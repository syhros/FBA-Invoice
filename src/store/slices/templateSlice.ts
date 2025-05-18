import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ReceiptTemplate } from '../../types/types';
import { loadTemplates, saveTemplate } from '../../utils/localStorage';

interface TemplateState {
  templates: ReceiptTemplate[];
  currentTemplateId: string;
}

const templates = loadTemplates();

const initialState: TemplateState = {
  templates,
  currentTemplateId: templates.length > 0 ? templates[0].id : '',
};

const templateSlice = createSlice({
  name: 'template',
  initialState,
  reducers: {
    addTemplate: (state, action: PayloadAction<ReceiptTemplate>) => {
      state.templates.push(action.payload);
      saveTemplate(action.payload);
    },
    updateTemplate: (state, action: PayloadAction<ReceiptTemplate>) => {
      const index = state.templates.findIndex(t => t.id === action.payload.id);
      if (index !== -1) {
        state.templates[index] = action.payload;
        saveTemplate(action.payload);
      }
    },
    deleteTemplate: (state, action: PayloadAction<string>) => {
      state.templates = state.templates.filter(t => t.id !== action.payload);
      if (state.currentTemplateId === action.payload && state.templates.length > 0) {
        state.currentTemplateId = state.templates[0].id;
      }
      localStorage.setItem('amazon-receipt-generator-templates', JSON.stringify(state.templates));
    },
    setCurrentTemplate: (state, action: PayloadAction<string>) => {
      state.currentTemplateId = action.payload;
    },
  },
});

export const {
  addTemplate,
  updateTemplate,
  deleteTemplate,
  setCurrentTemplate,
} = templateSlice.actions;

export default templateSlice.reducer;