import React, { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-arrowheads";
import "leaflet-polylinedecorator"; // ✅ Added missing import

const FamilyMigrationMap = () => {
  const [map, setMap] = useState(null);
  const [progress, setProgress] = useState({ current: 0, total: 0 }); // State to track progress
  const [processedChildren, setProcessedChildren] = useState(new Set()); // Track children who later become parents

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
        let town = "";
        let country = "";
        const placeArray = place.split(",");

        if (placeArray.length === 1) {
          town = placeArray[0].trim();
        } else if (placeArray.length === 2) {
          town = placeArray[0].trim();
          country = placeArray[1].trim();
        } else {
          town = placeArray[0].trim();
          country = placeArray[placeArray.length - 1].trim();
        }

        console.log("Town:", town);
        console.log("Country:", country);

        if (country === "scotland") {
          country = "United Kingdom";
        }
        if (country === "scandinavia") {
          country = "norway";
        }
        if (town === "scandinavia") {
          town = "norway";
        }


        let url = "";
        if (country) {
          url = `https://nominatim.openstreetmap.org/search?format=json&q=${town}&country=${country}`;
        } else {
          url = `https://nominatim.openstreetmap.org/search?format=json&q=${town}`;
        }

        

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

      setProgress({ current: 0, total: migrations.length });

      let lastValidCoordinates = null; // To track the last valid place when a child's POB is NULL

      for (let index = 0; index < migrations.length; index++) {
        const migration = migrations[index];
        const parentCoords = await geocodeLocation(migration.parent_birth);
        const childCoords = await geocodeLocation(migration.child_birth);

        let relation = migration.relation_to_user[0];
        if (relation < 13) {
          relation += 10;
        } else {
          relation += 50;
        };


        // Use lastValidCoordinates if childCoords is NULL
        const finalChildCoords = childCoords || lastValidCoordinates;
        const finalParentCoords = parentCoords || lastValidCoordinates;

        // If both parent and child have valid coordinates (or fallback to the previous valid one), draw the line
        if (finalParentCoords && finalChildCoords) {
          // Add the line from parent to child
          const polyline = L.polyline([finalParentCoords, finalChildCoords], {
            color: "green",
            weight: 4,
            opacity: getOpacity(relation),
          }).addTo(map);

          // Add an arrowhead to the polyline
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

        // Update the last valid coordinates (either parent's or child's)
        if (finalChildCoords) {
          lastValidCoordinates = finalChildCoords;
        }

        // Update progress
        setProgress((prevState) => ({
          current: prevState.current + 1,
          total: prevState.total,
        }));
      }
    };

    plotParentChildMigrations();
  }, [map]);

  return (
    <div>
      <div
        id="map"
        style={{ height: "600px", width: "100%" }}
      />
      <div style={{ marginTop: "10px" }}>
        {progress.total > 0 && (
          <p style={{textAlign:"center"}}>{progress.current} of {progress.total} lines added. {(progress.current/progress.total*100).toFixed(2)}% Complete</p>
        )}
      </div>
    </div>
  );
};

export default FamilyMigrationMap;
