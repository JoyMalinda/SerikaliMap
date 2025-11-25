// CountiesMapPage.jsx
import React, { useEffect, useState, useMemo, useCallback } from "react";
import axios from "../utils/axiosInstance";
import NavBar from "../components/NavBar";
import CountyModal from "../components/CountyModal"; 
import Footer from "../components/Footer";

// Helper: deterministic color generator for fallback parties
function hashStringToHue(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h << 5) - h + s.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h) % 360;
}

// Hard-coded colours first, rest deterministic on party abbrev/name
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
    "FORD-K":"green-200"
  };

  // explicit mapping to hex (safer than relying on tailwind class inside svg fill)
  const palette = {
    "orange-400": "#fb923c",
    "amber-400": "#d3b822",
    "red-500": "#d32240",
    "blue-500": "#377eb8",
    "teal-400": "#32b6c2",
    "gray-400": "#999999",
    "pink-400": "#f781bf",
    "green-200": "#86efac",
    "brown-400": "#a65628",
    "purple-100": "#e9d5ff",
    "green-700": "#396115",
    "maroon-400": "#4f0b2b",
    "purple-150": "#aa87c7",
    "yellow-100": "#c7be87",
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

export default function CountiesMap() {
  const [counties, setCounties] = useState([]); // from /maps/counties
  const [officials, setOfficials] = useState([]); // from /officials/counties (cached once)
  const [selectedPosition, setSelectedPosition] = useState("Default"); // Governor, Senator, Women Rep, or "Default"
  const [hoveredCounty, setHoveredCounty] = useState(null);
  const [tooltip, setTooltip] = useState({ x: 0, y: 0, visible: false });
  const [selectedCountyId, setSelectedCountyId] = useState(null);
  const [partyColorMap, setPartyColorMap] = useState({}); // partyAbbrev -> color hex

  // fetch counties (SVG paths)
  useEffect(() => {
    let cancelled = false;
    const fetchCounties = async () => {
      try {
        const res = await axios.get("/maps/counties");
        if (!cancelled) setCounties(res.data);
        console.log("Data:", res.data);
      } catch (err) {
        console.error("Failed to fetch counties:", err);
      }
    };
    fetchCounties();
    return () => {
      cancelled = true;
    };
  }, []);

  // fetch officials once (cached in state). We'll compute derived maps from this.
  useEffect(() => {
    let cancelled = false;
    const fetchOfficials = async () => {
      try {
        const res = await axios.get("/officials/counties");
        if (!cancelled) setOfficials(res.data.officials || res.data);
      } catch (err) {
        console.error("Failed to fetch officials:", err);
      }
    };
    fetchOfficials();
    return () => {
      cancelled = true;
    };
  }, []);

  // Build party -> colour map (stable). Only run when officials change.
  useEffect(() => {
    // gather unique party abbrevs/names
    const seen = {};
    (officials || []).forEach((o) => {
      const abbrev = o?.party?.abbrev || o?.party?.name || "IND";
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
  }, [officials]);

  // Derived: map countyName -> official for the currently selected position
  // We memoize so switching selectedPosition doesn't trigger network calls.
  const countyToOfficial = useMemo(() => {
    if (!officials || !selectedPosition || selectedPosition === "Default") return {};
    const map = {};
    
    officials.forEach((o) => {
      // position might be exactly "Governor", "Senator", "Women Rep" or "Woman Rep" depending on your API
      // normalize some common variations
      const pos = (o.position || "").toLowerCase();
      const target = selectedPosition.toLowerCase();
      if (pos.includes(target.toLowerCase().split(" ")[0])) {
        // match: e.g., 'governor' includes 'governor'
        map[o.county] = o;
      } else {
        // handle "Women Rep" vs "Woman Rep" or "Women Representative"
        if (
          (target.includes("women") || target.includes("woman")) &&
          (pos.includes("women") || pos.includes("woman") || pos.includes("women rep") || pos.includes("women representative") || pos.includes("women"))
        ) {
          map[o.county] = o;
        }
      }
    });
    return map;
  }, [officials, selectedPosition]);

  // get fill color for a county based on current selection
  const getCountyFill = useCallback(
    (county) => {
      if (!selectedPosition || selectedPosition === "Default") {
        // default neutral color depending on dark mode
        return isDarkMode() ? "#374151" /* gray-700 */ : "#ffffff";
      }
      const official = countyToOfficial[county.name];
      if (!official || !official.party) {
        return isDarkMode() ? "#4b5563" : "#f3f4f6"; // fallback neutral
      }
      const abbrev = official.party.abbrev || official.party.name || "IND";
      return partyColorMap[abbrev] || getPartyColor(abbrev, official.party.name);
    },
    [countyToOfficial, selectedPosition, partyColorMap]
  );

  // SVG mouse move: update tooltip x/y relative to svg container
  const handleMouseMove = (e) => {
    const bounds = e.currentTarget.getBoundingClientRect();
    setTooltip((prev) => ({
      ...prev,
      x: e.clientX + 5,
      y: e.clientY - bounds.top + 40 ,
    }));
  };

  // Controls: position buttons and default button
  const positions = ["Governor", "Senator", "Women Rep"];

  // Make svg full screen height (minus navbar). If your navbar has a fixed height, you can set a CSS var.
  // Using inline style: height: calc(100vh - 64px) — adjust 64px if needed.
  const svgContainerStyle = { height: "calc(100vh - 64px)" };

  return (
    
    <div className="bg-white dark:bg-gray-900 min-h-screen">
    <NavBar />
      <main className="px-4 lg:px-8 pt-16">
        <div className="py-4 flex flex-col lg:flex-row items-start gap-4">
          {/* Controls */}
          

          {/* Map area */}
          <div className="flex-1 rounded-xl overflow-hidden bg-green-50 dark:bg-gray-800 shadow" style={svgContainerStyle}>
            <svg
              viewBox="33 -5 10 10"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full pt-1"
              preserveAspectRatio="xMidYMid meet"
              onMouseMove={handleMouseMove}
            >
              {counties.map((county) => {
                const fill = getCountyFill(county);
                const isHovered = hoveredCounty?.id === county.id;
                return (
                  <path
                    key={county.id}
                    d={county.svgPath}
                    fill={isHovered ? "#d1d5db" : fill} // hovered -> red (like landing page)
                    stroke="#d1d5db"
                    strokeWidth="0.02"
                    onMouseEnter={() => {
                      setHoveredCounty(county);
                      setTooltip((prev) => ({ ...prev, visible: true }));
                    }}
                    onMouseLeave={() => {
                      setHoveredCounty(null);
                      setTooltip((prev) => ({ ...prev, visible: false }));
                    }}
                    onClick={() => {
                      setSelectedCountyId(county.id);
                    }}
                    style={{ cursor: "pointer", transition: "fill 200ms ease" }}
                  />
                );
              })}
            </svg>

            {/* Tooltip */}
            {tooltip.visible && hoveredCounty && (
              <div
                className="absolute bg-white dark:bg-gray-900 shadow px-2 py-1 rounded text-sm text-gray-800 dark:text-white pointer-events-none border"
                style={{
                  top: tooltip.y + 10,
                  left: tooltip.x + 10,
                  transform: "translate3d(0,0,0)",
                  zIndex: 40,
                  borderColor: hoveredCounty ? getCountyFill(hoveredCounty) : "transparent", // red-500
                  borderWidth: "thin",
                }}
              >
                <p className="text-base">
                  <span className="text-xs mr-2">{hoveredCounty.code}</span>
                  {hoveredCounty.name}
                </p>
                {/* optionally show party when filtered */}
                {selectedPosition !== "Default" && countyToOfficial[hoveredCounty.name] && (
                  <p className="text-xs mt-1 opacity-80">
                    {countyToOfficial[hoveredCounty.name].party?.abbrev || countyToOfficial[hoveredCounty.name].party?.name}
                  </p>
                )}
              </div>
            )}
          </div>
          <div className="w-full lg:w-72 space-y-3 ml-auto">
  <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
    Party Distribution
  </h2>

  {/* Dropdown instead of button group */}
  <select
    value={selectedPosition}
    onChange={(e) => setSelectedPosition(e.target.value)}
    className="w-full px-3 py-2 rounded-md border bg-white dark:bg-gray-800 dark:text-gray-200"
  >
    <option value="Default">Default</option>
    {positions.map((p) => (
      <option key={p} value={p}>
        {p}
      </option>
    ))}
  </select>

  {/* Legend (same, just grouped under the dropdown) */}
  <div className="mt-4">
    <h3 className="font-medium text-sm text-gray-700 dark:text-gray-100">
      Party colours
    </h3>
    <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
      {Object.keys(partyColorMap)
        .slice(0, 8)
        .map((abbr) => (
          <div key={abbr} className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
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

      {/* County Modal */}
      {selectedCountyId && (
        <CountyModal countyId={selectedCountyId} onClose={() => setSelectedCountyId(null)} />
      )}
      <Footer />
    </div>
  );
}
