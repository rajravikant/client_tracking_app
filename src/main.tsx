import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Provider } from "react-redux";
import store from "./store.ts";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import AddShipment from "./components/AddShipment.tsx";
import ShipmentDetail from "./components/ShipmentDetails.tsx";

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/shipment/:id" element={<ShipmentDetail />} />
        <Route path="/add-shipment" element={<AddShipment />} />
      </Routes>
    </Router>
  </Provider>
);
