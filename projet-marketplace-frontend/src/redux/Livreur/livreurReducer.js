// reducers/livreurReducer.js

import { SET_LIVREUR_INFO } from "./livreurActions";

// État initial du store pour le livreur
const initialState = {
  livreurInfo: null,
};

// Reducer pour gérer les actions du livreur
const livreurReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_LIVREUR_INFO:
      return {
        ...state,
        livreurInfo: action.payload,
      };
    default:
      return state;
  }
};

export default livreurReducer;
