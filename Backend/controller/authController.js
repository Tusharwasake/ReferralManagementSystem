import mongoose from "mongoose";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import Users from "../models/user.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/tokenGen.js";

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const existingUser = await Users.findOne({ email: email.toLowerCase() });

    if (existingUser) {
      return res.status(400).json({
        error: "User already exists, please login",
      });
    }

    const hashpassword = await argon2.hash(password);

    const data = {
      name,
      email: email.toLowerCase(),
      password: hashpassword,
    };

    const user = await Users.create(data);

    res.status(201).json({
      message: "Account created successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({
        error: "Email and password are required",
      });
    }

    const findUser = await Users.findOne({ email: email.toLowerCase() });

    if (!findUser) {
      return res.status(404).json({
        error: "User not found. Please signup first.",
      });
    }

    
    const isPasswordValid = await argon2.verify(findUser.password, password);

    if (!isPasswordValid) {
      return res.status(401).json({
        error: "Invalid credentials",
      });
    }

    const accessToken = generateAccessToken(findUser);
    const refreshToken = generateRefreshToken(findUser);

    // Set refresh token as httpOnly cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, 
    });

    res.status(200).json({
      message: "Login successful",
      accessToken,
      user: {
        id: findUser._id,
        name: findUser.name,
        email: findUser.email,
        role: findUser.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      error: "Internal server error",
      message: error.message,
    });
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie("refreshToken");

    res.status(200).json({
      message: "Logout successful",
    });
  } catch (error) {
    res.status(500).json({
      error: "Internal server error",
      message: error.message,
    });
  }
};

const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res.status(401).json({
        error: "Refresh token not provided",
      });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    // Find user
    const user = await Users.findById(decoded.id);

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    // Generate new access token
    const newAccessToken = generateAccessToken(user);

    res.status(200).json({
      accessToken: newAccessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        error: "Invalid refresh token",
      });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        error: "Refresh token expired",
      });
    }

    res.status(500).json({
      error: "Internal server error",
      message: error.message,
    });
  }
};

export { signup, login, logout, refreshToken };
