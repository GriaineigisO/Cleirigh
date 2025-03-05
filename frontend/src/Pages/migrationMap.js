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
        //retrieves name of the village/town/city only and excludes the district and country
        let town = [];
        const placeArray = Array.from(place);
        for (let i = 0; i < placeArray.length; i++) {
          if (placeArray[i] !== ",") {
            town.push(placeArray[i]);
          } else {
            return;
          }
        }
        town = town.join("");
        console.log(town);

        //retrieves country name only
        let country = "";

        // Split the place string by commas
        const countryArray = place.split(",");

        // The country is always the last part after the final comma
        country = countryArray[countryArray.length - 1].trim(); // Remove any leading/trailing spaces


        console.log(country);
        if (country === "Scotland") {
          country = "United Kingdom";
        }

        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          town
        )}&county=${country}`;
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
                  opacity: getOpacity(relation + 40),
                  symbol: L.Symbol.arrowHead({
                    pixelSize: 10,
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
