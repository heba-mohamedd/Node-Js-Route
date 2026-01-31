import { Router } from "express";
import * as LOGS from "./logs.service.js";
const logRouter = Router();

logRouter.post("/", LOGS.insertLogs);

export default logRouter;
