import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../src/store';
import { fetchShipments } from '../features/shipmentSlice';

const Dashboard: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { shipments, loading, error } = useSelector((state: RootState) => state.shipments);

  useEffect(() => {
    dispatch(fetchShipments());
  }, [dispatch]);

  return (
    <div className="dashboard p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Shipments Dashboard</h2>
      {loading && <p className="text-gray-500">Loading shipments...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
            <thead className="bg-blue-500 text-white">
              <tr>
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">Container ID</th>
                <th className="px-4 py-2">Current Location</th>
                <th className="px-4 py-2">ETA</th>
                <th className="px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {shipments.map((shipment) => (
                <tr key={shipment._id} className="border-b hover:bg-gray-100">
                  <td className="px-4 py-2">{shipment._id}</td>
                  <td className="px-4 py-2">{shipment.containerId}</td>
                  <td className="px-4 py-2"> [{shipment.currentLocation.latitude},{shipment.currentLocation.longitude}]</td>
                  <td className="px-4 py-2">{shipment.currentETA}</td>
                  <td className="px-4 py-2 font-semibold text-blue-600">{shipment.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
