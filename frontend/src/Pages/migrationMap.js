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
      parentBirthplace = ancestorBirthplaces.get(migration.parent_id) || null;
    }

    // Store parent birthplace in ancestor map (if valid)
    if (parentBirthplace && migration.parent_id) {
      ancestorBirthplaces.set(migration.parent_id, parentBirthplace);
    }

    // Check if the child's birthplace is NULL
    let childBirthplace = migration.child_birth || null;
    if (!childBirthplace && migration.child_id) {
      childBirthplace = ancestorBirthplaces.get(migration.child_id) || parentBirthplace;
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
      relation += 10;
    } else {
      relation += 50;
    }

    if (parentCoords && childCoords) {
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

    // Update progress
    setProgress((prevState) => ({
      current: prevState.current + 1,
      total: prevState.total,
    }));
  }
};
