import React, { Fragment } from "react";
import Dashboard from "./components/Dashboard";
import MapView from "./components/MapView";
import "./index.css";
import Header from "./components/Header";
import { Plus } from "lucide-react";
import ShipmentsSideBar from "./components/ShipmentsSideBar";
import { useNavigate } from "react-router-dom";

const App: React.FC = () => {
  const navigate = useNavigate();

  return (
      <div className="min-h-screen w-full bg-neutral-900 ">
        <Header />
        <div className=" bg-gray-50  rounded-4xl flex flex-col items-center m-5 p-5">
          <div className="flex justify-between items-center mb-2 w-full p-5">
            <h1 className="text-3xl font-medium ">Shipment Tracking</h1>
            <button
              onClick={() => navigate("/add-shipment")}
              className="bg-teal-600 hover:bg-teal-700 rounded-full flex items-center text-white px-4 py-2 "
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New Shipping
            </button>
          </div>

          <div className="flex gap-6 w-full sm:flex-row flex-col">
            
            {/* Left Panel */}
            <div className="sm:w-1/3 bg-white p-6 rounded-lg border-zinc-200 border">
              <div className="add-shipment">
                <ShipmentsSideBar />
              </div>
            </div>

            {/* Map Area */}
            <div className="sm:w-2/3 relative">
              <div className="bg-gray-100 rounded-lg h-[680px] sticky top-5">
                <MapView />
              </div>
            </div>
          </div>

          <Dashboard />
        </div>
      </div>
  );
};

export default App;
