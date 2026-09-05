import {
    ArrowLeft,
    ArrowRight,
    Check,
    CheckCircle2,
    Clock3,
    IndianRupee,
    MapPin,
    Plane,
    RefreshCw,
    ShieldCheck,
    Sparkles,
    WalletCards,
    AlertTriangle,
} from "lucide-react";

const PARIS_IMAGE =
    "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1600&q=85";

function getRecoveryData(plan) {
    if (!plan) return null;

    const id = String(plan.id || "").toLowerCase();

    if (
        id.includes("recommended") ||
        id.includes("best")
    ) {
        return {
            label: "Recommended",
            tag: "BEST OVERALL",
            flight: {
                date: "14 SEP",
                departure: "16:10",
                arrival: "22:10",
                code: "AF 217",
                route: "Delhi → Paris",
                details: "Business · Direct",
            },
            transfer: "23:00",
            hotel: "23:30",
            activity: "15 SEP · 19:00",
            extraCost: "₹4,200",
            delay: "+2h",
            preservation: "96%",
            description:
                "The strongest balance of time, convenience and itinerary preservation.",
        };
    }

    if (
        id.includes("low") ||
        id.includes("cost") ||
        id.includes("budget")
    ) {
        return {
            label: "Lower Cost",
            tag: "SAVE MORE",
            flight: {
                date: "14 SEP → 15 SEP",
                departure: "22:10",
                arrival: "04:10",
                code: "AI 326",
                route: "Delhi → Paris",
                details: "Economy · Alternative",
            },
            transfer: "05:00",
            hotel: "06:00",
            activity: "16 SEP · 19:00",
            extraCost: "₹1,100",
            delay: "+8h",
            preservation: "82%",
            description:
                "Reduces the additional cost while accepting a longer arrival delay.",
        };
    }

    if (
        id.includes("flex") ||
        id.includes("saving")
    ) {
        return {
            label: "Flexible",
            tag: "MAXIMUM SAVINGS",
            flight: {
                date: "15 SEP",
                departure: "08:40",
                arrival: "20:15",
                code: "ALT 842",
                route: "Delhi → Paris",
                details: "Economy · 1 stop",
            },
            transfer: "21:00",
            hotel: "22:00",
            activity: "16 SEP · 19:00",
            extraCost: "₹0",
            delay: "+8h",
            preservation: "71%",
            description:
                "Avoids additional spend by accepting a more flexible route and schedule.",
        };
    }

    return {
        label: plan.title || "Recovery Plan",
        tag: "ALTERNATIVE",
        flight: {
            date: "14 SEP",
            departure: "16:10",
            arrival: "22:10",
            code: "ALT 217",
            route: "Delhi → Paris",
            details: "Alternative itinerary",
        },
        transfer: "23:00",
        hotel: "23:30",
        activity: "15 SEP · 19:00",
        extraCost: "₹4,200",
        delay: "+2h",
        preservation: "90%",
        description:
            "A practical alternative designed to keep the journey moving.",
    };
}

function getScore(plan, recoveryData) {
    if (!plan) return recoveryData?.preservation || "90%";

    if (plan.preferenceScore !== undefined) {
        return `${Math.round(plan.preferenceScore)}%`;
    }

    if (plan.score !== undefined) {
        return `${Math.round(plan.score)}%`;
    }

    return recoveryData?.preservation || "90%";
}

function Metric({ label, value, dark = false }) {
    return (
        <div
            className={`recovery-metric ${
                dark ? "recovery-metric-dark" : ""
            }`}
        >
            <span>{label}</span>
            <strong>{value}</strong>
        </div>
    );
}

