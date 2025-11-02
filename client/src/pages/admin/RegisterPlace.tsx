import { useRef } from "react";
import { useSearchParams } from "react-router-dom";

const RegisterPlace = () => {
  const [searchParams] = useSearchParams();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const registerPlace = async () => {
    const cityCode = searchParams.get("cityCode");
    const rawText = textareaRef.current?.value;

    if (!cityCode) {
      alert("cityCode가 없습니다.");
      return;
    }

    if (!rawText) {
      alert("데이터를 입력해주세요.");
      return;
    }

    let places = [];

    try {
      places = JSON.parse(rawText); // JSON 문자열을 배열로 변환

      if (!Array.isArray(places)) {
        alert("JSON 배열 형태로 입력해주세요.");
        return;
      }
    } catch (error) {
      alert("JSON 형식이 올바르지 않습니다.");
      console.error(error);
      return;
    }

    for (const place of places) {
      try {
        const res = await fetch(`/api/cities/${cityCode}/places`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(place),
        });

        if (!res.ok) {
          console.error(`❌ Failed: ${place.name}`);
        } else {
          console.log(`✅ Registered: ${place.name}`);
        }
      } catch (error) {
        console.error(`❌ Error registering ${place.name}:`, error);
      }
    }

    alert(`✅ ${places.length}개의 장소가 등록되었습니다!`);
    textareaRef.current!.value = "";
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <textarea
        ref={textareaRef}
        style={{ width: "600px", height: "400px" }}
        placeholder="여기에 JSON 배열을 붙여넣으세요."
      />
      <button onClick={registerPlace}>등록</button>
    </div>
  );
};

export default RegisterPlace;
