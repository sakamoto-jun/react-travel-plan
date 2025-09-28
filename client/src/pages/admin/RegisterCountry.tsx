import { useRef } from "react";

const RegisterCountry = () => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const registerCountry = async () => {
    const country = textareaRef.current?.value;

    if (!country) return;

    try {
      const res = await fetch("/api/countries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: country,
      });

      if (res.ok) {
        alert("Country registered successfully!");
        textareaRef.current!.value = "";
      } else {
        alert("Failed to register country.");
      }
    } catch (error) {
      console.error("Error registering country:", error);
    }
  };

  return (
    <div>
      <div>
        <textarea ref={textareaRef} />
      </div>
      <button onClick={registerCountry}>등록</button>
    </div>
  );
};

export default RegisterCountry;
