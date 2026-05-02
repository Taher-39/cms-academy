import { Router } from "express";
import {
  register,
  login,
  refreshToken,
  logout,
  getMe,
} from "./user.controller";
import { validate } from "../../middlewares/validate.middleware";
import { authenticate } from "../../middlewares/auth.middleware";
import { registerSchema, loginSchema } from "./user.validation";

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/refresh-token", refreshToken);
router.post("/logout", authenticate, logout);
router.get("/me", authenticate, getMe);

export default router;