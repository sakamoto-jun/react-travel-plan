import type { FormEvent } from "react";

const RegisterCity = () => {
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const city = {
      city: (formData.get("city") ?? "") as string,
      name: (formData.get("name") ?? "") as string,
      description: (formData.get("description") ?? "") as string,
    };

    if (!city.city || !city.name || !city.description) return;

    try {
      const res = await fetch("/api/cities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(city),
      });

      if (res.ok) {
        alert("City registered successfully!");
        e.currentTarget.reset();
      } else {
        alert("Failed to register city.");
      }
    } catch (error) {
      console.error("Error registering city:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        City Name:
        <input type="text" name="city" />
      </label>
      <label>
        Name:
        <input type="text" name="name" />
      </label>
      <label>
        Description:
        <input type="text" name="description" />
      </label>
      <button type="submit">Register City</button>
    </form>
  );
};

export default RegisterCity;
