// actions/clientActions.js

// Action type pour la déconnexion du client
export const LOGOUT = "LOGOUT";

// Action creator pour la déconnexion du client
export const logout = () => {
  return {
    type: LOGOUT,
  };
};
