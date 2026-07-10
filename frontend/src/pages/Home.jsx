import React from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Stats from "../components/Stats";
import Features from "../components/Features";
import "./Home.css";

function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Stats />
      <Features />
    </>
  );
}

export default Home;