class CustomError extends Error {
  constructor(message, status = 500, additionalInfo = undefined) {
    super(message);
    this.message = message;
    this.status = status;
    this.additionalInfo = additionalInfo;
  }
}

export default CustomError;
