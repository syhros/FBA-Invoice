import { z } from 'zod';

export const companyDetailsSchema = z.object({
  name: z.string().min(1, "Company name is required"),
  logo: z.string().optional(),
  address: z.array(z.string()).min(1, "At least one address line is required"),
  vatNumber: z.string().optional(),
  companyNumber: z.string().optional(),
  phoneNumber: z.string().optional(),
  email: z.string().email("Invalid email address").optional(),
  website: z.string().url("Invalid website URL").optional(),
});

export const orderItemSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  asin: z.string().min(1, "ASIN is required"),
  sku: z.string().min(1, "SKU is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  price: z.number().min(0, "Price must be a positive number"),
  total: z.number().min(0, "Total must be a positive number"),
});

export const orderDataSchema = z.object({
  orderId: z.string().regex(/^\d{3}-\d{7}-\d{7}$/, "Invalid order ID format"),
  purchaseDate: z.string().min(1, "Purchase date is required"),
  purchaseTime: z.string().min(1, "Purchase time is required"),
  shippingDetails: z.object({
    service: z.string().optional(),
    fulfillment: z.string().optional(),
    channel: z.string().optional(),
  }),
  customer: z.object({
    name: z.string().min(1, "Customer name is required"),
    address: z.array(z.string()).min(1, "At least one address line is required"),
    postcode: z.string().optional(),
    country: z.string().optional(),
    contact: z.string().optional(),
  }),
  items: z.array(orderItemSchema).min(1, "At least one item is required"),
  totals: z.object({
    subtotal: z.number().min(0, "Subtotal must be a positive number"),
    shipping: z.number().optional(),
    vat: z.number().optional(),
    total: z.number().min(0, "Total must be a positive number"),
  }),
});

export const receiptDataSchema = orderDataSchema.extend({
  company: companyDetailsSchema,
  paymentMethod: z.string().min(1, "Payment method is required"),
  receiptNumber: z.string().min(1, "Receipt number is required"),
  receiptDate: z.string().min(1, "Receipt date is required"),
  notes: z.string().optional(),
  template: z.object({
    id: z.string(),
    name: z.string(),
    primaryColor: z.string(),
    secondaryColor: z.string(),
    logo: z.string().optional(),
    showVat: z.boolean(),
    termsAndConditions: z.array(z.string()),
  }),
});

export type ValidationError = {
  path: string[];
  message: string;
};

export const validateOrderData = (
  data: any
): { success: boolean; errors?: ValidationError[] } => {
  try {
    orderDataSchema.parse(data);
    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      errors: error.errors,
    };
  }
};