/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { sedResponse } from "../../utils/sendResponse";
import { AuthService } from "./auth.service";
import AppError from "../../errorHelpers/AppError";
import { setCookies } from "../../utils/setCookis";
import { createUserTokens } from "../user/userTokens";
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";

const credentialsLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const loginInfo = await AuthService.credentialsLogin(req.body);

    setCookies(res, loginInfo);

    sedResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User Logged In Successfully",
      data: loginInfo,
      meta: undefined,
    });
  }
);

const getNewAccessToken = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "No refresh Token recieved from the cookies"
      );
    }

    const tokenInfo = await AuthService.getNewAccessToken(
      refreshToken as string
    );
    setCookies(res, {
      accessToken: "jwt_string",
      refreshToken: "refresh_string",
    });

    sedResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User Logged In Successfully",
      data: tokenInfo,
      meta: undefined,
    });
  }
);
const logout = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    sedResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User Log Out Successfully",
      data: null,
    });
  }
);
const resetPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user;

    const newPassword = req.body.newPassword;
    const oldPassword = req.body.oldPassword;

    await AuthService.restPassword(
      decodedToken as JwtPayload,
      newPassword,
      oldPassword
    );

    sedResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Password changed Successfully",
      data: null,
    });
  }
);
const googleCallbackController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    console.log("user", user);

    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, "User Not Found");
    }

    let redirectTo = req.query.state ? (req.query.state as string) : "";
    if (redirectTo.startsWith("/")) {
      redirectTo = redirectTo.slice(1);
    }

    const tokenInfo = createUserTokens(user);
    setCookies(res, tokenInfo);

    // sedResponse(res, {
    //   success: true,
    //   statusCode: httpStatus.OK,
    //   message: "Password changed Successfully",
    //   data: null,
    // });
    res.redirect(`${envVars.FRONTEND_URL}/${redirectTo}`);
  }
);
export const AuthControllers = {
  credentialsLogin,
  getNewAccessToken,
  logout,
  resetPassword,
  googleCallbackController,
};
