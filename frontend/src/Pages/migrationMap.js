import React, { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-arrowheads";
import "leaflet-polylinedecorator"; // ✅ Added missing import

const FamilyMigrationMap = () => {
  const [map, setMap] = useState(null);
  const [progress, setProgress] = useState({ current: 0, total: 0 }); // State to track progress

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
        /*let town = "";
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

        if (country === "Scandinavia") {
          country = "Norway";
        }
        if (town === "Scandinavia") {
          town = "Norway";
        }

        let query = town;
        if (country) {
          query = `${town}, ${country}`;
        }*/

        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          place
        )}`;

        const response = await fetch(url);
        const data = await response.json();
        return data.length > 0
          ? [parseFloat(data[0].lat), parseFloat(data[0].lon)]
          : null;
      } else {
        return null;
      }
    };

    //determines a line's opactiy based on the ancestor's relation to the user: more distant = more opaque
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

      let ancestorBirthplaces = new Map(); // Track most recent ancestor's valid POB

      for (let index = 0; index < migrations.length; index++) {
        const migration = migrations[index];

        // Check if the parent's birthplace is NULL
        let parentBirthplace = migration.parent_birth || null;
        if (!parentBirthplace && migration.parent_id) {
          parentBirthplace =
            ancestorBirthplaces.get(migration.parent_id) || null;
        }

        // Store parent birthplace in ancestor map (if valid)
        if (parentBirthplace && migration.parent_id) {
          ancestorBirthplaces.set(migration.parent_id, parentBirthplace);
        }

        // Check if the child's birthplace is NULL
        let childBirthplace = migration.child_birth || null;
        if (!childBirthplace && migration.child_id) {
          childBirthplace =
            ancestorBirthplaces.get(migration.child_id) || parentBirthplace;
        }

        // Store child's birthplace in ancestor map (if valid)
        if (childBirthplace && migration.child_id) {
          ancestorBirthplaces.set(migration.child_id, childBirthplace);
        }

        // Get coordinates
        const parentCoords = await geocodeLocation(parentBirthplace);
        const childCoords = await geocodeLocation(childBirthplace);

        console.log(`${parentBirthplace} > ${childBirthplace}`);

        let relation = migration.relation_to_user[0];
        let unchangedRelation = relation;
        if (relation < 7) {
          relation += 20;
        } else {
          relation += 50;
        }

        if (parentCoords && childCoords) {
          //loads data of parent and child to populate popups
          const polylineDataMap = new Map(); // Store data for each polyline

          const polylineKey = `${parentCoords}-${childCoords}`;

          if (!polylineDataMap.has(polylineKey)) {
            polylineDataMap.set(polylineKey, []);
          }

          polylineDataMap.get(polylineKey).push({
            parent: {
              name: migration.parent_name,
              birth: migration.parent_birth,
              dob: migration.parent_dob,
              id: migration.parent_id
            },
            child: {
              name: migration.child_name,
              birth: migration.child_birth,
              dob: migration.child_dob,
              id: migration.child_id
            },
          });

          let polyline = "";
          if (unchangedRelation < 7) {
            polyline = L.polyline([parentCoords, childCoords], {
              color: "blue",
              weight: 4,
              opacity: getOpacity(relation),
            }).addTo(map);
          } else if (unchangedRelation >= 7 && unchangedRelation <= 17) {
            polyline = L.polyline([parentCoords, childCoords], {
              color: "green",
              weight: 4,
              opacity: getOpacity(relation),
            }).addTo(map);
          } else if (unchangedRelation > 17) {
            polyline = L.polyline([parentCoords, childCoords], {
              color: "black",
              weight: 4,
              opacity: getOpacity(relation),
            }).addTo(map);
          }

          polyline.on("click", (e) => {
            
            const details = polylineDataMap
              .get(polylineKey)
              .map(
                (entry) =>
                  `<b>Parent:</b> <a class="popup_migration_link" href="./profile/${entry.parent.id}" target="_blank">${entry.parent.name} (b.${entry.parent.dob}) - ${entry.parent.birth}</a><br>
                   <b>Child:</b> <a class="popup_migration_link" href="./profile/${entry.child.id}" target="_blank">${entry.child.name} (b.${entry.child.dob}) - ${entry.child.birth}</a><br><br>`
              )
              .join("");

            L.popup()
              .setLatLng(e.latlng)
              .setContent(`<div>${details}</div>`)
              .openOn(map);
          });

          polylineDataMap.get(polylineKey).polyline = polyline;

          // Add an arrowhead to the polyline
          setTimeout(() => {
            const decorator = L.polylineDecorator(polyline, {
              patterns: [
                {
                  pixelSize: 14,
                  offset: "10%", // Start arrows 10% into the line
                  repeat: "20%", // Repeat every 20% of the line length
                  symbol: L.Symbol.arrowHead({
                    headAngle: 30,
                    pathOptions: {
                      stroke: true,
                      color: "blue",
                      opacity: getOpacity(relation + 40), // Apply opacity here
                    },
                  }),
                  
                },
              ],
            }).addTo(map);
          }, 100);
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
      <div id="map" style={{ height: "600px", width: "100%" }} />
      <div style={{ marginTop: "10px" }}>
        {progress.total > 0 && (
          <p style={{ textAlign: "center" }}>
            {progress.current} of {progress.total} lines added.{" "}
            {((progress.current / progress.total) * 100).toFixed(2)}% Complete
          </p>
        )}
      </div>
    </div>
  );
};

export default FamilyMigrationMap;
