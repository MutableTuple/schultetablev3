import React from "react";

export default function Nationality({
  countries,
  setNationality,
  nationality,
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">Nationality</label>
      <select
        className="select select-bordered w-full"
        value={nationality}
        onChange={(e) => setNationality(e.target.value)}
      >
        <option value="">Select Country</option>
        {countries.map((country) => (
          <option key={country} value={country}>
            {country}
          </option>
        ))}
      </select>
    </div>
  );
}
