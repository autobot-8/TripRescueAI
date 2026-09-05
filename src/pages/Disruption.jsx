import { useState } from "react";
import {
    ArrowLeft,
    ArrowRight,
    AlertTriangle,
    Plane,
    Hotel,
    MapPin,
    CloudRain,
    Clock3,
    X,
    ShieldCheck,
    Activity,
} from "lucide-react";

import { tripData } from "../data/tripData";
import { analyzeDisruption } from "../services/impactEngine";
import { generateRecoveryPlans } from "../services/recoveryEngine";

const disruptions = [
    {
        id: "flight-cancel",
        icon: Plane,
        title: "Flight Cancellation",
        description: "A flight in your itinerary has been cancelled.",
        eventId: "flight-2",
        reason: "AI 182 has been cancelled by the airline.",
        severity: "HIGH",
    },
    {
        id: "flight-delay",
        icon: Clock3,
        title: "Flight Delay",
        description: "A flight arrives later than originally scheduled.",
        eventId: "flight-2",
        reason: "AI 182 has been delayed by 4 hours.",
        severity: "MEDIUM",
    },
    {
        id: "hotel-cancel",
        icon: Hotel,
        title: "Hotel Cancellation",
        description: "Your accommodation becomes unavailable.",
        eventId: "hotel-1",
        reason: "Le Meurice is no longer available for your stay.",
        severity: "HIGH",
    },
    {
        id: "weather",
        icon: CloudRain,
        title: "Weather Disruption",
        description: "Severe weather affects your journey.",
        eventId: "flight-2",
        reason: "Severe weather is affecting your Paris arrival.",
        severity: "HIGH",
    },
];

