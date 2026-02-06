import jwt from "jsonwebtoken";

export const auth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({ message: "token not provided" });
  }

  const token = authorization.split(" ")[1];
  jwt.verify(token, "secret", function (err, decoded) {
    if (err) return res.status(401).json({ message: "invalid token" });
    req.id = decoded.id;
    next();
  });
};
