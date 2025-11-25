import React, { useState, useEffect } from "react";
import axios from "../utils/axiosInstance"
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import Loader from "../components/Loader";

function hashStringToHue(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h << 5) - h + s.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h) % 360;
}

function getPartyColor(partyAbbrev, partyName) {
  const hard = {
    ODM: "orange-400", // tailwind-like name used to pick actual hex below
    UDA: "amber-400",
    Jubilee: "red-500",
    Wiper: "blue-500",
    WIPER: "blue-500",
    ANC: "teal-400",
    IND: "gray-400",
    "Independent": "gray-400",
    UDM: "pink-400",
    UPA:"maroon-400",
    DP:"green-700",
    NRA:"purple-150",
    TSP:"purple-100",
    KANU:"brown-400",
    NARC:"yellow-100",
    "FORD-K":"green-200",
    UPIA:"tan-400",
    JP: "red-500",
  };

  // explicit mapping to hex (safer than relying on tailwind class inside svg fill)
  const palette = {
    "orange-400": "#ff7f00",
    "amber-400": "#ffd92f",
    "red-500": "#e41a1c",
    "blue-500": "#377eb8",
    "teal-400": "#32b6c2",
    "gray-400": "#999999",
    "pink-400": "#f781bf",
    "green-200": "#a6d854",
    "brown-400": "#a65628",
    "purple-100": "#e9d5ff",
    "green-700": "#4daf4a",
    "maroon-400": "#4f0b2b",
    "purple-150": "#984ea3",
    "yellow-100": "#c7be87",
    "tan-400": "#e5c494",
  };

  if (partyAbbrev && hard[partyAbbrev]) {
    return palette[hard[partyAbbrev]];
  }
  if (partyName && hard[partyName]) {
    return palette[hard[partyName]];
  }

  // deterministic fallback: pick a hue from hash and return HSL (pleasant saturation/lightness)
  const base = partyAbbrev || partyName || "OTHER";
  const hue = hashStringToHue(base);
  // keep saturation/luminance fixed for readability
  return `hsl(${hue} 72% 48%)`;
}

// Utility: detect dark mode currently active (depends on your implementation)
function isDarkMode() {
  // many apps toggle 'dark' class on document.documentElement — check that first
  if (typeof document !== "undefined") {
    return document.documentElement.classList.contains("dark");
  }
  return false;
}

