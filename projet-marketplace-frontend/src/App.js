// Librairie
import "./App.css";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./redux/store";

// Composants
import Marketplace from "./containers/Marketplace";

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Marketplace />
      </PersistGate>
    </Provider>
  );
}

export default App;