function RecoveryPlanCard({
    plan,
    index,
    selected,
    onSelect,
}) {
    const data = getRecoveryData(plan);
    const score = getScore(plan, data);

    const isRecommended =
        String(plan?.id || "")
            .toLowerCase()
            .includes("recommended") ||
        index === 0;

    return (
        <article
            className={`recovery-plan-card ${
                selected ? "selected" : ""
            } ${isRecommended ? "recommended" : ""}`}
        >
            <div className="plan-card-top">
                <div>
                    <div className="plan-number">
                        0{index + 1}
                    </div>

                    <div className="plan-card-title-row">
                        <h3>
                            {data.label}
                        </h3>

                        {isRecommended && (
                            <span className="plan-best-badge">
                                <Sparkles size={12} />
                                RECOMMENDED
                            </span>
                        )}
                    </div>
                </div>

                <div className="plan-score">
                    <strong>{score}</strong>
                    <span>match</span>
                </div>
            </div>

            <p className="plan-description">
                {data.description}
            </p>

            <div className="plan-flight">
                <div className="plan-flight-date">
                    {data.flight.date}
                </div>

                <div className="plan-flight-route">
                    <div className="plan-time">
                        {data.flight.departure}
                        <span>DEL</span>
                    </div>

                    <div className="plan-flight-line">
                        <span />
                        <Plane size={14} />
                        <span />
                    </div>

                    <div className="plan-time">
                        {data.flight.arrival}
                        <span>CDG</span>
                    </div>
                </div>

                <div className="plan-flight-meta">
                    <strong>{data.flight.code}</strong>
                    <span>{data.flight.details}</span>
                </div>
            </div>

            <div className="plan-metrics">
                <Metric
                    label="Additional cost"
                    value={data.extraCost}
                />

                <Metric
                    label="Arrival impact"
                    value={data.delay}
                />

                <Metric
                    label="Itinerary preserved"
                    value={data.preservation}
                />
            </div>

            <div className="plan-card-bottom">
                <div className="plan-preservation">
                    <CheckCircle2 size={15} />
                    <span>
                        Eiffel Tower preserved
                    </span>
                </div>

                <button
                    type="button"
                    className={`plan-select-button ${
                        selected ? "selected" : ""
                    }`}
                    onClick={() => onSelect(plan)}
                >
                    {selected ? (
                        <>
                            <Check size={15} />
                            Selected
                        </>
                    ) : (
                        <>
                            Select plan
                            <ArrowRight size={15} />
                        </>
                    )}
                </button>
            </div>
        </article>
    );
}

