import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GOOGLE_API_KEY } from "./Constants";
import { TOM_TOM_API_Key } from "./Constants";

//export const host = "http://tusharma123.pythonanywhere.com/";
//export const host = "https://seeme.traakme.com/"; 
//export const host = "http://172.20.10.2:8000";
//export const host = "http://172.20.10.4:8000";
//export const host = "http://192.168.219.214:8000";
//export const host = "http://seemeglobal-dev.us-west-2.elasticbeanstalk.com";
export const host = "https://me.seemeglobal.net";

const client = axios.create();

// client.interceptors.request.use(async (configuration) => {
//   const { access, refresh } = snapshot(auth);
//   const accessToken = access;
//   if (accessToken) {
//     const decoded = jwt_decode(accessToken);
//     const expiryDate = new Date(decoded.exp * 1000);
//     if (
//       !configuration.url.endsWith("auth/jwt/create/") &&
//       new Date() > expiryDate
//     ) {
//       try {
//         const res = await axios.post(`${host}/auth/jwt/refresh/`, {
//           refresh: refresh,
//         });
//         auth.access = res.data.access;
//         return {
//           ...configuration,
//           headers: {
//             ...configuration.headers,
//             Authorization: `JWT ${res.data.access}`,
//           },
//         };
//       } catch (err) {
//         reset(auth, authInit);
//         reset(menu, menuInit);
//         message.error("Session expired");
//         throw new Error(err);
//       }
//     }
//   }
//   return configuration;
// });

// Internal help/generic functions
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) === `${name}=`) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

function buildHeaders(authorize = false, extraHeaders = {}) {
  return AsyncStorage.getItem("AUTH_TOKEN").then((value) => {
    if (authorize && value) {

      return { Authorization: `Token ${value}`, ...extraHeaders };
    }
    return { ...extraHeaders };
  }).catch((err) => {
    return { ...extraHeaders };
  });


}

// eslint-disable-next-line no-unused-vars
export async function get({ uri, params = {}, options }) {
  const opt = {
    params,
    headers: await buildHeaders(false),
  };
  return axios
    .get(`${host}/${uri}`, { ...options, ...opt })
    .then((response) => response.data);
}

async function post({ uri, params, body = {} }) {
  const options = {
    params,
    headers: await buildHeaders(false),
  };

  return axios
    .post(`${host}/${uri}`, body, options)
    .then((response) => response.data);
}

function setUrl(uri, mocked) {
  const res = mocked ? `${uri}` : `${host}/${uri}`;
  return res;
}

async function authorizedGet({ uri, params = {}, options, mocked }) {
  const token = await AsyncStorage.getItem("AUTH_TOKEN")

  let opt = {
    params,
    headers: {
      Authorization: `Token ${token}`
    },
  };
  const url = setUrl(uri, mocked);
  return client
    .get(url, { ...options, ...opt })
    .then((response) => response.data);
}

async function authorizedPost({ uri, params, body = {}, mocked }) {
  const token = await AsyncStorage.getItem("AUTH_TOKEN")
  const options = {
    params,
    headers: {
      Authorization: `Token ${token}`
    },
  };
  const url = setUrl(uri, mocked);
  return client.post(url, body, options).then((response) => response.data);
}

async function authorizedPatch({ uri, params, body = {}, mocked }) {
  const token = await AsyncStorage.getItem("AUTH_TOKEN")
  const options = {
    params,
    headers: {
      Authorization: `Token ${token}`
    },
  };
  const url = setUrl(uri, mocked);
  return client.patch(url, body, options).then((response) => response.data);
}

async function authorizedDelete({ uri, params, body = {}, mocked }) {
  const token = await AsyncStorage.getItem("AUTH_TOKEN")
  const options = {
    params,
    headers: {
      Authorization: `Token ${token}`
    },
  };
  const url = setUrl(uri, mocked);
  return client.delete(url, options).then((response) => response.data);
}

async function authorizedPostUpload({ uri, body = {}, params }) {
  const token = await AsyncStorage.getItem("AUTH_TOKEN")
  const options = {
    params,
    headers: {
      Authorization: `Token ${token}`,
      'Content-Type': 'multipart/form-data'
    },
  };
  return client
    .post(`${host}/${uri}`, body, options)
    .then((response) => response.data);
}

async function unauthorizedPostUpload({ uri, body = {}, params }) {
  const options = {
    params,
    headers: {
      'Content-Type': 'multipart/form-data'
    },
  };
  return client
    .post(`${host}/${uri}`, body, options)
    .then((response) => response.data);
}

// REST API
export function _signupfire({ body }) {
  return post({ uri: "auth/mobile/fire", body });
}

export function _signupImage({ body }) {
  return unauthorizedPostUpload({ uri: "auth/mobile/photosignup", body });
}

