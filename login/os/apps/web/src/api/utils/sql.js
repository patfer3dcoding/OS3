import db from './db.server';

// Mock SQL function for demo
const sql = async (stringsOrQuery, ...values) => {
  let query = '';
  let params = [];

  // Check if it's a template literal call
  if (Array.isArray(stringsOrQuery) && stringsOrQuery.raw) {
    // Template literal: sql`SELECT * ...`
    // Reconstruct query replacing ${x} with ?
    query = stringsOrQuery.reduce((acc, str, i) => {
      return acc + str + (i < values.length ? '?' : '');
    }, '');
    params = values;
  } else {
    // Function usage: sql(query, paramsArray)
    query = stringsOrQuery;
    params = values[0] || [];
  }

  // Safety check
  if (typeof query !== 'string') return [];

  const lower = query.trim().toLowerCase();

  // Handling RETURNING * for client_placements
  if (lower.includes('returning')) {
    // We can't easily emulate RETURNING without more complex logic.
    // We will execute the update/insert and then return a dummy object or fetch the item if ID is known.
    // For the demo, returning an array with one "simulated" object might be enough to satisfy "result[0]" checks.

    db.prepare(query).run(...params);
    // Attempt to return something useful if params contained an object
    let mockReturn = { id: 'demo-mock-id' };
    if (params.length > 0 && typeof params[0] === 'object') {
      mockReturn = { ...mockReturn, ...params[0] };
    }
    return [mockReturn];
  }

  if (lower.startsWith('select')) {
    const result = db.prepare(query).all(...params);
    // Ensure array
    if (result === undefined) return [];
    return Array.isArray(result) ? result : [result];
  } else {
    // INSERT/UPDATE/DELETE
    db.prepare(query).run(...params);
    return [];
  }
};

export default sql;