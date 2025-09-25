class AppError extends Error {
  public statusCode: number;

  constructor(statusCode: number, massage: string, stack = "") {
    super(massage);
    this.statusCode = statusCode;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default AppError;
