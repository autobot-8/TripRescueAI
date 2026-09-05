import { useEffect, useState } from "react";
import { ArrowRight, ChevronDown, ShieldCheck } from "lucide-react";
import "./Home.css";

const destinations = [
    {
        location: "PARIS, FRANCE",
        title: "Where every journey",
        highlight: "becomes a memory.",
        image:
            "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=2400&q=90",
    },
    {
        location: "SANTORINI, GREECE",
        title: "Go farther.",
        highlight: "Stay protected.",
        image:
            "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=2400&q=90",
    },
    {
        location: "SWITZERLAND",
        title: "The world is waiting.",
        highlight: "Your plans are protected.",
        image:
            "https://images.unsplash.com/photo-1530789253388-582c481c54b0?auto=format&fit=crop&w=2400&q=90",
    },
    {
        location: "AMALFI COAST, ITALY",
        title: "Travel without",
        highlight: "the uncertainty.",
        image:
            "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=2400&q=90",
    },
    {
        location: "KYOTO, JAPAN",
        title: "Your journey.",
        highlight: "Protected.",
        image:
            "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=2400&q=90",
    },
];

function Home({ onEnterApp }) {
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setActiveIndex(
                (current) => (current + 1) % destinations.length
            );
        }, 7000);

        return () => clearInterval(timer);
    }, []);

    const activeDestination = destinations[activeIndex];

    return (
        <main className="home-page">
            {/* BACKGROUND CAROUSEL */}
            <div className="home-background">
                {destinations.map((destination, index) => (
                    <div
                        key={destination.location}
                        className={`home-slide ${index === activeIndex ? "active" : ""
                            }`}
                        style={{
                            backgroundImage: `url(${destination.image})`,
                        }}
                    />
                ))}

                <div className="home-overlay" />
                <div className="home-vignette" />
            </div>

            {/* NAVIGATION */}
            <header className="home-nav">
                <button
                    className="home-brand"
                    onClick={() => setActiveIndex(0)}
                    aria-label="TripRescue AI home"
                >
                    <div
                        className="home-brand-mark"
                        aria-hidden="true"
                    >
                        <svg
                            viewBox="0 0 48 48"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M24 4L39 10V22C39 32 33 39 24 44C15 39 9 32 9 22V10L24 4Z"
                                stroke="currentColor"
                                strokeWidth="1.6"
                            />

                            <path
                                d="M15 27L24 18L33 27"
                                stroke="currentColor"
                                strokeWidth="1.6"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />

                            <path
                                d="M19 23H29"
                                stroke="currentColor"
                                strokeWidth="1.6"
                                strokeLinecap="round"
                            />
                        </svg>
                    </div>

                    <div className="home-brand-wordmark">
                        <span>TRIPRESCUE</span>
                        <small>AI</small>
                    </div>
                </button>

                <nav className="home-nav-links">
                    <button
                        onClick={() =>
                            document
                                .querySelector(".home-story")
                                ?.scrollIntoView({
                                    behavior: "smooth",
                                })
                        }
                    >
                        HOW IT WORKS
                    </button>

                    <button
                        onClick={onEnterApp}
                        className="home-nav-enter"
                    >
                        ENTER JOURNEY
                        <ArrowRight size={14} />
                    </button>
                </nav>
            </header>

            {/* HERO */}
            <section className="home-hero">
                <div className="home-location">
                    <span className="home-location-line" />

                    <span key={activeDestination.location}>
                        {activeDestination.location}
                    </span>
                </div>

                <div className="home-hero-content">
                    <h1 key={`title-${activeIndex}`}>
                        {activeDestination.title}
                        <br />
                        <em>{activeDestination.highlight}</em>
                    </h1>

                    <p className="home-description">
                        When travel plans break, TripRescue AI
                        understands what else is at risk — and
                        rebuilds your journey around the disruption.
                    </p>

                    <button
                        className="home-primary-button"
                        onClick={onEnterApp}
                    >
                        <span>EXPLORE YOUR JOURNEY</span>
                        <ArrowRight size={17} />
                    </button>
                </div>

                {/* TRUST INDICATOR */}
                <div className="home-trust">
                    <ShieldCheck size={17} />

                    <div>
                        <strong>
                            YOUR JOURNEY IS MONITORED
                        </strong>

                        <span>
                            Flights · Hotels · Transfers · Experiences
                        </span>
                    </div>
                </div>
            </section>

            {/* CAROUSEL CONTROLS */}
            <div className="home-carousel">
                <div className="home-carousel-numbers">
                    <span>
                        {String(activeIndex + 1).padStart(2, "0")}
                    </span>

                    <div className="home-carousel-progress">
                        <div
                            key={activeIndex}
                            className="home-carousel-progress-fill"
                        />
                    </div>

                    <span>
                        {String(destinations.length).padStart(2, "0")}
                    </span>
                </div>

                <div className="home-destination-list">
                    {destinations.map((destination, index) => (
                        <button
                            key={destination.location}
                            className={
                                index === activeIndex
                                    ? "active"
                                    : ""
                            }
                            onClick={() =>
                                setActiveIndex(index)
                            }
                        >
                            {destination.location.split(",")[0]}
                        </button>
                    ))}
                </div>
            </div>

            {/* SCROLL INDICATOR */}
            <button
                className="home-scroll"
                onClick={() =>
                    document
                        .querySelector(".home-story")
                        ?.scrollIntoView({
                            behavior: "smooth",
                        })
                }
            >
                <span>DISCOVER</span>
                <ChevronDown size={15} />
            </button>

            {/* STORY SECTION */}
            <section className="home-story">
                <div>
                    <p className="home-story-eyebrow">
                        TRIPRESCUE AI
                    </p>

                    <h2>
                        We don't plan your trip.
                        <br />
                        <em>We protect it.</em>
                    </h2>
                </div>

                <p>
                    A trip isn't a list of bookings. It's a
                    connected system of dependencies. When one
                    part breaks, TripRescue AI understands what
                    else will break — and helps rebuild the
                    journey around it.
                </p>
            </section>
        </main>
    );
}

export default Home;