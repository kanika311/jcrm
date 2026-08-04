"use client";

import { useEffect, useState } from "react";
import { Country, State, City, ICountry, IState, ICity } from "country-state-city";

interface LocationSelectorProps {
  country: string;
  state: string;
  city: string;
  pincode: string;
  onCountryChange: (val: string) => void;
  onStateChange: (val: string) => void;
  onCityChange: (val: string) => void;
  onPincodeChange: (val: string) => void;
}

export default function LocationSelector({
  country,
  state,
  city,
  pincode,
  onCountryChange,
  onStateChange,
  onCityChange,
  onPincodeChange
}: LocationSelectorProps) {
  const [countries, setCountries] = useState<ICountry[]>([]);
  const [states, setStates] = useState<IState[]>([]);
  const [cities, setCities] = useState<ICity[]>([]);

  useEffect(() => {
    setCountries(Country.getAllCountries());
  }, []);

  useEffect(() => {
    if (country) {
      setStates(State.getStatesOfCountry(country));
    } else {
      setStates([]);
    }
  }, [country]);

  useEffect(() => {
    if (country && state) {
      setCities(City.getCitiesOfState(country, state));
    } else {
      setCities([]);
    }
  }, [country, state]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Country</label>
          <select 
            value={country} 
            onChange={e => { onCountryChange(e.target.value); onStateChange(""); onCityChange(""); }}
            className="input-premium w-full px-4 py-3 rounded-xl appearance-none bg-transparent"
          >
            <option value="" disabled>Select Country</option>
            {countries.map(c => (
              <option key={c.isoCode} value={c.isoCode}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">State / Province</label>
          <select 
            value={state} 
            onChange={e => { onStateChange(e.target.value); onCityChange(""); }}
            className="input-premium w-full px-4 py-3 rounded-xl appearance-none bg-transparent"
            disabled={!country}
          >
            <option value="" disabled>{country ? "Select State" : "Select Country First"}</option>
            {states.map(s => (
              <option key={s.isoCode} value={s.isoCode}>{s.name}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">City</label>
          <select 
            value={city} 
            onChange={e => onCityChange(e.target.value)}
            className="input-premium w-full px-4 py-3 rounded-xl appearance-none bg-transparent"
            disabled={!state}
          >
            <option value="" disabled>{state ? "Select City" : "Select State First"}</option>
            {cities.map(c => (
              <option key={c.name} value={c.name}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Pincode / Zip Code</label>
          <input 
            type="text" 
            value={pincode} 
            onChange={e => onPincodeChange(e.target.value)} 
            className="input-premium w-full px-4 py-3 rounded-xl" 
            placeholder="e.g. 110001" 
          />
        </div>
      </div>
    </div>
  );
}
