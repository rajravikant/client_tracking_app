import React, { useEffect,useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../src/store';
import { fetchShipments } from '../features/shipmentSlice';
import { Shipment } from '../types/Shipment';
import { Link } from 'react-router-dom';



interface FilterState {
  status: string;
  vehicleType: string;
  searchTerm: string;
}

const Dashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { shipments, loading, error } = useSelector((state: RootState) => state.shipments);
  const [filteredShipments, setFilteredShipments] = useState<Shipment[]>([]);
  const [filter, setFilter] = useState<FilterState>({
    status: '',
    vehicleType: '',
    searchTerm: ''
  });

  useEffect(() => {
    dispatch(fetchShipments());
  }, [dispatch]);

  useEffect(() => {
    if (shipments) {
      let result = [...shipments];
      
      if (filter.status) {
        result = result.filter(ship => ship.status === filter.status);
      }
      
      if (filter.vehicleType) {
        result = result.filter(ship => ship.vehicleDetails.vehicleType === filter.vehicleType);
      }
      
      if (filter.searchTerm) {
        const term = filter.searchTerm.toLowerCase();
        result = result.filter(ship => 
          ship.containerId.toLowerCase().includes(term) || 
          ship.assignedDriver.toLowerCase().includes(term) ||
          ship.vehicleDetails.vehicleNumber.toLowerCase().includes(term)
        );
      }
      
      setFilteredShipments(result);
    }
  }, [shipments, filter]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilter({
      ...filter,
      [e.target.name]: e.target.value
    });
  };

  const getStatusBadgeColor = (status: string): string => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-100 text-green-800 border-green-800';
      case 'In Transit':
        return 'bg-blue-100 text-blue-800 border-blue-800';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-800';
    }
  };

  if (loading) return <div className="flex justify-center mt-5"><div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>;
  if (error) return <div className="mt-3 p-4 text-red-700 bg-red-100 rounded-md">{error}</div>;

  return (
    <div className="container mx-auto  py-6">
     
      
      <div className="bg-white rounded-lg shadow-md mb-6">
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Search by Container ID, Driver, Vehicle..."
                name="searchTerm"
                value={filter.searchTerm}
                onChange={handleFilterChange}
              />
            </div>
            <div>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                name="status"
                value={filter.status}
                onChange={handleFilterChange}
              >
                <option value="">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="In Transit">In Transit</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>
            <div>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                name="vehicleType"
                value={filter.vehicleType}
                onChange={handleFilterChange}
              >
                <option value="">All Vehicle Types</option>
                <option value="Truck">Truck</option>
                <option value="Ship">Ship</option>
                <option value="Train">Train</option>
                <option value="Air Cargo">Air Cargo</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {filteredShipments.length === 0 ? (
        <div className="p-4 text-blue-700 bg-blue-100 rounded-md">No shipments found matching your criteria.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg overflow-hidden">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="py-3 px-4 text-left">ID</th>
                <th className="py-3 px-4 text-left">Container ID</th>
                <th className="py-3 px-4 text-left">Current Location</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-left">Vehicle Type</th>
                <th className="py-3 px-4 text-left">Driver</th>
                <th className="py-3 px-4 text-left">ETA</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredShipments.map((shipment) => (
                <tr key={shipment._id} className="hover:bg-gray-50">
                  <td className="py-3 px-4">#{shipment._id}</td>
                  <td className="py-3 px-4">{shipment.containerId}</td>
                  <td className="py-3 px-4">{shipment.currentLocation.coordinates[1]} | {shipment.currentLocation.coordinates[0]}</td>
                  <td className="py-3 px-4">
                    <span className={`px-3 py-1 text-xs border font-semibold rounded-full ${getStatusBadgeColor(shipment.status)}`}>
                      {shipment.status}
                    </span>
                  </td>
                 
                  <td className="py-3 px-4">{shipment.vehicleDetails.vehicleType}</td>
                  <td className="py-3 px-4">{shipment.assignedDriver}</td>
                  <td className="py-3 px-4">{new Date(shipment.currentETA).toLocaleDateString()}</td>
                  <td className="py-3 px-4">
                    <Link to={`/shipment/${shipment._id}`} className="px-3 py-1 bg-teal-600 hover:bg-teal-800 text-white text-sm rounded transition-colors">
                      View
                    </Link>
                  </td>
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