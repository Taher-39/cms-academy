import { Request, Response } from "express";
import User from "./user.model";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../../utils/jwt.utils";

// ─── Register ────────────────────────────────────────────────
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(409).json({ success: false, message: "Email already in use" });
      return;
    }

    const user = await User.create({ name, email, password, role });

    const accessToken = generateAccessToken({
      userId: user._id.toString(),
      role: user.role,
    });
    const refreshToken = generateRefreshToken({
      userId: user._id.toString(),
      role: user.role,
    });

    // Refresh token DB তে save করো
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    res.status(201).json({
      success: true,
      message: "Registration successful",
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
  console.error("REGISTER ERROR:", error); // এই line add করো
  res.status(500).json({ success: false, message: "Server error", error });
}
};

// ─── Login ───────────────────────────────────────────────────
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password +refreshToken");
    if (!user) {
      res.status(401).json({ success: false, message: "Invalid credentials" });
      return;
    }

    if (!user.isActive) {
      res.status(403).json({ success: false, message: "Account is deactivated" });
      return;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401).json({ success: false, message: "Invalid credentials" });
      return;
    }

    const accessToken = generateAccessToken({
      userId: user._id.toString(),
      role: user.role,
    });
    const refreshToken = generateRefreshToken({
      userId: user._id.toString(),
      role: user.role,
    });

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    res.json({
      success: true,
      message: "Login successful",
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

// ─── Refresh Token ────────────────────────────────────────────
export const refreshToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const { refreshToken: token } = req.body;

    if (!token) {
      res.status(400).json({ success: false, message: "Refresh token required" });
      return;
    }

    const decoded = verifyRefreshToken(token);
    const user = await User.findById(decoded.userId).select("+refreshToken");

    if (!user || user.refreshToken !== token) {
      res.status(401).json({ success: false, message: "Invalid refresh token" });
      return;
    }

    const newAccessToken = generateAccessToken({
      userId: user._id.toString(),
      role: user.role,
    });

    res.json({
      success: true,
      data: { accessToken: newAccessToken },
    });
  } catch {
    res.status(401).json({ success: false, message: "Invalid refresh token" });
  }
};

// ─── Logout ──────────────────────────────────────────────────
export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    await User.findByIdAndUpdate(req.user?.userId, {
      $unset: { refreshToken: 1 },
    });
    res.json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

// ─── Get Me ──────────────────────────────────────────────────
export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user?.userId);
    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }
    res.json({ success: true, data: { user } });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};