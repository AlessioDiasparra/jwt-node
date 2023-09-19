import bcrypt from "bcrypt";
import { NotFoundError } from "../exceptions/notFoundError.js";
import { ClientError } from "../exceptions/clientError.js";

// Our API supports both an admin and regular user, as defined by a role.
export let Roles;
(function (Roles) {
  Roles["ADMIN"] = "ADMIN";
  Roles["USER"] = "USER";
})(Roles || (Roles = {}));

// Let's initialize our example API with some user records.
// NOTE: We generate passwords using the Node.js CLI with this command:
// "await require('bcrypt').hash('PASSWORD_TO_HASH', 12)"
let users = {
  "0": {
    id: "0",
    username: "testuser1",
    // Plaintext password: testuser1_password
    password: "testuser1_password",
    role: Roles.USER
  },
  "1": {
    id: "1",
    username: "testuser2",
    // Plaintext password: testuser2_password
    password: "$2b$12$63l0Br1wIniFBFUnHaoeW.55yh8.a3QcpCy7hYt9sfaIDg.rnTAPC",
    role: Roles.USER
  },
  "2": {
    id: "2",
    username: "testuser3",
    // Plaintext password: testuser3_password
    password: "$2b$12$fTu/nKtkTsNO91tM7wd5yO6LyY1HpyMlmVUE9SM97IBg8eLMqw4mu",
    role: Roles.USER
  },
  "3": {
    id: "3",
    username: "testadmin1",
    // Plaintext password: testadmin1_password
    password: "$2b$12$tuzkBzJWCEqN1DemuFjRuuEs4z3z2a3S5K0fRukob/E959dPYLE3i",
    role: Roles.ADMIN
  },
  "4": {
    id: "4",
    username: "testadmin2",
    // Plaintext password: testadmin2_password
    password: "$2b$12$.dN3BgEeR0YdWMFv4z0pZOXOWfQUijnncXGz.3YOycHSAECzXQLdq",
    role: Roles.ADMIN
  }
};

let nextUserId = Object.keys(users).length;

// NOTE: Validation errors are handled directly within these functions.

// Generate a copy of the users without their passwords.
const generateSafeCopy = user => {
  let _user = { ...user };
  delete _user.password;
  return _user;
};

// Recover a user if present.
export const getUser = id => {
  if (!(id in users)) throw new NotFoundError(`User with ID ${id} not found`);
  return generateSafeCopy(users[id]);
};

// Recover a user based on username if present, using the username as the query.
export const getUserByUsername = username => {
  const possibleUsers = Object.values(users).filter(user => user.username === username);
  // Undefined if no user exists with that username.
  if (possibleUsers.length == 0) return undefined;
  return generateSafeCopy(possibleUsers[0]);
};

export const getAllUsers = () => {
  return Object.values(users).map(elem => generateSafeCopy(elem));
};

export const createUser = async (username, password, role) => {
  username = username.trim();
  password = password.trim();

  // Reader: Add checks according to your custom use case.
  if (username.length === 0) throw new ClientError("Invalid username");
  else if (password.length === 0) throw new ClientError("Invalid password");
  // Check for duplicates.
  if (getUserByUsername(username) != undefined) throw new ClientError("Username is taken");

  // Generate a user id.
  const id = nextUserId.toString();
  nextUserId++;
  // Create the user.
  users[id] = {
    username,
    password: await bcrypt.hash(password, 12),
    role,
    id
  };
  return generateSafeCopy(users[id]);
};

export const updateUser = (id, username, role) => {
  // Check that user exists.
  if (!(id in users)) throw new NotFoundError(`User with ID ${id} not found`);

  // Reader: Add checks according to your custom use case.
  if (username.trim().length === 0) throw new ClientError("Invalid username");
  username = username.trim();
  const userIdWithUsername = getUserByUsername(username)?.id;
  if (userIdWithUsername !== undefined && userIdWithUsername !== id)
    throw new ClientError("Username is taken");

  // Apply the changes.
  users[id].username = username;
  users[id].role = role;
  return generateSafeCopy(users[id]);
};

export const deleteUser = id => {
  if (!(id in users)) throw new NotFoundError(`User with ID ${id} not found`);
  delete users[id];
};

export const isPasswordCorrect = async (id, password) => {
  if (!(id in users)) throw new NotFoundError(`User with ID ${id} not found`);
  return await bcrypt.compare(password, users[id].password);
};

export const changePassword = async (id, password) => {
  if (!(id in users)) throw new NotFoundError(`User with ID ${id} not found`);

  password = password.trim();
  // Reader: Add checks according to your custom use case.
  if (password.length === 0) throw new ClientError("Invalid password");

  // Store encrypted password.
  users[id].password = await bcrypt.hash(password, 12);
};
