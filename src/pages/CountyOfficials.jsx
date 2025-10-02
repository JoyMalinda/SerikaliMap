import React, { useEffect, useState } from "react";
import axios from "../utils/axiosInstance";
import toast, { Toaster } from "react-hot-toast";
import { Search } from "lucide-react";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import {
  PieChart,
  Pie,
  Tooltip,
  Cell,
  Legend,
  ResponsiveContainer,
} from "recharts";

function hashStringToHue(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash % 360);
}

function getPartyColor(partyAbbrev, partyName) {
  const hard = {
    ODM: "orange-400",
    UDA: "amber-400",
    Jubilee: "red-500",
    Wiper: "blue-500",
    WIPER: "blue-500",
    ANC: "teal-400",
    IND: "gray-400",
    Independent: "gray-400",
    UDM: "pink-400",
    UPA: "maroon-400",
    DP: "green-700",
    NRA: "purple-150",
    TSP: "purple-100",
    KANU: "brown-400",
    NARC: "yellow-100",
    "FORD-K": "green-200",
  };

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

  const base = partyAbbrev || partyName || "OTHER";
  const hue = hashStringToHue(base);
  return `hsl(${hue} 72% 48%)`;
}

export default function CountyOfficials() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [searchName, setSearchName] = useState("");
  const [filterPosition, setFilterPosition] = useState("All Leaders");
  const [filterParty, setParty] = useState("All Parties");
  const [filterCounty, setCounty] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("/officials/counties");
        setData(res.data);
        console.log("County Officials: ", res.data);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse m-4">
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 space-y-3">
          <div className="w-full h-10 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="w-full h-10 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-x-auto">
          <div className="w-full h-40 bg-gray-200 dark:bg-gray-700" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-red-400 dark:bg-red-900 text-white p-4 rounded-lg text-center m-6">
        <p className="">Failed to fetch national leaders</p>
      </div>
    );
  }

  const { officials, stats } = data;

  const filteredLeaders = officials.filter((leader) => {
    const matchesName = leader.name
      .toLowerCase()
      .includes(searchName.toLowerCase());
    const matchesPosition =
      filterPosition === "All Leaders" || leader.position === filterPosition;
    const matchesParty =
      filterParty === "All Parties" || leader.party.abbrev === filterParty;
    const matchesCounty =
      filterCounty === "" || leader.county === filterCounty;
    return matchesName && matchesPosition && matchesParty && matchesCounty;
  });

  const uniqueCounties = [...new Set(officials.map((o) => o.county).filter(Boolean))];
  const uniqueParties = [...new Set(
    officials.map((o) => o.party?.abbrev || "Independent").filter(Boolean)
  )];

  const handleNameSearch = (searchName) => {
    const nonAlphabetRegex = /[^a-zA-Z]/;
    if (!searchName.trim()) 
        toast.error("Please enter a name to search");
    if (nonAlphabetRegex.test(searchName))
      toast.error("Name can only contain alphabetic characters");
    if (searchName.length > 50) toast.error("Name is too long");
    setSearchName(searchName);
  };

  // Charts Data
  const genderCharts = [
    { title: "Governors", data: stats?.Governor?.gender_counts },
    { title: "Deputy Governors", data: stats?.["Deputy Governor"]?.gender_counts },
    { title: "Senators", data: stats?.Senator?.gender_counts },
  ];

  const partyCharts = [
    { title: "Governors", data: stats?.Governor?.party_distribution },
    { title: "Women Representatives", data: stats?.["Women Representative"]?.party_distribution },
    { title: "Senators", data: stats?.Senator?.party_distribution },
  ];

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen">
      <NavBar />
      <Toaster position="top-center" reverseOrder={false} />
      <section className="mt-15">
        <div className="space-y-6 mx-12 my-6 dark:bg-gray-900">
          <h2 className="text-2xl font-semibold dark:text-white pt-4">
            Elected National Officials
          </h2>

          {/* Search & Filters */}
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 gap-4">
              {/* Name Search */}
              <div className="flex flex-1">
                <input
                  type="text"
                  placeholder="Search by name"
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  className="flex-1 border-y border-l border-gray-300 rounded-l-lg px-3 py-2 focus:ring-1 focus:ring-green-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
                <button
                  type="button"
                  onClick={() => handleNameSearch(searchName)}
                  className="bg-white text-green-800 px-3 rounded-r-lg hover:bg-green-800 hover:text-white hover:scale-105 transition border-y border-r border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                >
                  <Search className="w-5 h-5" />
                </button>
              </div>

              {/* Position Filter */}
              <div className="relative flex-1">
                <select
                  value={filterPosition}
                  onChange={(e) => setFilterPosition(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-1 focus:ring-green-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                >
                  <option value="All Leaders">All Leaders</option>
                  <option value="Governor">Governor</option>
                  <option value="Deputy Governor">Deputy Governor</option>
                  <option value="Senator">Senator</option>
                  <option value="Women Representative">Women Representative</option>
                </select>
              </div>

              {/* Party Filter */}
              <div className="flex flex-1 sm:w-40">
                <select
                  value={filterParty}
                  onChange={(e) => setParty(e.target.value)}
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-1 focus:ring-green-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                >
                  <option value="All Parties">All Parties</option>
                  {uniqueParties.map((party, idx) => (
      <option key={idx} value={party}>
        {party}
      </option>
                  ))}
                </select>
              </div>

              {/* County Filter */}
              <div className="flex flex-1 sm:w-40">
                <select
                  value={filterCounty}
                  onChange={(e) => setCounty(e.target.value)}
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-1 focus:ring-green-500 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">All Counties</option>
                  {uniqueCounties.map((county, idx) => (
                  <option key={idx} value={county}>
                  {county}
                  </option>
                 ))}
                </select>
              </div>
            </div>
          </div>

          {/* Leaders Table */}
          <div className="p-4 dark:bg-gray-800 rounded-lg shadow">
            <div className="bg-white dark:bg-gray-800 shadow overflow-x-auto h-100">
              <table className="min-w-full text-sm">
                <thead className="bg-white border-y-2 text-base dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium">Photo</th>
                    <th className="px-4 py-3 text-left font-medium">Name</th>
                    <th className="px-4 py-3 text-left font-medium">Position</th>
                    <th className="px-4 py-3 text-left font-medium">County</th>
                    <th className="px-4 py-3 text-left font-medium">Term</th>
                    <th className="px-4 py-3 text-left font-medium">Party</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeaders.map((leader, idx) => (
                    <tr
                      key={idx}
                      className="border-t dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600"
                    >
                      <td className="px-4 py-1">
                        <img
                          src={leader.photo_url}
                          alt={leader.name}
                          className="w-12 h-12 rounded object-cover"
                        />
                      </td>
                      <td className="px-4 py-1">Hon. {leader.name}</td>
                      <td className="px-4 py-1">{leader.position}</td>
                      <td className="px-4 py-1">{leader.county}</td>
                      <td className="px-4 py-1">
                        {leader.start_year} – {leader.end_year || "Present"}
                      </td>
                      <td className="px-4 py-1">
                        {leader.party.abbrev || "Independent"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Gender Distribution Charts */}
          <h3 className="text-xl font-semibold dark:text-white mt-8">
            Gender Distribution
          </h3>
          <div className="flex flex-col md:flex-row gap-6">
            {genderCharts.map(
              (chart, i) =>
                chart.data && (
                  <div
                    key={i}
                    className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow w-full md:w-1/3"
                  >
                    <h4 className="text-lg font-medium mb-2 dark:text-gray-200">
                      {chart.title}
                    </h4>
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie
                          data={[
                            { name: "Male", value: chart.data.male },
                            { name: "Female", value: chart.data.female },
                          ]}
                          dataKey="value"
                          nameKey="name"
                          outerRadius={80}
                          label
                        >
                          <Cell fill="#377eb8" />
                          <Cell fill="#d32240" />
                        </Pie>
                        <Legend />
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )
            )}
          </div>

          {/* Party Distribution Charts */}
          <h3 className="text-xl font-semibold dark:text-white mt-8">
            Party Distribution
          </h3>
          <div className="flex flex-col md:flex-row gap-6">
            {partyCharts.map(
              (chart, i) =>
                chart.data && (
                  <div
                    key={i}
                    className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow w-full md:w-1/3"
                  >
                    <h4 className="text-lg font-medium mb-2 dark:text-gray-200">
                      {chart.title}
                    </h4>
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie
                          data={chart.data.map((p) => ({
                            name: p.name,
                            value: p.count,
                            color: getPartyColor(p.abbrev, p.name),
                          }))}
                          dataKey="value"
                          nameKey="name"
                          outerRadius={80}
                        >
                          {chart.data.map((p, idx) => (
                            <Cell
                              key={idx}
                              fill={getPartyColor(p.abbrev, p.name)}
                            />
                          ))}
                        </Pie>
                        <Tooltip 
                        formatter={(val, name) => [`${val}`, name]} 
                        contentStyle={{ borderRadius: '8px' }} 
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )
            )}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
