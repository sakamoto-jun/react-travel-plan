import express from "express";
import { citiesDB, countriesDB } from "../db";
import type { City, Country } from "../types";

interface CitiesWithCountry extends City {
  country: Country | null; // 국가 정보 추가 (없으면 null)
}

type CityFieldQuery = { name: RegExp } | { countryCode: RegExp };

interface CityOrQuery {
  $or: CityFieldQuery[];
}

// city 라우터 생성
const cityRouter = express.Router();

cityRouter.get("/", (_req, res) => {
  citiesDB.find({}, (err: Error | null, cities: City[]) => {
    if (err) return res.status(500).send(err);

    countriesDB.find({}, (err: Error | null, countries: Country[]) => {
      if (err) {
        return res.status(500).send(err);
      }
      if (countries.length === 0) {
        return res.status(404).send({ message: "Country not found" });
      }

      const citiesWithCountry = attachCountryToCities(cities, countries);

      return res.send(citiesWithCountry);
    });
  });
});

cityRouter.get("/search", (req, res) => {
  const { query } = req.query;

  if (typeof query !== "string") {
    return res.status(400).send("Invalid query");
  }

  countriesDB.find({}, (err: Error | null, countries: Country[]) => {
    if (err) return res.status(500).send(err);

    const searchCountires = countries.filter((c) =>
      c.name.match(new RegExp(query, "i"))
    ); // 전체 Country 데이터 중에서 검색 키워드(query)에 매칭되는 국가만 필터링.

    const countriesCodeRegex =
      searchCountires.length > 0
        ? new RegExp(
            searchCountires.map((country) => country.code).join("|"),
            "i"
          )
        : null;

    const cityQuery: CityOrQuery = {
      $or: [{ name: new RegExp(query, "i") }],
    }; // countriesCodeRegex가 없을 경우에도 기본적으로 도시명 검색은 가능.

    if (countriesCodeRegex) {
      cityQuery.$or.push({ countryCode: countriesCodeRegex });
    } // countriesCodeRegex 있을 때 즉, 국가명이 매칭 된 경우에 $or에 조건을 추가하여 검색 범위를 확장.

    citiesDB.find(cityQuery, (err: Error | null, cities: City[]) => {
      if (err) return res.status(500).send(err);

      const citiesWithCountry = attachCountryToCities(cities, countries);

      return res.send(citiesWithCountry);
    });
  });
});

cityRouter.get("/:cityCode", (req, res) => {
  citiesDB.findOne(
    { code: req.params.cityCode.toLowerCase() },
    (err: Error | null, city: City | null) => {
      if (err) {
        return res.status(500).send(err);
      }
      if (!city) {
        return res.status(404).send({ message: "City not found" });
      }

      countriesDB.findOne(
        { code: city.countryCode },
        (err: Error | null, country: Country | null) => {
          if (err) {
            return res.status(500).send(err);
          }
          return res.send({ ...city, country: country ?? null }); // 국가 정보 추가 (없으면 null)
        }
      );
    }
  );
});

cityRouter.post("/", (req, res) => {
  const { _id, code, countryCode, ...rest } = req.body;

  if (!code) {
    return res.status(400).send({ message: "City code is required" });
  }
  if (!countryCode) {
    return res.status(400).send({ message: "Country code is required" });
  }

  const city = {
    ...rest,
    code: code.toLowerCase(),
    countryCode: countryCode.toUpperCase(),
  } as City;

  citiesDB.insert(city, (err: Error | null, newCity: City) => {
    if (err) {
      return res.status(500).send(err);
    }

    return res.send(newCity);
  });
});

// 유틸 함수
function attachCountryToCities(
  cities: City[],
  countries: Country[]
): CitiesWithCountry[] {
  const countryMap = Object.fromEntries(
    countries.map((country) => [country.code, country])
  ); // 국가 코드를 키로 하는 맵 생성

  return cities.map((city) => {
    return {
      ...city,
      country: countryMap[city.countryCode] ?? null,
    };
  });
}

export default cityRouter;
