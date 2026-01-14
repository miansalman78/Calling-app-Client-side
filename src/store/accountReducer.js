// action - state management
import { ACCOUNT_INITIALIZE, LOGIN, LOGOUT } from './actions';
import AsyncStorage from "@react-native-async-storage/async-storage";

// ===========================|| ACCOUNT REDUCER ||=========================== //

const accountReducer = (state, action) => {
    switch (action.type) {
        case ACCOUNT_INITIALIZE: {
            const { isLoggedIn, user } = action.payload;
            return {
                ...state,
                isLoggedIn,
                isInitialized: true,
                user
            };
        }
        case LOGIN: {
            const { user } = action.payload;

            AsyncStorage.setItem("AUTH_TOKEN", user)
            return {
                ...state,
                isLoggedIn: true,
                user
            };
        }
        case LOGOUT: {
            return {
                ...state,
                isLoggedIn: false,
                user: null
            };
        }
        default: {
            return { ...state };
        }
    }
};

export default accountReducer;
