import jwt from 'jsonwebtoken';
const { sign } = jwt;
import config from '../config/config.js';
import { ClientError } from '../exceptions/clientError.js';
import { UnauthorizedError } from '../exceptions/unauthorizedError.js';
import {
  getUserByUsername,
  isPasswordCorrect,
  changePassword,
} from '../state/users.js';

class AuthController {
  //login
  static login = async (req, res, next) => {
    // Assicurarsi che vengano forniti il nome utente e la password.
    // Lancia un'eccezione al client se questi valori sono mancanti.
    let { username, password } = req?.body;
    if (!(username && password))
      throw new ClientError('Username and password are required');

    const user = getUserByUsername(username);

    // Verificare se la password fornita corrisponde alla nostra password crittografata.
    /* if (!user || !(await isPasswordCorrect(user.id, password)))
      throw new UnauthorizedError("Username and password don't match"); */

    // Generare e firmare un JWT valido per un'ora..
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

    // Restituire il JWT nella risposta.
    res.send({ token: token });
  };

  //cambia password
  static changePassword = async (req, res, next) => {
    // Recuperare l'ID utente dal JWT in arrivo.
    const id = req.token.payload.userId;

    // fornire i parametri dal body della request.
    const { oldPassword, newPassword } = req.body;
    if (!(oldPassword && newPassword))
      throw new ClientError("Passwords don't match");

    // Verificare se la vecchia password corrisponde a quella attualmente memorizzata, quindi procedere.
    // Lancia un errore al client se la vecchia password non è corrispondente.
    if (!(await isPasswordCorrect(id, oldPassword)))
      throw new UnauthorizedError("Old password doesn't match");

    // Aggiorna la password dell'utente.
    // Nota: questo codice non verrà utilizzato se il confronto con la vecchia password non è andato a buon fine.
    await changePassword(id, newPassword);

    res.status(204).send();
  };
}
export default AuthController;
