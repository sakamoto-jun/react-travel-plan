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

## 13. 시차 계산 로직 개선 (UTC Offset → 한국 기준 변환)

- **문제**: 기존에는 `city.timezoneOffset`을 그대로 출력해서 `UTC 기준 오프셋`만 보여줬음.

  → 서울(9)과 부산(9)이 동일해도 "없음" 처리가 안 되고, 뉴욕(-5)도 실제 한국 대비 -14시간인데 -5시간으로 표시되는 오류 발생.

- **해결**: 한국 표준시(UTC+9)를 기준으로 차이를 계산하는 `getTimeDiff` 헬퍼 함수를 도입.

  → 도시별 `timezoneOffset`에서 `9`를 빼고, 양수/음수에 따라 `+n시간 / -n시간`을 출력.

  → 동일한 오프셋일 경우 `"없음"` 처리.

**Before**

```ts
<p className="text-gray800 font-medium">
  {city.timezoneOffset === 0 ? "없음" : `${city.timezoneOffset}시간`}
</p>
```

**After**

```ts
// 헬퍼 함수
const getTimeDiff = (cityOffset: number) => {
  const koreaOffset = 9; // UTC+9
  const diff = cityOffset - koreaOffset;

  if (diff === 0) return "없음";
  return diff > 0 ? `+${diff}시간` : `${diff}시간`;
};
```

```tsx
<p className="text-gray800 font-medium">{getTimeDiff(city.timezoneOffset)}</p>
```

> ✅ 이제 서울/부산은 `"없음"`, 파리는 `-8시간`, 뉴욕은 `-14시간`, 시드니는 `+1시간`으로 정확하게 한국 기준 시차가 표시됨.

---

# 🧭 시도 기록

## 📘 Date Picker 교체 과정

### 1️⃣ 초기 선택: `react-datepicker`

- 이유: `selectsRange`, `locale`, `renderCustomHeader` 등

  범위 선택 및 커스텀 기능이 모두 내장되어 있어 초기 구현 속도가 빠름.

- 문제점:

  `react-datepicker`는 내부 CSS 영향력이 매우 강해, **Tailwind 기반 커스텀 디자인 적용이 까다로움**.

  > ⚠️ 특히 버튼, 캘린더 셀 스타일을 프로젝트 디자인 시스템에 맞게 통일하기 어려움.

### 2️⃣ 전환 시도: `react-day-picker`

- 이유:

  `react-day-picker`는 Headless 구조 기반이라 UI를 완전히 자유롭게 구성할 수 있고, 프로젝트의 커스텀 디자인 시스템과 Tailwind 조합에 적합하다고 판단.

- 시도 내용:

  `DayPicker`의 `range` 모드와 `MonthCaption` 커스텀을 활용해 네비게이션 버튼과 한글 로케일이 적용된 커스텀 달력을 구현함.

```tsx
import LeftArrowIcon from "@/assets/icons/keyboard_arrow_left.svg?react";
import { addDays, format, isAfter, isBefore } from "date-fns";
import { ko } from "date-fns/locale";
import { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import {
  DayPicker,
  useDayPicker,
  type MonthCaptionProps,
} from "react-day-picker";
import "react-day-picker/style.css";
import "./TravelDateSelector.css";

const TravelDateSelector = () => {
  const today = new Date();
  const [from, setFrom] = useState<Date | undefined>();
  const [to, setTo] = useState<Date | undefined>();
  const [hoverDate, setHoverDate] = useState<Date>();

  const handleSelect = (range: { from?: Date; to?: Date } | undefined) => {
    if (!range) {
      setFrom(undefined);
      setTo(undefined);
      return;
    }

    const { from, to } = range;
    setFrom(from);
    setTo(to);
  };

  const isInHoverRange = (day: Date) => {
    if (!from || to || !hoverDate) return false;
    return (
      isAfter(hoverDate, from) && isAfter(day, from) && isBefore(day, hoverDate)
    );
  };

  const disabledDays = { before: today, after: from && addDays(from, 10) };

  return (
    <div className="px-26 py-36 rounded-16 border-2 border-gray200 bg-bg2">
      <DayPicker
        mode="range"
        numberOfMonths={2}
        locale={ko}
        selected={{ from, to }}
        onSelect={handleSelect}
        disabled={disabledDays}
        onDayMouseEnter={setHoverDate}
        onDayMouseLeave={() => setHoverDate(undefined)}
        modifiers={{
          hoverRange: isInHoverRange,
        }}
        modifiersClassNames={{
          hoverRange: "rdp-hover-range_middle",
        }}
        hideNavigation
        max={10}
        components={{
          MonthCaption: CustomMonthCaption,
        }}
      />
    </div>
  );
};

const CustomMonthCaption = ({
  calendarMonth,
  displayIndex,
  ...divProps
}: MonthCaptionProps) => {
  const { goToMonth, previousMonth, nextMonth } = useDayPicker();

  return (
    <div {...divProps} className="flex justify-between items-center mb-16">
      <button
        type="button"
        aria-label="Previous month"
        className={displayIndex === 1 ? "invisible" : ""}
        onClick={() => previousMonth && goToMonth(previousMonth)}
      >
        <LeftArrowIcon />
      </button>
      <span className="text-20 font-bold leading-[24px] tracking-[0.38px]">
        {format(calendarMonth.date, "yyyy년 M월", { locale: ko })}
      </span>
      <button
        type="button"
        aria-label="Next month"
        className={displayIndex === 0 ? "invisible" : ""}
        onClick={() => nextMonth && goToMonth(nextMonth)}
      >
        <LeftArrowIcon className="scale-x-[-1]" />
      </button>
    </div>
  );
};
```

### 3️⃣ 문제점 (Hover 구간 처리 한계)

- 의도:

  시작일 클릭 후 → 마감일 선택 전까지 마우스 hover로 “예비 구간(range preview)”을 시각적으로 표시하려고 함.

- 시도 방식:

  `modifiers`와 `modifiersClassNames`를 활용해 `isInHoverRange()` 함수를 작성, hover 상태일 때 `rdp-hover-range_middle` 클래스 추가를 시도.

- 결과:

  `react-day-picker` 내부의 `range_middle` 로직과 충돌하여 hover 중간 날짜 스타일이 렌더링되지 않음. **즉, hover 상태의 예비 구간 강조 미적용.**

  > ⚠️ v9.11.1 기준 공식 문서에서도 hover range preview 관련 API는 제공되지 않음.
  > 따라서 완전한 hover-range UX 구현은 사실상 불가능했음.

### 4️⃣ 결론: 다시 `react-datepicker`로 회귀

- 이유:

  `react-day-picker`는 커스텀 자유도가 높지만, hover-range처럼 기본 UX까지 직접 구현해야 하기에 개발 효율성이 떨어짐.

- 결정:

  유지보수성과 일정 효율을 고려하여 react-datepicker로 복귀. 기본 스타일의 영향이 강하더라도, `hover` `preview`, `range selection`, `locale`, `custom header` 등의 주요 기능이 모두 내장되어 있어 실용적이라 판단함.

  > ✅ 결론적으로, `react-day-picker`는 기술적으로 흥미로운 시도였지만, **현재 기준에서는 react-datepicker의 안정성과 즉시성이 더 적합했다.**
