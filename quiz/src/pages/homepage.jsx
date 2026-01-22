import { useState } from "react";

import "../styles/home.css";
import FeaturesSection from "../components/ui/featureCard";
import Hero from "../components/ui/hero";
import SupportSection from "../components/ui/supportForm";


export default function HomePage({ userName, userId }) {




  return (
    <main className="home-container">

      {/* ================= Welcome Section ================= */}
      <section className="welcome-section section-theme-1">
        <Hero />
      </section>

      {/* ================= Dashboard Cards Section ================= */}
      <section className="dashboard-section section-theme-2">
        <FeaturesSection />
      </section>

      <section className="dashboard-section section-theme-2">
        <SupportSection />
      </section>

      {/* ================= Subscribe Section ================= */}

    </main>
  );
}
