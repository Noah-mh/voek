import express, { NextFunction, Request, Response } from "express";
import config from "config";
import log from "./logger";
import routes from "./routes/Routes";
import dmRoomRoutes from "./routes/dmRoom.routes";
import chatMessageRoutes from "./routes/chatMessage.routes";
import cors from "cors";
import cookieParser from "cookie-parser";
import * as bodyParser from "body-parser";
import credientals from "./middlewares/credentials";
import corsOptions from "../config/corsOptions";

import http, { Server } from "http";
import io from "../src/websocket/io";

const port: number = config.get("port");
const host: string = config.get("host");

const app = express();
const router = express.Router();

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(credientals);
app.use(cors(corsOptions));

app.use(
  cors({
    origin: true,
    optionsSuccessStatus: 200,
    credentials: true,
  })
);
app.use(router);

routes(app, router);
dmRoomRoutes(app, router);
chatMessageRoutes(app, router);

const server: Server = http.createServer(app);
io(server, process.env.PORT || port);

app.use(
  (error: Error, req: Request, res: Response, next: NextFunction) => {
    console.log(error);
    res.status(500).json(error.message);
  }
);

server.listen(process.env.PORT || port, () => {
  console.log(
    `Server is listening on port ${process.env.PORT || port}`
  );
});
