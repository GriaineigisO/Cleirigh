import React, { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-arrowheads";
import "leaflet-polylinedecorator"; // ✅ Added missing import

const FamilyMigrationMap = () => {
  const [map, setMap] = useState(null);

  useEffect(() => {
    console.log(
      "L.polyline.prototype.arrowheads:",
      L.polyline.prototype.arrowheads
    );
  }, []);

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
      const data = await response.json();
      console.log(data);
      return data;
    };

    const geocodeLocation = async (place) => {
      if (place) {
        // Initialize the town and country variables
        let town = "";
        let country = "";
    
        // Check how many commas are in the place string
        const placeArray = place.split(",");
    
        if (placeArray.length === 1) {
          // If there's no comma, the whole string is the town
          town = placeArray[0].trim();
        } else if (placeArray.length === 2) {
          // If there's one comma, the first part is the town and the second is the country
          town = placeArray[0].trim();
          country = placeArray[1].trim();
        } else {
          // If there are two or more commas, the first part is the town and the last part is the country
          town = placeArray[0].trim();
          country = placeArray[placeArray.length - 1].trim();
        }
    
        console.log("Town:", town);
        console.log("Country:", country);
    
        // If country is "Scotland", adjust it to "United Kingdom"
        if (country === "Scotland") {
          country = "United Kingdom";
        }
        if (country === "Scandinavia") {
          country = "Norway";
        }
    
        // If a country is provided, create a combined query string (town, country)
        let query = town;
        if (country) {
          query = `${town}, ${country}`;
        }
    
        // Build the URL with the 'q' parameter only
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`;
    
        const response = await fetch(url);
        const data = await response.json();
        return data.length > 0
          ? [parseFloat(data[0].lat), parseFloat(data[0].lon)]
          : null;
      } else {
        return null;
      }
    };
    
    

    const getOpacity = (relationLevel) => {
      return Math.max(100 - relationLevel, 10) / 100;
    };

    const plotParentChildMigrations = async () => {
      const migrations = await fetchParentChildBirths();
      if (!migrations || migrations.length === 0) {
        console.log("No migration data available.");
        return;
      }

      for (const migration of migrations) {
        const parentCoords = await geocodeLocation(migration.parent_birth);
        const childCoords = await geocodeLocation(migration.child_birth);

        const relation = migration.relation_to_user[0];

        if (parentCoords && childCoords) {
          // Add arrows between parent and child if both coordinates are available
          const polyline = L.polyline([parentCoords, childCoords], {
            color: "green",
            weight: 4,
            opacity: getOpacity(relation + 50),
          }).addTo(map);

          // ✅ Ensure arrowheads appear by adding a delay
          setTimeout(() => {
            const decorator = L.polylineDecorator(polyline, {
              patterns: [
                {
                  offset: "100%",
                  repeat: 0,
                  symbol: L.Symbol.arrowHead({
                    pixelSize: 10,
                    opacity: getOpacity(relation + 40),
                    headAngle: 30,
                    pathOptions: { stroke: true, color: "blue" },
                  }),
                },
              ],
            }).addTo(map);
          }, 100);
        }
      }
    };

    plotParentChildMigrations();
  }, [map]);

  return <div id="map" style={{ height: "600px", width: "100%" }} />;
};

export default FamilyMigrationMap;
