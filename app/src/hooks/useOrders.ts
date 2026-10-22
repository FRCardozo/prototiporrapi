import { useCallback, useEffect, useMemo, useState } from 'react';
import { getSupabase } from '../lib/supabase';
import type { Order, OrderStatus } from '../types';
import { useAuth } from '../context/AuthContext';

const LOCAL_KEY = 'rappiclone.orders';
const STATUSES: OrderStatus[] = ['confirmado', 'en_preparacion', 'en_camino', 'entregado'];

/**
 * Órdenes con Supabase (realtime) o fallback local.
 * El "driver" avanza el estado de la orden automáticamente para simular
 * el tracking en vivo cuando no hay backend conectado.
 */
export function useOrders() {
  const { user } = useAuth();
  const supabase = getSupabase();
  const [orders, setOrders] = useState<Order[]>([]);

  const reload = useCallback(async () => {
    if (supabase && user) {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (!error && data) {
        setOrders(
          data.map((r) => ({
            id: r.id,
            userId: r.user_id,
            storeTitle: r.store_title,
            storeImage: r.store_image,
            items: r.items as Order['items'],
            total: r.total,
            status: r.status as OrderStatus,
            createdAt: r.created_at,
            address: r.address,
          })),
        );
        return;
      }
    }
    try {
      const all = JSON.parse(localStorage.getItem(LOCAL_KEY) ?? '[]') as Order[];
      setOrders(all.sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
    } catch {
      setOrders([]);
    }
  }, [supabase, user]);

  useEffect(() => {
    void reload();
  }, [reload]);

  // Realtime cuando existe Supabase
  useEffect(() => {
    if (!supabase || !user) return;
    const channel = supabase
      .channel(`orders-${user.id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders', filter: `user_id=eq.${user.id}` }, () => {
        void reload();
      })
      .subscribe();
    return () => {
      void supabase.removeChannel(channel);
    };
  }, [supabase, user, reload]);

  // Simulación de avance de estado en modo demo
  useEffect(() => {
    const t = setInterval(() => {
      try {
        const all = JSON.parse(localStorage.getItem(LOCAL_KEY) ?? '[]') as Order[];
        let changed = false;
        for (const o of all) {
          const idx = STATUSES.indexOf(o.status);
          if (idx > -1 && idx < STATUSES.length - 1 && Date.now() - new Date(o.createdAt).getTime() > (idx + 1) * 25_000) {
            o.status = STATUSES[idx + 1];
            changed = true;
          }
        }
        if (changed) localStorage.setItem(LOCAL_KEY, JSON.stringify(all));
        setOrders((prev) => (prev.some((o) => o.userId === 'local') ? all.sort((a, b) => b.createdAt.localeCompare(a.createdAt)) : prev));
      } catch {
        /* ignore */
      }
    }, 8000);
    return () => clearInterval(t);
  }, []);

  const placeOrder = useCallback(
    async (payload: Omit<Order, 'id' | 'status' | 'createdAt'>) => {
      if (supabase && user) {
        const { error } = await supabase.from('orders').insert({
          user_id: user.id,
          store_title: payload.storeTitle,
          store_image: payload.storeImage,
          items: payload.items,
          total: payload.total,
          address: payload.address,
          status: 'confirmado',
        });
        if (!error) {
          await reload();
          return;
        }
      }
      const order: Order = { ...payload, id: crypto.randomUUID(), status: 'confirmado', createdAt: new Date().toISOString(), userId: 'local' };
      const all: Order[] = JSON.parse(localStorage.getItem(LOCAL_KEY) ?? '[]');
      all.push(order);
      localStorage.setItem(LOCAL_KEY, JSON.stringify(all));
      setOrders(all.sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
    },
    [supabase, user, reload],
  );

  const active = useMemo(() => orders.find((o) => o.status !== 'entregado' && o.status !== 'cancelado'), [orders]);

  return { orders, placeOrder, active, reload };
}

export const nextStatusLabel: Record<OrderStatus, string> = {
  confirmado: 'Restaurante recibió tu pedido',
  en_preparacion: 'Vanilla está preparando tu pedido',
  en_camino: 'Tu pedido va en camino 🛵',
  entregado: '¡Pedido entregado! Disfrútalo ♥',
  cancelado: 'Pedido cancelado',
};
