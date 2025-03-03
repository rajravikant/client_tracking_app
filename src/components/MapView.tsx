import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import L from 'leaflet';

const MapView: React.FC = () => {
  const shipments = useSelector((state: RootState) => state.shipments.shipments);

  const customIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
    iconSize: [30, 30],
  });

  return (
    <div className="map-container p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Shipment Locations</h3>
      <MapContainer center={[20, 0]} zoom={2} style={{ height: '500px', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {shipments.map((shipment) => (
          <Marker key={shipment._id} position={[Math.random() * 180 - 90, Math.random() * 360 - 180]} icon={customIcon}>
            <Popup>
              <strong>Container ID:</strong> {shipment.containerId} <br />
              <strong>Location:</strong> {shipment.currentLocation.latitude | shipment.currentLocation.longitude} <br />
              <strong>Status:</strong> {shipment.status}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapView;
