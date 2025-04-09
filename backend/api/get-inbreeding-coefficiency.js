function calculateInbreedingCoefficient(personId, path = []) {
    // Check memoization cache first
    if (memo[personId] !== undefined) {
      return memo[personId];
    }
  
    const person = ancestorLookup[personId];
    
    // If person doesn't exist in the tree, return 0
    if (!person) {
      memo[personId] = 0;
      return 0;
    }
  
    // Check for parent loops
    if (path.includes(personId)) {
      memo[personId] = 0;
      return 0;
    }
  
    // If person has no parents, return 0
    if (!person.father_id && !person.mother_id) {
      memo[personId] = 0;
      return 0;
    }
  
    let commonCoEff = 0;
    
    // Only calculate if both parents exist
    if (person.father_id && person.mother_id) {
      const commonAncestors = findCommonAncestors(person.father_id, person.mother_id);
      
      for (const {ancestorId, fatherSteps, motherSteps} of commonAncestors) {
        const n = fatherSteps + motherSteps;
        const F_CA = calculateInbreedingCoefficient(ancestorId, [...path, personId]);
        commonCoEff += Math.pow(0.5, n + 1) * (1 + F_CA);
      }
    }
  
    // Calculate parents' coefficients
    const fatherCoEff = person.father_id 
      ? calculateInbreedingCoefficient(person.father_id, [...path, personId])
      : 0;
    
    const motherCoEff = person.mother_id 
      ? calculateInbreedingCoefficient(person.mother_id, [...path, personId])
      : 0;
  
    // Total coefficient
    const totalCoEff = commonCoEff + (fatherCoEff / 2) + (motherCoEff / 2);
    
    memo[personId] = totalCoEff;
    return totalCoEff;
  }
  
  function findCommonAncestors(personId1, personId2) {
    const ancestors1 = getAncestorSteps(personId1);
    const ancestors2 = getAncestorSteps(personId2);
    
    const common = [];
    
    for (const [ancestorId, steps] of Object.entries(ancestors1)) {
      if (ancestors2[ancestorId]) {
        for (const s1 of steps) {
          for (const s2 of ancestors2[ancestorId]) {
            common.push({
              ancestorId: Number(ancestorId),
              fatherSteps: s1,
              motherSteps: s2
            });
          }
        }
      }
    }
    
    return common;
  }
  
  function getAncestorSteps(personId, steps = 0) {
    const person = ancestorLookup[personId];
    if (!person) return {};
    
    const result = {};
    
    if (person.father_id) {
      const fatherAncestors = getAncestorSteps(person.father_id, steps + 1);
      Object.assign(result, fatherAncestors);
    }
    
    if (person.mother_id) {
      const motherAncestors = getAncestorSteps(person.mother_id, steps + 1);
      Object.assign(result, motherAncestors);
    }
    
    if (!person.father_id && !person.mother_id) {
      result[personId] = [steps];
    }
    
    return result;
  }