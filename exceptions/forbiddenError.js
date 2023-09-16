import CustomError from "./customError.js";

export class ForbiddenError extends CustomError {
  constructor(message) {
    super(message, 403);
  }
}