export default function ConstituenciesMap() {
  const [constituencies, setConstituencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedView, setSelectedView] = useState("Default");
  const [hoveredConstituency, setHoveredConstituency] = useState(null);
  const [partyColorMap, setPartyColorMap] = useState({});
  const [tooltip, setTooltip] = useState(null);

  useEffect(() => {
    const fetchConstituencies = async () => {
      try {
        const response = await axios.get("/maps/constituencies"); 
        setConstituencies(response.data);
      } catch (err) {
        console.error("Error fetching constituencies:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchConstituencies();
  }, []);

  useEffect(() => {
      // gather unique party abbrevs/names
      const seen = {};
      const officials = constituencies.map(c => c.mp).filter(mp => mp && mp.party);
      (officials || []).forEach((o) => {
        const abbrev = o?.party?.abbreviation || "Independent";
        if (!seen[abbrev]) seen[abbrev] = true;
      });
  
      const map = {};
      Object.keys(seen).forEach((abbrev) => {
        map[abbrev] = getPartyColor(abbrev, abbrev);
      });
  
      // ensure specified parties have exactly the requested colors
      map["ODM"] = getPartyColor("ODM", "Orange Democratic Movement");
      map["UDA"] = getPartyColor("UDA", "United Democratic Alliance");
      map["JP"] = getPartyColor("JP", "Jubilee/JP");
      map["Wiper"] = getPartyColor("Wiper", "Wiper");
  
      setPartyColorMap(map);
    }, [constituencies]);

  if (loading) return <Loader />;
  if (error) return <p className="text-red-500">Failed to load constituencies.</p>;

  const getConstFill = (c) => {
  if (!selectedView || selectedView === "Default") {
    return isDarkMode() ? "#374151" /* gray-700 */ : "#fff" ;
  }

  const official = c?.mp;
  if (!official || !official.party) {
    return isDarkMode() ? "#4b5563" : "#e2e5e9";
  }

  const abbrev = official.party.abbreviation || "Independent";
  return (
    getPartyColor(abbrev, official.party.name)
  );
};
  const handleMouseMove = (e) => {
  const bounds = e.currentTarget.ownerSVGElement.getBoundingClientRect(); 
  setTooltip((prev) => ({
    ...prev,
    x: e.clientX + 10, // +10px for slight offset
    y: e.clientY - bounds.top + 10,
  }));
};

  const svgContainerStyle = { height: "calc(100vh)" };
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 p-4 ">
        <NavBar />
      </nav>

      {/* Main content */}
      <main className="px-4 lg:px-8 mt-8">
      <div className="py-4 flex flex-col lg:flex-row items-start gap-4">
        {/* Map */}
        <div className="flex-1 rounded-xl overflow-hidden bg-green-50 dark:bg-gray-800 shadow" style={svgContainerStyle}>
          <svg
            viewBox="33 -5 10 10"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
          >
            {constituencies.map((c) => {
                const isHovered = hoveredConstituency?.id === c.id;
              return (
              <path
                key={c.id}
                d={c.svgPath}
                id={c.name}
                className="cursor-pointer transition-colors duration-200"
                fill={isHovered ? "#d1d5db" : getConstFill(c)}
                stroke= {isDarkMode() && selectedView==="Default" ? "#e2e5e9":"#000000"}
                strokeWidth="0.002"
                onMouseEnter={(e) => {
                 setHoveredConstituency(c);
                  setTooltip({
                    x: e.clientX,
                    y: e.clientY,
                    constituency: c,
                  });
                }}
                onMouseMove={handleMouseMove}
                onMouseLeave={() => {
                    setHoveredConstituency(null);
                    setTooltip(null);}}
              />
                );
    })}
          </svg>

          {/* Tooltip */}
          {tooltip && hoveredConstituency?.mp && (
            <div
              className="absolute bg-white dark:bg-gray-800 border rounded-lg shadow-lg p-1 pointer-events-none"
              style={{ 
                top: tooltip.y, 
                left: tooltip.x,
                borderColor: hoveredConstituency ? getConstFill(hoveredConstituency) : "transparent", // red-500
                borderWidth: "thin",
            }}
            >
              <div className="flex items-center gap-3">
                <img
                  src={tooltip.constituency.mp.photo_url}
                  alt={tooltip.constituency.mp.name}
                  className="w-13 h-13 rounded object-cover border border-gray-200 dark:border-gray-700"
                />
                <div>
                  <p className="font-semibold text-gray-800 dark:text-gray-100">
                   <span className="text-xs">{tooltip.constituency.code}</span> {tooltip.constituency.name} 
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mr-3">
                     {tooltip.constituency.mp.name}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {tooltip.constituency.mp.party.abbreviation}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Controls + Legend */}
        <div className="w-full lg:w-72 space-y-3 p-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            Map controls
          </h2>

          {/* Dropdown */}
          <select
            value={selectedView}
            onChange={(e) => setSelectedView(e.target.value)}
            className="w-full px-3 py-2 rounded-md border bg-white dark:bg-gray-800 dark:text-gray-200"
          >
            <option value="Default">Default</option>
            <option value="Party Distribution">Party Distribution</option>
          </select>

          {/* Party Legend */}
          <div className="mt-4">
            <h3 className="font-medium text-sm text-gray-700 dark:text-gray-100">
              Party colours
            </h3>
            <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
              {Object.keys(partyColorMap).map((abbr) => (
                <div key={abbr} className="flex items-center gap-2 text-gray-800 dark:text-gray-200">
                  <span
                    className="w-5 h-5 rounded-sm"
                    style={{ background: partyColorMap[abbr] }}
                  />
                  <span className="truncate">{abbr}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      </main>
      <Footer />
    </div>
  );
}
