import customError from "../utils/customError.js";

import dotEnv from "dotenv";

dotEnv.config();

// Production Function
const productionHandler = (res, error) => {
  // console.log(navigator.onLine);
  if (error.isOperational) {
    res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
    });
  } else {
    res.status(500).json({
      status: "error",
      message: "SomeThing Got Wrong ! Please Try Later",
    });
  }
};

//------------------------------- Db Errors Handlers Starts--------------------------------
const castErrorHandler = (error) => {
  return new customError("Invalid Id Please Enter Another One", 400);
};

const ValidationErrorHandler = (error) => {
  const errors = Object.values(error.errors);
  const messages = errors.map((err) => err.message).join(" and ");
  // const msg = error.errors.content.message;
  return new customError(messages, 400);
};

const duplicateKeyError = (error) => {
  const errors = Object.keys(error.keyValue);
  return new customError(`the field ${errors.toString()} is existed`, 400);
};
//------------------------------- Db Errors Handlers End--------------------------------

// ------------------------------Token Errors Handlers Start ----------------------------
const jsonwebtokenError = () => {
  return new customError(`Invalid token`, 400);
};

const TokenExpiredErrorHandler = () => {
  return new customError("JWT has expired.please login again!", 401);
};
// ------------------------------Token Errors Handlers Ends ----------------------------

export default (error, req, res, next) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || "error";

  // Development Function
  if (process.env.NODE_ENV === "development") {
    res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
      stackTrace: error.stack,
      error: error,
    });
  }

  if (process.env.NODE_ENV === "production") {
    if (error.name == "CastError") error = castErrorHandler(error);
    if (error.name === "ValidationError") error = ValidationErrorHandler(error);
    if (error.code === 11000) error = duplicateKeyError(error);
    if (error.name === "JsonWebTokenError") error = jsonwebtokenError();
    if (error.name === "TokenExpiredError") error = TokenExpiredErrorHandler();

    productionHandler(res, error);
  }
};
