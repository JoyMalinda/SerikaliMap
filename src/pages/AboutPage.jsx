import React, { useState } from "react";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import axios from "../utils/axiosInstance";
import SuccessComponent from "../components/SuccessMail";

export default function AboutPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false); // animation trigger

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSent(false);

    try {
      const res = await axios.post(
        "/send_mail",
        {
          email,
          message,
          middleName: "" // honeypot MUST be empty
        },
        { withCredentials: true }  // so cookies work for rate limit
      );

      if (res.data?.success) {
        setSent(true); // <-- trigger animation
      }
    } catch (err) {
      // If the backend returned a response
      if (err.response) {
        const { status, data } = err.response;

        // ------------- RATE LIMITED (429) -------------
        if (status === 429) {
          setError("Too many requests. Try again later.");
        }

        // ----------- SPAM DETECTED -------------
        else if (status === 400 && data?.error === "Spam detected") {
          setError("Too many requests. Try again later.");
        }

        // ----------- NORMAL VALIDATION ERROR -------------
        else if (status === 400 && data?.error) {
          setError(data.error);
        }

        // ----------- GENERIC SERVER ERROR -------------
        else {
          setError("Something went wrong. Try again.");
        }
      } else {
        // Network or Axios internal error
        setError("Network error. Try again.");
      }
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen flex flex-col dark:bg-gray-900">
      <NavBar />

      {/* Hero Section */}
      <div className="bg-green-100 mt-16 py-8 text-center">
        <h1 className="text-3xl font-semibold text-green-900">About Us</h1>
      </div>

      {/* Main Content */}
      <main className="flex flex-col items-center px-4 py-8">
        <div className="max-w-3xl text-gray-800 space-y-8 dark:text-gray-300">
          <section>
            <p>
              <span className="font-semibold">SerikaliMap</span> is a
              school project designed to give a visual and accessible overview
              of elected officials across Kenya. Using publicly available data,
              we aim to make it easier for citizens, researchers, and students
              to explore Kenya’s political structure — from counties to
              constituencies to wards.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-semibold text-2xl text-green-800">Vision</h2>
            <p>
              SerikaliMap is guided by the idea that civic understanding is the
              foundation of good governance. By connecting citizens to their
              representatives, the project seeks to bridge the gap between
              government structures and public knowledge.
            </p>
            <blockquote className="italic border-l-4 border-green-500 pl-4 text-gray-700 dark:text-gray-400">
              “Democracy doesn't solely mean ‘one person, one vote.’ It also
              means, among other things, the protection of minority rights; an
              elective and truly representative parliament; an independent
              judiciary; <span className="font-semibold">an informed and engaged citizenry;</span> an independent
              fourth estate; the rights to assemble, practice one's religion
              freely, and advocate for one's own view peacefully without fear of
              reprisal or arbitrary arrest; and an empowered and active civil
              society that can operate without intimidation.”
              <br />
              <span className="block mt-1 font-light">
                — Wangari Maathai, *The Challenge for Africa*
              </span>
            </blockquote>
            <p>
              Inspired by these words, SerikaliMap strives to promote
              transparency, representation, and civic awareness through open
              access to information.
            </p>
          </section>

          <section id="disclaimer" className="space-y-4">
            <h2 className="font-semibold text-2xl text-green-800">Disclaimer</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>This is an academic project created for educational purposes.</li>
              <li>
                While we strive for accuracy, the information on this site may
                not always be complete, up-to-date, or free from errors.
              </li>
              <li>Some positions, especially historical or past office holders, may be missing.</li>
              <li>
                The data presented is sourced from public records and open
                government sources, and is not affiliated with or endorsed by
                the Government of Kenya, the IEBC, or any other official body.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-semibold text-2xl text-green-800 mb-2">
              Our Data Sources
            </h2>
            <p>We use publicly accessible and reputable sources, including:</p>
            <ul className="list-disc list-inside space-y-2 pl-6">
              <li>
                Several Kenya Government Gazettes, including:{" "}
                <ul className="list-inside space-y-1 pl-6" id="gazettes">
                  <li >
                    <a
                      href="https://new.kenyalaw.org/akn/ke/officialGazette/gazette/2022-08-23/169/eng@2022-08-23"
                      className="text-green-700 underline hover:text-green-900"
                    >
                      Kenya Gazette Vol. CXXIV-No. 169
                    </a>
                  </li>
                  <li >
                    <a
                      href="https://new.kenyalaw.org/akn/ke/officialGazette/gazette/2022-08-24/170/eng@2022-08-24"
                      className="text-green-700 underline hover:text-green-900"
                    >
                      Kenya Gazette Vol. CXXIV-No. 170
                    </a>
                  </li>
                </ul>
              </li>
              <li>
                Office of the Registrar of Political Parties (ORPP) – {" "}
                <a
                  href="https://orpp.or.ke/list-of-political-parties/"
                  className="text-green-700 underline hover:text-green-900"
                >
                  www.orpp.or.ke
                </a>
              </li>
              <li>
                The Parliament Website, i.e., {" "}
                <ul className="list-inside space-y-1 pl-6" id="parliamentlinks">
                  <li>
                <a
                  href="https://www.parliament.go.ke/the-senate/senators"
                  className="text-green-700 underline hover:text-green-900"
                >
                  The Senate Page
                </a>
                  </li>
                  <li>
                <a
                  href="https://www.parliament.go.ke/the-national-assembly/mps"
                  className="text-green-700 underline hover:text-green-900"
                >
                  The National Assembly Page
                </a>
                  </li>
                </ul>
              </li>
              <li>
                Kenya Women Parliamentary Association (KEWOPA) – {" "}
                <a
                  href="https://www.kewopa.org/?page_id=965"
                  className="text-green-700 underline hover:text-green-900"
                >
                  www.kewopa.org
                </a>
              </li>
              <li>
                Council of Governors (CoG) – {" "}
                <a
                  href="https://cog.go.ke/current-governors/"
                  className="text-green-700 underline hover:text-green-900"
                >
                  cog.go.ke
                </a>
              </li>
              <li>County government websites and official press releases</li>
              <li>Other public-domain government documents</li>
            </ul>
          </section>
        </div>
      </main>

      {/* Contact Card */}
      <section
        id="contactcard"
        className="flex flex-col md:flex-row justify-center items-stretch mx-auto mb-12 bg-gray-50 dark:bg-gray-900 border-2 border-green-600 dark:border-green-800 rounded-lg max-w-4xl overflow-hidden"
      >
        {/* Left Info */}
        <div className="flex-1 flex flex-col justify-center p-6 text-center md:text-left bg-gray-100 dark:bg-gray-900 my-7">
          <h3 className="font-semibold text-lg text-green-900 dark:text-green-700 mb-4">
            Contribute and Contact Us
          </h3>
          <p className="text-sm mb-1 dark:text-gray-300">We welcome suggestions and corrections.</p>
          <p className="text-sm dark:text-gray-300">
            If you notice missing officials, incorrect data, or have historical
            records you’d like to share, please get in touch.
          </p>
        </div>

        {/* Right Form */}
        <div className="flex-1 bg-white p-6 dark:bg-gray-800">
          <form className="flex flex-col gap-4 dark:text-gray-400" style={sent ? { display: "none" } : {}}>
            <input
              name="name"
              required
              type="text"
              className="border border-gray-400 dark:border-gray-600 rounded px-3 py-2 focus:ring-1 focus:ring-green-400 focus:outline-none dark:bg-gray-700 dark:text-gray-200"
              placeholder="Your Name"
            />
            <input
              name="email"
              required
              value={email}
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              className="border border-gray-400 dark:border-gray-600 rounded px-3 py-2 focus:ring-1 focus:ring-green-400 focus:outline-none dark:bg-gray-700 dark:text-gray-200"
              placeholder="Your Email"
            />
            <textarea
              name="message"
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="border border-gray-400 dark:border-gray-600 rounded px-3 py-2 h-24 resize-none focus:ring-1 focus:ring-green-400 focus:outline-none dark:bg-gray-700 dark:text-gray-200"
              placeholder="Share Your Thoughts..."
            />
            <input
              type="text"
              name="middleName"
              style={{ display: "none" }}
              onChange={() => {}}
              />
            <button
              type="submit"
              disabled={loading}
              onClick={handleSubmit}
              className="bg-green-600 dark:bg-green-800 dark:text-gray-300 text-white font-medium py-2 px-4 rounded hover:bg-green-700 transition w-full md:w-32 self-center md:self-start"
            >
              {loading ? "Sending..." : "Submit"}
            </button>
            {error && <p className="font-light" style={{ color: "red" }}>{error}</p>}
          </form>
          {sent && <SuccessComponent />}
        </div>
      </section>

      <Footer />
    </div>
  );
}
