import { ForbiddenError } from "../exceptions/forbiddenError.js";
import { ClientError } from "../exceptions/clientError.js";
import { getAllUsers, Roles, getUser, createUser, updateUser, deleteUser } from "../state/users.js";

class UserController {
  static listAll = async (req, res, next) => {
    // recupera tutti gli users.
    const users = getAllUsers();
    // ritorna info users.
    res.json({ users: users });
  };

  static getOneById = async (req, res, next) => {
    // Get  ID da  URL.
    const id = req.params.id;

    // Valida permessi.
    if (req.token.payload.role === Roles.USER && req.params.id !== req.token.payload.userId) {
      throw new ForbiddenError("Not enough permissions");
    }

    // Get user con id.
    const user = getUser(id);

    // NOTA: Si arriva a questo punto solo se si è trovato un utente con l'ID richiesto.
    res.json({ user: user });
  };

  static newUser = async (req, res, next) => {
    // Get  user name e password.
    let { username, password } = req.body;
    // Possiamo creare utenti regolari solo attraverso questa funzione.
    const user = await createUser(username, password, Roles.USER);

    // NOTA: si arriverà a questo punto solo se tutte le informazioni dei nuovi utenti
    // è valido e l'utente è stato creato.
    // Send HTTP "Created" response.
    res.status(201).type("json").send(user);
  };

  static editUser = async (req, res, next) => {
    // Get user ID.
    const id = req.params.id;

    // Valida permessi.
    if (req.token.payload.role === Roles.USER && req.params.id !== req.token.payload.userId) {
      throw new ForbiddenError("Not enough permissions");
    }

    // Get valori dal body.
    const { username, role } = req.body;

    // Verificare che non si può diventare ADMIN se si è UTENTE.
    if (req.token.payload.role === Roles.USER && role === Roles.ADMIN) {
      throw new ForbiddenError("Not enough permissions");
    }
    // Verificare che il ruolo sia corretto.
    else if (!Object.values(Roles).includes(role)) throw new ClientError("Invalid role");

    // Recuperare e aggiornare il record dell'utente.
    const user = getUser(id);
    const updatedUser = updateUser(id, username || user.username, role || user.role);

    // NOTA: Si arriva a questo punto solo se tutte le informazioni del nuovo utente
    // sono valide e l'utente è stato aggiornato.
    // Inviare una risposta HTTP "No Content".
    res.status(204).type("json").send(updatedUser);
  };

  static deleteUser = async (req, res, next) => {
    // Get  ID da URL.
    const id = req.params.id;

    deleteUser(id);

    // NOTA: Si arriva qui solo se si è trovato un utente con l'ID richiesto e lo si è cancellato.
    // cancellato.
    // Inviare una risposta HTTP "No Content".
    res.status(204).type("json").send();
  };
}

export default UserController;
