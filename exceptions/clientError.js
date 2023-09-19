import CustomError from "./customError.js";

export class ClientError extends CustomError {
  constructor(message) {
    super(message, 400);
  }
}
