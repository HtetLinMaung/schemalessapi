const jwt = require("jsonwebtoken");

module.exports = (req) => {
  const authHeader = req.get("authorization");
  if (!authHeader) {
    return {
      status: 401,
      json: {
        code: 401,
        message: "No authorization header!",
      },
    };
  }
  const token = authHeader.replace("Bearer ", "").trim();
  if (!token) {
    return {
      status: 401,
      json: {
        code: 401,
        message: "Token is required!",
      },
    };
  }
  try {
    req["tokenPayload"] = jwt.verify(token, process.env.jwt_secret);
  } catch (err) {
    return {
      status: 401,
      json: {
        code: 401,
        message: err.message,
      },
    };
  }
  return {
    status: 200,
    json: null,
  };
};
