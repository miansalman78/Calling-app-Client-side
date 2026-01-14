import PropTypes from 'prop-types';
import React, { createContext, useEffect, useReducer } from 'react';

// third-party
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-simple-toast';


// reducer - state management
import { ACCOUNT_INITIALIZE, LOGIN, LOGOUT } from '../store/actions';
import accountReducer from '../store/accountReducer';
import { _signin, _getActiveRequest, _me, _signupActivate } from '../utils/api'
import { useSelector, useDispatch } from 'react-redux'
import { updateRequestStatus, updateCurrentUser } from '../slices/requestSlice'


import * as ZIM from 'zego-zim-react-native';

import * as ZPNs from 'zego-zpns-react-native';

import ZegoUIKitPrebuiltCallService, { ZegoMenuBarButtonName, } from '@zegocloud/zego-uikit-prebuilt-call-rn';
import { KeyCenter } from '../utils/Constants';

const onUserLogin = async (userID, userName, props) => {
    return ZegoUIKitPrebuiltCallService.init(
        KeyCenter.appID,
        KeyCenter.appSign,
        userID,
        userName,
        [ZIM, ZPNs], {

        ringtoneConfig: {
            incomingCallFileName: 'zego_incoming.mp3',
            outgoingCallFileName: 'zego_outgoing.mp3',
        },

        notifyWhenAppRunningInBackgroundOrQuit: true,
        isIOSSandboxEnvironment: true,
        androidNotificationConfig: {
            channelID: 'ZegoUIKit',
            channelName: 'ZegoUIKit',
        },

        requireConfig: data => {
            return {
                onHangUp: duration => {
                    props.navigation.navigate('Home');
                },

                topMenuBarConfig: {
                    buttons: [ZegoMenuBarButtonName.minimizingButton],
                },

                onWindowMinimized: () => {
                    props.navigation.navigate('Home');
                },

                onWindowMaximized: () => {
                    props.navigation.navigate('ZegoUIKitPrebuiltCallInCallScreen');
                },
            };

        },
    },).then(() => {
        ZegoUIKitPrebuiltCallService.requestSystemAlertWindow({
            message: 'We need your consent for the following permissions in order to use the offline call function properly',
            allow: 'Allow',
            deny: 'Deny',
        });
    });
};

// project imports

// constant
const initialState = {
    isLoggedIn: false,
    isInitialized: false,
    user: null
};

const verifyToken = (serviceToken) => {
    if (!serviceToken) {
        return false;
    }
    const decoded = jwtDecode(serviceToken);
    return decoded.exp > Date.now() / 1000;
};

const setSession = (serviceToken) => {
    // if (serviceToken) {
    //     localStorage.setItem('serviceToken', serviceToken);
    //     axios.defaults.headers.common.Authorization = `Bearer ${serviceToken}`;
    // } else {
    //     localStorage.removeItem('serviceToken');
    //     delete axios.defaults.headers.common.Authorization;
    // }
};

// ===========================|| Auth CONTEXT & PROVIDER ||=========================== //

const AuthContext = createContext({
    ...initialState,
    login: () => Promise.resolve(),
    loginVerifyOTP: () => Promise.resolve(),
    logout: () => Promise.resolve()
});

export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(accountReducer, initialState);
    const dispatchRedux = useDispatch()

    const login = async (email, password) => {

        let body = {
            email: email,
            password: password
        }
        try {

            let res = await _signin({ body });
            dispatch({
                type: LOGIN,
                payload: {
                    user: res.auth_token || null
                }
            });
            let currentUserDetails = await _me()
            dispatchRedux(updateCurrentUser(currentUserDetails))
            let currentRequest = await _getActiveRequest()
            dispatchRedux(updateRequestStatus(currentRequest))

            //await onUserLogin(currentUserDetails.id.toString(), currentUserDetails.fullname, );

        } catch (err) {
            if (err?.response?.data?.detail) {
                Toast.show(err.response.data.detail);
            } else {
                Toast.show("Wrong credentials. Please try with correct credentials");
            }
        }
    };

    const loginVerifyOTP = async (phone_number, otp, token) => {

        let body = {
            phone_number: phone_number,
            otp: otp,
            token: token,
            action: 'SIGNIN'
        }
        try {

            let res = await _signupActivate({ body });
            //let res = await _signupfire({ body });
            console.log(res);
            if (res.code != 200) {
                Toast.show(res.error, Toast.LONG);
                return;
            }
            Toast.show("Your OTP code has been accepted. You will now be logged in.", Toast.LONG);
            dispatch({
                type: LOGIN,
                payload: {
                    user: res.auth_token || null
                }
            });
            let currentUserDetails = await _me()
            dispatchRedux(updateCurrentUser(currentUserDetails))
            let currentRequest = await _getActiveRequest()
            dispatchRedux(updateRequestStatus(currentRequest))

            //await onUserLogin(currentUserDetails.id.toString(), currentUserDetails.fullname, );

        } catch (err) {
            if (err?.response?.data?.detail) {
                Toast.show(err.response.data.detail);
            } else {
                Toast.show("Wrong OTP. Please try with correct OTP");
            }
        }
    };

    const logout = async () => {
        // setSession(null);
        await AsyncStorage.removeItem('AUTH_TOKEN');
        dispatch({ type: LOGOUT });

    };

    useEffect(() => {
        const init = async () => {
            try {
                const serviceToken = await AsyncStorage.getItem('AUTH_TOKEN');

                if (serviceToken) {
                    setSession(serviceToken);
                    // const response = await axios.get('/api/account/me');
                    // const { user } = response.data;
                    dispatch({
                        type: ACCOUNT_INITIALIZE,
                        payload: {
                            isLoggedIn: true,
                            user: serviceToken
                        }
                    });

                    let currentUserDetails = await _me()
                    dispatchRedux(updateCurrentUser(currentUserDetails))
                    let currentRequest = await _getActiveRequest()
                    dispatchRedux(updateRequestStatus(currentRequest))

                } else {
                    dispatch({
                        type: ACCOUNT_INITIALIZE,
                        payload: {
                            isLoggedIn: false,
                            user: null
                        }
                    });
                }
            } catch (err) {
                console.error(err);
                dispatch({
                    type: ACCOUNT_INITIALIZE,
                    payload: {
                        isLoggedIn: false,
                        user: null
                    }
                });
            }
        };

        init();
    }, []);

    //todo
    // if (!state.isInitialized) {
    //     return <Loader />;
    // }


    return <AuthContext.Provider value={{ ...state, login, logout, loginVerifyOTP }}>{children}</AuthContext.Provider>;
};

// AuthProvider.propTypes = {
//     children: PropTypes.node.isRequired
// };

export default AuthContext;
