import { useEffect, useState } from "react";
import {
  ArrowRight,
  Sparkles,
  Truck,
  ShieldCheck,
  Heart,
} from "lucide-react";
import { Link } from "react-router-dom";

import dollhouse1 from "../../assets/dollhouses/dollhouse-1.png";
import dollhouse2 from "../../assets/dollhouses/dollhouse-2.png";
import dollhouse3 from "../../assets/dollhouses/dollhouse-3.png";

import "./Hero.css";

export default function Hero() {
  const houses = [
    dollhouse1,
    dollhouse2,
    dollhouse3,
  ];

  const [activeHouse, setActiveHouse] = useState(0);

  const [mouse, setMouse] = useState({
    x: 0,
    y: 0,
  });

  /* =====================================================
     DOLLHOUSE CINEMATIC ROTATION
  ===================================================== */

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveHouse((current) => {
        return (current + 1) % houses.length;
      });
    }, 6500);

    return () => clearInterval(timer);
  }, [houses.length]);


  /* =====================================================
     MOUSE PARALLAX
  ===================================================== */

  useEffect(() => {
    const handleMouseMove = (event) => {
      const x =
        (event.clientX / window.innerWidth - 0.5) * 2;

      const y =
        (event.clientY / window.innerHeight - 0.5) * 2;

      setMouse({
        x,
        y,
      });
    };

    window.addEventListener(
      "mousemove",
      handleMouseMove
    );

    return () => {
      window.removeEventListener(
        "mousemove",
        handleMouseMove
      );
    };
  }, []);


  return (
    <section className="toyland-hero">

      {/* =================================================
          BACKGROUND ATMOSPHERE
      ================================================= */}

      <div className="hero-bg-glow hero-bg-glow-one" />

      <div className="hero-bg-glow hero-bg-glow-two" />

      <div className="hero-light-orb" />


      <div className="hero-container">

        {/* =================================================
            LEFT SIDE
        ================================================= */}

        <div className="hero-copy">

          <div className="hero-badge">
            <Sparkles size={15} />
            <span>
              Little worlds. Big imaginations.
            </span>
          </div>


          <h1>
            Let Their
            <br />
            <span>Imagination</span>
            <br />
            <strong>Run Wild!</strong>
          </h1>


          <p>
            Discover beautiful toys and magical little
            worlds designed to inspire creativity,
            curiosity, and endless adventures.
          </p>


          {/* =================================================
              BUTTONS
          ================================================= */}

          <div className="hero-actions">

            <Link
              to="/shop"
              className="hero-primary-btn"
            >
              Shop Toys
              <ArrowRight size={18} />
            </Link>


            <a
             href="#categories"
             className="hero-secondary-btn"
            >
             Explore Collections
            </a>

          </div>
 

          {/* =================================================
              TRUST
          ================================================= */}

          <div className="hero-trust">

            <div className="trust-item">

              <div className="trust-icon">
                <Truck size={17} />
              </div>

              <div>
                <strong>FAST DELIVERY</strong>
                <small>Across Pakistan</small>
              </div>

            </div>


            <div className="trust-line" />


            <div className="trust-item">

              <div className="trust-icon">
                <ShieldCheck size={17} />
              </div>

              <div>
                <strong>SAFE & QUALITY</strong>
                <small>Kids approved</small>
              </div>

            </div>


            <div className="trust-line" />


            <div className="trust-item">

              <div className="trust-icon">
                <Heart size={17} />
              </div>

              <div>
                <strong>MADE WITH LOVE</strong>
                <small>For little dreamers</small>
              </div>

            </div>

          </div>

        </div>


        {/* =================================================
            DOLLHOUSE STAGE
        ================================================= */}

        <div className="hero-visual">

          {/* Large atmospheric glow */}

          <div className="dollhouse-glow" />


          {/* Moving transition light */}

          <div className="dollhouse-transition-light" />


          {/* Ground shadow */}

          <div className="dollhouse-shadow" />


          {/* =================================================
              DOLLHOUSE LAYERS
          ================================================= */}

          <div
            className="dollhouse-stage"
            style={{
              transform: `
                translate(
                  ${mouse.x * 7}px,
                  ${mouse.y * 5}px
                )
              `,
            }}
          >

            {houses.map((house, index) => {

              const isActive =
                index === activeHouse;

              return (
                <div
                  key={house}
                  className={`dollhouse-layer ${
                    isActive
                      ? "is-active"
                      : ""
                  }`}
                >

                  <img
                    src={house}
                    alt={`Toyland dollhouse ${index + 1}`}
                  />

                </div>
              );
            })}

          </div>


          {/* =================================================
              GOLDEN SPARKLES
          ================================================= */}

          <div className="premium-sparkle sparkle-one">
            ✦
          </div>

          <div className="premium-sparkle sparkle-two">
            ✧
          </div>

          <div className="premium-sparkle sparkle-three">
            ✦
          </div>


          {/* =================================================
              FOUR POINT SPARKLES
          ================================================= */}

          <div className="aesthetic-sparkle aesthetic-one" />

          <div className="aesthetic-sparkle aesthetic-two" />

          <div className="aesthetic-sparkle aesthetic-three" />

          <div className="aesthetic-sparkle aesthetic-four" />

          <div className="aesthetic-sparkle aesthetic-five" />


          {/* =================================================
              TINY GLITTER
          ================================================= */}

          <div className="glitter-dot glitter-one" />

          <div className="glitter-dot glitter-two" />

          <div className="glitter-dot glitter-three" />

          <div className="glitter-dot glitter-four" />

          <div className="glitter-dot glitter-five" />

          <div className="glitter-dot glitter-six" />

          <div className="glitter-dot glitter-seven" />

          <div className="glitter-dot glitter-eight" />


          {/* =================================================
              HOUSE INDICATORS
          ================================================= */}

          <div className="house-indicators">

            {houses.map((_, index) => (

              <button
                key={index}
                type="button"
                aria-label={`Show dollhouse ${index + 1}`}
                className={
                  index === activeHouse
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setActiveHouse(index)
                }
              />

            ))}

          </div>

        </div>

      </div>

    </section>
  );
}