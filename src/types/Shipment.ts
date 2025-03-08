export type GeoPoint = {
    type: "Point";
    coordinates: [number, number]; 
};
  
export type Shipment = {
    _id ?: string;
    containerId: string;
    status: "Pending" | "In Transit" | "Delivered";
    currentETA: string; 
    currentLocation: GeoPoint;
    route: GeoPoint[];
    assignedDriver: string;
    vehicleDetails: VehicleDetails;
    createdAt?: string;
    updatedAt?: string;
};
  



export interface VehicleDetails {
  vehicleNumber: string;
  vehicleType: 'Truck' | 'Ship' | 'Train' | 'Air Cargo';
}

export interface ShipmentFormData {
  containerId: string;
  status: 'Pending' | 'In Transit' | 'Delivered';
  currentETA: string;
  currentLocation: GeoPoint;
  route: GeoPoint[];
  assignedDriver: string;
  vehicleDetails: VehicleDetails;
}

export interface LocationState {
  longitude: string;
  latitude: string;
}

export interface LocationPickerProps {
  position: [number, number];
  onPositionChange: (lat: number, lng: number) => void;
}