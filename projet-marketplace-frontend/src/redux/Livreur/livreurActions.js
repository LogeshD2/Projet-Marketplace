// actions/livreursActions.js

// Action type
export const SET_LIVREUR_INFO = "SET_LIVREUR_INFO";

// Action creator
export const setLivreurInfo = (livreurInfo) => {
  return {
    type: SET_LIVREUR_INFO,
    payload: livreurInfo,
  };
};
