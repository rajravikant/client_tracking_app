import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store';
import { addShipment } from '../features/shipmentSlice';
import { Shipment } from '../types/Shipment';

const ShipmentForm: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const [shipment, setShipment] = useState<Shipment>({
    containerId: '',
    currentLocation: {
      longitude: 0,
      latitude: 0,
    },
    route: [
      {
        longitude: 45.66,
        latitude: 86.3,
      },
      {
        longitude: 84.36,
        latitude: 90.66,
      },

    ],
    currentETA: '',
    status: 'Pending',
  });



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (shipment.containerId === '' ) {
      alert('Please enter a container ID');
      return;
    }
    dispatch(addShipment(shipment));
    console.log(shipment);
    
    // setShipment({});
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    
    if (e.target.name === 'longitude' || e.target.name === 'latitude') {
      setShipment({
        ...shipment!,
        currentLocation: {
          ...shipment!.currentLocation,
          [e.target.name]: parseFloat(e.target.value),
        },
      });
      return;
      
    }
    
    setShipment({
      ...shipment!,
      [e.target.name]: e.target.value,
    });
  }

  return (
    <form className="shipment-form p-6 bg-white rounded-lg shadow-md" onSubmit={handleSubmit}>
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Add Shipment</h3>
      <label className="block mb-2">
        Container ID:
        <input
          type="text"
          value={shipment?.containerId || '' }
          onChange={(e) => handleChange(e)}
          name="containerId"
          className="w-full border border-gray-300 p-2 rounded-md"
          required
        />
      </label>
      <label className="block mb-4">
        Current Location:
        <div className="grid sm:grid-cols-2 gap-4">
        <input
          type="number"
          name="longitude"
          placeholder='Longitude'
          value={shipment?.currentLocation.longitude}
          onChange={(e) => handleChange(e)}
          className="w-full border border-gray-300 p-2 rounded-md"
          required
        />
        <input
          type="number"
          value={shipment?.currentLocation.latitude }
          name="latitude"
          placeholder='Latitude'
          onChange={(e) => handleChange(e)}
          className="w-full border border-gray-300 p-2 rounded-md"
          required
        />
        </div>
        
      </label>

      {/* <label className="block mb-4">
        
          <div className="grid sm:grid-cols-3 gap-4 mb-2">
            <input
              type="number"
              placeholder='Longitude'
              value={shipment?.route[0].longitude || 0}
              name="longitude"
              onChange={(e) => handleChange(e)}
              className="w-full border border-gray-300 p-2 rounded-md"
            />
            <input
              type="number"
              placeholder='Longitude'
              value={shipment?.route[0].longitude || 0}
              name="longitude"
              onChange={(e) => handleChange(e) }
              className="w-full border border-gray-300 p-2 rounded-md"
            />
            <button>Add</button>
            </div>
            
      </label> */}

      <label className="block mb-4">
      Current ETA:
      <input type='date' value={shipment?.currentETA} name='currentETA' onChange={(e) => {
        setShipment({
          ...shipment!,
          currentETA: e.target.value.toString()
        });
      }} className="w-full border border-gray-300 p-2 rounded-md"/>
     
      </label>

      <label className="block mb-4">
      Status:

      <select name='status' value={shipment?.status} onChange={(e) => {
        setShipment({
          ...shipment!,
          status: e.target.value as 'Pending' | 'In Transit' | 'Delivered'
        });
      }} className="w-full border border-gray-300 p-2 rounded-md">
        <option value='Pending'>Pending</option>
        <option value='In Transit'>In Transit</option>
        <option value='Delivered'>Delivered</option>
      </select>
      </label>
      <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600">
        Add Shipment
      </button>
    </form>
  );
};

export default ShipmentForm;
