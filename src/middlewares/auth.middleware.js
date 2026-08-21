"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.protect = protect;
exports.authorize = authorize;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function protect(req, res, next) {
    // 1. Get token from cookies
    const token = req.cookies?.token;
    if (!token) {
        res.status(401).json({ message: "Unauthorized: No token provided" });
        return;
    }
    try {
        // 2. Verify token
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "super-secret-key-12345");
        // 3. Attach decoded user info to request
        req.user = decoded;
        // 4. Move to next middleware or controller
        next();
    }
    catch (error) {
        res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
    }
}
function authorize(...allowedRoles) {
    return (req, res, next) => {
        const user = req.user;
        // Check if user exists and has a permitted role
        if (!user || !allowedRoles.includes(user.role)) {
            res.status(403).json({ message: "Forbidden: You do not have access" });
            return;
        }
        next();
    };
}
//# sourceMappingURL=auth.middleware.js.map