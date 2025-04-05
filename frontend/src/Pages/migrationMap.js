import React, { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-arrowheads";
import "leaflet-polylinedecorator";
import "leaflet-curve";

const FamilyMigrationMap = () => {
  const [map, setMap] = useState(null);
  const [progress, setProgress] = useState({ current: 0, total: 0 }); // State to track progress

  useEffect(() => {
    const initMap = L.map("map").setView([20, 0], 2);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(initMap);
    // Create a custom control for the info button
    const infoControl = L.control({ position: "topright" });

    infoControl.onAdd = function () {
      const div = L.DomUtil.create("div", "info-button");
      div.innerHTML = "ℹ️"; // Unicode info symbol
      div.style.cursor = "pointer";
      div.style.fontSize = "24px";
      div.style.background = "white";
      div.style.padding = "5px 10px";
      div.style.borderRadius = "5px";
      div.style.boxShadow = "0 0 10px rgba(0,0,0,0.3)";

      // Prevent clicks from propagating to the map
      L.DomEvent.on(div, "click", function (e) {
        L.DomEvent.stopPropagation(e);
        L.popup()
          .setLatLng(initMap.getCenter()) // Show popup at center of map
          .setContent(
            `<div style="width: 500px;">
            <h3>Migration Map Info</h3>
            <p>This map displays migration paths of your ancestors based on birthplaces.</p>
            <p>Click on the migration lines to view ancestor details.</p>
            <p>Different colors represent different generations:</p>
            <ul>
              <li><span style="color:blue;">Blue</span> - Greatx5 Grandparents and below, these ancestors constitute >1% of your ancestry</li>
              <li><span style="color:green;">Green</span> - Greatx5 Grandparents and above, these ancestors constitude <1% of your ancestry</li>
              <li><span style="color:black;">Black</span> - Greatx15 Grandparents and above, these ancestors constitude < 0.000762939453125% of your ancestry</li>
            </ul>

            <h2>Valid Placenames</h2>
            <p>To check if the places of birth that you entered returns the desired place, and not another place of the same name, enter the place after the equals sign in this link and paste the link in your browser and check the first result: https://nominatim.openstreetmap.org/search?format=json&q=</p>.
            If you want the map to choose one specific place which shares a name with other places, use the full name listed as "display name" when pasting the link in the browser and assign it as the ancestor's birth place.
          </div>`
          )
          .openOn(initMap);
      });

      return div;
    };

    infoControl.addTo(initMap);
    setMap(initMap);
  }, []);

  useEffect(() => {
    if (!map) return;

    const migrationLayer = L.layerGroup().addTo(map); //layer for migration path of everyone in the tree
    const anfExpansionLayer = L.layerGroup().addTo(map); //layer for Anatolian Neolithic Farmer migrations

    // const fetchParentChildBirths = async () => {
    //   const userId = localStorage.getItem("userId");
    //   const response = await fetch(
    //     "https://cleirigh-backend.vercel.app/api/migration-map",
    //     {
    //       method: "POST",
    //       headers: { "Content-Type": "application/json" },
    //       body: JSON.stringify({ userId }),
    //     }
    //   );
    //   const data = await response.json();
    //   console.log(data);
    //   return data;
    // };

    // const geocodeLocation = async (place) => {
    //   if (place) {
    //     if (place === "Scandinavia") {
    //       place = "Norway";
    //     }

    //     const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
    //       place
    //     )}`;

    //     const response = await fetch(url);
    //     const data = await response.json();
    //     return data.length > 0
    //       ? [parseFloat(data[0].lat), parseFloat(data[0].lon)]
    //       : null;
    //   } else {
    //     return null;
    //   }
    // };

    // //determines a line's opactiy based on the ancestor's relation to the user: more distant = more opaque
    // const getOpacity = (relationLevel) => {
    //   return Math.max(100 - relationLevel, 10) / 100;
    // };

    // const plotParentChildMigrations = async () => {
    //   const migrations = await fetchParentChildBirths();
    //   if (!migrations || migrations.length === 0) {
    //     console.log("No migration data available.");
    //     return;
    //   }

    //   setProgress({ current: 0, total: migrations.length });

    //   let ancestorBirthplaces = new Map(); // Track most recent ancestor's valid POB

    //   for (let index = 0; index < migrations.length; index++) {
    //     const migration = migrations[index];

    //     // Check if the parent's birthplace is NULL
    //     let parentBirthplace = migration.parent_birth || null;
    //     if (!parentBirthplace && migration.parent_id) {
    //       parentBirthplace =
    //         ancestorBirthplaces.get(migration.parent_id) || null;
    //     }

    //     // Store parent birthplace in ancestor map (if valid)
    //     if (parentBirthplace && migration.parent_id) {
    //       ancestorBirthplaces.set(migration.parent_id, parentBirthplace);
    //     }

    //     // Check if the child's birthplace is NULL
    //     let childBirthplace = migration.child_birth || null;
    //     if (!childBirthplace && migration.child_id) {
    //       childBirthplace =
    //         ancestorBirthplaces.get(migration.child_id) || parentBirthplace;
    //     }

    //     // Store child's birthplace in ancestor map (if valid)
    //     if (childBirthplace && migration.child_id) {
    //       ancestorBirthplaces.set(migration.child_id, childBirthplace);
    //     }

    //     // Get coordinates
    //     const parentCoords = await geocodeLocation(parentBirthplace);
    //     const childCoords = await geocodeLocation(childBirthplace);

    //     //console.log(`${parentBirthplace} > ${childBirthplace}`);

    //     let relation = migration.relation_to_user[0];
    //     let unchangedRelation = relation;
    //     if (relation < 7) {
    //       relation += 20;
    //     } else {
    //       relation += 50;
    //     }

    //     if (parentCoords && childCoords) {
    //       //loads data of parent and child to populate popups
    //       const polylineDataMap = new Map(); // Store data for each polyline

    //       const polylineKey = `${parentCoords}-${childCoords}`;

    //       if (!polylineDataMap.has(polylineKey)) {
    //         polylineDataMap.set(polylineKey, []);
    //       }

    //       polylineDataMap.get(polylineKey).push({
    //         parent: {
    //           name: migration.parent_name,
    //           birth: migration.parent_birth,
    //           dob: migration.parent_dob,
    //           id: migration.parent_id,
    //         },
    //         child: {
    //           name: migration.child_name,
    //           birth: migration.child_birth,
    //           dob: migration.child_dob,
    //           id: migration.child_id,
    //         },
    //       });

    //       let polyline = "";
    //       if (unchangedRelation < 7) {
    //         polyline = L.polyline([parentCoords, childCoords], {
    //           color: "blue",
    //           weight: 4,
    //           opacity: getOpacity(relation),
    //         }).addTo(migrationLayer);
    //       } else if (unchangedRelation >= 7 && unchangedRelation <= 17) {
    //         polyline = L.polyline([parentCoords, childCoords], {
    //           color: "green",
    //           weight: 4,
    //           opacity: getOpacity(relation),
    //         }).addTo(migrationLayer);
    //       } else if (unchangedRelation > 17) {
    //         polyline = L.polyline([parentCoords, childCoords], {
    //           color: "black",
    //           weight: 4,
    //           opacity: getOpacity(relation),
    //         }).addTo(migrationLayer);
    //       }

    //       polyline.on("click", (e) => {
    //         const details = polylineDataMap
    //           .get(polylineKey)
    //           .map(
    //             (entry) =>
    //               `<b>Parent:</b> <a class="popup_migration_link" href="./profile/${entry.parent.id}" target="_blank">${entry.parent.name} (b.${entry.parent.dob}) - ${entry.parent.birth}</a><br>
    //                <b>Child:</b> <a class="popup_migration_link" href="./profile/${entry.child.id}" target="_blank">${entry.child.name} (b.${entry.child.dob}) - ${entry.child.birth}</a><br><br>`
    //           )
    //           .join("");

    //         L.popup()
    //           .setLatLng(e.latlng)
    //           .setContent(`<div>${details}</div>`)
    //           .openOn(map);
    //       });

    //       polylineDataMap.get(polylineKey).polyline = polyline;

    //       // Add an arrowhead to the polyline
    //       setTimeout(() => {
    //         const decorator = L.polylineDecorator(polyline, {
    //           patterns: [
    //             {
    //               pixelSize: 14,
    //               offset: "10%", // Start arrows 10% into the line
    //               repeat: "20%", // Repeat every 20% of the line length
    //               symbol: L.Symbol.arrowHead({
    //                 headAngle: 30,
    //                 pathOptions: {
    //                   stroke: true,
    //                   color: "blue",
    //                   opacity: getOpacity(relation + 40), // Apply opacity here
    //                 },
    //               }),
    //             },
    //           ],
    //         }).addTo(migrationLayer);
    //       }, 100);
    //     }

    //     // Update progress
    //     setProgress((prevState) => ({
    //       current: prevState.current + 1,
    //       total: prevState.total,
    //     }));
    //   }
    // };

    // plotParentChildMigrations();

    // L.control
    //   .layers(null, { "Migration Paths": migrationLayer }, { collapsed: false })
    //   .addTo(map);

    let ANFOriginCoords = [38.109904916253555, 37.56280292126914];
    let cyprus = [34.937300019663, 33.12242036505382];
    let crete = [35.231110035824535, 24.80451044415649];
    let bademdere = [37.91529817816538, 35.076834657380765];
    let kusadasi = [37.85638183728916, 27.290315419375275];
    let thessaloniki = [40.67467495371143, 22.894976499076776];
    let tirana = [41.334582276261884, 19.677275378989766];
    let cutro = [39.027030380708986, 16.885483724873207];
    let nafplion = [37.567760841027386, 22.98740570268659];
    let syvota = [39.55142338246975, 20.180992582746878];
    let rossano = [39.57185552491794, 16.643531035064285];
    let split = [43.519201932947865, 16.51378613302088];
    let paola = [39.34275024440744, 16.04286760094992];
    let latina = [41.43538325186495, 12.86778800709526];
    let ostia = [41.75491678543996, 12.274359485378756];
    let sardinia = [39.8677093953908, 9.047691232289715];
    let piombino = [42.969452702406, 10.525436595835794];
    let genoa = [44.46942144131711, 8.841474913224822];
    let frejus = [43.37954726509159, 6.604082213078283];
    let montpellier = [43.58487223384653, 3.8178397375090576];
    let girona = [42.40345722881095, 2.879939763110085];
    let valencia = [39.374613208102666, -0.534081545192991];
    let seville = [37.038532578492855, -5.206541501117564];
    let lisbon = [38.8665697002456, -8.923271011495029];
    let lesvans = [44.3901009211351, 4.117062995377118];
    let lemans = [48.23111664095748, 0.6421339818132111];
    let brittany = [48.55648532612354, -4.163733952892681];
    let southwales = [51.84800378764838, -4.8610559669437166];
    let lille = [50.60889068902996, 2.1498572554072446];
    let london = [51.344590583719764, 0.05789121325413622];
    let izmit = [40.68726386603334, 30.72121329075923];
    let northmacedonia = [42.05903556486896, 22.485274908559845];
    let serbia = [44.39314119869013, 20.7137000620518];
    let sofia = [42.69943560665004, 23.08836421800939];
    let craiova = [44.177273889432506, 23.80453277298072];
    let burgas = [42.657869532924906, 27.25344976139531];
    let babadag = [44.77473442415656, 28.849941790154233];

    const plotANFExpansion = (from, to) => {
      // Plot the various paths of expansion taken by the Anatolian Neolithic Farmers into Europe
      let polyline = "";
      let opacity = 0.5;
      let weight = 8;
      let colour = "brown";

      // Function to calculate control point for the curve
      const getControlPoint = (from, to, curveStrength = 0.3) => {
        const latMid = (from[0] + to[0]) / 2;
        const lngMid = (from[1] + to[1]) / 2;
        const dx = to[1] - from[1];
        const dy = to[0] - from[0];
        const norm = Math.sqrt(dx * dx + dy * dy);
        const offsetLat = (-dy / norm) * curveStrength;
        const offsetLng = (dx / norm) * curveStrength;

        return [latMid + offsetLat, lngMid + offsetLng];
      };

      // Calculate control point for the curve
      const controlPoint = getControlPoint(from, to, 1.2); // Adjust the curve strength if needed

      // Create the curved polyline with control point
      polyline = L.curve(["M", from, "Q", controlPoint, to], {
        color: colour,
        weight: weight,
        opacity: opacity,
      }).addTo(anfExpansionLayer);

      // Calculate the angle for the arrow
      const angle =
        (Math.atan2(to[1] - from[1], to[0] - from[0]) * 180) / Math.PI;

      // Custom arrow icon with an outstretched triangle
      const arrowIcon = L.divIcon({
        className: "",
        html: `<svg width="30" height="30" viewBox="0 0 30 30" style="transform: rotate(${angle}deg);">
      <polygon points="15,0 5,25 25,25" fill="${colour}" />
    </svg>`,
        iconSize: [30, 30],
        iconAnchor: [15, 15],
      });

      // Place the arrow at the end of the curved polyline
      L.marker(to, { icon: arrowIcon }).addTo(anfExpansionLayer);
    };

    plotANFExpansion(ANFOriginCoords, cyprus);
    plotANFExpansion(cyprus, crete);
    plotANFExpansion(crete, cutro);
    plotANFExpansion(crete, nafplion);
    plotANFExpansion(ANFOriginCoords, bademdere);
    plotANFExpansion(bademdere, kusadasi);
    plotANFExpansion(bademdere, izmit);
    plotANFExpansion(kusadasi, thessaloniki);
    plotANFExpansion(thessaloniki, tirana);
    plotANFExpansion(nafplion, syvota);
    plotANFExpansion(syvota, rossano);
    plotANFExpansion(syvota, split);
    plotANFExpansion(paola, latina);
    plotANFExpansion(ostia, sardinia);
    plotANFExpansion(piombino, genoa);
    plotANFExpansion(genoa, frejus);
    plotANFExpansion(frejus, montpellier);
    plotANFExpansion(girona, valencia);
    plotANFExpansion(valencia, seville);
    plotANFExpansion(seville, lisbon);
    plotANFExpansion(lesvans, lemans);
    plotANFExpansion(brittany, southwales);
    plotANFExpansion(lille, london);
    plotANFExpansion(northmacedonia, serbia);
    plotANFExpansion(sofia, craiova);
    plotANFExpansion(burgas, babadag);

    /***ANF BORDERS**************************************/
    let anfOriginCoords = [
      [38.65592378562599, 37.625977094769496],
      [38.46503850516063, 36.77157632010816],
      [37.73506145800293, 36.67393051728971],
      [36.83125364058383, 36.71818868379447],
      [36.50782304499802, 37.71361967743543],
      [36.702162420101025, 38.30370819450153],
      [37.67846419124882, 39.1812757327024],
    ];

    let anfOrigin = L.polygon(anfOriginCoords, {
      color: "red", // Border color
      weight: 8, // Border thickness
      opacity: 0.6, // Border opacity
      fillColor: "red", // Fill color
      fillOpacity: 0.5, // Fill opacity
      smoothFactor: 4, // Smooths out the curves between points (not necessary for simple polygons)
    }).addTo(anfExpansionLayer);

    anfOrigin.setStyle({
      color: "red",
      weight: 8,
      opacity: 0.6,
      fillColor: "red",
      fillOpacity: 0.5,
      filter: "blur(3px)", // Apply blur to polygon's border
    });

    /******************************************************/

    L.control
      .layers(
        null,
        { "Anatolian Neolithic Farmer Expansion": anfExpansionLayer },
        { collapsed: false }
      )
      .addTo(map);
  }, [map]);

  return (
    <div style={{ height: "100vh" }}>
      <div id="map" />
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
