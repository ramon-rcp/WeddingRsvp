import express, { Express } from "express";
import bodyParser from 'body-parser';
import { load, names, save, values } from "./routes";


// Configure and start the HTTP server.
const port: number = 8088;
const app: Express = express();
app.use(bodyParser.json());
app.post("/api/save", save);
app.get("/api/load", load);
app.get("/api/names", names);
app.get("/api/values", values);
app.listen(port, () => console.log(`Server listening on ${port}`));
