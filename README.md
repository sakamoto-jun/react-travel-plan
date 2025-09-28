# ✅ 개선 사항

## 1. 날짜 선택 로직 보완

- **문제**: 사용자가 날짜를 선택하지 않고 `null`을 전달하는 경우 상태 불일치 가능성 발생.
- **해결**: `if (!date)` 조건문으로 `null` 감지 → 해당 날짜 및 관련 상태 초기화.

```ts
setStartDate: (date) => {
  if (!date) {
    set({ startDate: null, endDate: null }); // 시작일 초기화 시 도착일도 리셋
    return;
  }
  set({ startDate: date });
},

setEndDate: (date) => {
  if (!date) {
    set({ endDate: null }); // 도착일만 초기화
    return;
  }
  ...
}
```

## 2. 도착 날짜 유효성 검증

- **문제**: `endDate < startDate` 상황 발생 시, 잘못된 범위가 저장됨.
- **해결**: `set` 함수에 콜백(`state`)을 사용하여 최신 상태를 보장하고, 유효성 검사 추가.

```ts
setEndDate: (date) => {
  if (!date) {
    set({ endDate: null });
    return;
  }
  set((state) => {
    if (state.startDate && date < state.startDate) {
      return { endDate: null }; // 잘못된 범위 방지
    }
    return { endDate: date };
  });
};
```

## 3. `req.body`에서 `_id` 제거

- **문제**: 클라이언트가 `_id`를 강제로 보내면 DB에 그대로 저장될 수 있음.
- **해결**: 구조 분해 시, `_id`로 제외하고 나머지(`rest`)만 사용.

```ts
const { _id, ...rest } = req.body;
```

## 4. `code` 필드 소문자 처리

- **문제**: 도시 코드(`code`)가 대소문자 혼용되면 조회/검색 시 충돌 발생 가능.
- **해결**: DB 저장 시, 무조건 소문자 처리.

**Before**

```ts
const city = req.body as City;
```

**After**

```ts
const city = {
  ...rest,
  code: req.body.code.toLowerCase(),
} as City;
```

## 5. Validation 체크(필수 필드 검사)

- **문제**: `code` 같은 핵심 필수 필드가 누락될 경우에 에러 발생 가능.
- **해결**: `if` 조건문으로 존재 여부를 체크하여 없을 시 요청 차단.

```ts
if (!req.body.code) {
  return res.status(400).send("code is required");
}
```

## 6. `country` 코드 대문자 강제 처리

- **문제**: `city.countryCode`에 소문자(`"kr"`, `"jp"`)가 들어가면 `CountriesDB` 조회 실패 가능.
- **해결**: city 데이터 생성 시, `countryCode`를 무조건 대문자로 변환하여 저장.

**Before**

```ts
const city = {
  ...rest,
  code: code.toLowerCase(),
} as City;
```

**After**

```ts
const city = {
  ...rest,
  code: code.toLowerCase(), // 도시 코드는 소문자
  countryCode: countryCode.toUpperCase(), // 국가 코드는 대문자
} as City;
```

## 7. 파라미터 정규화 (조회 일관성 확보)

- **문제**: 도시 코드를 URL 파라미터로 받을 때, 대소문자 입력 혼용 가능(`Seoul`, `SEOUL`, `seoul`).
- **해결**: DB 저장 시, 도시 코드는 소문자로 강제, 조회 시 `toLowerCase()`를 적용하여 일관성 유지.

```ts
citiesDB.findOne(
  { code: req.params.cityCode.toLowerCase() },
  ...
);
```

## 8. 국가 매칭 성능 개선 (O(n × m) → O(n))

- **문제**: 기존에는 `cities.map` 안에서 `countries.find`를 매번 호출 → 도시 수 × 국가 수 만큼 반복(O(n × m)) 발생.
- **해결**: `Object.fromEntries`로 국가 코드를 키로 하는 해시맵(`countryMap`)을 생성 → O(1)로 매칭.

> ✅ “매번 메뉴판을 다 뒤지는 대신, 단축번호로 바로 찾게 최적화” 같은 느낌

**Before**

```ts
const citiesWithCountry = cities.map((city) => {
  const country = countries.find(
    (country) => country.code === city.countryCode
  );
  return { ...city, country: country ?? null };
});
```

