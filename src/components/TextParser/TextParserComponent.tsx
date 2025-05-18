import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { FileText, ArrowRight } from 'lucide-react';
import { parseAmazonOrderText } from '../../utils/parser';
import { setCurrentOrder, setOrderError } from '../../store/slices/orderSlice';

const TextParserComponent: React.FC = () => {
  const [rawText, setRawText] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const dispatch = useDispatch();

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setRawText(e.target.value);
  };

  const handleParse = async () => {
    if (!rawText.trim()) {
      dispatch(setOrderError('Please enter the Amazon order text to parse.'));
      return;
    }

    setIsParsing(true);
    
    try {
      // Simulating processing delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const parsedData = parseAmazonOrderText(rawText);
      
      if (!parsedData) {
        dispatch(setOrderError('Failed to parse the order text. Please check the format and try again.'));
        setIsParsing(false);
        return;
      }
      
      if (!parsedData.orderId) {
        dispatch(setOrderError('Could not detect an Amazon order ID. Please check the text and try again.'));
        setIsParsing(false);
        return;
      }
      
      dispatch(setCurrentOrder(parsedData));
    } catch (error) {
      console.error('Error parsing text:', error);
      dispatch(setOrderError('An error occurred while parsing the order text.'));
    } finally {
      setIsParsing(false);
    }
  };

  const handlePasteExample = () => {
    // Example order text
    const exampleText = `
    Order details  Order ID: # 206-8888888-1111111 Business customerNo Invoice UploadedYour Seller Order ID: # 206-8888888-1111111 
    Go back to List Orders
    Upload invoice
    Refund Order
    Request a Review
    Order summary

    Amazon's Ship By:	Sat, 10 May 2025 BST
    Purchase date:	Fri, 9 May 2025, 12:00 BST
    Shipping service:	Expedited
    Fulfilment:	Amazon
    Sales channel:	Amazon.co.uk 
    Ship to

    Steven Steve
    123
    Amazon Lane
    Texas
    AM4 4ZN
    United Kingdom

    Contact Buyer: Steven

    Order contents
    Status
    Image
    Product name
    More information
    Quantity
    Unit price
    Proceeds
    Payment Complete

    Amazon Basics Pencil (HB)
    ASIN: B09MXXXXXX
    SKU: AM-AMZN-XXXX
    1 £2.99
    Item subtotal:£2.99
    Item totel:£2.99
    `;
    setRawText(exampleText);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center mb-4">
        <FileText className="text-red-500 mr-2" />
        <h2 className="text-xl font-semibold">Amazon Order Parser</h2>
      </div>
      
      <div>
        <div className="mb-4">
          <label htmlFor="orderText" className="block text-sm font-medium text-gray-700 mb-1">
            Paste Amazon Order Text
          </label>
          <textarea
            id="orderText"
            className="w-full h-56 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
            value={rawText}
            onChange={handleTextChange}
            placeholder="Paste the raw text from your Amazon order page here..."
          />
        </div>
        
        <div className="flex space-x-4">
          <button
            className="flex items-center px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
            onClick={handleParse}
            disabled={isParsing || !rawText.trim()}
          >
            {isParsing ? (
              <>
                <span className="animate-spin inline-block w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full"></span>
                Parsing...
              </>
            ) : (
              <>
                Parse Order <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </button>
          
          <button
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            onClick={handlePasteExample}
          >
            Insert Example
          </button>
        </div>
      </div>
    </div>
  );
};

export default TextParserComponent;