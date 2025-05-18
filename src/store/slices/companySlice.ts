import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CompanyDetails } from '../../types/types';
import { loadCompanyDetails, saveCompanyDetails } from '../../utils/localStorage';

interface CompanyState {
  details: CompanyDetails | null;
  defaultDetails: CompanyDetails[];
  isCustomCompanyDetails: boolean;
}

// Default company details
const defaultCompanyDetails: CompanyDetails[] = [
  {
    name: 'My FBA Business',
    address: ['456 Commerce Road', 'Manchester', 'M1 1BB', 'United Kingdom'],
    vatNumber: 'GB987654321',
    companyNumber: '87654321',
    email: 'contact@myfba.com',
    website: 'www.myfba.com',
  }
];

const initialCompanyDetails = loadCompanyDetails() || defaultCompanyDetails[0];

const initialState: CompanyState = {
  details: initialCompanyDetails,
  defaultDetails: defaultCompanyDetails,
  isCustomCompanyDetails: false,
};

const companySlice = createSlice({
  name: 'company',
  initialState,
  reducers: {
    updateCompanyDetails: (state, action: PayloadAction<Partial<CompanyDetails>>) => {
      state.details = {
        ...state.details as CompanyDetails,
        ...action.payload,
      };
      if (state.details) {
        saveCompanyDetails(state.details);
      }
    },
    setCompanyLogo: (state, action: PayloadAction<string>) => {
      if (state.details) {
        state.details.logo = action.payload;
        saveCompanyDetails(state.details);
      }
    },
    setDefaultCompanyDetails: (state, action: PayloadAction<CompanyDetails>) => {
      state.details = action.payload;
      saveCompanyDetails(action.payload);
    },
    setIsCustomCompanyDetails: (state, action: PayloadAction<boolean>) => {
      state.isCustomCompanyDetails = action.payload;
    },
    addDefaultCompanyDetails: (state, action: PayloadAction<CompanyDetails>) => {
      state.defaultDetails.push(action.payload);
    },
    removeDefaultCompanyDetails: (state, action: PayloadAction<string>) => {
      state.defaultDetails = state.defaultDetails.filter(
        company => company.name !== action.payload
      );
    },
  },
});

export const {
  updateCompanyDetails,
  setCompanyLogo,
  setDefaultCompanyDetails,
  setIsCustomCompanyDetails,
  addDefaultCompanyDetails,
  removeDefaultCompanyDetails,
} = companySlice.actions;

export default companySlice.reducer;
