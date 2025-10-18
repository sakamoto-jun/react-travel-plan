import { setDefaultOptions } from "date-fns";
import { ko } from "date-fns/locale";
import { registerLocale, setDefaultLocale } from "react-datepicker";

// ✅ date-fns 내부 함수들 (format, parse 등) 기본 로케일 설정
setDefaultOptions({ locale: ko });

// ✅ react-datepicker에 한국어 로케일 등록
registerLocale("ko", ko);

// ✅ react-datepicker의 기본 로케일을 'ko'로 지정
setDefaultLocale("ko");
