import express from "express";
import DataStore from "nedb";
import type { City } from "../types";

// DB 설정
const db = new DataStore({
  filename: "data/cities.db",
  autoload: true,
});

// city 라우터 생성
const cityRouter = express.Router();

cityRouter.get("/", (_req, res) => {
  db.find({}, (err: Error | null, docs: City[]) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send(docs);
    }
  });
});

cityRouter.get("/:city", (req, res) => {
  db.findOne(
    { city: req.params.city.toLowerCase() },
    (err: Error | null, doc: City | null) => {
      if (err) {
        return res.status(500).send(err);
      }
      if (!doc) {
        return res.status(404).send({ message: "City not found" });
      }
      res.send(doc);
    }
  );
});

cityRouter.post("/", (req, res) => {
  const city = {
    city: req.body.city.toLowerCase(),
    name: req.body.name,
    description: req.body.description,
  } as City;

  db.insert(city, (err: Error | null, newDoc: City) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send(newDoc);
    }
  });
});

export default cityRouter;
