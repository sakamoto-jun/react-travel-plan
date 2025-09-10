import express from "express";
import apiRouter from "./api";

async function startServer() {
  const app = express();
  const port = 3000;

  // JSON 파싱
  app.use(express.json());

  // API 라우터 연결
  app.use("/api", apiRouter);

  app.get("/", (_req, res) => {
    return res.send("Hello World!");
  });

  return app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
}

const server = await startServer();

if (import.meta.hot) {
  import.meta.hot.dispose(() => server.close());
}
