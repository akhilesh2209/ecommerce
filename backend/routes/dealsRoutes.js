import express from "express";
import { getDeals } from "../controllers/dealsController.js";

const router = express.Router();

router.get("/", getDeals);

export default router;
