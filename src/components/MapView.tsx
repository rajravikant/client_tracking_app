import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import L from "leaflet";

const MapView = () => {
  const { shipments } = useSelector((state: RootState) => state.shipments);

  const customIcon = new L.Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
    iconSize: [30, 30],
  });

  return (
    <div className="map-container bg-white rounded-lg overflow-hidden h-full w-full ">
      <MapContainer
        center={[20.5937, 78.9629]}
        zoom={5}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {shipments.map((shipment) => (
          <Marker
            key={shipment._id}
            position={[
              shipment.currentLocation.coordinates[1],
              shipment.currentLocation.coordinates[0],
            ]}
            icon={customIcon}
          >
            <Popup>
              <strong>Container ID:</strong> {shipment.containerId} <br />
              <strong>Location:</strong>{" "}
              {shipment.currentLocation.coordinates[0]} |{" "}
              {shipment.currentLocation.coordinates[1]} <br />
              <strong>Status:</strong> {shipment.status}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapView;
