import React from "react";
import { ChevronDown } from "lucide-react";

export default function Nationality({
  countries,
  setNationality,
  nationality,
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-2">
        Nationality
      </label>
      <div className="relative">
        <select
          value={nationality}
          onChange={(e) => setNationality(e.target.value)}
          className="w-full h-11 rounded-2xl border border-input bg-background pl-4 pr-10 text-sm text-foreground appearance-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:border-ring"
        >
          <option value="">Select Country</option>
          {countries.map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>
        <ChevronDown
          size={16}
          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
      </div>
    </div>
  );
}
