import { z } from 'zod';
import { MoneySchema } from './common.js';

export const ProductVariantSchema = z.object({
  id: z.string().uuid(),
  productId: z.string().uuid(),
  tenantId: z.string().uuid(),
  sku: z.string().min(1),
  title: z.string().min(1),
  price: MoneySchema,
  attributes: z.record(z.string()).default({}),
  active: z.boolean().default(true),
});
export type ProductVariant = z.infer<typeof ProductVariantSchema>;

export const ProductSchema = z.object({
  id: z.string().uuid(),
  tenantId: z.string().uuid(),
  title: z.string().min(1),
  description: z.string(),
  category: z.string(),
  imageUrl: z.string().url().optional(),
  variants: z.array(ProductVariantSchema).default([]),
});
export type Product = z.infer<typeof ProductSchema>;

export const OrderItemSchema = z.object({
  id: z.string().uuid(),
  orderId: z.string().uuid(),
  variantId: z.string().uuid(),
  sku: z.string(),
  title: z.string(),
  quantity: z.number().int().positive(),
  unitPrice: MoneySchema,
  totalPrice: MoneySchema,
});
export type OrderItem = z.infer<typeof OrderItemSchema>;

export const OrderStatusSchema = z.enum([
  'PENDING',
  'PAID',
  'FULFILLED',
  'PARTIALLY_REFUNDED',
  'REFUNDED',
  'CANCELLED',
]);
export type OrderStatus = z.infer<typeof OrderStatusSchema>;

export const OrderSchema = z.object({
  id: z.string().uuid(),
  tenantId: z.string().uuid(),
  orderReference: z.string(),
  customerId: z.string().uuid(),
  customerEmail: z.string().email(),
  customerName: z.string(),
  status: OrderStatusSchema,
  currency: z.string().length(3).default('USD'),
  subtotal: MoneySchema,
  tax: MoneySchema,
  shipping: MoneySchema,
  total: MoneySchema,
  items: z.array(OrderItemSchema),
  paypalOrderId: z.string().optional(),
  paypalCaptureId: z.string().optional(),
  createdAt: z.string(),
});
export type Order = z.infer<typeof OrderSchema>;

export const CreateCheckoutOrderDtoSchema = z.object({
  tenantSlug: z.string().default('default-merchant'),
  customerEmail: z.string().email(),
  customerName: z.string().min(1),
  instantDemo: z.boolean().optional(),
  items: z.array(
    z.object({
      variantId: z.string().uuid(),
      quantity: z.number().int().positive(),
    })
  ).min(1),
});
export type CreateCheckoutOrderDto = z.infer<typeof CreateCheckoutOrderDtoSchema>;

export const CaptureCheckoutOrderDtoSchema = z.object({
  paypalOrderId: z.string().min(1),
});
export type CaptureCheckoutOrderDto = z.infer<typeof CaptureCheckoutOrderDtoSchema>;

