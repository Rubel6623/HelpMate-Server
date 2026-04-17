import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import config from "../../config";

const createUser = async (req: Request, res: Response) => {
  try {
    const payload = { ...req.body };
    if (payload.avatar && !payload.avatarUrl) {
      payload.avatarUrl = payload.avatar;
    }
    const result = await AuthService.createUserIntoDB(payload);
    res.status(200).json({
      success: true,
      message: "User created successfully",
      data: result,
    });
  } catch (e) {
    console.log(e);
      res.status(400).json({
      error: "User creation failed",
      details: e,
    });
  }
};

const loginUser = async (req: Request, res: Response) => {
  try {
    const result = await AuthService.loginUserIntoDB(req.body);
    res.cookie("token", result.token, {
      httpOnly: true,
      secure: config.node_env === "production",
      sameSite: "strict",
    })
      res.status(200).json({
      success: true,
      message: "User Login successfully",
      data: result
    });
  } catch (e: any) {
    res.status(401).json({
      success: false,
      message: e.message || "User Login failed",
      error: e,
    });
  }
};


const getMe = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    const result = await AuthService.getMeFromDB(userId);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User profile retrieved successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};


const updateMe = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { name, avatar, avatarUrl } = req.body; 
    const updateData: any = { name };
    if (avatarUrl) updateData.avatarUrl = avatarUrl;
    else if (avatar) updateData.avatarUrl = avatar;

    const result = await AuthService.updateMeInDB(userId, updateData);

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};


const logoutUser = async (req: Request, res: Response) => {
  res.clearCookie("token");
  res.status(200).json({
    success: true,
    message: "User logged out successfully",
  });
};


export const AuthController = {
  createUser,
  loginUser,
  getMe,
  updateMe,
  logoutUser
};


