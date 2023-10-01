const JWT = require("jsonwebtoken");

const validateJWT = (token) => JWT.verify(token, process.env.JWT_SECRET);

exports.createTokenForUser = function (user) {
  const payload = {
    id: user._id,
    email: user.email,
    fullName: user.fullName,
    profileImageURL: user.profileImageURL,
    role: user.role,
  };
  const token = JWT.sign(payload, process.env.JWT_SECRET);

  return token;
};

exports.protect = function (req, res, next) {
  const tokenCookieValue = req.cookies["jwt"];
  if (!tokenCookieValue) return next();

  try {
    const userPayload = validateJWT(tokenCookieValue);
    req.user = userPayload;
  } catch (error) {}

  next();
};
