import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { UIState } from '@/services/types';

const initialState: UIState = {
  currentPage:       'dashboard',
  sidebarOpen:       true,
  previewContractId: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setCurrentPage(state, action: PayloadAction<string>) {
      state.currentPage = action.payload;
    },
    toggleSidebar(state) {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen(state, action: PayloadAction<boolean>) {
      state.sidebarOpen = action.payload;
    },
    openPreview(state, action: PayloadAction<string>) {
      state.previewContractId = action.payload;
    },
    closePreview(state) {
      state.previewContractId = null;
    },
  },
});

export const { setCurrentPage, toggleSidebar, setSidebarOpen, openPreview, closePreview } = uiSlice.actions;
export default uiSlice.reducer;
