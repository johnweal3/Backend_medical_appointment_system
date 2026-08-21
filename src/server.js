"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const appointment_routes_1 = __importDefault(require("./routes/appointment.routes"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./config/db"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
const PORT = process.env.PORT || 3000;
(0, db_1.default)();
app.get("/", (req, res) => {
    res.json({
        message: "Medical Appointment System API is running"
    });
});
app.use("/api/appointments", appointment_routes_1.default);
app.use("/auth", auth_routes_1.default);
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
//# sourceMappingURL=server.js.map