import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getShipmentById, updateShipmentLocation } from '../features/shipmentSlice';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { RootState, AppDispatch } from '../store';
import LocationPicker from './LocationPicker';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});


interface LocationInputs {
  longitude: string;
  latitude: string;
}



const ShipmentDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { currentShipment, loading, error } = useSelector((state: RootState) => state.shipments);
  
  const [newLocation, setNewLocation] = useState<LocationInputs>({
    longitude: '',
    latitude: ''
  });

  useEffect(() => {
    if (id) {
      dispatch(getShipmentById(id));
    }
  }, [dispatch, id]);


  const handleMapPositionChange = (lat: number, lng: number) => {
    setNewLocation({
      latitude: lat.toString(),
      longitude: lng.toString()
    });
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewLocation({
      ...newLocation,
      [e.target.name]: e.target.value
    });
  };

  const handleUpdateLocation = (e: React.FormEvent) => {
    e.preventDefault();
    if (id) {
      dispatch(updateShipmentLocation({
        id,
        longitude: parseFloat(newLocation.longitude),
        latitude: parseFloat(newLocation.latitude)
      }));
      setNewLocation({ longitude: '', latitude: '' });
      navigate(0);

    }
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
  if (!currentShipment) return <div className="mt-3 p-4 text-blue-700 bg-blue-100 rounded-md">Shipment not found</div>;

  const routePoints: [number, number][] = currentShipment.route.map(point => [
    point.coordinates[1], 
    point.coordinates[0]  
  ]);

  // Add current location to the route points if available
  const mapPoints: [number, number][] = [...routePoints];
  let currentLocationPoint: [number, number] | null = null;
  
  if (currentShipment.currentLocation && currentShipment.currentLocation.coordinates) {
    currentLocationPoint = [
      currentShipment.currentLocation.coordinates[1], // latitude
      currentShipment.currentLocation.coordinates[0]  // longitude
    ];
    
    // Add to map points if not already included
    // @ts-ignore
    if (!mapPoints.some(point => point[0] === currentLocationPoint[0] && point[1] === currentLocationPoint[1])) {
      mapPoints.push(currentLocationPoint);
    }
  }

  // Find map center - use current location or the first route point
  const mapCenter: [number, number] = currentLocationPoint || (mapPoints.length > 0 ? mapPoints[0] : [0, 0]);

  // Custom marker icons
  const blueIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  const redIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 container mx-auto">
      <div>
        <div className="bg-white rounded-lg shadow-md m-6">
          <div className="bg-gray-100 py-3 px-4 border-b border-gray-200 rounded-t-lg">
            <h3 className="text-xl font-semibold">Shipment Details</h3>
          </div>
          <div className="p-4">
            <h4 className="text-lg font-medium mb-4">Container ID: {currentShipment.containerId}</h4>
            <div className="mb-3">
              <span className="font-semibold">Status:</span>{' '}
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(currentShipment.status)}`}>
                {currentShipment.status}
              </span>
            </div>
            <div className="mb-3">
              <span className="font-semibold">Vehicle:</span> {currentShipment.vehicleDetails.vehicleType} - {currentShipment.vehicleDetails.vehicleNumber}
            </div>
            <div className="mb-3">
              <span className="font-semibold">Driver:</span> {currentShipment.assignedDriver}
            </div>
            <div className="mb-3">
              <span className="font-semibold">ETA:</span> {new Date(currentShipment.currentETA).toLocaleString()}
            </div>
            {currentShipment.currentLocation && (
              <div className="mb-3">
                <span className="font-semibold">Current Location:</span> {currentShipment.currentLocation.coordinates[1]}° N, {currentShipment.currentLocation.coordinates[0]}° E
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md m-6">
          <div className="bg-gray-100 py-3 px-4 border-b border-gray-200 rounded-t-lg">
            <h3 className="text-xl font-semibold">Update Location  (Click on map to set)</h3>
          </div>
          <div className="p-4">
            <form onSubmit={handleUpdateLocation}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Longitude</label>
                <input
                  type="number"
                  step="0.000001"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter longitude (e.g., -73.935242)"
                  name="longitude"
                  value={newLocation.longitude}
                  onChange={handleLocationChange}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Latitude</label>
                <input
                  type="number"
                  step="0.000001"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter latitude (e.g., 40.730610)"
                  name="latitude"
                  value={newLocation.latitude}
                  onChange={handleLocationChange}
                  required
                />
              </div>
              <button 
                type="submit" 
                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-md transition-colors"
              >
                Update Location
              </button>
            </form>
          </div>
        </div>
      </div>

      <div>
        <div className="bg-white rounded-lg shadow-md h-screen">
          <div className="bg-gray-100 px-4 border-b border-gray-200 rounded-t-lg">
            <h3 className="text-xl font-semibold">Shipment Map</h3>
          </div>
          <div className="p-0 overflow-hidden">
            <div style={{ height: 'calc(100vh - 2rem)' }}>
              {mapCenter[0] !== 0 && mapCenter[1] !== 0 ? (
                <MapContainer 
                  center={mapCenter} 
                  zoom={5} 
                  className="h-full w-full"
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />

                    <LocationPicker 
                        position={mapCenter}
                        onPositionChange={handleMapPositionChange}
                      />
                  
                  {/* Draw route polyline */}
                  {routePoints.length > 1 && (
                    <Polyline 
                      positions={routePoints}
                      color="blue"
                      weight={3}
                      opacity={0.7}
                    />
                  )}
                  
                  {/* Mark route points */}
                  {routePoints.map((point, index) => (
                    <Marker 
                      key={`route-${index}`} 
                      position={point}
                      icon={blueIcon}
                    >
                      <Popup>
                        Route Point {index + 1}
                      </Popup>
                    </Marker>
                  ))}
                  
                  {/* Mark current location */}
                  {currentLocationPoint && (
                    <Marker 
                      position={currentLocationPoint}
                      icon={redIcon}
                    >
                      <Popup>
                        <div>
                          <strong>Current Location</strong><br />
                          Container: {currentShipment.containerId}<br />
                          ETA: {new Date(currentShipment.currentETA).toLocaleDateString()}<br />
                          Status: {currentShipment.status}
                        </div>
                      </Popup>
                    </Marker>
                  )}
                </MapContainer>
              ) : (
                <div className="m-3 p-4 text-yellow-700 bg-yellow-100 rounded-md">
                  No location data available to display on map.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShipmentDetail;