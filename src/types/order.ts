import type { Address } from './user';

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PROCESSING = 'processing',
  SHIPPING = 'shipping',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
}

export enum PaymentMethod {
  COD = 'cod',
  VNPAY = 'vnpay',
  MOMO = 'momo',
  BANK_TRANSFER = 'bank_transfer',
}

export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

export enum ShipmentStatus {
  PREPARING = 'preparing',
  PICKED_UP = 'picked_up',
  IN_TRANSIT = 'in_transit',
  OUT_FOR_DELIVERY = 'out_for_delivery',
  DELIVERED = 'delivered',
  FAILED = 'failed',
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  variantId: string | null;
  /** Snapshot of the product name at the time of ordering */
  productName: string;
  variantName: string | null;
  sku: string;
  /** Snapshot of the product image at the time of ordering */
  image: string | null;
  quantity: number;
  /** Snapshot of the price at the time of ordering */
  price: number;
  /** quantity * price */
  subtotal: number;
  createdAt: Date | string;
}

export interface OrderStatusHistory {
  id: string;
  orderId: string;
  status: OrderStatus;
  note: string | null;
  /** UUID of the user (admin/staff) who changed the status */
  changedBy: string | null;
  createdAt: Date | string;
}

export interface Payment {
  id: string;
  orderId: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  /** Transaction ID from the payment gateway */
  transactionId: string | null;
  /** Raw response from the payment gateway */
  gatewayResponse: Record<string, unknown> | null;
  paidAt: Date | string | null;
  refundedAt: Date | string | null;
  createdAt: Date | string;
}

export interface ShippingUpdate {
  id: string;
  shipmentId: string;
  status: string;
  location: string | null;
  note: string | null;
  createdAt: Date | string;
}

export interface Shipment {
  id: string;
  orderId: string;
  trackingNumber: string | null;
  carrier: string | null;
  status: ShipmentStatus;
  shippedAt: Date | string | null;
  estimatedDeliveryAt: Date | string | null;
  deliveredAt: Date | string | null;
  failedReason: string | null;
  /** Proof-of-delivery image URLs */
  deliveryImages: string[] | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  updates: ShippingUpdate[];
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string | null;
  isGuest: boolean;
  guestName: string | null;
  guestEmail: string | null;
  guestPhone: string | null;
  guestAddress: { street: string; city: string; district: string; ward: string } | null;
  ipAddress: string | null;
  device: string | null;
  status: OrderStatus;
  /** Sum of item prices before shipping/discount */
  subtotal: number;
  shippingFee: number;
  tax: number;
  /** Discount from coupon or promotion */
  discount: number;
  /** Final amount to pay */
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  shippingAddressId: string | null;
  billingAddressId: string | null;
  customerNote: string | null;
  adminNote: string | null;
  cancelReason: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  confirmedAt: Date | string | null;
  shippedAt: Date | string | null;
  deliveredAt: Date | string | null;
  // Eager-loaded relations
  items: OrderItem[];
  shippingAddress: Address | null;
  billingAddress: Address | null;
  payment: Payment | null;
  shipment: Shipment | null;
  statusHistory: OrderStatusHistory[];
}
