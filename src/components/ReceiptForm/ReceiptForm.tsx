import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import CompanyDetailsForm from './CompanyDetailsForm';
import DefaultCompanyDetailsForm from './DefaultCompanyDetailsForm';
import OrderDetailsForm from './OrderDetailsForm';
import TemplateSelectorForm from './TemplateSelectorForm';
import ItemsTableForm from './ItemsTableForm';

const ReceiptForm: React.FC = () => {
  const currentOrder = useSelector((state: RootState) => state.order.currentOrder);
  const isCustomCompanyDetails = useSelector((state: RootState) => state.company.isCustomCompanyDetails);
  
  if (!currentOrder) {
    return null;
  }

  return (
    <div>
      {isCustomCompanyDetails ? <CompanyDetailsForm /> : <DefaultCompanyDetailsForm />}
      <OrderDetailsForm />
      <ItemsTableForm />
      <TemplateSelectorForm />
    </div>
  );
};

export default ReceiptForm;