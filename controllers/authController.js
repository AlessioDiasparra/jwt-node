import { sign } from 'jsonwebtoken';
import config from '../config/config.js';
import { ClientError } from '../exceptions/clientError.js';
import { UnauthorizedError } from '../exceptions/unauthorizedError.js';
import {
  getUserByUsername,
  isPasswordCorrect,
  changePassword,
} from '../state/users';

class AuthController {
  static login = async (req, res, next) => {
    // Ensure the username and password are provided.
    // Throw an exception back to the client if those values are missing.
    let { username, password } = req.body;
    if (!(username && password))
      throw new ClientError('Username and password are required');

    const user = getUserByUsername(username);

    // Check if the provided password matches our encrypted password.
    if (!user || !(await isPasswordCorrect(user.id, password)))
      throw new UnauthorizedError("Username and password don't match");

    // Generate and sign a JWT that is valid for one hour.
    const token = sign(
      { userId: user.id, username: user.username, role: user.role },
      config.jwt.secret,
      {
        expiresIn: '1h',
        notBefore: '0', // Cannot use before now, can be configured to be deferred.
        algorithm: 'HS256',
        audience: config.jwt.audience,
        issuer: config.jwt.issuer,
      }
    );

    // Return the JWT in our response.
    res.type('json').send({ token: token });
  };

  static changePassword = async (req, res, next) => {
    // Retrieve the user ID from the incoming JWT.
    const id = req.token.payload.userId;

    // Get the provided parameters from the request body.
    const { oldPassword, newPassword } = req.body;
    if (!(oldPassword && newPassword))
      throw new ClientError("Passwords don't match");

    // Check if old password matches our currently stored password, then we proceed.
    // Throw an error back to the client if the old password is mismatched.
    if (!(await isPasswordCorrect(id, oldPassword)))
      throw new UnauthorizedError("Old password doesn't match");

    // Update the user password.
    // Note: We will not hit this code if the old password compare failed.
    await changePassword(id, newPassword);

    res.status(204).send();
  };
}
export default AuthController;