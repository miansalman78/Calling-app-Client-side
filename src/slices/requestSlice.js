import { createSlice } from '@reduxjs/toolkit'

const initialState = {}

export const requestSlice = createSlice({
  name: 'track_request',
  initialState,
  reducers: {
    updateRequestStatus: (state,action) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.requestStatus = action.payload
    },
    updateCurrentUser: (state,action) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.currentUser = action.payload
    }
  },
})

// Action creators are generated for each case reducer function
export const { updateRequestStatus,updateCurrentUser} = requestSlice.actions

export default requestSlice.reducer