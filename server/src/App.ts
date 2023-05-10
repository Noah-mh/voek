import express, { NextFunction, Request, Response } from "express";
import config from "config";
import log from "./logger";
import routes from "./Routes";
import cors from "cors";

const port: number = config.get("port");
const host: string = config.get("host");

const app = express();
const router = express.Router();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: true,
    optionsSuccessStatus: 200,
    credentials: true,
  })
);
app.use(router);

routes(app, router);

app.use(
  (error: Error, req: Request, res: Response, next: NextFunction) => {
    console.log(error);
    res.status(500).json(error.message);
  }
);

app.listen(port, host, () => {
  log.info(`Server is listening on http://${host}:${port}`);
});
