import { createSlice } from '@reduxjs/toolkit'

const initialState = {}

export const currentItemSlice = createSlice({
  name: 'current_item',
  initialState,
  reducers: {
    updateCurrentRequestItem: (state,action) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      // state = action.payload


      let _updatedState = { ...state}
      _updatedState = action.payload

      state = _updatedState

    }
  },
})

// Action creators are generated for each case reducer function
export const { updateCurrentRequestItem} = currentItemSlice.actions

export default currentItemSlice.reducer