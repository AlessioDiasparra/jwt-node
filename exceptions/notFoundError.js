import { CustomError } from './customError.js';

export class NotFoundError extends CustomError {
  constructor(message) {
    super(message, 404);
  }
}
