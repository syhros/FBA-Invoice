import { CompanyDetails, OrderData, ReceiptTemplate } from '../types/types';

const STORAGE_KEYS = {
  COMPANY_DETAILS: 'amazon-receipt-generator-company',
  TEMPLATES: 'amazon-receipt-generator-templates',
  ORDER_HISTORY: 'amazon-receipt-generator-orders'
};

// Company Details
export const saveCompanyDetails = (details: CompanyDetails): void => {
  localStorage.setItem(STORAGE_KEYS.COMPANY_DETAILS, JSON.stringify(details));
};

export const loadCompanyDetails = (): CompanyDetails | null => {
  const data = localStorage.getItem(STORAGE_KEYS.COMPANY_DETAILS);
  return data ? JSON.parse(data) : null;
};

// Templates
export const saveTemplate = (template: ReceiptTemplate): void => {
  const templates = loadTemplates();
  const existingIndex = templates.findIndex(t => t.id === template.id);
  
  if (existingIndex >= 0) {
    templates[existingIndex] = template;
  } else {
    templates.push(template);
  }
  
  localStorage.setItem(STORAGE_KEYS.TEMPLATES, JSON.stringify(templates));
};

export const loadTemplates = (): ReceiptTemplate[] => {
  const data = localStorage.getItem(STORAGE_KEYS.TEMPLATES);
  return data ? JSON.parse(data) : getDefaultTemplates();
};

const getDefaultTemplates = (): ReceiptTemplate[] => {
  return [{
    id: 'default',
    name: 'Default Template',
    primaryColor: '#E43B3B',
    secondaryColor: '#333333',
    showVat: true,
    termsAndConditions: [
      'Thank you for your purchase.',
      'This receipt is proof of purchase and may be required for warranty claims.',
      'Returns and exchanges must be made within 30 days of purchase.'
    ]
  }];
};

// Order History
export const saveOrderToHistory = (order: OrderData): void => {
  const orders = loadOrderHistory();
  // Only keep the last 100 orders
  if (orders.length >= 100) {
    orders.pop();
  }
  orders.unshift(order);
  localStorage.setItem(STORAGE_KEYS.ORDER_HISTORY, JSON.stringify(orders));
};

export const loadOrderHistory = (): OrderData[] => {
  const data = localStorage.getItem(STORAGE_KEYS.ORDER_HISTORY);
  return data ? JSON.parse(data) : [];
};