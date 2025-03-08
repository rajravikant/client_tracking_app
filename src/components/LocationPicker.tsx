// LocationPicker component with click handler
import { useState } from "react";
import { LocationPickerProps } from "../types/Shipment";
import {Marker, Popup, useMapEvents } from 'react-leaflet';
const LocationPicker: React.FC<LocationPickerProps> = ({ position, onPositionChange }) => {
    const [markerPosition, setMarkerPosition] = useState<[number, number]>(position);
    
    const map = useMapEvents({
      click: (e) => {
        const { lat, lng } = e.latlng;
        setMarkerPosition([lat, lng]);
        onPositionChange(lat, lng);
        
      },
    });
  
    return (
      <Marker position={markerPosition}>
        <Popup>
          Latitude: {markerPosition[0].toFixed(6)}<br />
          Longitude: {markerPosition[1].toFixed(6)}
        </Popup>
      </Marker>
    );
  };

export default LocationPicker;