import { useRef } from "react";

const RegisterCity = () => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const registerCity = async () => {
    const city = textareaRef.current?.value;

    if (!city) return;

    try {
      const res = await fetch("/api/cities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: city,
      });

      if (res.ok) {
        alert("City registered successfully!");
        textareaRef.current!.value = "";
      } else {
        alert("Failed to register city.");
      }
    } catch (error) {
      console.error("Error registering city:", error);
    }
  };

  return (
    <div>
      <div>
        <textarea ref={textareaRef} />
      </div>
      <button onClick={registerCity}>등록</button>
    </div>
  );
};

export default RegisterCity;
