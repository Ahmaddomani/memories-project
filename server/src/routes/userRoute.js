import { Router } from "express";
import {
  deleteMe,
  forgetPassword,
  login,
  protect,
  resetPassword,
  signup,
  updateDetails,
  updatePassword,
} from "../controllers/authControllers.js";

const authRouter = Router();

authRouter.route("/signup").post(signup);
authRouter.route("/login").post(login);
authRouter.route("/forget-password").post(forgetPassword);
authRouter.route("/resetPassword/:token").post(resetPassword);
authRouter.route("/update-password").patch(protect, updatePassword);
authRouter.route("/update-details").patch(protect, updateDetails);
authRouter.route("/delete-me").delete(protect, deleteMe);

export default authRouter;
