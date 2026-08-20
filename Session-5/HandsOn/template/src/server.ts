import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import { connectDB } from "./config/db.js";
import { specs } from "./config/swagger.js";
import explorerRoutes from "./routes/explorer.router.js";
import treasureRoutes from "./routes/treasure.routes.js";
import authRoutes from "./routes/auth.routes";

const app = express();
const PORT = Number(process.env.PORT) || 5000;

app.use(express.json());
app.use(cookieParser());

connectDB();

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
app.use("/explorers", explorerRoutes);
app.use("/treasures", treasureRoutes);
app.use("/api/auth", authRoutes);
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