export function _updateImage({ body }) {
  return authorizedPostUpload({ uri: "auth/mobile/uploadphoto", body });
}

export function _signup({ body }) {
  return post({ uri: "auth/users/", body });
}

export function _signin({ body }) {
  return post({ uri: "auth/token/login", body });
}

export function _signinmobile({ body }) {
  return post({ uri: "auth/mobile/login", body });
}

export function _signupActivate({ body }) {
  return post({ uri: "auth/mobile/activate", body });
}

export function _sendFCMMessage({ body }) {
  return post({ uri: "auth/mobile/sendfcm", body });
}

export function _passwordForgotten({ body }) {
  return post({ uri: "password_reset/", body });
}

export function _validateToken({ body }) {
  return post({ uri: "password_reset/validate_token/", body });
}

export function _confirmPasswordChange({ body }) {
  return post({ uri: "password_reset/confirm/", body });
}

export function _changePassword({ body }) {
  return authorizedPost({ uri: "accounts/change_password/", body });
}

export function _me() {
  return authorizedGet({ uri: "auth/users/me/" });
}

export function _fetchContacts(searchParam = '') {

  if ((searchParam || "") != "") {
    return authorizedGet({ uri: `accounts/contacts/?fullname=${searchParam}` });
  }
  return authorizedGet({ uri: "accounts/contacts/" });
}

export function _fetchContactsNextPage({ page }) {

  return authorizedGet({ uri: `accounts/contacts/?page=${page}` });
}

export function _patchContact({ pk, body }) {

  return authorizedPatch({ uri: `accounts/contacts/${pk}/`, body });
}

export function _deleteContact(pk) {
  return authorizedDelete({ uri: `accounts/contacts/${pk}/` });
}

export function _postContact({ body }) {
  return authorizedPost({ uri: "accounts/contacts/", body });
}

export function _updateDeviceToken({ body }) {
  return authorizedPost({ uri: "accounts/update_device_token", body });
}

export function normalGet({ uri, params = {}, options }) {
  const opt = {
    params,
  };
  return axios
    .get(`${uri}`, { ...options, ...opt })
    .then((response) => response.data);
}

export function _getPlaceDetails(searchParam = '') {
  return normalGet({ uri: `https://maps.googleapis.com/maps/api/place/details/json?place_id=${searchParam}&key=${GOOGLE_API_KEY}` });
}

export function _getDetailsLatLong(searchParam = '') {
  return normalGet({ uri: `https://maps.googleapis.com/maps/api/geocode/json?latlng=${searchParam}&key=${GOOGLE_API_KEY}` });
}


export function _checkEmailStatus({ body }) {
  return post({ uri: "accounts/check_email_status/", body });
}

export function _makeTwilioToken({ body }) {
  return authorizedPost({ uri: "accounts/twiliotoken/", body });
}

export function _getingusersinfo({ body }) {
  return authorizedPost({ uri: "accounts/getingusersinfo/", body });
}

export function _sendfcm({ body }) {
  return authorizedPost({ uri: "accounts/sendfcm/", body });
}

export function _getActiveRequest() {
  return authorizedGet({ uri: "accounts/track_request/get_active_request/" });
}

export function _postSendRequest({ body }) {
  return authorizedPost({ uri: "accounts/track_request/", body });
}

export function _patchSendRequest({ pk, body }) {

  return authorizedPatch({ uri: `accounts/track_request/${pk}/`, body });
}

export function _batchSendRequest({ body }) {
  return authorizedPost({ uri: "accounts/batch_contacts/", body });
}

export function _postUpdateAcctRequest({ body }) {
  return authorizedPost({ uri: "accounts/updateaccount/", body });
}

export function _patchSendSeeMeRequest({ pk, body }) {
  return authorizedPost({ uri: `seeme/home/${pk}`, body });
}

export function _patchTestSeeMeRequest({ pk, body }) {
  return post({ uri: `seeme/testpost/${pk}`, body });
}

export function _lookseeme({ pk, body }) {
  return post({ uri: `seeme/lookseeme/${pk}`, body });
}

/*export function _patchTestSeeMeRequest() {
  let data = new FormData();
    data.append("search", "Anya beg");
    data.append("longitude", "87076543");
    let body = {
      search: 'Anya beg',
      longitude: '87076543',
    };
  return axios
    .post('https://tusharma123.pythonanywhere.com/seeme/testpost/3456', body)
    .then((response) => response.data);
}*/

export function _tomGeocode(searchParam = '') {
  return normalGet({ uri: `https://api.tomtom.com/search/2/reverseGeocode/${searchParam}.json?key=${TOM_TOM_API_Key}&radius=100` });
}

export function _patchUser({ pk, body }) {
  return authorizedPatch({ uri: `auth/users/${pk}/`, body });
}