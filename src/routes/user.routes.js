import express from "express";
import { claimPoints, getAllUser, giveHistoryOfAUser } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/get-users", getAllUser);
router.patch("/claim-points", claimPoints);
router.get("/your-history", giveHistoryOfAUser);

export default router;
