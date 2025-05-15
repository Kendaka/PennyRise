// Home.tsx
import React from "react";
import Hero from "../../components/sections/Hero/Hero";

// This is the main page of the application
const Home: React.FC = () => {
  return (
    <div className="bg-background min-h-screen">
      <Hero />
    </div>
  );
};

export default Home;
