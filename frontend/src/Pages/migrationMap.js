import React, { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-arrowheads";

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

    const fetchParentChildBirths = async () => {
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
      console.log(data);
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

    const addMigrationArrow = (parentCoords, childCoords, opacity) => {
      const line = L.polyline([parentCoords, childCoords], {
        color: "blue",
        weight: 4,
        opacity: opacity,
      }).addTo(map);

      console.log("Adding arrowheads...");
    
      // Add arrowheads directly to the polyline
      if (typeof line.arrowheads === "function") {
        console.log("here")
        setTimeout(() => {
          console.log("Applying arrowheads...");
          if (line.arrowheads) {
            line.arrowheads({
              size: "15px",
              frequency: "end",
              fill: true,
              color: "red",
              opacity: 1,
            });
            console.log("Arrowheads applied!");
          } else {
            console.error("Arrowheads method not found!");
          }
        }, 500);
      } else {
        console.error("arrowheads() function is missing! Ensure leaflet-arrowheads is installed and imported.");
      }
    };
    

    const getOpacity = (relationLevel) => {
      console.log(relationLevel);
      return Math.max(100 - relationLevel, 10) / 100; // Min opacity 10%
    };

    const plotParentChildMigrations = async () => {
      const migrations = await fetchParentChildBirths();
      for (const migration of migrations) {
        const parentCoords = await geocodeLocation(migration.parent_birth);
        const childCoords = await geocodeLocation(migration.child_birth);

        const relation = migration.relation_to_user[0];

        if (parentCoords && childCoords) {
          addMigrationArrow(
            parentCoords,
            childCoords,
            getOpacity(relation + 40)
          );
        }
      }
    };

    plotParentChildMigrations();
  }, [map]);

  return <div id="map" style={{ height: "600px", width: "100%" }} />;
};

export default FamilyMigrationMap;
