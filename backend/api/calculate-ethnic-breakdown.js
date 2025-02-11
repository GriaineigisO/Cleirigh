app.use("/calculate-ethnic-breakdown", async (req, res) => {
    try {
      const { userId, id } = req.body;
  
      // Query to get the current tree
      const getCurrentTreeId = await pool.query(
        "SELECT current_tree_id FROM users WHERE id = $1",
        [userId]
      );
  
      const currentTree = getCurrentTreeId.rows[0].current_tree_id;
  
      // Stack-based approach to replace recursion
      const stack = [id];
      const ethnicityMap = new Map();
  
      while (stack.length > 0) {
        const childId = stack.pop();
        if (ethnicityMap.has(childId)) continue;
  
        const findParents = await pool.query(
          `SELECT * FROM tree_${currentTree} WHERE ancestor_id = $1`,
          [childId]
        );
  
        if (findParents.rows.length === 0) continue;
  
        const row = findParents.rows[0];
        const { father_id: fatherId, mother_id: motherId, ethnicity } = row;
  
        if (fatherId === null && motherId === null) {
          // Dead-end ancestor, assign full ethnicity
          ethnicityMap.set(childId, { [ethnicity]: 100 });
        } else {
          if (fatherId !== null && !ethnicityMap.has(fatherId)) {
            stack.push(fatherId);
            continue;
          }
          if (motherId !== null && !ethnicityMap.has(motherId)) {
            stack.push(motherId);
            continue;
          }
  
          const childEthnicity = {};
          const processParent = (parentId) => {
            if (parentId !== null) {
              const parentEthnicity = ethnicityMap.get(parentId) || {};
              for (const [ethnicity, percentage] of Object.entries(parentEthnicity)) {
                childEthnicity[ethnicity] =
                  (childEthnicity[ethnicity] || 0) + percentage / 2;
              }
            }
          };
  
          processParent(fatherId);
          processParent(motherId);
  
          ethnicityMap.set(childId, childEthnicity);
        }
      }
  
      const resultEthnicity = ethnicityMap.get(id) || {};
      res.json({
        ethnicityNameArray: Object.keys(resultEthnicity),
        ethnicityPercentageArray: Object.values(resultEthnicity),
      });
    } catch (error) {
      console.log("Error calculating ethnic breakdown:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  