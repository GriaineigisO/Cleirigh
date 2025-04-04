import { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-polylinedecorator";

const getOpacity = (relation) => {
  return relation >= 100 ? 0.1 : 1 - relation / 100;
};

const MigrationLines = ({ map }) => {
  const [progress, setProgress] = useState({ current: 0, total: 0 });

  useEffect(() => {
    if (map) {
      plotParentChildMigrations();
    }
  }, [map]);

  const fetchParentChildBirths = async () => {
    try {
      const res = await fetch("/api/parent-child-birthplaces");
      const data = await res.json();
      return data;
    } catch (err) {
      console.error("Error fetching migration data:", err);
      return [];
    }
  };

  const plotParentChildMigrations = async () => {
    const migrations = await fetchParentChildBirths();
    if (!migrations || migrations.length === 0) {
      console.log("No migration data available.");
      return;
    }

    setProgress({ current: 0, total: migrations.length });

    const ancestorBirthplaces = new Map();
    const geocodeCache = new Map();
    const migrationLayer = L.layerGroup();

    const getCoords = async (place) => {
      if (!place) return null;
      if (place === "Scandinavia") place = "Norway";
      if (geocodeCache.has(place)) return geocodeCache.get(place);

      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(place)}`;
      const response = await fetch(url);
      const data = await response.json();

      const coords = data.length > 0
        ? [parseFloat(data[0].lat), parseFloat(data[0].lon)]
        : null;

      geocodeCache.set(place, coords);
      return coords;
    };

    const tasks = migrations.map(async (migration) => {
      let { parent_id, child_id, parent_birth, child_birth } = migration;

      if (!parent_birth && parent_id) {
        parent_birth = ancestorBirthplaces.get(parent_id) || null;
      }
      if (parent_birth && parent_id) {
        ancestorBirthplaces.set(parent_id, parent_birth);
      }

      if (!child_birth && child_id) {
        child_birth = ancestorBirthplaces.get(child_id) || parent_birth;
      }
      if (child_birth && child_id) {
        ancestorBirthplaces.set(child_id, child_birth);
      }

      const parentCoords = await getCoords(parent_birth);
      const childCoords = await getCoords(child_birth);

      if (!parentCoords || !childCoords) return;

      const unchangedRelation = migration.relation_to_user[0];
      const relation =
        unchangedRelation < 7 ? unchangedRelation + 20 : unchangedRelation + 50;
      const opacity = getOpacity(relation);

      let color = "blue";
      if (unchangedRelation >= 7 && unchangedRelation <= 17) color = "green";
      else if (unchangedRelation > 17) color = "black";

      const polyline = L.polyline([parentCoords, childCoords], {
        color,
        weight: 4,
        opacity,
      }).addTo(migrationLayer);

      polyline.on("click", (e) => {
        L.popup()
          .setLatLng(e.latlng)
          .setContent(
            `<b>Parent:</b> <a class="popup_migration_link" href="./profile/${migration.parent_id}" target="_blank">${migration.parent_name} (b.${migration.parent_dob}) - ${migration.parent_birth}</a><br>
             <b>Child:</b> <a class="popup_migration_link" href="./profile/${migration.child_id}" target="_blank">${migration.child_name} (b.${migration.child_dob}) - ${migration.child_birth}</a>`
          )
          .openOn(map);
      });

      L.polylineDecorator(polyline, {
        patterns: [
          {
            pixelSize: 14,
            offset: "10%",
            repeat: "20%",
            symbol: L.Symbol.arrowHead({
              headAngle: 30,
              pathOptions: {
                stroke: true,
                color,
                opacity: getOpacity(relation + 40),
              },
            }),
          },
        ],
      }).addTo(migrationLayer);

      setProgress((prev) => ({ ...prev, current: prev.current + 1 }));
    });

    await Promise.all(tasks);

    migrationLayer.addTo(map);
    L.control.layers(null, { "Migration Paths": migrationLayer }, { collapsed: false }).addTo(map);
  };

  return (
    <div className="migration-progress">
      {progress.total > 0 && (
        <p>
          Drawing lines: {progress.current} / {progress.total}
        </p>
      )}
    </div>
  );
};

export default MigrationLines;
