import React from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Stats from "../components/Stats";
import "./Home.css";

function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Stats />
    </>
  );
}

export default Home;