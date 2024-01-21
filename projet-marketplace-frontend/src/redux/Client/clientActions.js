// actions/clientActions.js

// Action type
export const SET_CLIENT_INFO = "SET_CLIENT_INFO";

// Action creator
export const setClientInfo = (clientInfo) => {
  return {
    type: SET_CLIENT_INFO,
    payload: clientInfo,
  };
};
