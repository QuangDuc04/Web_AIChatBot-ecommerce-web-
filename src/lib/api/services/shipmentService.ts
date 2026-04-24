// Shipment service — client-side only.
import { apiGet } from '@/lib/api/client';

export interface TrackingEvent {
  id: string;
  status: string;
  description: string;
  location: string | null;
  timestamp: string;
}

export interface ShipmentTracking {
  orderId: string;
  trackingNumber: string | null;
  carrier: string | null;
  currentStatus: string;
  estimatedDeliveryAt: string | null;
  events: TrackingEvent[];
}

/** Get full tracking details for an order's shipment. */
export const trackShipment = (orderId: string): Promise<ShipmentTracking> =>
  apiGet<ShipmentTracking>(`/shipments/track/${orderId}`);
