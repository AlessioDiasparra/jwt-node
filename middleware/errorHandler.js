import CustomError from "../exceptions/customError.js";

export function errorHandler(err, req, res, next) {
  console.error(err);
  if (!(err instanceof CustomError)) {
    res.status(500).send(
      JSON.stringify({
        message: 'Server error, please try again later',
      })
    );
  } else {
    const customError = err;
    let response = {
      message: customError.message,
    };
    // Check if there is more info to return.
    if (customError.additionalInfo)
      response.additionalInfo = customError.additionalInfo;
    res.status(customError.status).type('json').send(JSON.stringify(response));
  }
}
