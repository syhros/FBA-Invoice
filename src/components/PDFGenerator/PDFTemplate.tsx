import React from 'react';
import { ReceiptData } from '../../types/types';

interface PDFTemplateProps {
  data: ReceiptData;
}

const PDFTemplate: React.FC<PDFTemplateProps> = ({ data }) => {
  const {
    orderId,
    purchaseDate,
    customer,
    items,
    totals,
    company,
    paymentMethod,
    receiptNumber,
    receiptDate,
    notes,
    template
  } = data;

  // Parse the purchaseDate and add one day
  let paymentDate: string;
  try {
    const purchaseDateObj = new Date(purchaseDate);
    purchaseDateObj.setDate(purchaseDateObj.getDate() + 1);
    paymentDate = purchaseDateObj.toLocaleDateString();
  } catch (error) {
    console.error("Error parsing purchase date:", error);
    paymentDate = 'Invalid Date';
  }

  // Calculate VAT for each item if VAT is enabled
  const vatRate = template.showVat ? 0.20 : 0; // 20% VAT rate
  const itemsWithVat = items.map(item => {
    if (item.name === 'Promotion') {
      return {
        ...item,
        vatAmount: 0,
        priceExVat: item.price,
        totalExVat: item.total
      };
    }
    const priceExVat = template.showVat ? item.price / (1 + vatRate) : item.price;
    const vatAmount = template.showVat ? item.price - priceExVat : 0;
    const totalExVat = priceExVat * item.quantity;
    const totalVat = vatAmount * item.quantity;
    return {
      ...item,
      vatAmount,
      priceExVat,
      totalExVat,
      totalVat
    };
  });

  // Sort items to put promotions at the end
  const sortedItems = [...itemsWithVat].sort((a, b) => {
    if (a.name === 'Promotion') return 1;
    if (b.name === 'Promotion') return -1;
    return 0;
  });

  return (
    <div className="bg-white p-8 max-w-4xl mx-auto" style={{ fontSize: '10pt', fontFamily: 'Inter, sans-serif' }}>
      {/* Header */}
      <div className="flex justify-between items-start border-b pb-6" style={{ borderColor: template.primaryColor }}>
        <div className="flex-1">
          {company.logo ? (
            <img 
              src={company.logo} 
              alt={`${company.name} logo`} 
              className="h-16 mb-2 object-contain" 
            />
          ) : (
            <h1 className="text-2xl font-bold mb-2" style={{ color: template.primaryColor }}>{company.name}</h1>
          )}
          <div className="text-sm text-gray-700">
            {company.address.map((line, i) => (
              <div key={i}>{line}</div>
            ))}
            {company.phoneNumber && <div>Tel: {company.phoneNumber}</div>}
            {company.email && <div>Email: {company.email}</div>}
            {company.website && <div>Web: {company.website}</div>}
          </div>
        </div>
        
        <div className="text-right">
          <h1 className="text-3xl font-bold mb-4" style={{ color: template.primaryColor }}>RECEIPT</h1>
          <div className="text-sm">
            <div><span className="font-semibold">Receipt No:</span> {receiptNumber}</div>
            <div><span className="font-semibold">Receipt Date:</span> {receiptDate}</div>
            <div><span className="font-semibold">Order ID:</span> {orderId}</div>
            <div><span className="font-semibold">Order Date:</span> {purchaseDate}</div>
          </div>
        </div>
      </div>
      
      {/* Billing Info */}
      <div className="mt-6 mb-8">
        <div className="flex">
          <div className="flex-1">
            <h2 className="text-lg font-semibold mb-2" style={{ color: template.secondaryColor }}>Bill To:</h2>
            <div className="text-sm">
              <div className="font-semibold">{customer.name}</div>
              {customer.address.map((line, i) => (
                <div key={i}>{line}</div>
              ))}
              {customer.contact && <div>{customer.contact}</div>}
            </div>
          </div>
          
          {company.vatNumber && template.showVat && (
            <div className="flex-1">
              <h2 className="text-lg font-semibold mb-2" style={{ color: template.secondaryColor }}>VAT Information:</h2>
              <div className="text-sm">
                <div><span className="font-semibold">VAT Number:</span> {company.vatNumber}</div>
                {company.companyNumber && (
                  <div><span className="font-semibold">Company No:</span> {company.companyNumber}</div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Items Table */}
      <h2 className="text-lg font-semibold mb-2" style={{ color: template.secondaryColor }}>Order Items:</h2>
      <table className="w-full text-sm mb-8">
        <thead>
          <tr style={{ backgroundColor: `${template.primaryColor}20` }}>
            <th className="py-2 px-4 text-left">Product</th>
            <th className="py-2 px-4 text-left">SKU</th>
            <th className="py-2 px-4 text-right">Qty</th>
            <th className="py-2 px-4 text-right">{template.showVat ? 'Price (ex VAT)' : 'Price'}</th>
            {template.showVat && <th className="py-2 px-4 text-right">VAT</th>}
            <th className="py-2 px-4 text-right">Total</th>
          </tr>
        </thead>
        <tbody>
          {sortedItems.map((item, index) => (
            <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
              <td className="py-2 px-4">
                {item.name}
                <div className="text-xs text-gray-500">ASIN: {item.asin}</div>
              </td>
              <td className="py-2 px-4">{item.sku}</td>
              <td className="py-2 px-4 text-right">{item.quantity}</td>
              <td className="py-2 px-4 text-right">£{item.priceExVat.toFixed(2)}</td>
              {template.showVat && (
                <td className="py-2 px-4 text-right">£{item.totalVat.toFixed(2)}</td>
              )}
              <td className="py-2 px-4 text-right">£{item.total.toFixed(2)}</td>
            </tr>
          ))}
          {!template.showVat && (
            <tr className="bg-gray-50">
              <td className="py-2 px-4">Not VAT Registered</td>
              <td className="py-2 px-4">VAT</td>
              <td className="py-2 px-4 text-right">0</td>
              <td className="py-2 px-4 text-right">£0.00</td>
              <td className="py-2 px-4 text-right">£0.00</td>
            </tr>
          )}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={template.showVat ? 4 : 3}></td>
            <td className="py-2 px-4 text-right font-semibold">Subtotal:</td>
            <td className="py-2 px-4 text-right">£{totals.subtotal.toFixed(2)}</td>
          </tr>
          {totals.shipping !== undefined && totals.shipping > 0 && (
            <tr>
              <td colSpan={template.showVat ? 4 : 3}></td>
              <td className="py-2 px-4 text-right font-semibold">Shipping:</td>
              <td className="py-2 px-4 text-right">£{totals.shipping.toFixed(2)}</td>
            </tr>
          )}
          {totals.vat !== undefined && template.showVat && (
            <tr>
              <td colSpan={template.showVat ? 4 : 3}></td>
              <td className="py-2 px-4 text-right font-semibold">VAT:</td>
              <td className="py-2 px-4 text-right">£{totals.vat.toFixed(2)}</td>
            </tr>
          )}
          <tr style={{ backgroundColor: `${template.primaryColor}20` }}>
            <td colSpan={template.showVat ? 4 : 3}></td>
            <td className="py-2 px-4 text-right font-bold">Total:</td>
            <td className="py-2 px-4 text-right font-bold">£{totals.total.toFixed(2)}</td>
          </tr>
        </tfoot>
      </table>
      
      {/* Payment Info */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-2" style={{ color: template.secondaryColor }}>Payment Information:</h2>
        <div className="flex">
          <div className="w-1/2 pr-4">
            <div className="border rounded p-4">
              <div className="text-sm">
                <div><span className="font-semibold">Payment Status:</span> <span className="text-green-600 font-semibold">Paid</span></div>
                <div><span className="font-semibold">Payment Date:</span> {paymentDate}</div>
              </div>
            </div>
          </div>
          
          {notes && (
            <div className="w-1/2 pl-4">
              <div className="border rounded p-4">
                <h3 className="text-sm font-semibold mb-1">Additional Notes:</h3>
                <p className="text-sm text-gray-700">{notes}</p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Terms and Conditions */}
      <div className="mt-8 pt-4 border-t text-xs text-gray-600" style={{ borderColor: template.primaryColor }}>
        <h3 className="font-semibold mb-1">Terms and Conditions:</h3>
        <ul className="list-disc pl-5">
          {template.termsAndConditions.map((term, index) => (
            <li key={index}>{term}</li>
          ))}
        </ul>
      </div>
      
      {/* Footer */}
      <div className="mt-8 pt-4 text-center text-xs text-gray-500">
        <p>Thank you for your business!</p>
        <p>{company.name} {company.companyNumber && `- Company No: ${company.companyNumber}`} {company.vatNumber && template.showVat && `- VAT Reg No: ${company.vatNumber}`}</p>
      </div>
    </div>
  );
};

export default PDFTemplate;