import express from "express";
import cityRouter from "./city";

// api 라우터 생성
const apiRouter = express.Router();

// city 라우터 연결
apiRouter.use("/cities", cityRouter);

export default apiRouter;
