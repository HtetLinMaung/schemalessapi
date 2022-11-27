const generateFilter = (req) => {
  let filter = {};
  for (const [k, v] of Object.entries(req.query)) {
    if (!k.startsWith("$")) {
      filter[k] = v;
    }
  }
  if (req.query.$filter) {
    filter = JSON.parse(req.query.$filter);
  }
  if ("$search" in req.query && req.query.$search) {
    filter["$text"] = { $search: req.query.$search };
  }
  return filter;
};

module.exports = generateFilter;
