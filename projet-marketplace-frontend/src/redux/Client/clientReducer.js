// reducers/clientReducer.js

import { SET_CLIENT_INFO } from "./clientActions";
import { LOGOUT } from "../Logout/logoutActions";

// État initial du store
const initialState = {
  clientInfo: null,
};

// Reducer pour gérer l'action SET_CLIENT_INFO
const clientReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_CLIENT_INFO:
      return {
        ...state,
        clientInfo: action.payload,
      };
    case LOGOUT:
      return {
        ...state,
        clientInfo: undefined,
      };
    default:
      return state;
  }
};

export default clientReducer;
