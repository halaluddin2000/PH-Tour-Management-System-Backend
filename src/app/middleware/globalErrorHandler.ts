/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { envVars } from "../../config/env";
import AppError from "../errorHelpers/AppError";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = 500;
  let massage = `Something went Wrong!! ${err.massage}`;

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    massage = err.message;
  } else if (err instanceof Error) {
    statusCode = 500;
    massage = err.message;
  }

  res.status(statusCode).json({
    success: false,
    massage,
    err,

    stack: envVars.NODE_ENV === "development" ? err.stack : null,
  });
};
