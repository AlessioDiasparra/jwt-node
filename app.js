// run `node index.js` in the terminal
import express from 'express';
import cors from "cors";
import { errorHandler } from './middleware/errorHandler.js';
import config from './config/config.js';
import routes from './routes/index.js';
import * as dotenv from "dotenv";

//configurazione variabili d'ambiente
dotenv.config();
const app = express();

// Add error handling as the last middleware, just prior to our app.listen call.
// This ensures that all errors are always handled.
app.use(errorHandler);
app.use(express.json());


//monta le rotte
app.use('/' + config.prefix, routes);

app.get("/", async function (req, res) {
  res.json({ message: "server in esecuzione" });
});

// app.listen...
app.listen(config.port, config.host, () => {
  console.log(`Server in esecuzione su ${config.host}:${config.port}`);
});
