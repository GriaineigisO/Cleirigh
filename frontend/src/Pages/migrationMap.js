import React, { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-arrowheads";
import "leaflet-polylinedecorator"; // ✅ Added missing import

const FamilyMigrationMap = () => {
  const [map, setMap] = useState(null);

  useEffect(() => {
    console.log("L.polyline.prototype.arrowheads:", L.polyline.prototype.arrowheads);
  }, []);

  useEffect(() => {
    const initMap = L.map("map").setView([20, 0], 2);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(initMap);
    setMap(initMap);
  }, []);

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
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      place
    )}`;
    const response = await fetch(url);
    const data = await response.json();
    return data.length > 0
      ? [parseFloat(data[0].lat), parseFloat(data[0].lon)]
      : null;
  };

  const getOpacity = (relationLevel) => {
    return Math.max(100 - relationLevel, 10) / 100;
  };

  // Simulate fetching ancestor data (replace with actual backend request)
  const fetchAncestorData = async (ancestorId) => {
    // Simulate ancestor data (replace with your backend call)
    const ancestorData = {
      birthplace: ancestorId === "greatx5" ? "Perth" : null, // Example: "greatx5" has Perth as birthplace
    };
    return ancestorData;
  };

  // Simulate fetching the parent ID (replace with actual logic)
  const getParentId = async (ancestorId) => {
    // Simulate traversal (replace with actual parent ID lookup logic)
    const parentMap = {
      greatx5: "greatx4",
      greatx4: "greatx3",
      greatx3: "greatx2",
      greatx2: "greatx1",
      greatx1: "grandfather",
      grandfather: "father",
      father: "me",
    };
    return parentMap[ancestorId] || null; // Return null if no parent found
  };

  const getInheritedBirthPlace = async (ancestorId) => {
    let birthPlace = null;

    // Traverse the ancestor chain upwards
    while (ancestorId && !birthPlace) {
      birthPlace = await getAncestorBirthPlace(ancestorId);
      ancestorId = await getParentId(ancestorId); // Get the next ancestor's ID
    }

    return birthPlace; // Return the first valid birth place found
  };

  const plotParentChildMigrations = async () => {
    const migrations = await fetchParentChildBirths();
    if (!migrations || migrations.length === 0) {
      console.log("No migration data available.");
      return;
    }

    for (const migration of migrations) {
      const parentId = migration.parent_id;
      const childId = migration.child_id;

      let parentCoords = migration.parent_birth
        ? await geocodeLocation(migration.parent_birth)
        : null;

      let childCoords = migration.child_birth
        ? await geocodeLocation(migration.child_birth)
        : null;

      // If both POBs are null, inherit from nearest ancestor
      if (!parentCoords && !childCoords) {
        const inheritedPlace = await getInheritedBirthPlace(parentId); // Get the inherited birthplace from ancestors
        if (inheritedPlace) {
          parentCoords = childCoords = await geocodeLocation(inheritedPlace); // Use inherited place for both
        }
      }

      // If only the parent POB is null, inherit from ancestors
      if (!parentCoords) {
        parentCoords = await getInheritedBirthPlace(parentId);
        if (parentCoords) {
          parentCoords = await geocodeLocation(parentCoords);
        }
      }

      // If only the child POB is null, inherit from parent
      if (!childCoords && parentCoords) {
        childCoords = parentCoords; // Child inherits the parent's POB
      }

      if (parentCoords && childCoords && parentCoords !== childCoords) {
        const polyline = L.polyline([parentCoords, childCoords], {
          color: "green",
          weight: 4,
          opacity: getOpacity(migration.relation_to_user[0] + 60),
        }).addTo(map);

        // ✅ Ensure arrowheads appear by adding a delay
        setTimeout(() => {
          const decorator = L.polylineDecorator(polyline, {
            patterns: [
              {
                offset: "100%",
                repeat: 0,
                opacity: getOpacity(migration.relation_to_user[0] + 40),
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

  useEffect(() => {
    if (!map) return;
    plotParentChildMigrations();
  }, [map]);

  return <div id="map" style={{ height: "600px", width: "100%" }} />;
};

export default FamilyMigrationMap;
