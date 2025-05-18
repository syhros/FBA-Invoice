import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import { Building2, Edit } from 'lucide-react';
import { setIsCustomCompanyDetails, setDefaultCompanyDetails } from '../../store/slices/companySlice';

const DefaultCompanyDetailsForm: React.FC = () => {
  const company = useSelector((state: RootState) => state.company.details);
  const defaultCompanyDetails = useSelector((state: RootState) => state.company.defaultDetails);
  const dispatch = useDispatch();

  const handleCompanyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCompanyName = e.target.value;
    const selectedCompany = defaultCompanyDetails.find(c => c.name === selectedCompanyName);

    if (selectedCompany) {
      dispatch(setDefaultCompanyDetails(selectedCompany));
    }
  };

  const handleCustomize = () => {
    dispatch(setIsCustomCompanyDetails(true));
  };

  if (!company) return null;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Building2 className="text-red-500 mr-2" />
          <h2 className="text-xl font-semibold">Company Details</h2>
        </div>
        <button
          onClick={handleCustomize}
          className="flex items-center px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
        >
          <Edit className="h-4 w-4 mr-1" />
          Customize
        </button>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Select Company</label>
        <select
          value={company.name}
          onChange={handleCompanyChange}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
        >
          {defaultCompanyDetails.map(company => (
            <option key={company.name} value={company.name}>
              {company.name}
            </option>
          ))}
        </select>
      </div>

      <div className="md:grid md:grid-cols-2 md:gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
          <p className="text-gray-900">{company.name}</p>

          <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
          {company.address.map((line, index) => (
            <p key={index} className="text-gray-900">{line}</p>
          ))}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Company Number</label>
          <p className="text-gray-900">{company.companyNumber}</p>

          <label className="block text-sm font-medium text-gray-700 mb-1">VAT Number</label>
          <p className="text-gray-900">{company.vatNumber}</p>

          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <p className="text-gray-900">{company.email}</p>

          <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
          <p className="text-gray-900">{company.website}</p>
        </div>
      </div>
    </div>
  );
};

export default DefaultCompanyDetailsForm;
