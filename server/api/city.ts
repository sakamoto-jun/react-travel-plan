import express from "express";
import { citiesDB, countriesDB, placesDB } from "../db";
import type { City, Country, Place } from "../types";

interface CitiesWithCountry extends City {
  country: Country | null; // 국가 정보 추가 (없으면 null)
}

type CityFieldQuery = { name: RegExp } | { countryCode: RegExp };

interface CityOrQuery {
  $or: CityFieldQuery[];
}

// city 라우터 생성
const cityRouter = express.Router();

// 도시 리스트
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

// 도시 등록
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

// 도시 검색
cityRouter.get("/search", (req, res) => {
  const { query } = req.query as { query?: string };

  if (query && typeof query !== "string") {
    return res.status(400).send("Invalid query");
  }

  if (!query) {
    return res.send([]);
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

// 도시 데이터
cityRouter.get("/:cityCode", (req, res) => {
  citiesDB.findOne(
    { code: req.params.cityCode.toLowerCase() },
    (err: Error | null, city: City | null) => {
      if (err) return res.status(500).send(err);
      if (!city) return res.status(404).send({ message: "City not found" });

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

// 장소 리스트
cityRouter.get("/:cityCode/places", (req, res) => {
  const cityCode = req.params.cityCode.toLowerCase();
  const { category, q } = req.query as {
    category?: Place["category"] | Place["category"][];
    q?: string;
  };

  if (typeof cityCode !== "string") {
    return res.status(400).send({ message: "Invalid city code" });
  }
  if (category) {
    const isString = typeof category === "string";
    const isStringArray =
      Array.isArray(category) && category.every((c) => typeof c === "string");

    if (!isString && !isStringArray) {
      return res.status(400).send({ message: "Invalid category" });
    }
  }
  if (q && typeof q !== "string") {
    return res.status(400).send({ message: "Invalid query" });
  }

  const placesQuery = {
    cityCode,
    ...(category
      ? { category: { $in: Array.isArray(category) ? category : [category] } }
      : {}),
    ...(q ? { name: new RegExp(q, "i") } : {}),
  }; // undefined 조건 제거

  placesDB.find(placesQuery, (err: Error | null, places: Place[] | null) => {
    if (err) return res.status(500).send(err);
    if (!places) return res.status(400).send({ message: "Place not found" });

    return res.send(places);
  });
});

// 장소 등록
cityRouter.post("/:cityCode/places", (req, res) => {
  const place = req.body as Place;
  const cityCode = req.params.cityCode.toLowerCase();

  placesDB.insert(
    { ...place, cityCode },
    (err: Error | null, newPlace: Place) => {
      if (err) {
        return res.status(500).send(err);
      }

      return res.send(newPlace);
    }
  );
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
