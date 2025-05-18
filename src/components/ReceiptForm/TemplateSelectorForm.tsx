import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import { setCurrentTemplate, updateTemplate, addTemplate } from '../../store/slices/templateSlice';
import { PaintBucket, Plus } from 'lucide-react';
import { ReceiptTemplate } from '../../types/types';

const TemplateSelectorForm: React.FC = () => {
  const { templates, currentTemplateId } = useSelector((state: RootState) => state.template);
  const currentTemplate = templates.find(t => t.id === currentTemplateId) || templates[0];
  const dispatch = useDispatch();

  const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setCurrentTemplate(e.target.value));
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (currentTemplate) {
      dispatch(updateTemplate({
        ...currentTemplate,
        [name]: value,
      }));
    }
  };

  const handleTermsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (currentTemplate) {
      const terms = e.target.value.split('\n').filter(line => line.trim() !== '');
      dispatch(updateTemplate({
        ...currentTemplate,
        termsAndConditions: terms,
      }));
    }
  };

  const handleVatToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (currentTemplate) {
      dispatch(updateTemplate({
        ...currentTemplate,
        showVat: e.target.checked,
      }));
    }
  };

  const handleCreateNewTemplate = () => {
    const newId = `template-${Date.now()}`;
    const newTemplate: ReceiptTemplate = {
      id: newId,
      name: `Template ${templates.length + 1}`,
      primaryColor: '#E43B3B',
      secondaryColor: '#333333',
      showVat: true,
      termsAndConditions: [
        'Thank you for your purchase.',
        'This receipt is proof of purchase and may be required for warranty claims.',
        'Returns and exchanges must be made within 30 days of purchase.',
      ]
    };
    
    dispatch(addTemplate(newTemplate));
    dispatch(setCurrentTemplate(newId));
  };

  if (!currentTemplate) return null;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <PaintBucket className="text-red-500 mr-2" />
          <h2 className="text-xl font-semibold">Receipt Template</h2>
        </div>
        
        <button
          onClick={handleCreateNewTemplate}
          className="flex items-center px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          <Plus className="h-4 w-4 mr-1" />
          New Template
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Template
          </label>
          <select
            value={currentTemplateId}
            onChange={handleTemplateChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
          >
            {templates.map(template => (
              <option key={template.id} value={template.id}>
                {template.name}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Template Name
          </label>
          <input
            type="text"
            name="name"
            value={currentTemplate.name}
            onChange={(e) => dispatch(updateTemplate({...currentTemplate, name: e.target.value}))}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
          />
        </div>
        
        <div className="flex space-x-4 items-center">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Primary Color
            </label>
            <div className="flex items-center">
              <input
                type="color"
                name="primaryColor"
                value={currentTemplate.primaryColor}
                onChange={handleColorChange}
                className="w-10 h-10 border-0 p-0"
              />
              <span className="ml-2 text-sm text-gray-600">
                {currentTemplate.primaryColor}
              </span>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Secondary Color
            </label>
            <div className="flex items-center">
              <input
                type="color"
                name="secondaryColor"
                value={currentTemplate.secondaryColor}
                onChange={handleColorChange}
                className="w-10 h-10 border-0 p-0"
              />
              <span className="ml-2 text-sm text-gray-600">
                {currentTemplate.secondaryColor}
              </span>
            </div>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Display Options
          </label>
          <div className="flex items-center">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={currentTemplate.showVat}
                onChange={handleVatToggle}
                className="rounded text-red-500 focus:ring-red-500 h-4 w-4"
              />
              <span className="ml-2">Show VAT on receipt</span>
            </label>
          </div>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Terms and Conditions
        </label>
        <textarea
          value={currentTemplate.termsAndConditions.join('\n')}
          onChange={handleTermsChange}
          rows={4}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
          placeholder="Enter terms and conditions (one per line)..."
        />
      </div>
    </div>
  );
};

export default TemplateSelectorForm;