const { brewBlankExpressFunc } = require("code-alchemy");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../../models/User");

module.exports = brewBlankExpressFunc(async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user) {
    return res.status(404).json({
      code: 404,
      message: "Username is incorrect!",
    });
  }

  if (user.status == "inactive") {
    return res.status(401).json({
      code: 401,
      message: "Your account is not activated!",
    });
  }

  if (user.status == "lock") {
    return res.status(401).json({
      code: 401,
      message: "Your account is locked!",
    });
  }

  if (user.status == "suspend") {
    return res.status(401).json({
      code: 401,
      message: "Your account is suspended!",
    });
  }

  if (!bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({
      code: 401,
      message: "Password is incorrect!",
    });
  }

  const token = jwt.sign(
    {
      userId: user._id,
    },
    process.env.jwt_secret,
    {
      expiresIn: process.env.jwt_expires_in,
    }
  );

  res.json({
    code: 200,
    message: "Login successful!",
    data: token,
  });
});
