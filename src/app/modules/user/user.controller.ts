import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { UserServices } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sedResponse } from "../../utils/sendResponse";
import { JwtPayload } from "jsonwebtoken";

// const createUser = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     throw new AppError(httpStatus.BAD_REQUEST, "fake error");

//     const user = await UserServices.createUser(req.body);

//     res.status(httpStatus.CREATED).json({
//       massage: "User Created Successfully",
//       user,
//     });

//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   } catch (err: any) {
//     // eslint-disable-next-line no-console
//     console.log(err);
//     next(err);
//   }
// };

const createUser = catchAsync(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (req: Request, res: Response, next: NextFunction) => {
    const users = await UserServices.createUser(req.body);

    // res.status(httpStatus.CREATED).json({
    //   massage: "User Created Successfully",
    //   user,
    // });
    sedResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "User Created Successfully",
      data: users,
    });
  }
);
const updateUser = catchAsync(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;
    // const token = req.headers.authorization;
    // const verifiedToken = verifyToken(
    //   token as string,
    //   envVars.JWT_ACCESS_SECRET
    // ) as JwtPayload;
    const verifiedToken = req.user;
    const payload = req.body;
    const user = await UserServices.updateUser(
      userId,
      payload,
      verifiedToken as JwtPayload
    );

    sedResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "User Created Successfully",
      data: user,
      meta: undefined,
    });
  }
);

const getAllUsers = catchAsync(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (req: Request, res: Response, next: NextFunction) => {
    const users = await UserServices.getAllUsers();

    // res.status(httpStatus.OK).json({
    //   success: true,
    //   message: "All Users Retrieved Successfully",
    //   data: users,
    // });
    sedResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User Created Successfully",
      data: users,
      meta: users.meta,
    });
  }
);

export const UserControllers = {
  createUser,
  getAllUsers,
  updateUser,
};
