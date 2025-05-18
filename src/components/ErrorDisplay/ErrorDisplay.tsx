import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import { AlertCircle, X } from 'lucide-react';
import { clearOrderError } from '../../store/slices/orderSlice';

const ErrorDisplay: React.FC = () => {
  const error = useSelector((state: RootState) => state.order.error);
  const dispatch = useDispatch();

  if (!error) return null;

  return (
    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-md">
      <div className="flex">
        <div className="flex-shrink-0">
          <AlertCircle className="h-5 w-5 text-red-500" />
        </div>
        <div className="ml-3 flex-1">
          <div className="flex justify-between items-center">
            <p className="text-sm font-medium text-red-800">
              {error}
            </p>
            <button
              className="ml-auto text-red-500 hover:text-red-800"
              onClick={() => dispatch(clearOrderError())}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorDisplay;