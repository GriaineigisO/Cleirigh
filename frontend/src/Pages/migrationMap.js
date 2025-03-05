import React, { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const FamilyMigrationMap = () => {
  const [map, setMap] = useState(null);

  useEffect(() => {
    const initMap = L.map("map").setView([20, 0], 2);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(initMap);
    setMap(initMap);
  }, []);

  useEffect(() => {
    if (!map) return;

    const fetchAncestors = async () => {
      const userId = localStorage.getItem("userId");
      const response = await fetch(
        "https://cleirigh-backend.vercel.app/api/migration-map",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        }
      );
      const data = response.json();
      console.log(data)
      return data;
    };

    const geocodeLocation = async (place) => {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        place
      )}`;
      const response = await fetch(url);
      const data = await response.json();
      return data.length > 0
        ? [parseFloat(data[0].lat), parseFloat(data[0].lon)]
        : null;
    };

    const getOpacity = (relationLevel) =>
      Math.max(100 - relationLevel, 10) / 100; // Min opacity 10%

    const addMigrationArrow = (birthCoords, deathCoords, opacity) => {
      L.polyline([birthCoords, deathCoords], {
        color: "blue",
        weight: 2,
        opacity: opacity,
        dashArray: "5,5",
      }).addTo(map);
    };

    const plotMigrations = async () => {
      const ancestors = await fetchAncestors();
      for (const ancestor of ancestors) {
        const birthCoords = await geocodeLocation(ancestor.place_of_birth);
        const deathCoords = await geocodeLocation(ancestor.place_of_death);

        if (birthCoords && deathCoords) {
          addMigrationArrow(
            birthCoords,
            deathCoords,
            getOpacity(ancestor.relation_to_user - 2)
          );
        }
      }
    };

    plotMigrations();
  }, [map]);

  return <div id="map" style={{ height: "600px", width: "100%" }} />;
};

export default FamilyMigrationMap;
