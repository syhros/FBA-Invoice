export interface OrderData {
  orderId: string;
  purchaseDate: string;
  purchaseTime: string;
  shippingDetails: {
    service: string;
    fulfillment: string;
    channel: string;
  };
  customer: {
    name: string;
    address: string[];
    contact?: string;
    postcode?: string;
    country?: string;
  };
  items: OrderItem[];
  totals: {
    subtotal: number;
    shipping?: number;
    vat?: number;
    total: number;
  };
}

export interface OrderItem {
  name: string;
  asin: string;
  sku: string;
  quantity: number;
  price: number;
  total: number;
}

export interface CompanyDetails {
  name: string;
  logo?: string;
  address: string[];
  vatNumber?: string;
  companyNumber?: string;
  phoneNumber?: string;
  email?: string;
  website?: string;
}

export interface ReceiptTemplate {
  id: string;
  name: string;
  primaryColor: string;
  secondaryColor: string;
  logo?: string;
  showVat: boolean;
  termsAndConditions: string[];
}

export interface ReceiptData extends OrderData {
  company: CompanyDetails;
  paymentMethod: string;
  receiptNumber: string;
  receiptDate: string;
  notes?: string;
  template: ReceiptTemplate;
}