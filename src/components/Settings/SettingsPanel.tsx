import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import { Settings, X, Plus, Trash2, Edit, Image } from 'lucide-react';
import { CompanyDetails } from '../../types/types';
import { updateCompanyDetails, setDefaultCompanyDetails, addDefaultCompanyDetails, removeDefaultCompanyDetails, setCompanyLogo } from '../../store/slices/companySlice';
import { updateTemplate, deleteTemplate } from '../../store/slices/templateSlice';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ isOpen, onClose }) => {
  const company = useSelector((state: RootState) => state.company.details);
  const defaultCompanyDetails = useSelector((state: RootState) => state.company.defaultDetails);
  const templates = useSelector((state: RootState) => state.template.templates);
  const dispatch = useDispatch();
  const [newCompanyName, setNewCompanyName] = useState('');
  const [editingCompany, setEditingCompany] = useState<CompanyDetails | null>(null);

  const handleEditCompanyDetails = (company: CompanyDetails) => {
    setEditingCompany({ ...company });
  };

  const handleSaveCompanyDetails = () => {
    if (editingCompany) {
      dispatch(updateCompanyDetails(editingCompany));
      setEditingCompany(null);
    }
  };

  const handleCancelEdit = () => {
    setEditingCompany(null);
  };

  const handleClearLocalStorage = () => {
    if (window.confirm('Are you sure you want to clear all data? This will reset your company information, templates, and order history.')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const handleExportData = () => {
    const data = {
      company: company,
      templates: templates,
      orderHistory: JSON.parse(localStorage.getItem('amazon-receipt-generator-orders') || '[]')
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'amazon-receipt-generator-backup.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDeleteTemplate = (templateId: string) => {
    if (templates.length <= 1) {
      alert('You cannot delete the last template.');
      return;
    }

    if (window.confirm('Are you sure you want to delete this template?')) {
      dispatch(deleteTemplate(templateId));
    }
  };

  const handleAddCompanyDetails = () => {
    if (!newCompanyName.trim()) {
      alert('Please enter a company name');
      return;
    }

    const newCompany: CompanyDetails = {
      name: newCompanyName,
      address: ['Enter Address'],
      vatNumber: '',
      companyNumber: '',
      email: '',
      website: '',
    };

    dispatch(addDefaultCompanyDetails(newCompany));
    setNewCompanyName('');
  };

  const handleRemoveCompanyDetails = (companyName: string) => {
    if (defaultCompanyDetails.length <= 1) {
      alert('You cannot delete the last company template.');
      return;
    }

    if (window.confirm('Are you sure you want to delete this company template?')) {
      dispatch(removeDefaultCompanyDetails(companyName));
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <Settings className="text-red-500 mr-2" />
              <h2 className="text-2xl font-bold">Application Settings</h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-3 border-b pb-2">Company Templates</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={newCompanyName}
                  onChange={(e) => setNewCompanyName(e.target.value)}
                  placeholder="Enter company name"
                  className="flex-1 p-2 border border-gray-300 rounded-md"
                />
                <button
                  onClick={handleAddCompanyDetails}
                  className="flex items-center px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Company
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {defaultCompanyDetails.map((company, index) => (
                  <div key={index} className="border rounded-md p-4">
                    {editingCompany?.name === company.name ? (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                        <input
                          type="text"
                          value={editingCompany.name || ''}
                          onChange={(e) => setEditingCompany({ ...editingCompany, name: e.target.value })}
                          className="w-full p-2 border border-gray-300 rounded-md mb-2"
                        />

                        <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                        <textarea
                          value={editingCompany.address?.join('\n') || ''}
                          onChange={(e) => setEditingCompany({ ...editingCompany, address: e.target.value.split('\n') })}
                          className="w-full p-2 border border-gray-300 rounded-md mb-2"
                          rows = {5}
                        />

                        <label className="block text-sm font-medium text-gray-700 mb-1">VAT Number</label>
                        <input
                          type="text"
                          value={editingCompany.vatNumber || ''}
                          onChange={(e) => setEditingCompany({ ...editingCompany, vatNumber: e.target.value })}
                          className="w-full p-2 border border-gray-300 rounded-md mb-2"
                        />

                        <label className="block text-sm font-medium text-gray-700 mb-1">Company Number</label>
                        <input
                          type="text"
                          value={editingCompany.companyNumber || ''}
                          onChange={(e) => setEditingCompany({ ...editingCompany, companyNumber: e.target.value })}
                          className="w-full p-2 border border-gray-300 rounded-md mb-2"
                        />

                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                          type="email"
                          value={editingCompany.email || ''}
                          onChange={(e) => setEditingCompany({ ...editingCompany, email: e.target.value })}
                          className="w-full p-2 border border-gray-300 rounded-md mb-2"
                        />

                        <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                        <input
                          type="text"
                          value={editingCompany.website || ''}
                          onChange={(e) => setEditingCompany({ ...editingCompany, website: e.target.value })}
                          className="w-full p-2 border border-gray-300 rounded-md mb-2"
                        />

                        <label className="block text-sm font-medium text-gray-700 mb-1">Logo</label>
                        {company.logo ? (
                          <p className="text-gray-900">{company.logo.split('/').pop()}</p>
                        ) : (
                          <div>
                            <input
                              type="file"
                              id="logo"
                              accept="image/*"
                              onChange={handleLogoChange}
                              className="hidden"
                            />
                            <label
                              htmlFor="logo"
                              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors cursor-pointer"
                            >
                              Upload Logo
                            </label>
                            <p className="text-gray-500 mt-1">No logo uploaded</p>
                          </div>
                        )}

                        <div className="flex space-x-2">
                          <button
                            onClick={handleSaveCompanyDetails}
                            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                          >
                            Save
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold">{company.name}</h4>
                          <p className="text-sm text-gray-600">{company.address[0]}</p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditCompanyDetails(company)}
                            className="text-blue-500 hover:text-blue-700"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleRemoveCompanyDetails(company.name)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-3 border-b pb-2">Data Management</h3>
            <div className="flex space-x-4">


          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-3 border-b pb-2">Data Management</h3>
            <div className="flex space-x-4">
              <button
                onClick={handleExportData}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                Export Data Backup
              </button>
              <button
                onClick={handleClearLocalStorage}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
              >
                Reset All Data
              </button>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-3 border-b pb-2">Templates</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {templates.map((template) => (
                <div key={template.id} className="border rounded-md p-4">
                  <div className="flex justify-between items-start">
                    <h4 className="font-semibold">{template.name}</h4>
                    <button
                      onClick={() => handleDeleteTemplate(template.id)}
                      className="text-xs text-red-500 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </div>
                  <div className="mt-2 flex space-x-2">
                    <div className="h-6 w-6 rounded-full" style={{ backgroundColor: template.primaryColor }}></div>
                    <div className="h-6 w-6 rounded-full" style={{ backgroundColor: template.secondaryColor }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3 border-b pb-2">About</h3>
            <p className="text-sm text-gray-600">
              Amazon FBA Receipt Generator v1.0.0
            </p>
            <p className="text-sm text-gray-600 mt-2">
              Created by Ashry Ltd. for Amazon FBA sellers to generate professional receipts.
            </p>
          </div>
        </div>
      </div>
    </div>
      </div>
    </div>
  );
};

export default SettingsPanel;