/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { envVars } from "../config/env";
import AppError from "../errorHelpers/AppError";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errorSoures: any = [];
  let statusCode = 500;
  let message = `Something went Wrong!! ${err.massage}`;

  if (err.code === 11000) {
    const matchedArray = err.message.match(/"([^"]*)"/);
    statusCode = 400;
    message = `${matchedArray[1]} already exists!!`;
  } else if (err.name === "castError") {
    statusCode = 400;
    message = "Invalid MongoDB ObjectID. please provide a valid id";
  } else if (err.name === "validationError") {
    statusCode = 400;
    const errors = Object.values(err.errors);

    errors.forEach((errorObject: any) => {
      errorSoures.push({
        path: errorObject.path,
        message: errorObject.message,
      });
      message = "validation Error";
    });
  } else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof Error) {
    statusCode = 500;
    message = err.message;
  }

  res.status(statusCode).json({
    success: false,
    message,
    // err,
    errorSoures,

    stack: envVars.NODE_ENV === "development" ? err.stack : null,
  });
};
