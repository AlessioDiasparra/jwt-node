import jwt from 'jsonwebtoken';
const {verify} = jwt;
import config from '../config/config.js';

export const checkJwt = (req, res, next) => {
  // Get the jwt token from the head.
  const token = req.headers.authorization?.split(' ')[1]
  let jwtPayload;

  // Try to validate the token and get data.
  try {
    jwtPayload = verify(token, config.jwt.secret, {
      complete: true,
      audience: config.jwt.audience,
      issuer: config.jwt.issuer,
      algorithms: ['HS256'],
      clockTolerance: 0,
      ignoreExpiration: false,
      ignoreNotBefore: false,
    });
    req.token = jwtPayload;
  } catch (error) {
    res
      .status(401)
      .type('json')
      .send(JSON.stringify({ message: 'Missing or invalid token' }));
    return;
  }

  // Call the next middleware or controller.
  next();
};
