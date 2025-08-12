import User from "../models/UserModel.js";
import asyncErrorHandler from "../utils/asyncErrorHandler.js";
import jwt from "jsonwebtoken";
import dotEnv from "dotenv";
import customError from "../utils/customError.js";
import util from "util";
import { sendEmail } from "../utils/email.js";
import crypto from "crypto";
import { filterReqObj } from "../utils/filterObj.js";

dotEnv.config();

// Create Token Function
const signToken = (id) =>
  jwt.sign({ id }, process.env.SECRET_STR, {
    expiresIn: process.env.LOGIN_EXPIRED,
  });

// Create Token and Send Response Function
const createSendResponse = (user, statusCode, res, message) => {
  const token = signToken(user._id);

  const options = {
    maxAge: 10 * 24 * 3600 * 1000, // 10 days
    secure: process.env.NODE_ENV === "production", // you cant use this in http you need https
    httpOnly: true, // For just not be read
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  };

  res.cookie("jwt", token, options);

  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    data: { user, message: message || undefined },
  });
};

/// Auth Controllers Start
export const signup = asyncErrorHandler(async (req, res, next) => {
  const { userName, email, password, confirmPassword } = req.body;
  const newUser = await User.create({
    userName,
    email,
    password,
    confirmPassword,
  });

  //create Token
  createSendResponse(newUser, 201, res);

  // const token = signToken(newUser._id);

  // res.status(201).json({
  //   status: "success",
  //   token,
  //   data: newUser,
  // });
});

export const login = asyncErrorHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password)
    return next(new customError("please Enter Email And Password", 400));

  // get the user by their email
  const user = await User.findOne({ email })
    .select("+password")
    .select("+active");

  if (user?.active === false) {
    return res.status(200).json({
      status: "fail",
      message:
        "Your Account is non-active if you want to reactive it user the link",
      link: `${req.protocol}://${req.get("host")}/api/v1/users/reactive`,
    });
  }

  const isMatch = await user?.comparePassword(password, user.password);
  // if the user is not in the db
  if (!user || !isMatch)
    return next(new customError("Wrong Email Or Password", 400));

  createSendResponse(user, 200, res);

  // const token = signToken(user._id);

  // res.status(200).json({
  //   status: "success",
  //   token,
  //   data: user,
  // });
});

// Protect Function
export const protect = asyncErrorHandler(async (req, res, next) => {
  // 1 => define the auth Header
  //? const authHeader = req.headers?.authorization;

  const token = req.cookies?.jwt;

  if (!token) return next(new customError("You Are Not Logged In", 401));

  // 2 => Check if the auth Header is existed and start with bearer or throw and error

  // ?if (!authHeader || !authHeader.toLowerCase().startsWith("bearer"))
  //  ? return next(new customError("You Are Not Logged In", 401));

  //? const token = authHeader.split(" ")[1];

  // 3 => Validate The Token
  const decodedToken = await util.promisify(jwt.verify)(
    token,
    process.env.SECRET_STR
  );

  const user = await User.findById(decodedToken.id);

  // 4 => Check if the user is existed in the db
  if (!user) return next(new customError("The User is not existed", 401));
  //  5 => Check if the user Password didn't change
  const isPasswordChanged = user.isPasswordChanged(decodedToken.iat); // await just in case of async but we don't use async

  if (isPasswordChanged)
    return next(
      new customError(
        "You Have Changed you password Lately,Please Login Again",
        401
      )
    );

  // 6 => Go If All Things Are Good
  req.user = user;
  next();
});

// For Permissions Function
export const restrict = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role)
      return next(new customError("You Don't Have permission to do this", 403));
    next();
  };
};

// Forget Password Function
export const forgetPassword = asyncErrorHandler(async (req, res, next) => {
  //Get User Based On The Post Request
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user)
    return next(new customError("There is not a user with this email", 404));

  // Generate A random reset Token

  const resetToken = user.generatePasswordRestToken();

  await user.save({ validateBeforeSave: false });

  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/users/reset-password/${resetToken}`;

  const message = `We Have received a password reset request . please use the link bellow to reset it \n\n ${resetUrl}`;

  try {
    await sendEmail({
      email,
      subject: "SomeThing happens",
      message,
    });
    res.status(200).json({
      status: "success",
      message: "The Rest token has been sent to the user email",
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpired = undefined;
    user.save({ validateBeforeSave: false });
    return next("SomeThing Got Wrong ,Please Try Later", 400);
  }
  // Send The token to the user
});

// Reset Password Function
export const resetPassword = asyncErrorHandler(async (req, res, next) => {
  const resetToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken: resetToken,
    resetPasswordTokenExpired: { $gt: Date.now() },
  });
  // reject Changing the password
  if (!user) return next(new customError("invalid Token or expired"));

  // accept Changing the password

  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordTokenExpired = undefined;
  user.passwordChangedAt = Date.now();

  await user.save();

  // Login the user
  const message = "the password has been changed successfully";
  createSendResponse(user, 200, res, message);

  // const newToken = signToken(user._id);

  // res.status(200).json({
  //   status: "success",
  //   newToken,
  //   message: "the password has been changed successfully",
  // });
});

// Update The Password Function
export const updatePassword = asyncErrorHandler(async (req, res, next) => {
  const { _id } = req.user;

  const { currentPassword, newPassword, confirmPassword } = req.body;

  const user = await User.findById(_id).select("+password");

  if (!user) return next(new customError("User not found", 404));

  // compare the passwords

  const isPasswordMatch = await user.comparePassword(
    currentPassword,
    user.password
  );

  if (!isPasswordMatch)
    return next(new customError("The password is not correct", 400));

  if (newPassword !== confirmPassword)
    return next(new customError("Passwords do not match", 400));

  user.password = newPassword;
  user.confirmPassword = confirmPassword;

  await user.save();

  const message = "Your password has been updated successfully.";

  createSendResponse(user, 200, res, message);

  // const token = signToken(user._id);

  // res.status(200).json({
  //   status: "success",
  //   message: "Your password has been updated successfully.",
  //   token,
  // });
});

// Update Details Function
export const updateDetails = asyncErrorHandler(async (req, res, next) => {
  const { _id } = req.user;

  //Get the new Details and the password
  const { password, ...updates } = req.body;

  const user = await User.findOne({ _id }).select("+password");

  const AllowedFields = filterReqObj(updates, "userName", "email");

  if (!user) return next(new customError("The User is not existed", 404));

  const isPasswordMatch = await user.comparePassword(password, user.password);

  if (!isPasswordMatch)
    return next(new customError("The password is Wrong !", 401));

  const userAfterUpdate = await User.findOneAndUpdate({ _id }, AllowedFields, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    userAfterUpdate,
  });
});

export const deleteMe = asyncErrorHandler(async (req, res, next) => {
  const { _id } = req.user;

  await User.findByIdAndUpdate(_id, { active: false });

  res.status(200).json({
    status: "success",
    message: "The User is non-Active Now ",
  });
});
/// Auth Controllers End