export default function Disruption({
    onBack,
    onFindRecovery,
    tripPreferences,
}) {
    const [showSimulator, setShowSimulator] = useState(false);
    const [selectedDisruption, setSelectedDisruption] = useState(null);

    const [analyzing, setAnalyzing] = useState(false);
    const [analysis, setAnalysis] = useState(null);

    const simulateDisruption = async () => {
        const disruption = disruptions.find(
            (item) => item.id === selectedDisruption
        );

        if (!disruption) return;

        setShowSimulator(false);
        setAnalysis(null);
        setAnalyzing(true);

        try {
            // --------------------------------------------
            // STEP 1 — LOCAL DEPENDENCY ANALYSIS
            // --------------------------------------------

            const localAnalysis = analyzeDisruption(
                tripData,
                disruption
            );

            // --------------------------------------------
            // STEP 2 — GENERATE RECOVERY CANDIDATES
            // --------------------------------------------

            const personalizedTrip = {
                ...tripData,
                preferences:
                    tripPreferences || tripData.preferences,
            };

            const recoveryPlans = generateRecoveryPlans(
                personalizedTrip,
                disruption,
                localAnalysis
            );

            // --------------------------------------------
            // STEP 3 — SEND EVERYTHING TO GEMINI
            // --------------------------------------------

            const response = await fetch(
                "http://localhost:5000/api/analyze-disruption",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        trip: personalizedTrip,
                        disruption,
                        impactAnalysis: localAnalysis,
                        recoveryPlans,
                    }),
                }
            );

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);

                throw new Error(
                    errorData?.error ||
                    `Gemini request failed with status ${response.status}`
                );
            }

            const result = await response.json();

            if (!result.success || !result.data) {
                throw new Error(
                    result.error || "Invalid Gemini response."
                );
            }

            // --------------------------------------------
            // STEP 4 — COMBINE DETERMINISTIC + AI DATA
            // --------------------------------------------

            setAnalysis({
                ...localAnalysis,

                disruption,

                ai: result.data,

                recoveryPlans,
            });
        } catch (error) {
            console.error("TripRescue AI analysis failed:", error);

            // --------------------------------------------
            // FALLBACK
            // --------------------------------------------
            // If Gemini fails, the deterministic engine
            // still keeps the demo functional.

            const fallbackAnalysis = analyzeDisruption(
                tripData,
                disruption
            );

            setAnalysis({
                ...fallbackAnalysis,
                disruption,

                ai: {
                    summary:
                        "TripRescue detected a disruption and traced its downstream impact across your itinerary.",

                    severity:
                        disruption.severity || fallbackAnalysis.severity,

                    primaryRisk:
                        "The disruption may affect connected bookings and activities later in your journey.",

                    affectedItems:
                        fallbackAnalysis.downstreamImpacts.map(
                            (item) => ({
                                title: item.event.title,
                                impact: item.reason,
                            })
                        ),

                    reasoning: [
                        "The disruption was detected in your itinerary.",
                        "TripRescue traced the dependency chain.",
                        "Connected bookings were identified for recovery planning.",
                    ],

                    recommendedPlanId: null,

                    recommendation:
                        "Recovery options can still be generated from the connected itinerary data.",

                    travelerMessage:
                        "We've identified the disruption and the parts of your journey that may be affected.",
                },

                recoveryPlans: [],
            });
        } finally {
            setAnalyzing(false);
        }
    };

    const findRecoveryOptions = () => {
        if (!analysis) return;

        const personalizedTrip = {
            ...tripData,
            preferences:
                tripPreferences || tripData.preferences,
        };

        const plans =
            analysis.recoveryPlans?.length > 0
                ? analysis.recoveryPlans
                : generateRecoveryPlans(
                    personalizedTrip,
                    analysis.disruption,
                    analysis
                );

        onFindRecovery(
            plans,
            analysis.disruption,
            analysis.ai
        );
    };

    return (
        <div className="disruption-page">
            <header className="disruption-topbar">
                <button
                    className="back-button"
                    onClick={onBack}
                >
                    <ArrowLeft size={15} />
                    Dashboard
                </button>

                <div className="disruption-brand">
                    <div className="brand-square">TR</div>
                    <span>TRIPRESCUE</span>
                </div>

                <div className="protected-status">
                    <span />
                    JOURNEY PROTECTED
                </div>
            </header>

            <main className="disruption-main">
                <section className="disruption-intro">
                    <div>
                        <span className="disruption-eyebrow">
                            DISRUPTION CENTER · EUROPE ESCAPE
                        </span>

                        <h1>
                            When something
                            <br />
                            <em>goes wrong.</em>
                        </h1>

                        <p>
                            TripRescue continuously watches the
                            connections between your flights,
                            accommodation, transfers and experiences.
                        </p>
                    </div>

                    <button
                        className="simulate-button"
                        onClick={() => setShowSimulator(true)}
                    >
                        <AlertTriangle size={16} />
                        Simulate disruption
                    </button>
                </section>

                {/* -------------------------------------------- */}
                {/* NORMAL STATE */}
                {/* -------------------------------------------- */}

                {!analysis && !analyzing && (
                    <section className="normal-state">
                        <div className="normal-icon">
                            <ShieldCheck
                                size={28}
                                strokeWidth={1.2}
                            />
                        </div>

                        <span className="disruption-eyebrow">
                            CURRENT STATUS
                        </span>

                        <h2>
                            All journeys operational.
                        </h2>

                        <p>
                            Your itinerary is being monitored
                            for changes that could affect your journey.
                        </p>

                        <div className="monitor-strip">
                            <div>
                                <span className="green-dot" />
                                Flights
                                <strong>03</strong>
                            </div>

                            <div>
                                <span className="green-dot" />
                                Accommodation
                                <strong>01</strong>
                            </div>

                            <div>
                                <span className="green-dot" />
                                Experiences
                                <strong>04</strong>
                            </div>

                            <div>
                                <span className="green-dot" />
                                Transfers
                                <strong>02</strong>
                            </div>
                        </div>
                    </section>
                )}

                {/* -------------------------------------------- */}
                {/* ANALYZING */}
                {/* -------------------------------------------- */}

                {analyzing && (
                    <section className="analysis-state">
                        <div className="analysis-loader">
                            <Activity size={25} />
                        </div>

                        <span className="disruption-eyebrow">
                            TRIPRESCUE INTELLIGENCE
                        </span>

                        <h2>
                            Analyzing your journey.
                        </h2>

                        <p>
                            Tracing the disruption through your
                            itinerary and identifying everything
                            that could be affected.
                        </p>

                        <div className="analysis-progress">
                            <div />
                        </div>

                        <div className="analysis-steps">
                            <span>
                                ✓ Detecting disruption
                            </span>

                            <span>
                                ✓ Checking dependencies
                            </span>

                            <span>
                                → Calculating downstream impact
                            </span>
                        </div>
                    </section>
                )}

                {/* -------------------------------------------- */}
                {/* DISRUPTED STATE */}
                {/* -------------------------------------------- */}

                {analysis && (
                    <section className="disrupted-state">

                        {/* ALERT */}
                        <div className="disruption-alert">
                            <div className="alert-icon">
                                <AlertTriangle size={23} />
                            </div>

                            <div>
                                <span>
                                    {analysis.ai?.severity ||
                                        analysis.severity}{" "}
                                    SEVERITY · DETECTED JUST NOW
                                </span>

                                <h2>
                                    {analysis.disruption.reason}
                                </h2>

                                <p>
                                    {analysis.directImpact?.event?.title}
                                </p>
                            </div>
                        </div>

                        {/* GEMINI SUMMARY */}
                        {analysis.ai?.summary && (
                            <div className="ai-summary-box">
                                <div className="explanation-icon">
                                    <Activity size={19} />
                                </div>

                                <div>
                                    <span className="disruption-eyebrow">
                                        TRIPRESCUE INTELLIGENCE
                                    </span>

                                    <strong>
                                        What this means for your journey
                                    </strong>

                                    <p>
                                        {analysis.ai.summary}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* IMPACT HEADING */}
                        <div className="impact-heading">
                            <div>
                                <span className="disruption-eyebrow">
                                    IMPACT ANALYSIS
                                </span>

                                <h2>
                                    The disruption doesn't
                                    <br />
                                    <em>stop at the flight.</em>
                                </h2>
                            </div>

                            <div className="impact-count">
                                <strong>
                                    {String(
                                        analysis.totalAffected
                                    ).padStart(2, "0")}
                                </strong>

                                <span>
                                    ELEMENTS
                                    <br />
                                    AFFECTED
                                </span>
                            </div>
                        </div>

                        {/* IMPACT CHAIN */}
                        <div className="impact-chain">
                            {analysis.directImpact && (
                                <ImpactCard
                                    number="01"
                                    event={analysis.directImpact}
                                />
                            )}

                            {analysis.downstreamImpacts.map(
                                (impact, index) => (
                                    <div
                                        className="impact-group"
                                        key={impact.event.id}
                                    >
                                        <ImpactConnector />

                                        <ImpactCard
                                            number={String(
                                                index + 2
                                            ).padStart(2, "0")}
                                            event={impact}
                                        />
                                    </div>
                                )
                            )}
                        </div>

                        {/* GEMINI REASONING */}
                        {analysis.ai?.reasoning?.length > 0 && (
                            <div className="ai-reasoning-box">
                                <div className="explanation-icon">
                                    <ShieldCheck size={19} />
                                </div>

                                <div>
                                    <span className="disruption-eyebrow">
                                        AI REASONING
                                    </span>

                                    <strong>
                                        Why TripRescue flagged these risks
                                    </strong>

                                    <ul>
                                        {analysis.ai.reasoning.map(
                                            (reason, index) => (
                                                <li key={index}>
                                                    {reason}
                                                </li>
                                            )
                                        )}
                                    </ul>
                                </div>
                            </div>
                        )}

                        {/* PRIMARY RISK */}
                        {analysis.ai?.primaryRisk && (
                            <div className="ai-risk-box">
                                <div className="explanation-icon">
                                    <AlertTriangle size={19} />
                                </div>

                                <div>
                                    <span className="disruption-eyebrow">
                                        PRIMARY RISK
                                    </span>

                                    <strong>
                                        What needs attention first
                                    </strong>

                                    <p>
                                        {analysis.ai.primaryRisk}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* ORIGINAL EXPLANATION */}
                        <div className="impact-explanation-box">
                            <div className="explanation-icon">
                                <ShieldCheck size={19} />
                            </div>

                            <div>
                                <strong>
                                    Why are these events affected?
                                </strong>

                                <p>
                                    TripRescue traced the disruption
                                    through the dependency graph. Each
                                    affected event depends on the timing
                                    or availability of the previous event
                                    in your journey.
                                </p>
                            </div>
                        </div>

                        {/* ACTIONS */}
                        <div className="impact-actions">
                            <button
                                className="secondary-action"
                                onClick={() => {
                                    setAnalysis(null);
                                    setSelectedDisruption(null);
                                }}
                            >
                                Reset simulation
                            </button>

                            <button
                                className="primary-action"
                                onClick={findRecoveryOptions}
                            >
                                Find recovery options
                                <ArrowRight size={15} />
                            </button>
                        </div>
                    </section>
                )}
            </main>

            {/* -------------------------------------------- */}
            {/* SIMULATOR MODAL */}
            {/* -------------------------------------------- */}

            {showSimulator && (
                <div
                    className="simulator-overlay"
                    onClick={() =>
                        setShowSimulator(false)
                    }
                >
                    <div
                        className="simulator-modal"
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                    >
                        <div className="simulator-header">
                            <div>
                                <span className="disruption-eyebrow">
                                    DEMO SCENARIO
                                </span>

                                <h2>
                                    Simulate a disruption
                                </h2>
                            </div>

                            <button
                                className="close-modal"
                                onClick={() =>
                                    setShowSimulator(false)
                                }
                            >
                                <X size={17} />
                            </button>
                        </div>

                        <p className="simulator-description">
                            Trigger an external travel disruption
                            and let TripRescue calculate its
                            downstream impact.
                        </p>

                        <div className="disruption-options">
                            {disruptions.map((item) => {
                                const Icon = item.icon;

                                return (
                                    <button
                                        key={item.id}
                                        className={`disruption-option ${selectedDisruption === item.id
                                            ? "selected"
                                            : ""
                                            }`}
                                        onClick={() =>
                                            setSelectedDisruption(
                                                item.id
                                            )
                                        }
                                    >
                                        <div className="option-icon">
                                            <Icon
                                                size={19}
                                                strokeWidth={1.3}
                                            />
                                        </div>

                                        <div>
                                            <strong>
                                                {item.title}
                                            </strong>

                                            <span>
                                                {item.description}
                                            </span>
                                        </div>

                                        <div className="option-radio">
                                            {selectedDisruption ===
                                                item.id && (
                                                    <span />
                                                )}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        <button
                            className="trigger-button"
                            disabled={!selectedDisruption}
                            onClick={simulateDisruption}
                        >
                            Trigger disruption
                            <ArrowRight size={15} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

// ======================================================
// IMPACT CARD
// ======================================================

function ImpactCard({ number, event }) {
    const Icon =
        event.event.type === "flight"
            ? Plane
            : event.event.type === "hotel"
                ? Hotel
                : event.event.type === "transfer"
                    ? MapPin
                    : Activity;

    return (
        <div
            className={`impact-card ${event.impactType === "DIRECT IMPACT"
                ? "impact-danger"
                : ""
                }`}
        >
            <div className="impact-card-top">
                <span>{number}</span>
                <Icon size={19} />
            </div>

            <div>
                <small>
                    {event.impactType}
                </small>

                <h3>
                    {event.event.title}
                </h3>

                <p>
                    {event.reason}
                </p>
            </div>
        </div>
    );
}

// ======================================================
// IMPACT CONNECTOR
// ======================================================

function ImpactConnector() {
    return (
        <div className="impact-connector-line">
            <ArrowRight size={14} />
        </div>
    );
}