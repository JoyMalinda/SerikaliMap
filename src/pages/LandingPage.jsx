import { useEffect, useState } from "react";
import axios from "../utils/axiosInstance";
import { Link, Search } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import SearchResult from "../components/SearchResult";
import CountyModal from "../components/CountyModal";
import Presidents from "../components/PresidentsTable";

export default function LandingPage() {
  const [query, setQuery] = useState("");
  const [searchData, setSearchData] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const navigate = useNavigate();

  const [counties, setCounties] = useState([]);
  const [hoveredCounty, setHoveredCounty] = useState(null);
  const [tooltip, setTooltip] = useState({ x: -10, y: 0, visible: false });

  const [touchStartPos, setTouchStartPos] = useState({ x: 0, y: 0 });
  const [isScrolling, setIsScrolling] = useState(false);
  const [touchedCounty, setTouchedCounty] = useState(null);

  const handleNavigate = (str) => {
  if (str === "mp") {
    navigate("/members-of-parliament");
  } else if (str === "co") {
    navigate("/county-officials");
  }
};

  const [selectedCountyId, setSelectedCountyId] = useState(null);

  // Fetch map data
  useEffect(() => {
    const fetchCounties = async () => {
      try {
        const res = await axios.get("/maps/counties");
        setCounties(res.data);
      } catch (err) {
        console.error("Failed to fetch counties:", err);
      }
    };
    fetchCounties();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    try {
      const res = await axios.post("/location_search", { place: query });
      setSearchData(res.data);
      setShowResult(true);
    } catch (err) {
      console.error("Search failed:", err);
      toast.error("Place not found. Please try again.");
    }
  };

  // Detect if finger is tapping or scrolling
const handleTouchStart = (e, county) => {
  const touch = e.touches[0];
  setTouchStartPos({ x: touch.clientX, y: touch.clientY});
  setIsScrolling(false);

  const svg = e.currentTarget.closest("svg");
  const bounds = svg.getBoundingClientRect();
  const localX = touch.clientX - bounds.left;
  const localY = touch.clientY - bounds.top;

  // Simulate hover
  setHoveredCounty(county);
  setTouchedCounty(county);
  setTooltip({ 
    x: localX + 10,
    y: localY - 60, 
    visible: true });
};

const handleTouchMove = (e) => {
  const touch = e.touches[0];

  const dx = Math.abs(touch.clientX - touchStartPos.x);
  const dy = Math.abs(touch.clientY - touchStartPos.y);

  // If finger moves too much → scrolling
  if (dx > 20 || dy > 20) {
    setIsScrolling(true);

    // Stop hover while scrolling
    setHoveredCounty(null);
    setTooltip((prev) => ({ ...prev, visible: false }));
  }
};

const handleTouchEnd = (county) => {
  // If finger moved → user was scrolling, NOT tapping
  if (isScrolling) return;

  // If tapped same county again → consider as click
  if (touchedCounty && touchedCounty.id === county.id) {
    setSelectedCountyId(county.id);
  }

  // Clear the hover after tap
  setTimeout(() => {
    setHoveredCounty(null);
    setTooltip((prev) => ({ ...prev, visible: false }));
  }, 150);
};

const handleTouchCancel = () => {
  setHoveredCounty(null);
  setTooltip((prev) => ({ ...prev, visible: false }));
};
  

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen">
    <Toaster />
    <NavBar />
    <section className="grid grid-cols-1 lg:grid-cols-2 items-center gap-8 px-6 py-12 lg:px-16 bg-green-100">
      {/* Left Side */}
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900 mt-8">
          Who Leads Where You Live?
        </h1>
        <p className="text-2xl text-gray-600 max-w-xl my-12">
          Discover your <span className="italic text-black">elected</span> officials, past and present. Search by name,
          county, or party and explore Kenya’s political history.
        </p>

        {/* Search Bar */}
        <div>
        <form
          onSubmit={handleSearch}
          className="flex w-full max-w-lg border border-gray-800 rounded-xl overflow-hidden bg-green-100"
        >
          <input
            type="text"
            placeholder="Search a location..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 px-4 py-2 text-gray-700 outline-none"
          />
          <button
            type="submit"
            className="bg-green-200 hover:bg-green-800 text-green-800  hover:text-white transition px-4 flex items-center justify-center border-l"
          >
            <Search className="w-5 h-5" />
          </button>
        </form>

        <div className="flex space-x-4">
        <button
        className="border-2 rounded-lg w-[200px] h-[35px] mt-10 text-sm border-green-800 text-gray-800"
        onClick={() => handleNavigate("co")}>Explore County Officials</button>
        

        <button
        className="border-2 rounded-lg w-[120px] h-[35px] mt-10 text-sm border-green-800 text-gray-800"
        onClick={() => handleNavigate("mp")}>Explore MPs</button>
        </div>
        </div>

        {/* On mobile, map moves here */}
        <div className="lg:hidden w-full h-[400px] flex items-center justify-center bg-green-100 rounded-xl relative overflow-hidden">
          <svg
            viewBox="33 -5 10 10"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
             preserveAspectRatio="xMidYMid meet"
            onMouseMove={(e) => {
              const bounds = e.currentTarget.getBoundingClientRect();
              setTooltip((prev) => ({
                ...prev,
                x: e.clientX - bounds.left,
                y: e.clientY - bounds.top,
              }))
            }}
          >
            {counties.map((county) => (
              <path
                key={county.id}
                d={county.svgPath}
                className={`stroke-gray-300 stroke-[0.02] 
                  ${hoveredCounty?.id === county.id 
                    ? "fill-red-500" 
                    : "fill-white dark:fill-gray-700"}`}
                stroke="lightgray"
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
                  setSelectedCountyId(county.id)
                  console.log("Clicked county:", county.name);
                }}
                onTouchStart={(e) => handleTouchStart(e,county)}
                onTouchMove={handleTouchMove}
                onTouchEnd={() => handleTouchEnd(county)}
                onTouchCancel={handleTouchCancel}
              />
            ))}
          </svg>

          {/* Tooltip */}
          {tooltip.visible && hoveredCounty && (
            <div
              className="absolute bg-white dark:bg-gray-800 shadow px-2 py-1 rounded text-sm text-gray-800 pointer-events-none border-2 border-red-500"
              style={{ top: tooltip.y + 10, left: tooltip.x + 10}}
            >
              <p className="text-base dark:text-white"><span className="text-xs">{hoveredCounty.code}</span> {hoveredCounty.name}</p>
            </div>
          )}
        </div>
      </div>

      {/* Right Side (desktop only) */}
      <div className="hidden lg:block w-full h-[500px] bg-green-100 rounded-xl relative overflow-hidden m-3">
        <svg
          viewBox="33 -5 10 10"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
          onMouseMove={(e) => {
            const bounds = e.currentTarget.getBoundingClientRect();
            setTooltip((prev) => ({
              ...prev,
              x: e.clientX - bounds.left,
              y: e.clientY - bounds.top,
            }))
          }}
        >
          {counties.map((county) => (
            <path
              key={county.id}
              d={county.svgPath}
              className={`stroke-gray-300 stroke-[0.02] 
                ${hoveredCounty?.id === county.id 
                ? "fill-red-500" 
                : "fill-white dark:fill-gray-700"}`}
              stroke="lightgray"
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
                setSelectedCountyId(county.id)
                console.log("Clicked county:", county.name);
              }}
              onTouchStart={(e) => handleTouchStart(e,county)}
              onTouchMove={handleTouchMove}
              onTouchEnd={() => handleTouchEnd(county)}
              onTouchCancel={handleTouchCancel}
            />
          ))}
        </svg>

        {/* Tooltip */}
        {tooltip.visible && hoveredCounty && (
          <div
            className="absolute bg-white dark:bg-gray-900 shadow px-2 py-1 rounded text-sm text-gray-800 pointer-events-none border-2 border-red-500"
            style={{ top: tooltip.y + 10, left: tooltip.x + 10 }}
          >
            <p className="text-base dark:text-white"><span className="text-xs">{hoveredCounty.code}</span> {hoveredCounty.name}</p>
          </div>
        )}
      </div>

      {/* Search Result Modal */}
      {showResult && (
        <SearchResult
          query={query}
          data={searchData}
          onClose={() => setShowResult(false)}
        />
      )}

      {/* County Modal */}
      {selectedCountyId && (
        <CountyModal countyId={selectedCountyId} onClose={() => setSelectedCountyId(null)} />
      )}

    </section>
    <Presidents />
    <Footer />
    </div>
  );
}
