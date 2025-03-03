import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import ShipmentForm from './components/ShipmentForm';
import MapView from './components/MapView';
import './index.css';





const App: React.FC = () => {
  
  return (
   
      <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
        <h1 className="text-3xl font-bold mb-6 text-blue-600">Cargo Shipment Tracker</h1>
        <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-md">
          <ShipmentForm />
        </div>
        <div className="w-full max-w-4xl mt-6 bg-white p-6 rounded-lg shadow-md">
          <Dashboard />
        </div>
        <div className="w-full max-w-4xl mt-6 bg-white p-6 rounded-lg shadow-md">
          <MapView />
        </div>

      
      </div>
  
  );
};

export default App;
