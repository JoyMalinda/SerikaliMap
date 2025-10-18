import React from "react";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import  BrushStroke  from "../assets/1571666637brush_stroke.svg"

export default function AboutPage() {
  return (
    <div className="min-h-screen">
    <NavBar />
    <div className="bg-green-100 mt-16 p-4 flex justify-center">
      <h1 className="text-3xl font-semibold mb-4">About Us</h1>
      </div>
    <section className="flex-col justify-center container text-left w-[800px] mx-20 px-4 py-4">
      <div>
        <p><span className="font-bold">SerikaliMap</span> is a school project designed to give a visual and accessible overview of elected officials across Kenya. Using publicly available data, we aim to make it easier for citizens, researchers, and students to explore Kenya’s political structure — from counties to constituencies to wards.</p>
      </div>
      <div className="mt-6 space-y-4">
        <h2 className="font-semibold text-2xl">Vision</h2>
        <p>SerikaliMap is guided by the idea that civic understanding is the foundation of good governance. By connecting citizens to their representatives, the project seeks to bridge the gap between government structures and public knowledge.</p>
        <div>
          <p>As Wangari Maathai reminds us in The Challenge for Africa,</p>
          <p className="italic font-light">“Democracy doesn't solely mean ‘one person, one vote.’ It also means, among other things, the protection of minority rights; an elective and truly representative parliament; an independent judiciary; <span className="font-normal">an informed and engaged citizenry;</span> an independent fourth estate; the rights to assemble, practice one's religion freely, and advocate for one's own view peacefully without fear of reprisal or arbitrary arrest; and an empowered and active civil society that can operate without intimidation.”</p>
        </div>
          <p>Inspired by these words, SerikaliMap strives to promote transparency, representation, and civic awareness through open access to information.</p>
      </div>
      <div className="mt-6 space-y-4">
        <h2 className="font-semibold text-2xl">Disclaimer</h2>
        <ul className="list-disc list-inside">
            <li>This is an academic project created for educational purposes.</li>
            <li>While we strive for accuracy, the information on this site may not always be complete, up-to-date, or free from errors.</li>
            <li>Some positions, especially historical or past office holders, may be missing.</li>
            <li>The data presented is sourced from public records and open government sources, and is not affiliated with or endorsed by the Government of Kenya, the IEBC, or any other official body.</li>
        </ul>
      </div>
      <div className="mt-6">
        <h2 className="font-semibold text-2xl my-4">Our Data Sources</h2>
            <p>We use publicly accessible and reputable sources, including:</p>
            <ul className="list-disc list-inside mt-0">
                <li>Kenya National Bureau of Statistics (KNBS) – https://www.knbs.or.ke</li>
                <li>Independent Electoral and Boundaries Commission (IEBC) – https://www.iebc.or.ke</li>
                <li>County government websites and official press releases</li>
                <li>Other public-domain government documents</li>
            </ul>
      </div>
      </section>
      <div id="contactcard" className="flex rounded-lg border-2 border-green-600 mx-20 my-6 bg-gray-100 w-[1000px]">
        <div className="flex justify-center items-center text-center p-4">
        <div className="w-[500px]">
          <h3 className="font-semibold">Contribute and Contact Us</h3>
          <p>We welcome suggestions and corrections.</p>
          <p>If you notice missing officials, incorrect data, or have historical records you’d like to share, please get in touch.</p>
        </div>
        </div>
        <div className="bg-white rounded flex-1 text-sm">
            <form className="flex flex-col gap-4 p-4 rounded-lg">
                <input className="border rounded h-9" placeholder="Your Name"></input>
                <input className="border rounded h-9" placeholder="Your Email"></input>
                <textarea className="border rounded h-20" placeholder="Share Your Thoughts..."></textarea>
                <button className="bg-green-300 px-4 py-2 rounded hover:bg-green-700 transition w-[120px]">Submit</button>
            </form>
        </div>
        </div>
      <Footer />
    </div>
  );
}