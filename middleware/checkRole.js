import { getUser } from '../state/users.js';

export const checkRole = (roles) => {
  return async (req, res, next) => {
    // Trova l'utente nel database.
    const user = getUser(req.token.payload.userId);

    if (!user) {
      res
        .status(404)
        .type('json')
        .send(JSON.stringify({ message: 'User not found' }));
      return;
    }

    // Check if array of authorized roles includes the user's role.
    if (roles.indexOf(user.role) > -1) next();
    else {
      res
        .status(403)
        .type('json')
        .send(JSON.stringify({ message: 'Not enough permissions' }));
      return;
    }
  };
};
