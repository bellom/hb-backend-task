import jwt from "jsonwebtoken";

export default (req, res, next) => {
  if (!req.body.username.trim() || !req.body.password.trim()) {
    req.status = 400;
    return next(new Error("Provide any username or password to login"));
  }

  try {
    const token = jwt.sign(
      { username: req.body.username },
      process.env.JWT_SECRET,
      {
        expiresIn: 60 * 60
      }
    );
    return res.status(200).send({ status: "Success", data: { token } });
  } catch (error) {
    req.status = 400;
    return next(error);
  }
};
