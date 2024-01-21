// store/index.js

import { createStore, combineReducers } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Importer le stockage local du navigateur
import clientReducer from "../redux/Client/clientReducer";
import livreurReducer from "../redux/Livreur/livreurReducer"; // Importer le reducer du livreur

// Configuration de la persistance des données du store Redux
const persistConfig = {
  key: "root",
  storage: storage,
};

// Combinez les reducers
const rootReducer = combineReducers({
  client: clientReducer,
  livreur: livreurReducer, // Ajouter le reducer du livreur
});

// Créer le reducer persistant
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Créer le store Redux
const store = createStore(persistedReducer);

// Persister le store Redux
const persistor = persistStore(store);

export { store, persistor };
