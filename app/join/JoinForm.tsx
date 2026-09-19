"use client";

import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { createPortal } from "react-dom";

export default function JoinForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    emailAddress: "",
    dateOfBirth: "",
    country: "India",
    state: "Karnataka",
    city: "Udupi",
    pinCode: "",
    department: "AI/ML Engineering",
    skills: "",
    college: "",
    courseMajor: "",
    experienceLevel: "Student (Intern)",
    aboutYourself: "",
    agreeTerms: false
  });

  const [mounted, setMounted] = useState(false);
  const [customCountry, setCustomCountry] = useState("");
  const [customState, setCustomState] = useState("");
  const [customCity, setCustomCity] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedApp, setSubmittedApp] = useState<{ id: string; name: string; dept: string } | null>(null);

  // Modern Calendar Modal State for DOB
  const [showCalendar, setShowCalendar] = useState(false);
  const [calYear, setCalYear] = useState<number>(2003);
  const [calMonth, setCalMonth] = useState<number>(0); // 0-indexed (Jan)

  // -------------------------------------------------------------
  // Comprehensive World & India Country-State-City Data Dictionary
  // -------------------------------------------------------------
  const locationData: Record<string, Record<string, string[]>> = {
    India: {
      Karnataka: ["Udupi", "Bengaluru", "Mangaluru", "Manipal", "Mysuru", "Hubballi-Dharwad", "Belagavi", "Shivamogga", "Davanagere", "Tumakuru", "Kalaburagi", "Ballari", "Kundapura", "Karkala"],
      Maharashtra: ["Mumbai", "Pune", "Nagpur", "Nashik", "Thane", "Navi Mumbai", "Aurangabad", "Solapur", "Kolhapur", "Amravati", "Jalgaon"],
      "Delhi NCR": ["New Delhi", "Noida", "Greater Noida", "Gurugram", "Faridabad", "Ghaziabad"],
      Telangana: ["Hyderabad", "Warangal", "Nizamabad", "Karimnagar", "Khammam", "Ramagundam"],
      "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Tirunelveli", "Erode", "Vellore", "Thoothukudi"],
      Gujarat: ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar", "Gandhinagar", "Anand", "Junagadh"],
      Rajasthan: ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Bikaner", "Ajmer", "Bhilwara", "Alwar", "Sikar"],
      "Uttar Pradesh": ["Lucknow", "Kanpur", "Varanasi", "Agra", "Prayagraj", "Meerut", "Noida", "Ghaziabad", "Bareilly", "Aligarh", "Gorakhpur"],
      "West Bengal": ["Kolkata", "Howrah", "Siliguri", "Durgapur", "Asansol", "Kharagpur", "Bardhaman"],
      Kerala: ["Kochi", "Thiruvananthapuram", "Kozhikode", "Thrissur", "Kollam", "Kannur", "Palakkad", "Alappuzha", "Kottayam"],
      Punjab: ["Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Mohali", "Bathinda", "Hoshiarpur"],
      Haryana: ["Gurugram", "Faridabad", "Panipat", "Ambala", "Karnal", "Rohtak", "Hisar", "Panchkula", "Sonipat"],
      "Madhya Pradesh": ["Bhopal", "Indore", "Gwalior", "Jabalpur", "Ujjain", "Sagar", "Dewas", "Satna"],
      Bihar: ["Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Purnia", "Darbhanga", "Bihar Sharif"],
      "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Tirupati", "Kurnool", "Kakinada", "Rajahmundry"],
      Odisha: ["Bhubaneswar", "Cuttack", "Rourkela", "Berhampur", "Sambalpur", "Puri", "Balasore"],
      Uttarakhand: ["Dehradun", "Haridwar", "Roorkee", "Haldwani", "Rishikesh", "Nainital", "Rudrapur"],
      "Himachal Pradesh": ["Shimla", "Dharamshala", "Solan", "Mandi", "Kullu", "Manali", "Baddi"],
      Jharkhand: ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro", "Deoghar", "Hazaribagh"],
      Chhattisgarh: ["Raipur", "Bhilai", "Bilaspur", "Korba", "Durg", "Rajnandgaon"],
      Assam: ["Guwahati", "Silchar", "Dibrugarh", "Jorhat", "Nagaon"],
      Goa: ["Panaji", "Margao", "Vasco da Gama", "Mapusa", "Ponda"],
      "Jammu & Kashmir": ["Srinagar", "Jammu", "Anantnag", "Baramulla", "Udhampur"],
      Chandigarh: ["Chandigarh"],
      Tripura: ["Agartala"],
      Meghalaya: ["Shillong"],
      Manipur: ["Imphal"],
      Nagaland: ["Kohima", "Dimapur"],
      Puducherry: ["Puducherry"]
    },
    "United States": {
      California: ["San Francisco", "Los Angeles", "San Jose", "San Diego", "Sacramento", "Sunnyvale"],
      "New York": ["New York City", "Buffalo", "Rochester", "Albany", "Syracuse"],
      Texas: ["Austin", "Dallas", "Houston", "San Antonio", "Fort Worth"],
      Washington: ["Seattle", "Bellevue", "Redmond", "Tacoma"],
      Massachusetts: ["Boston", "Cambridge", "Worcester", "Quincy"],
      Illinois: ["Chicago", "Naperville", "Springfield"],
      Florida: ["Miami", "Orlando", "Tampa", "Jacksonville"]
    },
    "United Kingdom": {
      England: ["London", "Manchester", "Birmingham", "Leeds", "Liverpool", "Bristol", "Cambridge", "Oxford"],
      Scotland: ["Edinburgh", "Glasgow", "Aberdeen", "Dundee"],
      Wales: ["Cardiff", "Swansea", "Newport"],
      "Northern Ireland": ["Belfast", "Derry"]
    },
    Canada: {
      Ontario: ["Toronto", "Ottawa", "Mississauga", "Hamilton", "Waterloo"],
      "British Columbia": ["Vancouver", "Victoria", "Surrey", "Burnaby"],
      Quebec: ["Montreal", "Quebec City", "Laval"],
      Alberta: ["Calgary", "Edmonton"]
    },
    Australia: {
      "New South Wales": ["Sydney", "Newcastle", "Wollongong"],
      Victoria: ["Melbourne", "Geelong", "Ballarat"],
      Queensland: ["Brisbane", "Gold Coast", "Sunshine Coast"],
      "Western Australia": ["Perth", "Fremantle"]
    },
    "United Arab Emirates": {
      Dubai: ["Dubai Marina", "Downtown Dubai", "Business Bay", "Deira", "Jumeirah"],
      "Abu Dhabi": ["Abu Dhabi City", "Al Ain", "Al Dhafra"],
      Sharjah: ["Sharjah City", "Khor Fakkan"],
      Ajman: ["Ajman City"]
    },
    Germany: {
      Bavaria: ["Munich", "Nuremberg", "Augsburg"],
      Berlin: ["Berlin City"],
      Hesse: ["Frankfurt", "Wiesbaden", "Darmstadt"],
      "North Rhine-Westphalia": ["Cologne", "Dusseldorf", "Dortmund"]
    },
    Singapore: {
      Central: ["Central Area", "Orchard", "Marina Bay", "Downtown Core"],
      East: ["Changi", "Tampines", "Bedok", "Pasir Ris"],
      West: ["Jurong", "Clementi", "Boon Lay"]
    },
    "Saudi Arabia": {
      Riyadh: ["Riyadh City"],
      Makkah: ["Jeddah", "Mecca"],
      "Eastern Province": ["Dammam", "Khobar", "Dhahran"]
    }
  };

  const countriesList = Object.keys(locationData);
  const currentStatesList = locationData[formData.country]
    ? Object.keys(locationData[formData.country])
    : [];

  const currentCitiesList = (locationData[formData.country] && locationData[formData.country][formData.state])
    ? locationData[formData.country][formData.state]
    : [];

  // Photo Upload Handler
  const handlePhotoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("File size exceeds 5MB limit. Please upload a smaller image.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.agreeTerms) {
      alert("Please agree to the Terms & Conditions to submit your application.");
      return;
    }

    setIsSubmitting(true);

    const displayCountry = formData.country === "Other" ? (customCountry.trim() || "Other") : formData.country;
    const displayState = formData.state === "Other" ? (customState.trim() || "Other") : formData.state;
    const displayCity = formData.city === "Other" ? (customCity.trim() || "Other") : formData.city;

    try {
      const res = await fetch("/api/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          country: displayCountry,
          state: displayState,
          city: displayCity,
          photoPreview: photoPreview || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to submit application");

      setSubmittedApp({
        id: data.id || `JCRM-APP-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        name: formData.fullName,
        dept: formData.department,
      });
    } catch (err: any) {
      alert(err.message || "An error occurred while submitting your application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFastTrackWhatsApp = () => {
    if (!submittedApp) return;

    const displayCountry = formData.country === "Other" ? (customCountry.trim() || "Other") : formData.country;
    const displayState = formData.state === "Other" ? (customState.trim() || "Other") : formData.state;
    const displayCity = formData.city === "Other" ? (customCity.trim() || "Other") : formData.city;

    const founderPhone = "918310531309";
    const message = `🚀 *NEW JCRM CAREER / INTERNSHIP APPLICATION* 🚀
--------------------------------------------
Hello Founder, a new candidate application has been submitted:

📌 *Application Reference ID:* ${submittedApp.id}
👤 *Applicant Name:* ${formData.fullName}
📱 *Mobile Number:* ${formData.phoneNumber}
✉️ *Email Address:* ${formData.emailAddress}
📅 *Date of Birth:* ${formData.dateOfBirth}
📍 *Location:* ${displayCity}, ${displayState}, ${displayCountry} (Pin: ${formData.pinCode})

💼 *Application Profile:*
• *Target Department:* ${formData.department}
• *Experience Level:* ${formData.experienceLevel}
• *College / Institution:* ${formData.college}
• *Course / Major:* ${formData.courseMajor}
• *Key Skills:* ${formData.skills || "Not specified"}

--------------------------------------------
⚡ Candidate is requesting fast-track review for interview scheduling.`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${founderPhone}?text=${encodedMessage}`, "_blank");
  };

  // Modern Calendar helper functions
  const monthsList = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const firstDayIndex = new Date(calYear, calMonth, 1).getDay();

  const handleSelectCalDate = (day: number) => {
    const formattedMonth = String(calMonth + 1).padStart(2, '0');
    const formattedDay = String(day).padStart(2, '0');
    const dateStr = `${calYear}-${formattedMonth}-${formattedDay}`;
    setFormData({ ...formData, dateOfBirth: dateStr });
    setShowCalendar(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto rounded-[36px] bg-[#D4E8F8]/90 backdrop-blur-2xl border border-white/90 shadow-[0_20px_60px_rgba(0,85,255,0.15)] overflow-hidden p-6 sm:p-12 relative">
      
      {/* Form Title Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="inline-block px-4 py-1.5 mb-3 text-xs font-extrabold uppercase tracking-widest text-[#0055FF] bg-white/90 rounded-full border border-blue-100 shadow-xs">
          SMART CANDIDATE REGISTRATION
        </span>
        <h2 className="heading-font text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Join JCRM Engineering & Internship Program
        </h2>
        <p className="text-xs sm:text-sm font-semibold text-slate-600 mt-2">
          Smart autocomplete inputs, cascading location selectors & modern DOB calendar picker.
        </p>
      </div>

      {/* DATALISTS FOR SMART TYPE-OR-SELECT AUTCOMPLETE */}
      <datalist id="country-options">
        {countriesList.map((c) => (
          <option key={c} value={c} />
        ))}
      </datalist>

      <datalist id="state-options">
        {currentStatesList.map((st) => (
          <option key={st} value={st} />
        ))}
      </datalist>

      <datalist id="city-options">
        {currentCitiesList.map((ct) => (
          <option key={ct} value={ct} />
        ))}
      </datalist>

      {/* SMART FORM (EXACT SCREENSHOT LAYOUT MATCH) */}
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Row 1: Full Name & Phone Number */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
              Full Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Akasha Sharma"
              className="w-full px-4 py-3.5 rounded-2xl bg-white border border-blue-100 text-slate-900 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0055FF] shadow-xs"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
              Phone Number *
            </label>
            <input
              type="tel"
              required
              placeholder="+91 98765 43210"
              className="w-full px-4 py-3.5 rounded-2xl bg-white border border-blue-100 text-slate-900 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0055FF] shadow-xs"
              value={formData.phoneNumber}
              onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
            />
          </div>
        </div>

        {/* Row 2: Email Address & SMART DOB PICKER (TYPE DIRECTLY OR CALENDAR POPUP) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
              Email Address *
            </label>
            <input
              type="email"
              required
              placeholder="candidate@gmail.com"
              className="w-full px-4 py-3.5 rounded-2xl bg-white border border-blue-100 text-slate-900 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0055FF] shadow-xs"
              value={formData.emailAddress}
              onChange={(e) => setFormData({ ...formData, emailAddress: e.target.value })}
            />
          </div>

          {/* SMART DOB SECTION WITH DIRECT TYPE + MODERN CALENDAR */}
          <div className="relative">
            <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
              Date of Birth * (Type or Pick Calendar)
            </label>

            <div className="relative flex items-center">
              <input
                type="text"
                required
                placeholder="YYYY-MM-DD (e.g. 2003-08-15)"
                className="w-full pr-12 pl-4 py-3.5 rounded-2xl bg-white border border-blue-100 text-slate-900 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0055FF] shadow-xs"
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
              />

              <button
                type="button"
                onClick={() => setShowCalendar(!showCalendar)}
                className="absolute right-3 p-2 text-[#0055FF] hover:bg-blue-50 rounded-xl transition-colors cursor-pointer"
                title="Open Smart Calendar"
              >
                📅
              </button>
            </div>

            {/* MODERN CALENDAR POPUP MODAL */}
            {showCalendar && (
              <div className="absolute top-full left-0 right-0 mt-2 z-40 p-4 rounded-3xl bg-white/95 backdrop-blur-2xl border border-blue-200 shadow-2xl space-y-3 animate-fade-in">
                
                {/* Year & Month Selection Header */}
                <div className="flex items-center justify-between gap-2 border-b border-blue-100 pb-3">
                  <select
                    className="px-2 py-1 rounded-xl bg-blue-50 border border-blue-100 text-xs font-extrabold text-slate-800"
                    value={calMonth}
                    onChange={(e) => setCalMonth(Number(e.target.value))}
                  >
                    {monthsList.map((m, idx) => (
                      <option key={m} value={idx}>{m}</option>
                    ))}
                  </select>

                  <select
                    className="px-2 py-1 rounded-xl bg-blue-50 border border-blue-100 text-xs font-extrabold text-[#0055FF]"
                    value={calYear}
                    onChange={(e) => setCalYear(Number(e.target.value))}
                  >
                    {Array.from({ length: 45 }, (_, i) => 1975 + i).map((yr) => (
                      <option key={yr} value={yr}>{yr}</option>
                    ))}
                  </select>

                  <button
                    type="button"
                    onClick={() => setShowCalendar(false)}
                    className="text-xs font-extrabold text-slate-400 hover:text-slate-700 px-2 py-1"
                  >
                    ✕
                  </button>
                </div>

                {/* Days of Week Header */}
                <div className="grid grid-cols-7 text-center text-[10px] font-extrabold text-slate-400 uppercase">
                  <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
                </div>

                {/* Days Grid */}
                <div className="grid grid-cols-7 gap-1 text-center">
                  {/* Empty padding days */}
                  {Array.from({ length: firstDayIndex }).map((_, i) => (
                    <div key={`empty-${i}`} />
                  ))}

                  {/* Month Days */}
                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const dayNum = i + 1;
                    return (
                      <button
                        key={dayNum}
                        type="button"
                        onClick={() => handleSelectCalDate(dayNum)}
                        className="py-1.5 rounded-xl text-xs font-bold hover:bg-[#0055FF] hover:text-white transition-colors cursor-pointer text-slate-800"
                      >
                        {dayNum}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Row 3: COUNTRY & STATE DROPDOWNS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
              Country *
            </label>
            <div className="relative">
              <select
                required
                className="w-full px-4 py-3.5 pr-10 rounded-2xl bg-white border border-blue-100 text-slate-900 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0055FF] shadow-xs cursor-pointer appearance-none"
                value={formData.country}
                onChange={(e) => {
                  const newCountry = e.target.value;
                  if (newCountry === "Other") {
                    setFormData({ ...formData, country: "Other", state: "Other", city: "Other" });
                  } else {
                    const states = locationData[newCountry] ? Object.keys(locationData[newCountry]) : [];
                    const firstState = states[0] || "";
                    const firstCity = (locationData[newCountry] && locationData[newCountry][firstState]) ? locationData[newCountry][firstState][0] || "" : "";
                    setFormData({ ...formData, country: newCountry, state: firstState, city: firstCity });
                  }
                }}
              >
                <option value="">-- Select Country --</option>
                {countriesList.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
                <option value="Other">Other Country</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            {formData.country === "Other" && (
              <input
                type="text"
                required
                placeholder="Type your country name..."
                className="mt-2 w-full px-4 py-2.5 rounded-xl bg-white border border-blue-200 text-slate-900 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0055FF]"
                value={customCountry}
                onChange={(e) => setCustomCountry(e.target.value)}
              />
            )}
          </div>

          <div>
            <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
              State *
            </label>
            <div className="relative">
              <select
                required
                className="w-full px-4 py-3.5 pr-10 rounded-2xl bg-white border border-blue-100 text-slate-900 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0055FF] shadow-xs cursor-pointer appearance-none"
                value={formData.state}
                onChange={(e) => {
                  const newState = e.target.value;
                  if (newState === "Other") {
                    setFormData({ ...formData, state: "Other", city: "Other" });
                  } else {
                    const cities = (locationData[formData.country] && locationData[formData.country][newState]) ? locationData[formData.country][newState] : [];
                    const firstCity = cities[0] || "";
                    setFormData({ ...formData, state: newState, city: firstCity });
                  }
                }}
              >
                <option value="">-- Select State --</option>
                {currentStatesList.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
                <option value="Other">Other State</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            {formData.state === "Other" && (
              <input
                type="text"
                required
                placeholder="Type your state name..."
                className="mt-2 w-full px-4 py-2.5 rounded-xl bg-white border border-blue-200 text-slate-900 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0055FF]"
                value={customState}
                onChange={(e) => setCustomState(e.target.value)}
              />
            )}
          </div>
        </div>

        {/* Row 4: CITY & PIN CODE */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
              City *
            </label>
            <div className="relative">
              <select
                required
                className="w-full px-4 py-3.5 pr-10 rounded-2xl bg-white border border-blue-100 text-slate-900 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0055FF] shadow-xs cursor-pointer appearance-none"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              >
                <option value="">-- Select City --</option>
                {currentCitiesList.map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
                <option value="Other">Other City</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            {formData.city === "Other" && (
              <input
                type="text"
                required
                placeholder="Type your city name..."
                className="mt-2 w-full px-4 py-2.5 rounded-xl bg-white border border-blue-200 text-slate-900 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0055FF]"
                value={customCity}
                onChange={(e) => setCustomCity(e.target.value)}
              />
            )}
          </div>

          <div>
            <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
              Pin Code *
            </label>
            <input
              type="text"
              required
              placeholder="576101 / 560001"
              className="w-full px-4 py-3.5 rounded-2xl bg-white border border-blue-100 text-slate-900 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0055FF] shadow-xs"
              value={formData.pinCode}
              onChange={(e) => setFormData({ ...formData, pinCode: e.target.value })}
            />
          </div>
        </div>

        {/* Row 5: Department & Skills */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
              Department / Target Role *
            </label>
            <select
              className="w-full px-4 py-3.5 rounded-2xl bg-white border border-blue-100 text-slate-900 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0055FF] shadow-xs"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            >
              <option value="AI/ML Engineering">AI/ML Engineering</option>
              <option value="Full-Stack Web Development">Full-Stack Web Development</option>
              <option value="Data Science & Analytics">Data Science & Analytics</option>
              <option value="Cyber Security & VAPT">Cyber Security & VAPT</option>
              <option value="Cloud DevOps Engineering">Cloud DevOps Engineering</option>
              <option value="UI/UX & Product Design">UI/UX & Product Design</option>
              <option value="Social Media & Digital Marketing">Social Media & Digital Marketing</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
              Skills (comma separated)
            </label>
            <input
              type="text"
              placeholder="e.g. Python, React, PyTorch, SQL..."
              className="w-full px-4 py-3.5 rounded-2xl bg-white border border-blue-100 text-slate-900 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0055FF] shadow-xs"
              value={formData.skills}
              onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
            />
          </div>
        </div>

        {/* Row 6: College / University & Course / Major */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
              College / University *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. SMVITM Udupi / Christ Univ"
              className="w-full px-4 py-3.5 rounded-2xl bg-white border border-blue-100 text-slate-900 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0055FF] shadow-xs"
              value={formData.college}
              onChange={(e) => setFormData({ ...formData, college: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
              Course / Major *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. B.E. CSE / B.Tech IT / BCA"
              className="w-full px-4 py-3.5 rounded-2xl bg-white border border-blue-100 text-slate-900 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0055FF] shadow-xs"
              value={formData.courseMajor}
              onChange={(e) => setFormData({ ...formData, courseMajor: e.target.value })}
            />
          </div>
        </div>

        {/* Row 7: Experience Level */}
        <div>
          <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
            Experience Level *
          </label>
          <select
            className="w-full px-4 py-3.5 rounded-2xl bg-white border border-blue-100 text-slate-900 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0055FF] shadow-xs"
            value={formData.experienceLevel}
            onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value })}
          >
            <option value="Student (Intern)">Student (Intern)</option>
            <option value="Fresher (0-1 Yrs)">Fresher (0-1 Yrs)</option>
            <option value="Experienced (1-3 Yrs)">Experienced (1-3 Yrs)</option>
          </select>
        </div>

        {/* Row 8: Profile Photo Upload with Live Thumbnail Preview */}
        <div>
          <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
            Profile Photo
          </label>
          <div className="flex items-center gap-4 bg-white p-3 rounded-2xl border border-blue-100">
            <input
              type="file"
              accept="image/*"
              className="text-xs text-slate-600 font-semibold file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-extrabold file:bg-blue-50 file:text-[#0055FF] hover:file:bg-blue-100 cursor-pointer"
              onChange={handlePhotoUpload}
            />

            {photoPreview && (
              <div className="w-12 h-12 rounded-xl overflow-hidden border border-blue-200 shrink-0 shadow-xs">
                <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>
        </div>

        {/* Row 9: About Yourself */}
        <div>
          <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
            About Yourself
          </label>
          <textarea
            rows={4}
            placeholder="Tell us about your final year projects, career aspirations, and programming interests..."
            className="w-full px-4 py-3.5 rounded-2xl bg-white border border-blue-100 text-slate-900 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#0055FF] shadow-xs"
            value={formData.aboutYourself}
            onChange={(e) => setFormData({ ...formData, aboutYourself: e.target.value })}
          />
        </div>

        {/* Row 10: Terms & Conditions Checkbox */}
        <div className="flex items-center gap-2.5 pt-2">
          <input
            type="checkbox"
            id="terms"
            className="w-4 h-4 rounded text-[#0055FF] focus:ring-[#0055FF] border-slate-300 cursor-pointer"
            checked={formData.agreeTerms}
            onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
          />
          <label htmlFor="terms" className="text-xs font-bold text-slate-700 cursor-pointer">
            I agree to the <span className="text-[#0055FF] hover:underline">Terms & Conditions</span> and consent to candidate profile indexing in the JCRM Talent Directory.
          </label>
        </div>

        {/* Submit Action Button (Exact Style Match to Orange/Copper Button in Screenshot) */}
        <div className="pt-4 text-center">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-10 py-4 rounded-2xl text-sm font-extrabold text-white bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 transition-all shadow-lg hover:shadow-orange-500/30 hover:scale-105 cursor-pointer inline-flex items-center gap-2.5"
          >
            {isSubmitting ? (
              <span>Submitting Candidate Profile...</span>
            ) : (
              <>
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                </svg>
                <span>Submit Application</span>
              </>
            )}
          </button>
        </div>

      </form>

      {/* CONFIRMATION MODAL ON SUCCESSFUL APPLICATION SUBMISSION */}
      {mounted && submittedApp && createPortal(
        <div 
          className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 bg-slate-900/70 backdrop-blur-sm animate-fade-in" 
          style={{ margin: 0 }}
          onClick={() => setSubmittedApp(null)}
        >
          <div 
            className="relative w-full max-w-lg text-center rounded-3xl bg-white shadow-2xl border border-blue-100 p-6 sm:p-8 space-y-6 max-h-[85vh] overflow-y-auto m-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-2xl font-black shadow-md">
              ✓
            </div>

            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#0055FF] bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                APPLICATION SUBMITTED SUCCESSFULLY
              </span>
              <h3 className="heading-font text-2xl font-extrabold text-slate-900 mt-3">
                Welcome, {submittedApp.name}!
              </h3>
              <p className="text-xs font-semibold text-slate-500 mt-1">
                Your application for <span className="text-[#0055FF] font-bold">{submittedApp.dept}</span> has been logged under Reference ID:
              </p>
              <div className="mt-3 p-3 bg-blue-50 rounded-xl font-mono text-base font-black text-[#0055FF] border border-blue-100 inline-block">
                {submittedApp.id}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 text-xs font-semibold text-slate-600 border border-slate-200">
              ⚡ Want to fast-track your profile for direct project onboarding and interview scheduling?
            </div>

            <div className="space-y-3">
              <button
                onClick={handleFastTrackWhatsApp}
                className="w-full py-3.5 rounded-2xl text-xs sm:text-sm font-extrabold text-white bg-emerald-600 hover:bg-emerald-700 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                Fast-Track Application with Founder on WhatsApp (+91 8310531309)
              </button>

              <button
                onClick={() => setSubmittedApp(null)}
                className="w-full py-2.5 rounded-xl text-xs font-extrabold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
              >
                Close Window
              </button>
            </div>

          </div>
        </div>,
        document.body
      )}

    </div>
  );
}
