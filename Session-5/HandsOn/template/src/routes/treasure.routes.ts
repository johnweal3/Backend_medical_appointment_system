import { Router } from "express";
import {
  getAllTreasures,
  createTreasure,
  deleteTreasure,
} from "../controllers/treasure.controller.js";
import { protect, authorize } from "../middleware/auth.middleware.js";

const router = Router();

/**
 * @swagger
 * /treasures:
 *   get:
 *     summary: Get all treasures
 *     responses:
 *       200:
 *         description: A list of treasures
 */
router.get("/", getAllTreasures);

// 🔒 Step 5️⃣: only authenticated explorers should reach this
router.post("/", protect, createTreasure);

// 🔒 Step 6️⃣: only a Captain should reach this
router.delete("/:id", protect, authorize("Captain"), deleteTreasure);

export default router;