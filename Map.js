import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Set up a custom icon for the user marker
const userIcon = new L.Icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const MapComponent = () => {
  const [currentPosition, setCurrentPosition] = useState(null);

  // Fetch the user's current position
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCurrentPosition({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => console.error("Error fetching location:", error),
      { enableHighAccuracy: true }
    );
  }, []);

  return (
    <div>
      {currentPosition ? (
        <MapContainer
          center={currentPosition}
          zoom={13}
          style={{ height: "100vh", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={currentPosition} icon={userIcon}>
            <Popup>You are here</Popup>
          </Marker>
        </MapContainer>
      ) : (
        <p>Fetching your location...</p>
      )}
    </div>
  );
};

export default MapComponent;
