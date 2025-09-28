import express from "express";
import { countriesDB } from "../db";
import type { Country } from "../types";

// country 라우터 생성
const countryRouter = express.Router();

countryRouter.get("/", (_req, res) => {
  countriesDB.find({}, (err: Error | null, docs: Country[]) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send(docs);
    }
  });
});

countryRouter.post("/", (req, res) => {
  const country = {
    ...req.body,
    code: req.body.code.toUpperCase(),
  } as Country;

  countriesDB.insert(country, (err: Error | null, newDoc: Country) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send(newDoc);
    }
  });
});

export default countryRouter;