**After**

```ts
const countryMap = Object.fromEntries(countries.map((c) => [c.code, c]));
const citiesWithCountry = cities.map((city) => ({
  ...city,
  country: countryMap[city.countryCode] ?? null,
}));
```

## 9. `country` vs `countryCode` 구분

- **문제**: `City` 타입에서 `country` 필드명이 실제로는 `Country["code"]`인데, 이름만 보면 객체처럼 오해할 여지가 있었음.
- **해결**: `City` 타입을 수정 → `countryCode` 으로 명확하게 정의.

**Before**

```ts
export interface City {
  ...
  country: Country["code"]; // 국가 코드지만 필드명 혼동 가능
}
```

**After**

```ts
export interface City {
  ...
  countryCode: Country["code"]; // 명확하게 코드라는걸 나타냄
}
```

## 10. 가공된 타입 분리 (`CitiesWithCountry`)

- **문제**: DB 원본 `City` 타입과 API 응답용으로 조인된 `City`+`Country` 타입이 혼재 → 공통 타입 혼동 가능성.
- **해결**: 원본은 `City`, 응답은 `CitiesWithCountry`로 분리 정의.

```ts
interface CitiesWithCountry extends City {
  country: Country | null; // 국가 정보 추가 (없으면 null)
}

const citiesWithCountry: CitiesWithCountry[] = cities.map((city) => {
  return {
    ...city,
    country: countryMap[city.countryCode] ?? null, // 국가 정보 추가 (없으면 null)
  };
});
```

## 11. `/search` 라우터 방어 처리 및 조건 분리

- **문제**: 국가 검색 시, `searchCountires` 배열이 비어 있으면 잘못된 정규식이 생성되거나 `$or` 조건에 `null`이 들어갈 위험이 존재.
- **해결**:
  - `searchCountires.length > 0` 조건을 먼저 확인하고, 정규식이 없으면 `null` 처리.
  - `cityQuery`를 기본값으로 `{ name: new RegExp(query, "i") }`만 세팅한 뒤, 국가 조건이 존재할 때만 `$or`에 `push`로 검색 범위 확장.

### `cityQuery`용 타입 정의

```ts
type CityFieldQuery = { name: RegExp } | { countryCode: RegExp };

interface CityOrQuery {
  $or: CityFieldQuery[];
}
```

### 코드 처리

**Before**

```ts
const searchCountires = countries.filter((c) =>
  c.name.match(new RegExp(query, "i"))
);

const countriesCodeRegex = new RegExp(
  searchCountires.map((country) => country.code).join("|"),
  "i"
);

const cityQuery =
  searchCountires.length > 0
    ? {
        $or: [
          { name: new RegExp(query, "i") },
          { countryCode: countriesCodeRegex },
        ],
      }
    : { name: new RegExp(query, "i") };
```

**After**

```ts
const searchCountires = countries.filter((c) =>
  c.name.match(new RegExp(query, "i"))
);

const countriesCodeRegex =
  searchCountires.length > 0
    ? new RegExp(searchCountires.map((country) => country.code).join("|"), "i")
    : null;

const cityQuery: CityOrQuery = {
  $or: [{ name: new RegExp(query, "i") }],
};

if (countriesCodeRegex) {
  cityQuery.$or.push({ countryCode: countriesCodeRegex });
}
```

> ✅ 이로써 도시명 검색은 항상 동작하고, 국가 검색은 안전하게 선택적으로 추가.

## 12. 국가 매핑 로직 유틸 함수화 (`attachCountryToCities`)

- **문제**: `/` 라우터와 `/search` 라우터에서 도시와 국가 매칭 로직이 중복 작성됨.
- **해결**: 공통 로직을 `attachCountryToCities`라는 유틸 함수로 분리하여 재사용.

```ts
function attachCountryToCities(
  cities: City[],
  countries: Country[]
): CitiesWithCountry[] {
  const countryMap = Object.fromEntries(
    countries.map((country) => [country.code, country])
  );
  return cities.map((city) => ({
    ...city,
    country: countryMap[city.countryCode] ?? null,
  }));
}
```

> ✅ 코드 중복 제거 + 응답 구조 일관성 보장 (`CitiesWithCountry[]`)
