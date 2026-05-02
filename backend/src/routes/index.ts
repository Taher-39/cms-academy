import { Router, Request, Response } from "express";
import userRoutes from "../modules/user/user.routes";

const router = Router();

router.get("/health", (req: Request, res: Response) => {
  res.json({ status: "ok", message: "CMS Academy API is running 🚀" });
});

router.use("/auth", userRoutes);

export default router;