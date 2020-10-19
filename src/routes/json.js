import express from "express";
import patch from "../controllers/json";
import auth from "../middlewares/auth";

const route = express.Router();

route.patch("/json", auth, patch);

export default route;
