import { configureStore } from '@reduxjs/toolkit'
import requestSlice from '../slices/requestSlice'
import currentItemSlice from '../slices/currentItemSlice'
export const store = configureStore({
  reducer: {
    requestStatus: requestSlice,
    currentItem:currentItemSlice
  },
})