export default function Recovery({
    plans = [],
    disruption,
    selectedPlan,
    recovered,
    aiAnalysis,
    onBack,
    onSelectPlan,
    onViewItinerary,
}) {
    const activePlan =
        selectedPlan || plans[0] || null;

    const activeData =
        getRecoveryData(activePlan);

    const disruptionTitle =
        disruption?.type ||
        "Flight disruption";

    const disruptionReason =
        disruption?.reason ||
        "A disruption has been detected in your journey.";

    const analysisSummary =
        aiAnalysis?.summary ||
        aiAnalysis?.reasoning ||
        aiAnalysis?.message ||
        "The disruption affects your onward connections. TripRescue has evaluated alternative routes while protecting as much of your original itinerary as possible.";

    return (
        <div className="recovery-page">
            <style>{`
                .recovery-page {
                    min-height: 100vh;
                    background: #f5f2ec;
                    color: #20201d;
                    font-family: Inter, "Helvetica Neue", Arial, sans-serif;
                    padding-bottom: 70px;
                }

                .recovery-page *,
                .recovery-page *::before,
                .recovery-page *::after {
                    box-sizing: border-box;
                }

                .recovery-topbar {
                    height: 76px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 0 5vw;
                    border-bottom: 1px solid rgba(32,32,29,.12);
                    background: rgba(245,242,236,.94);
                }

                .recovery-back {
                    appearance: none;
                    border: 0;
                    background: transparent !important;
                    color: #242420 !important;
                    display: inline-flex;
                    align-items: center;
                    gap: 9px;
                    padding: 9px 0;
                    font-size: 13px;
                    font-weight: 600;
                    cursor: pointer;
                }

                .recovery-back:hover {
                    opacity: .65;
                }

                .recovery-brand {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    color: #20201d;
                }

                .recovery-brand-mark {
                    width: 28px;
                    height: 28px;
                    border: 1px solid #20201d;
                    border-radius: 50%;
                    display: grid;
                    place-items: center;
                }

                .recovery-brand-mark svg {
                    width: 15px;
                    height: 15px;
                }

                .recovery-brand-text {
                    font-size: 12px;
                    font-weight: 700;
                    letter-spacing: .18em;
                }

                .recovery-brand-ai {
                    font-size: 8px;
                    letter-spacing: .15em;
                    opacity: .55;
                }

                .recovery-status {
                    display: flex;
                    align-items: center;
                    gap: 7px;
                    font-size: 10px;
                    font-weight: 700;
                    letter-spacing: .12em;
                    color: #53624e;
                }

                .recovery-status-dot {
                    width: 7px;
                    height: 7px;
                    border-radius: 50%;
                    background: #6f8168;
                }

                .recovery-content {
                    width: min(1320px, 90vw);
                    margin: 0 auto;
                }

                .recovery-heading {
                    padding: 58px 0 34px;
                    display: flex;
                    justify-content: space-between;
                    align-items: end;
                    gap: 30px;
                }

                .recovery-eyebrow {
                    margin: 0 0 13px;
                    font-size: 10px;
                    font-weight: 700;
                    letter-spacing: .2em;
                    color: #77746c;
                }

                .recovery-heading h1 {
                    margin: 0;
                    color: #1e1e1b !important;
                    font-family: Georgia, "Times New Roman", serif;
                    font-size: clamp(38px, 5vw, 68px);
                    line-height: .98;
                    font-weight: 400;
                    letter-spacing: -.045em;
                }

                .recovery-heading-copy {
                    max-width: 420px;
                    color: #68665f !important;
                    font-size: 14px;
                    line-height: 1.7;
                    margin: 0;
                }

                .recovery-hero {
                    position: relative;
                    min-height: 420px;
                    overflow: hidden;
                    border-radius: 2px;
                    background: #171714;
                    color: #ffffff !important;
                    display: grid;
                    grid-template-columns: 1.12fr .88fr;
                }

                .recovery-hero-image {
                    position: relative;
                    min-height: 420px;
                    overflow: hidden;
                    background:
                        linear-gradient(
                            135deg,
                            #2d2b25,
                            #8c8069
                        );
                }

                .recovery-hero-image img {
                    width: 100%;
                    height: 100%;
                    display: block;
                    object-fit: cover;
                    object-position: center;
                    position: absolute;
                    inset: 0;
                }

                .recovery-hero-image::after {
                    content: "";
                    position: absolute;
                    inset: 0;
                    background:
                        linear-gradient(
                            90deg,
                            rgba(0,0,0,.05),
                            rgba(0,0,0,.28)
                        );
                    pointer-events: none;
                }

                .recovery-image-label {
                    position: absolute;
                    left: 26px;
                    bottom: 24px;
                    z-index: 2;
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    color: #fff !important;
                    font-size: 10px;
                    font-weight: 700;
                    letter-spacing: .18em;
                    text-shadow: 0 1px 8px rgba(0,0,0,.5);
                }

                .recovery-image-label span {
                    width: 6px;
                    height: 6px;
                    border-radius: 50%;
                    background: #fff;
                }

                .recovery-hero-copy {
                    position: relative;
                    z-index: 3;
                    padding: 48px 48px 42px;
                    background: #171714 !important;
                    color: #ffffff !important;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                }

                .recovery-hero-copy * {
                    color: inherit;
                }

                .hero-disruption-label {
                    display: inline-flex;
                    width: fit-content;
                    align-items: center;
                    gap: 8px;
                    padding: 8px 11px;
                    border: 1px solid rgba(255,255,255,.24);
                    color: #f3eee5 !important;
                    font-size: 9px;
                    font-weight: 700;
                    letter-spacing: .16em;
                }

                .hero-disruption-label svg {
                    color: #f3eee5 !important;
                }

                .recovery-hero-copy h2 {
                    margin: 22px 0 12px;
                    color: #ffffff !important;
                    font-family: Georgia, "Times New Roman", serif;
                    font-size: clamp(30px, 3vw, 46px);
                    line-height: 1.04;
                    font-weight: 400;
                    letter-spacing: -.035em;
                }

                .recovery-hero-copy p {
                    margin: 0;
                    max-width: 500px;
                    color: rgba(255,255,255,.72) !important;
                    font-size: 13px;
                    line-height: 1.75;
                }

                .hero-analysis {
                    margin-top: 25px;
                    padding-top: 20px;
                    border-top: 1px solid rgba(255,255,255,.14);
                }

                .hero-analysis-label {
                    color: rgba(255,255,255,.46) !important;
                    font-size: 9px;
                    font-weight: 700;
                    letter-spacing: .16em;
                    margin-bottom: 8px;
                }

                .hero-analysis-text {
                    color: rgba(255,255,255,.82) !important;
                    font-size: 12px;
                    line-height: 1.65;
                }

                .hero-bottom {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 20px;
                    margin-top: 28px;
                }

                .hero-route {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    color: rgba(255,255,255,.7) !important;
                    font-size: 10px;
                    font-weight: 700;
                    letter-spacing: .13em;
                }

                .hero-route svg {
                    color: #fff !important;
                }

                .hero-protected {
                    display: inline-flex;
                    align-items: center;
                    gap: 7px;
                    color: #dce4d7 !important;
                    font-size: 10px;
                    font-weight: 700;
                    letter-spacing: .08em;
                }

                .impact-strip {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    border: 1px solid #ddd8cf;
                    border-top: 0;
                    background: #fbfaf7;
                }

                .impact-item {
                    min-height: 92px;
                    padding: 20px 22px;
                    border-right: 1px solid #ddd8cf;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                }

                .impact-item:last-child {
                    border-right: 0;
                }

                .impact-item span {
                    color: #89857c !important;
                    font-size: 9px;
                    font-weight: 700;
                    letter-spacing: .15em;
                    margin-bottom: 7px;
                }

                .impact-item strong {
                    color: #24241f !important;
                    font-family: Georgia, "Times New Roman", serif;
                    font-size: 20px;
                    font-weight: 400;
                }

                .section-heading {
                    padding: 68px 0 26px;
                    display: flex;
                    justify-content: space-between;
                    align-items: end;
                    gap: 20px;
                }

                .section-heading h2 {
                    margin: 0;
                    color: #25251f !important;
                    font-family: Georgia, "Times New Roman", serif;
                    font-weight: 400;
                    font-size: 31px;
                    letter-spacing: -.025em;
                }

                .section-heading p {
                    max-width: 420px;
                    margin: 0;
                    color: #77746d !important;
                    font-size: 12px;
                    line-height: 1.7;
                }

                .plans-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 15px;
                }

                .recovery-plan-card {
                    min-width: 0;
                    background: #ffffff !important;
                    color: #24241f !important;
                    border: 1px solid #dedad2;
                    padding: 25px;
                    position: relative;
                    transition:
                        transform .22s ease,
                        border-color .22s ease,
                        box-shadow .22s ease;
                }

                .recovery-plan-card:hover {
                    transform: translateY(-3px);
                    border-color: #aaa59b;
                    box-shadow: 0 15px 35px rgba(36,35,30,.08);
                }

                .recovery-plan-card.recommended {
                    border-color: #777a69;
                }

                .recovery-plan-card.selected {
                    border: 1.5px solid #24241f;
                    box-shadow: 0 15px 40px rgba(36,35,30,.10);
                }

                .plan-card-top {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    gap: 15px;
                }

                .plan-number {
                    color: #aaa69d !important;
                    font-size: 9px;
                    font-weight: 700;
                    letter-spacing: .15em;
                    margin-bottom: 11px;
                }

                .plan-card-title-row {
                    display: flex;
                    flex-direction: column;
                    gap: 9px;
                }

                .plan-card-title-row h3 {
                    margin: 0;
                    color: #20201c !important;
                    font-family: Georgia, "Times New Roman", serif;
                    font-size: 25px;
                    font-weight: 400;
                    letter-spacing: -.025em;
                }

                .plan-best-badge {
                    width: fit-content;
                    display: inline-flex;
                    align-items: center;
                    gap: 5px;
                    color: #59604e !important;
                    font-size: 8px;
                    font-weight: 800;
                    letter-spacing: .13em;
                }

                .plan-best-badge svg {
                    color: #59604e !important;
                }

                .plan-score {
                    min-width: 58px;
                    text-align: right;
                }

                .plan-score strong {
                    display: block;
                    color: #20201c !important;
                    font-family: Georgia, "Times New Roman", serif;
                    font-size: 23px;
                    font-weight: 400;
                }

                .plan-score span {
                    color: #9a968d !important;
                    font-size: 8px;
                    font-weight: 700;
                    letter-spacing: .1em;
                    text-transform: uppercase;
                }

                .plan-description {
                    min-height: 58px;
                    margin: 22px 0;
                    color: #68665e !important;
                    font-size: 11px;
                    line-height: 1.7;
                }

                .plan-flight {
                    padding: 17px 0;
                    border-top: 1px solid #e4e0d8;
                    border-bottom: 1px solid #e4e0d8;
                }

                .plan-flight-date {
                    color: #8c887f !important;
                    font-size: 8px;
                    font-weight: 800;
                    letter-spacing: .16em;
                    margin-bottom: 13px;
                }

                .plan-flight-route {
                    display: flex;
                    align-items: center;
                    gap: 9px;
                }

                .plan-time {
                    color: #22221e !important;
                    font-family: Georgia, "Times New Roman", serif;
                    font-size: 20px;
                    white-space: nowrap;
                }

                .plan-time span {
                    display: block;
                    color: #89857c !important;
                    font-family: Inter, "Helvetica Neue", Arial, sans-serif;
                    font-size: 8px;
                    font-weight: 800;
                    letter-spacing: .12em;
                    margin-top: 3px;
                }

                .plan-flight-line {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    gap: 5px;
                    color: #78766f !important;
                }

                .plan-flight-line span {
                    height: 1px;
                    flex: 1;
                    background: #cbc7bf;
                }

                .plan-flight-line svg {
                    color: #55534c !important;
                    flex-shrink: 0;
                }

                .plan-flight-meta {
                    margin-top: 13px;
                    display: flex;
                    gap: 8px;
                    align-items: center;
                    flex-wrap: wrap;
                }

                .plan-flight-meta strong {
                    color: #33332e !important;
                    font-size: 9px;
                    letter-spacing: .1em;
                }

                .plan-flight-meta span {
                    color: #99958b !important;
                    font-size: 9px;
                }

                .plan-metrics {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 8px;
                    padding: 19px 0;
                }

                .recovery-metric {
                    min-width: 0;
                }

                .recovery-metric span {
                    display: block;
                    color: #96928a !important;
                    font-size: 8px;
                    font-weight: 700;
                    line-height: 1.4;
                    margin-bottom: 5px;
                }

                .recovery-metric strong {
                    color: #24241f !important;
                    font-family: Georgia, "Times New Roman", serif;
                    font-size: 16px;
                    font-weight: 400;
                }

                .plan-card-bottom {
                    padding-top: 15px;
                    border-top: 1px solid #e4e0d8;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 10px;
                }

                .plan-preservation {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    color: #69715e !important;
                    font-size: 9px;
                    font-weight: 700;
                }

                .plan-preservation svg {
                    color: #69715e !important;
                }

                .plan-select-button {
                    appearance: none;
                    border: 1px solid #2b2b26;
                    background: #ffffff !important;
                    color: #25251f !important;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: 7px;
                    padding: 10px 13px;
                    font-size: 9px;
                    font-weight: 800;
                    letter-spacing: .06em;
                    cursor: pointer;
                    white-space: nowrap;
                }

                .plan-select-button:hover {
                    background: #25251f !important;
                    color: #ffffff !important;
                }

                .plan-select-button.selected {
                    background: #25251f !important;
                    color: #ffffff !important;
                }

                .plan-select-button.selected svg {
                    color: #ffffff !important;
                }

                .selected-plan {
                    margin-top: 48px;
                    background: #20201c !important;
                    color: #ffffff !important;
                    padding: 30px 32px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 30px;
                }

                .selected-plan * {
                    color: inherit;
                }

                .selected-plan-left {
                    display: flex;
                    align-items: center;
                    gap: 17px;
                }

                .selected-plan-icon {
                    width: 43px;
                    height: 43px;
                    border: 1px solid rgba(255,255,255,.22);
                    display: grid;
                    place-items: center;
                    flex-shrink: 0;
                }

                .selected-plan-icon svg {
                    color: #fff !important;
                }

                .selected-plan-label {
                    color: rgba(255,255,255,.45) !important;
                    font-size: 8px;
                    font-weight: 800;
                    letter-spacing: .15em;
                    margin-bottom: 5px;
                }

                .selected-plan h3 {
                    margin: 0;
                    color: #ffffff !important;
                    font-family: Georgia, "Times New Roman", serif;
                    font-size: 23px;
                    font-weight: 400;
                }

                .selected-plan-description {
                    color: rgba(255,255,255,.62) !important;
                    font-size: 11px;
                    line-height: 1.6;
                    max-width: 430px;
                }

                .view-itinerary-button {
                    appearance: none;
                    border: 1px solid #ffffff;
                    background: #ffffff !important;
                    color: #22221e !important;
                    padding: 13px 18px;
                    display: inline-flex;
                    align-items: center;
                    gap: 9px;
                    font-size: 9px;
                    font-weight: 800;
                    letter-spacing: .07em;
                    cursor: pointer;
                    white-space: nowrap;
                }

                .view-itinerary-button:hover {
                    background: transparent !important;
                    color: #ffffff !important;
                }

                .recovered-banner {
                    margin: 34px 0 0;
                    padding: 22px 25px;
                    background: #e7ebe2;
                    border: 1px solid #ccd3c5;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 20px;
                }

                .recovered-banner-left {
                    display: flex;
                    align-items: center;
                    gap: 14px;
                }

                .recovered-banner-icon {
                    width: 37px;
                    height: 37px;
                    border: 1px solid #89957e;
                    display: grid;
                    place-items: center;
                    color: #56634d !important;
                }

                .recovered-banner h3 {
                    margin: 0 0 4px;
                    color: #293026 !important;
                    font-family: Georgia, "Times New Roman", serif;
                    font-size: 19px;
                    font-weight: 400;
                }

                .recovered-banner p {
                    margin: 0;
                    color: #66705f !important;
                    font-size: 10px;
                }

                .recovered-banner-button {
                    appearance: none;
                    border: 1px solid #4c5545;
                    background: transparent !important;
                    color: #394134 !important;
                    padding: 11px 15px;
                    display: inline-flex;
                    align-items: center;
                    gap: 7px;
                    font-size: 9px;
                    font-weight: 800;
                    cursor: pointer;
                }

                .recovery-footer-note {
                    margin-top: 50px;
                    padding-top: 23px;
                    border-top: 1px solid #ddd8cf;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    color: #97938b !important;
                    font-size: 9px;
                    letter-spacing: .08em;
                }

                .recovery-footer-note svg {
                    color: #77736a !important;
                }

                @media (max-width: 1000px) {
                    .recovery-hero {
                        grid-template-columns: 1fr;
                    }

                    .recovery-hero-image {
                        min-height: 300px;
                    }

                    .plans-grid {
                        grid-template-columns: 1fr;
                    }

                    .impact-strip {
                        grid-template-columns: repeat(2, 1fr);
                    }

                    .impact-item:nth-child(2) {
                        border-right: 0;
                    }

                    .impact-item:nth-child(-n+2) {
                        border-bottom: 1px solid #ddd8cf;
                    }
                }

                @media (max-width: 700px) {
                    .recovery-topbar {
                        padding: 0 20px;
                    }

                    .recovery-brand-text {
                        display: none;
                    }

                    .recovery-content {
                        width: min(92vw, 600px);
                    }

                    .recovery-heading {
                        display: block;
                        padding: 42px 0 27px;
                    }

                    .recovery-heading-copy {
                        margin-top: 18px;
                    }

                    .recovery-hero-copy {
                        padding: 31px 25px;
                    }

                    .recovery-hero-image {
                        min-height: 240px;
                    }

                    .impact-strip {
                        grid-template-columns: 1fr 1fr;
                    }

                    .section-heading {
                        display: block;
                        padding-top: 50px;
                    }

                    .section-heading p {
                        margin-top: 12px;
                    }

                    .plan-card-bottom {
                        align-items: flex-end;
                    }

                    .selected-plan {
                        flex-direction: column;
                        align-items: flex-start;
                    }

                    .selected-plan-description {
                        margin: 0;
                    }

                    .recovered-banner {
                        align-items: flex-start;
                        flex-direction: column;
                    }

                    .hero-bottom {
                        align-items: flex-start;
                        flex-direction: column;
                    }
                }
            `}</style>

            <header className="recovery-topbar">
                <button
                    className="recovery-back"
                    onClick={onBack}
                >
                    <ArrowLeft size={16} />
                    Back
                </button>

                <div className="recovery-brand">
                    <div className="recovery-brand-mark">
                        <ShieldCheck size={15} />
                    </div>

                    <span className="recovery-brand-text">
                        TRIPRESCUE
                    </span>

                    <span className="recovery-brand-ai">
                        AI
                    </span>
                </div>

                <div className="recovery-status">
                    <span className="recovery-status-dot" />
                    RECOVERY ENGINE ACTIVE
                </div>
            </header>

            <main className="recovery-content">
                <section className="recovery-heading">
                    <div>
                        <p className="recovery-eyebrow">
                            TRIP RECOVERY
                        </p>

                        <h1>
                            Repair the journey.
                        </h1>
                    </div>

                    <p className="recovery-heading-copy">
                        Your itinerary has been evaluated as
                        one connected system. Choose the
                        recovery path that best fits your
                        priorities.
                    </p>
                </section>

                <section className="recovery-hero">
                    <div className="recovery-hero-image">
                        <img
                            src={PARIS_IMAGE}
                            alt="Paris skyline"
                            onError={(event) => {
                                event.currentTarget.style.display =
                                    "none";
                            }}
                        />

                        <div className="recovery-image-label">
                            <span />
                            PARIS · FRANCE
                        </div>
                    </div>

                    <div className="recovery-hero-copy">
                        <div>
                            <div className="hero-disruption-label">
                                <AlertTriangle size={13} />
                                DISRUPTION DETECTED
                            </div>

                            <h2>
                                {disruptionTitle}
                            </h2>

                            <p>
                                {disruptionReason}
                            </p>

                            <div className="hero-analysis">
                                <div className="hero-analysis-label">
                                    TRIPRESCUE ANALYSIS
                                </div>

                                <div className="hero-analysis-text">
                                    {analysisSummary}
                                </div>
                            </div>
                        </div>

                        <div className="hero-bottom">
                            <div className="hero-route">
                                <MapPin size={13} />
                                MUMBAI
                                <ArrowRight size={12} />
                                DELHI
                                <ArrowRight size={12} />
                                PARIS
                            </div>

                            <div className="hero-protected">
                                <ShieldCheck size={14} />
                                ITINERARY PROTECTED
                            </div>
                        </div>
                    </div>
                </section>

                <section className="impact-strip">
                    <div className="impact-item">
                        <span>
                            DISRUPTION
                        </span>
                        <strong>
                            {disruption?.severity ||
                                "HIGH"}{" "}
                            severity
                        </strong>
                    </div>

                    <div className="impact-item">
                        <span>
                            AFFECTED
                        </span>
                        <strong>
                            Connected itinerary
                        </strong>
                    </div>

                    <div className="impact-item">
                        <span>
                            OPTIONS
                        </span>
                        <strong>
                            {plans.length || 3} recovery paths
                        </strong>
                    </div>

                    <div className="impact-item">
                        <span>
                            OBJECTIVE
                        </span>
                        <strong>
                            Preserve the journey
                        </strong>
                    </div>
                </section>

                <section>
                    <div className="section-heading">
                        <div>
                            <p className="recovery-eyebrow">
                                AI DECISION SET
                            </p>

                            <h2>
                                Three ways forward.
                            </h2>
                        </div>

                        <p>
                            Each option is scored against
                            your travel priorities, balancing
                            cost, time, activities and
                            convenience.
                        </p>
                    </div>

                    <div className="plans-grid">
                        {plans.length > 0 ? (
                            plans
                                .slice(0, 3)
                                .map(
                                    (
                                        plan,
                                        index
                                    ) => (
                                        <RecoveryPlanCard
                                            key={
                                                plan.id ||
                                                index
                                            }
                                            plan={
                                                plan
                                            }
                                            index={
                                                index
                                            }
                                            selected={
                                                selectedPlan?.id ===
                                                plan.id
                                            }
                                            onSelect={
                                                onSelectPlan
                                            }
                                        />
                                    )
                                )
                        ) : (
                            <div
                                style={{
                                    gridColumn:
                                        "1 / -1",
                                    padding:
                                        "45px",
                                    background:
                                        "#fff",
                                    border:
                                        "1px solid #dedad2",
                                    color:
                                        "#68665e",
                                    textAlign:
                                        "center",
                                }}
                            >
                                Recovery options are
                                being generated.
                            </div>
                        )}
                    </div>
                </section>

                {selectedPlan &&
                    activeData && (
                        <section className="selected-plan">
                            <div className="selected-plan-left">
                                <div className="selected-plan-icon">
                                    <CheckCircle2
                                        size={19}
                                    />
                                </div>

                                <div>
                                    <div className="selected-plan-label">
                                        SELECTED RECOVERY
                                    </div>

                                    <h3>
                                        {
                                            activeData.label
                                        }
                                    </h3>
                                </div>
                            </div>

                            <p className="selected-plan-description">
                                {
                                    activeData.description
                                }
                            </p>

                            <button
                                type="button"
                                className="view-itinerary-button"
                                onClick={
                                    onViewItinerary
                                }
                            >
                                View rebuilt itinerary
                                <ArrowRight
                                    size={14}
                                />
                            </button>
                        </section>
                    )}

                {recovered && (
                    <section className="recovered-banner">
                        <div className="recovered-banner-left">
                            <div className="recovered-banner-icon">
                                <Check size={18} />
                            </div>

                            <div>
                                <h3>
                                    Trip recovered.
                                </h3>

                                <p>
                                    Your itinerary has
                                    been rebuilt around
                                    the selected recovery
                                    plan.
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            className="recovered-banner-button"
                            onClick={
                                onViewItinerary
                            }
                        >
                            <RefreshCw size={13} />
                            View final itinerary
                        </button>
                    </section>
                )}

                <div className="recovery-footer-note">
                    <ShieldCheck size={13} />
                    Recovery recommendations are
                    optimized from your current trip
                    preferences.
                </div>
            </main>
        </div>
    );
}