// run `node index.js` in the terminal
import express from 'express';
import cors from "cors";
import { errorHandler } from './middleware/errorHandler.js';
import config from './config/config.js';

const app = express();

// Add error handling as the last middleware, just prior to our app.listen call.
// This ensures that all errors are always handled.
app.use(errorHandler);

app.use(cors());
// Analizza i corpi delle richieste JSON
app.use(express.json());
// app.listen...
app.listen(config.port, config.host, () => {
  console.log(`Server in esecuzione su ${config.host}:${config.port}`);
});
