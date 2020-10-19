import express from "express";
import login from "../controllers/user";

const route = express.Router();

route.post("/login", login);

export default route;
