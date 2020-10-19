import express from "express";
import auth from "../middlewares/auth";
import thumbnail from "../controllers/thumbnail";

const route = express.Router();

route.get("/thumbnail", auth, thumbnail);

export default route;
