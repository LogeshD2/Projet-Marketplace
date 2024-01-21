// reducers/authReducer.js

import { LOGOUT } from "./authActions";

// État initial du store pour l'authentification
const initialState = {
  isAuthenticated: false, // Ajoutez d'autres propriétés d'authentification si nécessaire
};

// Reducer pour gérer les actions d'authentification
const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGOUT:
      return {
        ...state,
        isAuthenticated: false, // Mettez à jour les propriétés d'authentification en conséquence
        // Réinitialisez d'autres propriétés d'authentification si nécessaire
      };
    default:
      return state;
  }
};

export default authReducer;
