import jwt from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler";

export default asyncHandler((req, res, next) => {
  // Express headers are auto converted to lowercase
  let token =
    req.headers["x-access-token"] ||
    req.headers.authorization ||
    req.query.token ||
    req.body.token;

  if (!token) {
    req.status = 401;
    return next(new Error("You need to login to perform this operation"));
  }

  if (token.startsWith("Bearer ") || token.startsWith("bearer ")) {
    token = token.slice(7, token.length);
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET);
    return next();
  } catch (error) {
    req.status = 401;
    return next(new Error("Token has expired or invalid, login again"));
  }
});
