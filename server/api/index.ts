import express from "express";
import cityRouter from "./city";
import countryRouter from "./country";

// api 라우터 생성
const apiRouter = express.Router();

// city 라우터 연결
apiRouter.use("/cities", cityRouter);
apiRouter.use("/countries", countryRouter);

export default apiRouter;
