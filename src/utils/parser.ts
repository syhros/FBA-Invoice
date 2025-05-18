import { OrderData, OrderItem } from '../types/types';

export function parseAmazonOrderText(text: string): OrderData | null {
  try {
    // Default structure for OrderData
    const orderData: OrderData = {
      orderId: '',
      purchaseDate: '',
      purchaseTime: '',
      shippingDetails: {
        service: '',
        fulfillment: '',
        channel: '',
      },
      customer: {
        name: '',
        address: [],
        postcode: '',
        country: '',
      },
      items: [],
      totals: {
        subtotal: 0,
        shipping: 0,
        total: 0,
      }
    };

    // Extract Order ID
    const orderIdMatch = text.match(/Order ID:?\s*#?\s*(\d{3}-\d{7}-\d{7})/i);
    if (orderIdMatch && orderIdMatch[1]) {
      orderData.orderId = orderIdMatch[1];
    }

    // Extract Purchase Date and Time
    const dateTimeMatch = text.match(/Purchase date:\s*(.*?),\s*(\d{1,2}:\d{2})\s*([A-Z]{2,3})?/i);
    if (dateTimeMatch) {
      orderData.purchaseDate = dateTimeMatch[1].trim();
      orderData.purchaseTime = dateTimeMatch[2];
    }

    // Extract Customer Details
    const shipToMatch = text.match(/Ship to\s*\n+\s*([\s\S]+?)(?:\n+\s*Contact|\n+\s*United Kingdom|\n+\s*Shipping|$)/i);
    if (shipToMatch && shipToMatch[1]) {
      const addressLines = shipToMatch[1]
        .split('\n')
        .map(line => line.trim())
        .filter(line => line !== '');

      if (addressLines.length > 0) {
        orderData.customer.name = addressLines[0];
        
        // Extract postcode - UK postcode pattern
        const postcodeMatch = addressLines.join(' ').match(/([A-Z]{1,2}\d[A-Z\d]? \d[A-Z]{2})/i);
        if (postcodeMatch) {
          orderData.customer.postcode = postcodeMatch[1];
        }
        
        // Extract country
        const countryMatch = addressLines.join(' ').match(/United Kingdom/i);
        if (countryMatch) {
          orderData.customer.country = 'United Kingdom';
        }
        
        // Store full address
        orderData.customer.address = addressLines;
      }
    }

    // Extract Shipping Details
    const shippingServiceMatch = text.match(/Shipping service:\s*(.*?)(?:\n|$)/i);
    if (shippingServiceMatch && shippingServiceMatch[1]) {
      orderData.shippingDetails.service = shippingServiceMatch[1].trim();
    }

    const fulfillmentMatch = text.match(/Fulfilment:\s*(.*?)(?:\n|$)/i);
    if (fulfillmentMatch && fulfillmentMatch[1]) {
      orderData.shippingDetails.fulfillment = fulfillmentMatch[1].trim();
    }

    const channelMatch = text.match(/Sales channel:\s*(.*?)(?:\n|$)/i);
    if (channelMatch && channelMatch[1]) {
      orderData.shippingDetails.channel = channelMatch[1].trim();
    }

    // Extract Product Details
    const lines = text.split('\n').map(line => line.trim());
    let currentItem: Partial<OrderItem> = {};
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Extract shipping cost
      const shippingMatch = line.match(/Shipping total:£(\d+\.\d{2})/);
      if (shippingMatch) {
        orderData.totals.shipping = parseFloat(shippingMatch[1]);
      }

      // Handle promotions as items
      const promotionMatch = line.match(/Promotion:-£(\d+\.\d{2})/);
      if (promotionMatch) {
        const promotionAmount = parseFloat(promotionMatch[1]);
        orderData.items.push({
          name: 'Promotion',
          asin: 'PROMO',
          sku: 'PROMO',
          quantity: 1,
          price: -promotionAmount,
          total: -promotionAmount
        });
      }
      
      if (line.startsWith('ASIN:')) {
        // Start a new item
        if (Object.keys(currentItem).length > 0) {
          orderData.items.push(currentItem as OrderItem);
          currentItem = {};
        }
        
        // Get the product name from previous lines
        let j = i - 1;
        while (j >= 0 && !lines[j].match(/ASIN|SKU|Order Item ID|£/)) {
          if (lines[j] && !lines[j].match(/Status|Image|Product name|More information|Quantity|Unit price|Proceeds/i)) {
            currentItem.name = lines[j];
            break;
          }
          j--;
        }
        
        currentItem.asin = line.replace('ASIN:', '').trim();
      } else if (line.startsWith('SKU:')) {
        currentItem.sku = line.replace('SKU:', '').trim();
      } else if (line.match(/^\d+\s+£\d+\.\d{2}$/)) {
        const [quantity, price] = line.split('£');
        currentItem.quantity = parseInt(quantity.trim(), 10);
        currentItem.price = parseFloat(price.trim());
        currentItem.total = currentItem.quantity * currentItem.price;
      }
    }

    // Add the last item if exists
    if (Object.keys(currentItem).length > 0) {
      orderData.items.push(currentItem as OrderItem);
    }

    // Calculate Totals
    if (orderData.items.length > 0) {
      orderData.totals.subtotal = orderData.items.reduce((sum, item) => sum + item.total, 0);
      orderData.totals.total = orderData.totals.subtotal + (orderData.totals.shipping || 0);
    }

    return orderData;
  } catch (error) {
    console.error("Error parsing Amazon order text:", error);
    return null;
  }
}