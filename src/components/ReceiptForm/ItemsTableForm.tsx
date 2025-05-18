import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import { updateItemDetails } from '../../store/slices/orderSlice';
import { Package } from 'lucide-react';
import { OrderItem } from '../../types/types';

const ItemsTableForm: React.FC = () => {
  const order = useSelector((state: RootState) => state.order.currentOrder);
  const dispatch = useDispatch();

  if (!order) return null;

  const handleItemChange = (index: number, field: keyof OrderItem, value: string | number) => {
    const updatedItem: Partial<OrderItem> = { [field]: value };
    
    // If price or quantity changes, recalculate the total
    if (field === 'price' || field === 'quantity') {
      const currentItem = order.items[index];
      const price = field === 'price' ? parseFloat(value as string) : currentItem.price;
      const quantity = field === 'quantity' ? parseInt(value as string, 10) : currentItem.quantity;
      
      // Ensure valid numbers
      const validPrice = isNaN(price) ? currentItem.price : price;
      const validQuantity = isNaN(quantity) ? currentItem.quantity : quantity;
      
      updatedItem.price = validPrice;
      updatedItem.quantity = validQuantity;
      updatedItem.total = validPrice * validQuantity;
    }
    
    dispatch(updateItemDetails({ index, item: updatedItem }));
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center mb-4">
        <Package className="text-red-500 mr-2" />
        <h2 className="text-xl font-semibold">Order Items</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ASIN
              </th>
              <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                SKU
              </th>
              <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Qty
              </th>
              <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price (£)
              </th>
              <th className="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total (£)
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {order.items.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                    className="w-full p-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-red-500 focus:border-red-500"
                  />
                </td>
                <td className="px-4 py-3">
                  <input
                    type="text"
                    value={item.asin}
                    onChange={(e) => handleItemChange(index, 'asin', e.target.value)}
                    className="w-full p-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-red-500 focus:border-red-500"
                  />
                </td>
                <td className="px-4 py-3">
                  <input
                    type="text"
                    value={item.sku}
                    onChange={(e) => handleItemChange(index, 'sku', e.target.value)}
                    className="w-full p-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-red-500 focus:border-red-500"
                  />
                </td>
                <td className="px-4 py-3">
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value, 10))}
                    className="w-full p-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-red-500 focus:border-red-500"
                  />
                </td>
                <td className="px-4 py-3">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.price.toFixed(2)}
                    onChange={(e) => handleItemChange(index, 'price', parseFloat(e.target.value))}
                    className="w-full p-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-red-500 focus:border-red-500"
                  />
                </td>
                <td className="px-4 py-3 font-medium">
                  £{item.total.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-gray-50">
              <td colSpan={4} className="px-4 py-2"></td>
              <td className="px-4 py-2 text-right font-semibold">Subtotal:</td>
              <td className="px-4 py-2 font-semibold">£{order.totals.subtotal.toFixed(2)}</td>
            </tr>
            {order.totals.shipping !== undefined && order.totals.shipping > 0 && (
              <tr className="bg-gray-50">
                <td colSpan={4} className="px-4 py-2"></td>
                <td className="px-4 py-2 text-right font-semibold">Shipping:</td>
                <td className="px-4 py-2 font-semibold">£{order.totals.shipping.toFixed(2)}</td>
              </tr>
            )}
            {order.totals.vat !== undefined && (
              <tr className="bg-gray-50">
                <td colSpan={4} className="px-4 py-2"></td>
                <td className="px-4 py-2 text-right font-semibold">VAT:</td>
                <td className="px-4 py-2 font-semibold">£{order.totals.vat.toFixed(2)}</td>
              </tr>
            )}
            <tr className="bg-red-50">
              <td colSpan={4} className="px-4 py-2"></td>
              <td className="px-4 py-2 text-right font-semibold">Total:</td>
              <td className="px-4 py-2 font-semibold">£{order.totals.total.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default ItemsTableForm;