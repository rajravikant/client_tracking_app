import React, { useState, ChangeEvent, FormEvent } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import LocationPicker from "./LocationPicker";
import {
  GeoPoint as Point,
  LocationState,
  ShipmentFormData,
} from "../types/Shipment";
import { addShipment } from "../features/shipmentSlice";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const AddShipment: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<ShipmentFormData>({
    containerId: "",
    status: "Pending",
    currentETA: "",
    currentLocation: {
      type: "Point",
      coordinates: [0, 0],
    },
    route: [],
    assignedDriver: "",
    vehicleDetails: {
      vehicleNumber: "",
      vehicleType: "Truck",
    },
  });

  const [location, setLocation] = useState<LocationState>({
    longitude: "",
    latitude: "",
  });

  const [routePoints, setRoutePoints] = useState<Point[]>([]);
  const [currentRoutePoint, setCurrentRoutePoint] = useState<LocationState>({
    longitude: "",
    latitude: "",
  });

  const defaultPosition: [number, number] = [20.5937, 78.9629];
  const [mapCenter, setMapCenter] = useState<[number, number]>(defaultPosition);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData({
        ...formData,
        [parent]: {
          // @ts-ignore
          ...formData[parent as keyof ShipmentFormData],
          [child]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      } as ShipmentFormData);
    }
  };

  const handleLocationChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLocation({
      ...location,
      [e.target.name]: e.target.value,
    });
  };

  const handleRoutePointChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCurrentRoutePoint({
      ...currentRoutePoint,
      [e.target.name]: e.target.value,
    });
  };

  const handleMapPositionChange = (lat: number, lng: number) => {
    setLocation({
      latitude: lat.toString(),
      longitude: lng.toString(),
    });
  };

  const handleAddRoutePoint = () => {
    if (currentRoutePoint.longitude && currentRoutePoint.latitude) {
      const newPoint: Point = {
        type: "Point",
        coordinates: [
          parseFloat(currentRoutePoint.longitude),
          parseFloat(currentRoutePoint.latitude),
        ],
      };

      setRoutePoints([...routePoints, newPoint]);
      setCurrentRoutePoint({ longitude: "", latitude: "" });
    }
  };

  const handleRemoveRoutePoint = (index: number) => {
    const updatedRoutePoints = [...routePoints];
    updatedRoutePoints.splice(index, 1);
    setRoutePoints(updatedRoutePoints);
  };

  const handleUpdateLocation = () => {
    if (location.longitude && location.latitude) {
      setFormData({
        ...formData,
        currentLocation: {
          type: "Point",
          coordinates: [
            parseFloat(location.longitude),
            parseFloat(location.latitude),
          ],
        },
      });
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const shipmentData: ShipmentFormData = {
      ...formData,
      route: routePoints,
    };

    dispatch(addShipment(shipmentData) as any)
      .unwrap()
      .then(() => {
        navigate("/");
      })
      .catch((error: Error) => {
        console.error("Failed to create shipment:", error);
      });
  };

  return (
    <div className="bg-white overflow-hidden sm:h-screen">
      <div className="bg-gray-100 px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">
          Add New Shipment
        </h2>
      </div>
      <div className="p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Container ID
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  name="containerId"
                  value={formData.containerId}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  required
                >
                  <option value="Pending">Pending</option>
                  <option value="In Transit">In Transit</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ETA
                </label>
                <input
                  type="datetime-local"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  name="currentETA"
                  value={formData.currentETA}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Assigned Driver
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  name="assignedDriver"
                  value={formData.assignedDriver}
                  onChange={handleInputChange}
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vehicle Number
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  name="vehicleDetails.vehicleNumber"
                  value={formData.vehicleDetails.vehicleNumber}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vehicle Type
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  name="vehicleDetails.vehicleType"
                  value={formData.vehicleDetails.vehicleType}
                  onChange={handleInputChange}
                  required
                >
                  <option value="Truck">Truck</option>
                  <option value="Ship">Ship</option>
                  <option value="Train">Train</option>
                  <option value="Air Cargo">Air Cargo</option>
                </select>
              </div>
            </div>

            <div>
              <div className="mb-4 border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                <div className="bg-gray-50 px-4 py-2 font-medium text-gray-700 border-b border-gray-200">
                  Current Location (Click on map to set)
                </div>
                <div className="p-4">
                  <div className="h-64 mb-3 rounded-md overflow-hidden border border-gray-300">
                    <MapContainer
                      center={mapCenter}
                      zoom={5}
                      scrollWheelZoom={true}
                      style={{ height: "100%", width: "100%" }}
                    >
                      <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      />
                      <LocationPicker
                        position={mapCenter}
                        onPositionChange={handleMapPositionChange}
                      />
                    </MapContainer>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <div className="w-full md:w-5/12">
                      <input
                        type="number"
                        step="0.000001"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                        placeholder="Longitude"
                        name="longitude"
                        value={location.longitude}
                        onChange={handleLocationChange}
                      />
                    </div>
                    <div className="w-full md:w-5/12">
                      <input
                        type="number"
                        step="0.000001"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                        placeholder="Latitude"
                        name="latitude"
                        value={location.latitude}
                        onChange={handleLocationChange}
                      />
                    </div>
                    <div className="w-full md:w-1/12">
                      <button
                        type="button"
                        className="w-full px-3 py-2 border border-gray-300 text-blue-600 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onClick={handleUpdateLocation}
                      >
                        Set
                      </button>
                    </div>
                  </div>

                  {formData.currentLocation.coordinates[0] !== 0 &&
                    formData.currentLocation.coordinates[1] !== 0 && (
                      <div className="mt-2 p-2 bg-green-100 text-green-800 rounded-md">
                        Location set: {formData.currentLocation.coordinates[1]}°
                        N, {formData.currentLocation.coordinates[0]}° E
                      </div>
                    )}
                </div>
              </div>

              <div className="mb-6 border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                <div className="bg-gray-50 px-4 py-2 font-medium text-gray-700 border-b border-gray-200">
                  Route Points
                </div>
                <div className="p-4">
                  <div className="flex flex-wrap gap-2 mb-4">
                    <div className="w-full md:w-5/12">
                      <input
                        type="number"
                        step="0.000001"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Longitude"
                        name="longitude"
                        value={currentRoutePoint.longitude}
                        onChange={handleRoutePointChange}
                      />
                    </div>
                    <div className="w-full md:w-5/12">
                      <input
                        type="number"
                        step="0.000001"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Latitude"
                        name="latitude"
                        value={currentRoutePoint.latitude}
                        onChange={handleRoutePointChange}
                      />
                    </div>
                    <div className="w-full md:w-1/12">
                      <button
                        type="button"
                        className="w-full px-3 py-2 border border-gray-300 text-green-600 rounded-md hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-500"
                        onClick={handleAddRoutePoint}
                      >
                        Add
                      </button>
                    </div>
                  </div>

                  {routePoints.length > 0 && (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th
                              scope="col"
                              className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              #
                            </th>
                            <th
                              scope="col"
                              className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Coordinates
                            </th>
                            <th
                              scope="col"
                              className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {routePoints.map((point, index) => (
                            <tr
                              key={index}
                              className={
                                index % 2 === 0 ? "bg-white" : "bg-gray-50"
                              }
                            >
                              <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                                {index + 1}
                              </td>
                              <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                                {point.coordinates[1]}° N,{" "}
                                {point.coordinates[0]}° E
                              </td>
                              <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                                <button
                                  type="button"
                                  className="px-2 py-1 text-xs text-white bg-red-600 rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                                  onClick={() => handleRemoveRoutePoint(index)}
                                >
                                  Remove
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
              onClick={() => navigate("/")}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              Add Shipment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddShipment;
