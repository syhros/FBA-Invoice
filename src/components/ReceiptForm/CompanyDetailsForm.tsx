import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import { updateCompanyDetails, setCompanyLogo } from '../../store/slices/companySlice';
import { Building2, MailIcon, Phone, Globe, Image } from 'lucide-react';
import { CompanyDetails } from '../../types/types';
import { setIsCustomCompanyDetails } from '../../store/slices/companySlice';

const CompanyDetailsForm: React.FC = () => {
  const company = useSelector((state: RootState) => state.company.details);
  const isCustomCompanyDetails = useSelector((state: RootState) => state.company.isCustomCompanyDetails);
  const dispatch = useDispatch();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    
    if (name === 'address') {
      const addressLines = value.split('\n');
      dispatch(updateCompanyDetails({ address: addressLines }));
    } else {
      dispatch(updateCompanyDetails({ [name]: value }));
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 500000) {
      alert('Logo file is too large. Please use an image under 500KB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        dispatch(setCompanyLogo(event.target.result as string));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCancel = () => {
    dispatch(setIsCustomCompanyDetails(false));
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
          onClick={handleCancel}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
        >
          Save
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Company Name
          </label>
          <input
            type="text"
            name="name"
            value={company.name}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Logo
          </label>
          <div className="flex items-center">
            <input
              type="file"
              id="logo"
              accept="image/*"
              onChange={handleLogoChange}
              className="hidden"
            />
            <label
              htmlFor="logo"
              className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors cursor-pointer"
            >
              <Image className="mr-2 h-4 w-4" />
              Upload Logo
            </label>
            {company.logo && (
              <div className="ml-4 w-10 h-10 relative">
                <img 
                  src={company.logo} 
                  alt="Company logo" 
                  className="w-full h-full object-contain"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Address
        </label>
        <textarea
          name="address"
          value={company.address.join('\n')}
          onChange={handleInputChange}
          rows={5}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            VAT Number
          </label>
          <input
            type="text"
            name="vatNumber"
            value={company.vatNumber || ''}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Company Number
          </label>
          <input
            type="text"
            name="companyNumber"
            value={company.companyNumber || ''}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
          />
        </div>
        
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
            <MailIcon className="h-4 w-4 mr-1" />
            Email
          </label>
          <input
            type="email"
            name="email"
            value={company.email || ''}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
          />
        </div>
        
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
            <Phone className="h-4 w-4 mr-1" />
            Phone Number
          </label>
          <input
            type="text"
            name="phoneNumber"
            value={company.phoneNumber || ''}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
          />
        </div>
        
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
            <Globe className="h-4 w-4 mr-1" />
            Website
          </label>
          <input
            type="text"
            name="website"
            value={company.website || ''}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
          />
        </div>
      </div>
    </div>
  );
};

export default CompanyDetailsForm;
