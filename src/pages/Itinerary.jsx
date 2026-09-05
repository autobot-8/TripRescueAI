import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Clock3,
  MapPin,
  Plane,
  Building2,
  Sparkles,
  Check,
  RefreshCw,
} from "lucide-react";

export default function Itinerary({
  onBack,
  onOpenDisruption,
  selectedPlan,
  recovered,
}) {
  const isRecovered = Boolean(
    recovered && selectedPlan
  );

  const recoveryData =
    getRecoveryData(selectedPlan);

  const preservationScore =
    getPreservationScore(selectedPlan);

  return (
    <div className="itinerary-page">

      {/* ==================================================
          TOP BAR
      ================================================== */}

      <header className="itinerary-topbar">

        <button
          className="itinerary-back"
          onClick={onBack}
        >
          <ArrowLeft size={15} />
          Dashboard
        </button>

        <div className="itinerary-brand">

          <div className="itinerary-brand-mark">
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

          <span>TRIPRESCUE</span>
          <small>AI</small>
        </div>

        <div className="itinerary-status">
          <span />

          {isRecovered
            ? "JOURNEY RECOVERED"
            : "JOURNEY PROTECTED"}
        </div>

      </header>

      <main className="itinerary-main">

        {/* ==================================================
            DESTINATION HERO
        ================================================== */}

        <section className="itinerary-destination-hero">

          <img
            src="https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1800&q=88"
            alt="Paris"
          />

          <div className="itinerary-destination-overlay" />

          <div className="itinerary-destination-content">

            <span>
              EUROPE ESCAPE · 14—21 SEPTEMBER 2026
            </span>

            <h2>PARIS</h2>

            <p>France · Your journey destination</p>

          </div>

          <div className="itinerary-hero-route">

            <div>
              <small>DEPARTURE</small>
              <strong>BOM</strong>
              <span>MUMBAI</span>
            </div>

            <div className="itinerary-hero-line">
              <span />
              <div>
                <Plane
                  size={14}
                  strokeWidth={1.2}
                />
              </div>
              <span />
            </div>

            <div>
              <small>ARRIVAL</small>
              <strong>CDG</strong>
              <span>PARIS</span>
            </div>

          </div>

        </section>

        {/* ==================================================
            RECOVERY SUCCESS BANNER
        ================================================== */}

        {isRecovered && (
          <section className="itinerary-recovered-banner">

            <div className="itinerary-recovered-icon">
              <Check size={17} />
            </div>

            <div className="itinerary-recovered-content">

              <span>
                TRIPRESCUE · RECOVERY COMPLETE
              </span>

              <h3>
                Your itinerary has been rebuilt.
              </h3>

              <p>
                Your selected recovery plan —{" "}
                <strong>
                  {selectedPlan.name}
                </strong>{" "}
                — has been applied across the
                affected parts of your journey.
              </p>

            </div>

            <div className="itinerary-recovered-score">

              <span>PREFERENCE MATCH</span>

              <strong>
                {selectedPlan.preferenceScore ?? 0}%
              </strong>

            </div>

          </section>
        )}

        {/* ==================================================
            HEADING
        ================================================== */}

        <section className="itinerary-heading">

          <div>

            <span className="itinerary-eyebrow">
              {isRecovered
                ? "RECOVERED JOURNEY"
                : "CONNECTED ITINERARY"}
            </span>

            <h1>
              Your journey,
              <br />

              <em>
                {isRecovered
                  ? "back on track."
                  : "at a glance."}
              </em>
            </h1>

            <p>
              {isRecovered
                ? "Your itinerary has been recalculated around the disruption."
                : "Every booking is connected and continuously monitored for disruption."}
            </p>

          </div>

          <div className="itinerary-route">

            <span>MUMBAI</span>
            <strong>BOM</strong>

            <div className="route-line">
              <i />
            </div>

            <span>PARIS</span>
            <strong>CDG</strong>

          </div>

        </section>

        {/* ==================================================
            JOURNEY OVERVIEW
        ================================================== */}

        <section className="itinerary-overview">

          <div className="itinerary-overview-item">

            <span>DEPARTURE</span>

            <strong>14 SEP</strong>

            <small>MUMBAI · BOM</small>

          </div>

          <div className="itinerary-overview-divider" />

          <div className="itinerary-overview-item">

            <span>DESTINATION</span>

            <strong>PARIS</strong>

            <small>FRANCE · CDG</small>

          </div>

          <div className="itinerary-overview-divider" />

          <div className="itinerary-overview-item">

            <span>DURATION</span>

            <strong>7 NIGHTS</strong>

            <small>14—21 SEP 2026</small>

          </div>

          <div className="itinerary-overview-divider" />

          <div className="itinerary-overview-item">

            <span>ELEMENTS</span>

            <strong>05</strong>

            <small>CONNECTED BOOKINGS</small>

          </div>

        </section>

        {/* ==================================================
            RECOVERY SUMMARY
        ================================================== */}

        {isRecovered && (
          <section className="itinerary-recovery-summary">

            <div className="recovery-summary-heading">

              <div className="summary-heading-icon">
                <RefreshCw size={16} />
              </div>

              <div>

                <span>RECOVERY APPLIED</span>

                <h3>
                  {selectedPlan.name}
                </h3>

              </div>

            </div>

            <div className="recovery-summary-stats">

              <div>
                <span>ADDITIONAL COST</span>

                <strong>
                  {selectedPlan.additionalCost === 0
                    ? "₹0"
                    : `+₹${Number(
                        selectedPlan.additionalCost
                      ).toLocaleString("en-IN")}`}
                </strong>
              </div>

              <div>
                <span>ARRIVAL CHANGE</span>

                <strong>
                  {selectedPlan.arrivalChange ||
                    "No change"}
                </strong>
              </div>

              <div>
                <span>ITINERARY PRESERVED</span>

                <strong>
                  {preservationScore}%
                </strong>
              </div>

            </div>

          </section>
        )}

        {/* ==================================================
            MONITORING / PROTECTION
        ================================================== */}

        <section
          className={`itinerary-protection ${
            isRecovered
              ? "protection-recovered"
              : ""
          }`}
        >

          <div className="protection-icon">

            {isRecovered ? (
              <Check size={16} />
            ) : (
              <Sparkles size={16} />
            )}

          </div>

          <div>

            <span>
              {isRecovered
                ? "JOURNEY RECOVERED"
                : "TRIPRESCUE INTELLIGENCE"}
            </span>

            <h3>
              {isRecovered
                ? "Your updated itinerary is being monitored."
                : "Your itinerary is actively monitored."}
            </h3>

            <p>
              {isRecovered
                ? "The recovered journey will continue to be monitored for new disruptions."
                : "If a flight, transfer, hotel or experience changes, TripRescue will trace the impact across your journey."}
            </p>

          </div>

          <button onClick={onOpenDisruption}>
            View monitoring
            <ArrowRight size={15} />
          </button>

        </section>

        {/* ==================================================
            TIMELINE HEADING
        ================================================== */}

        <section className="itinerary-timeline-heading">

          <div>

            <span className="itinerary-eyebrow">
              YOUR JOURNEY
            </span>

            <h2>
              {isRecovered
                ? "The recovered itinerary."
                : "Five connected elements."}
            </h2>

          </div>

          <div className="itinerary-timeline-count">
            <strong>05</strong>
            <span>ELEMENTS</span>
          </div>

        </section>

        {/* ==================================================
            TIMELINE
        ================================================== */}

        <section className="timeline">

          {/* 01 */}

          <TimelineItem
            number="01"
            icon={<Plane size={17} />}
            type="FLIGHT"
            title="Mumbai → Delhi"
            date="14 SEP"
            time="08:30 — 10:45"
            location="BOM → DEL"
            booking="AI 101"
            visualImage="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=500&q=80"
          />

          {/* 02 */}

          <TimelineItem
            number="02"
            icon={<Plane size={17} />}
            type="FLIGHT"
            title="Delhi → Paris"
            date="14 SEP"
            time={
              isRecovered
                ? recoveryData.flight.time
                : "14:10 — 20:10"
            }
            location="DEL → CDG"
            booking={
              isRecovered
                ? recoveryData.flight.booking
                : "AI 182"
            }
            important
            recovered={isRecovered}
            originalTime={
              isRecovered
                ? recoveryData.flight.originalTime
                : null
            }
            status={
              isRecovered
                ? recoveryData.flight.status
                : null
            }
            visualImage="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=500&q=80"
          />

          {/* 03 */}

          <TimelineItem
            number="03"
            icon={<MapPin size={17} />}
            type="TRANSFER"
            title="Paris Airport Transfer"
            date="14 SEP"
            time={
              isRecovered
                ? recoveryData.transfer.time
                : "21:15"
            }
            location="CDG → Central Paris"
            booking={
              isRecovered
                ? recoveryData.transfer.booking
                : "Reserved"
            }
            recovered={isRecovered}
            originalTime={
              isRecovered
                ? recoveryData.transfer.originalTime
                : null
            }
            status={
              isRecovered
                ? recoveryData.transfer.status
                : null
            }
            visualImage="https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=500&q=80"
          />

          {/* 04 */}

          <TimelineItem
            number="04"
            icon={<Building2 size={17} />}
            type="HOTEL"
            title={recoveryData.hotel.title}
            date="14—21 SEP"
            time={
              isRecovered
                ? recoveryData.hotel.time
                : "Check-in 22:30"
            }
            location="Paris, France"
            booking={
              isRecovered
                ? recoveryData.hotel.booking
                : "7 nights"
            }
            recovered={isRecovered}
            originalTime={
              isRecovered
                ? recoveryData.hotel.originalTime
                : null
            }
            status={
              isRecovered
                ? recoveryData.hotel.status
                : null
            }
            visualImage="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=500&q=80"
          />

          {/* 05 */}

          <TimelineItem
            number="05"
            icon={<MapPin size={17} />}
            type="EXPERIENCE"
            title={recoveryData.activity.title}
            date={
              isRecovered
                ? recoveryData.activity.date
                : "15 SEP"
            }
            time={
              isRecovered
                ? recoveryData.activity.time
                : "19:00"
            }
            location="Paris, France"
            booking={
              isRecovered
                ? recoveryData.activity.booking
                : "Reserved"
            }
            recovered={isRecovered}
            originalTime={
              isRecovered
                ? recoveryData.activity.originalTime
                : null
            }
            status={
              isRecovered
                ? recoveryData.activity.status
                : null
            }
            visualImage="https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=500&q=80"
          />

        </section>

        {/* ==================================================
            RECOVERED CHANGES
        ================================================== */}

        {isRecovered && (
          <section className="itinerary-changes">

            <div className="changes-header">

              <div>

                <span className="itinerary-eyebrow">
                  WHAT CHANGED
                </span>

                <h2>
                  The journey changed.
                  <br />

                  <em>
                    {recoveryData.changeHeadline}
                  </em>
                </h2>

              </div>

              <div className="changes-status">
                <Check size={14} />
                VERIFIED
              </div>

            </div>

            <div className="changes-grid">

              {recoveryData.changes.map(
                (change) => (
                  <ChangeItem
                    key={change.title}
                    title={change.title}
                    text={change.text}
                    detail={change.detail}
                  />
                )
              )}

            </div>

          </section>
        )}

        {/* ==================================================
            BOTTOM
        ================================================== */}

        <section className="itinerary-bottom">

          <div>

            <span>05</span>

            <small>
              CONNECTED
              <br />
              ELEMENTS
            </small>

          </div>

          <p>
            {isRecovered
              ? "TripRescue rebuilt the connected journey around the disruption instead of treating each booking separately."
              : "Your trip isn't a list of separate bookings. TripRescue understands how each element depends on the others."}
          </p>

          <button onClick={onOpenDisruption}>

            {isRecovered
              ? "View disruption analysis"
              : "Open disruption center"}

            <ArrowRight size={15} />

          </button>

        </section>

      </main>

      {/* ==================================================
          VISUAL ENHANCEMENT CSS
      ================================================== */}

      <style>{`

        /* BRAND */

        .itinerary-brand {
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .itinerary-brand-mark {
          width: 27px;
          height: 27px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .itinerary-brand-mark svg {
          width: 100%;
          height: 100%;
          display: block;
        }

        .itinerary-brand span {
          letter-spacing: .16em;
        }

        .itinerary-brand small {
          font-size: 7px;
          letter-spacing: .13em;
          opacity: .55;
          align-self: flex-start;
          margin-top: 2px;
        }

        /* DESTINATION HERO */

        .itinerary-destination-hero {
          position: relative;
          height: 285px;
          margin-bottom: 42px;
          overflow: hidden;
          background: #222;
        }

        .itinerary-destination-hero > img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transform: scale(1.025);
        }

        .itinerary-destination-overlay {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(
              90deg,
              rgba(15,18,17,.78) 0%,
              rgba(15,18,17,.38) 48%,
              rgba(15,18,17,.12) 100%
            );
        }

        .itinerary-destination-content {
          position: absolute;
          left: 34px;
          bottom: 32px;
          color: #fff;
        }

        .itinerary-destination-content span {
          display: block;
          margin-bottom: 9px;
          font-size: 8px;
          letter-spacing: .2em;
          opacity: .7;
        }

        .itinerary-destination-content h2 {
          margin: 0;
          font-size: 52px;
          line-height: .9;
          font-weight: 400;
          letter-spacing: .05em;
        }

        .itinerary-destination-content p {
          margin: 12px 0 0;
          font-size: 11px;
          letter-spacing: .08em;
          opacity: .7;
        }

        .itinerary-hero-route {
          position: absolute;
          right: 34px;
          bottom: 34px;
          display: flex;
          align-items: center;
          gap: 18px;
          color: #fff;
        }

        .itinerary-hero-route > div:not(.itinerary-hero-line) {
          display: flex;
          flex-direction: column;
          gap: 3px;
          text-align: right;
        }

        .itinerary-hero-route > div:last-child {
          text-align: left !important;
        }

        .itinerary-hero-route small {
          font-size: 6px;
          letter-spacing: .15em;
          opacity: .55;
        }

        .itinerary-hero-route strong {
          font-size: 16px;
          font-weight: 500;
          letter-spacing: .08em;
        }

        .itinerary-hero-route span {
          font-size: 7px;
          letter-spacing: .1em;
          opacity: .55;
        }

        .itinerary-hero-line {
          display: flex;
          align-items: center;
          width: 95px;
        }

        .itinerary-hero-line > span {
          width: 5px;
          height: 5px;
          border: 1px solid rgba(255,255,255,.8);
          border-radius: 50%;
          flex-shrink: 0;
        }

        .itinerary-hero-line > div {
          height: 1px;
          flex: 1;
          background: rgba(255,255,255,.35);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .itinerary-hero-line svg {
          padding: 6px;
          width: 27px;
          height: 27px;
          border: 1px solid rgba(255,255,255,.28);
          border-radius: 50%;
          box-sizing: content-box;
          background: rgba(15,18,17,.25);
        }

        /* OVERVIEW */

        .itinerary-overview {
          display: grid;
          grid-template-columns: 1fr auto 1fr auto 1fr auto 1fr;
          align-items: center;
          margin: 30px 0 42px;
          padding: 23px 25px;
          border-top: 1px solid rgba(30,38,34,.1);
          border-bottom: 1px solid rgba(30,38,34,.1);
        }

        .itinerary-overview-item {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .itinerary-overview-item span {
          font-size: 7px;
          letter-spacing: .17em;
          opacity: .45;
        }

        .itinerary-overview-item strong {
          font-size: 13px;
          font-weight: 600;
          letter-spacing: .07em;
        }

        .itinerary-overview-item small {
          font-size: 7px;
          letter-spacing: .08em;
          opacity: .5;
        }

        .itinerary-overview-divider {
          width: 1px;
          height: 32px;
          background: rgba(30,38,34,.11);
          margin: 0 24px;
        }

        /* TIMELINE HEADING */

        .itinerary-timeline-heading {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin: 55px 0 22px;
        }

        .itinerary-timeline-heading h2 {
          margin: 7px 0 0;
          font-size: 26px;
          font-weight: 400;
          letter-spacing: -.02em;
        }

        .itinerary-timeline-count {
          display: flex;
          align-items: baseline;
          gap: 8px;
        }

        .itinerary-timeline-count strong {
          font-size: 23px;
          font-weight: 400;
        }

        .itinerary-timeline-count span {
          font-size: 7px;
          letter-spacing: .16em;
          opacity: .45;
        }

        /* TIMELINE VISUALS */

        .timeline-item {
          position: relative;
        }

        .timeline-item::after {
          content: "";
          position: absolute;
          left: 25px;
          right: 25px;
          bottom: 0;
          height: 1px;
          background: rgba(30,38,34,.07);
        }

        .timeline-item > .timeline-icon {
          position: relative;
          z-index: 2;
        }

        .timeline-item.timeline-important {
          background: rgba(30,38,34,.025);
        }

        .timeline-item.timeline-recovered {
          background: rgba(30,38,34,.018);
        }

        .timeline-updated-label {
          display: inline-flex;
          margin-left: 8px;
          padding: 4px 7px;
          border: 1px solid rgba(30,38,34,.13);
          font-size: 6px;
          letter-spacing: .13em;
          font-weight: 700;
        }

        .timeline-original-time {
          display: block;
          margin-top: 4px;
          font-size: 7px;
          opacity: .4;
          letter-spacing: .02em;
        }

        /* RECOVERY */

        .itinerary-recovery-summary {
          position: relative;
          overflow: hidden;
        }

        .itinerary-recovery-summary::after {
          content: "";
          position: absolute;
          width: 170px;
          height: 170px;
          right: -70px;
          top: -80px;
          border: 1px solid rgba(30,38,34,.08);
          border-radius: 50%;
          pointer-events: none;
        }

        /* MOBILE */

        @media (max-width: 800px) {

          .itinerary-destination-hero {
            height: 250px;
          }

          .itinerary-destination-content {
            left: 22px;
            bottom: 24px;
          }

          .itinerary-destination-content h2 {
            font-size: 40px;
          }

          .itinerary-hero-route {
            display: none;
          }

          .itinerary-overview {
            grid-template-columns: 1fr 1fr;
            gap: 20px;
          }

          .itinerary-overview-divider {
            display: none;
          }

        }

        @media (max-width: 520px) {

          .itinerary-destination-hero {
            margin-left: -15px;
            margin-right: -15px;
          }

          .itinerary-destination-content h2 {
            font-size: 34px;
          }

          .itinerary-overview {
            padding: 18px;
          }

          .itinerary-overview-item strong {
            font-size: 11px;
          }

          .itinerary-timeline-heading h2 {
            font-size: 22px;
          }

        }

      `}</style>

    </div>
  );
}

/* ==================================================
   PRESERVATION SCORE
================================================== */

function getPreservationScore(plan) {
  if (!plan) {
    return 100;
  }

  const breakdown =
    plan.scoreBreakdown || {};

  if (
    typeof breakdown.itineraryPreservation ===
      "number"
  ) {
    return Math.round(
      breakdown.itineraryPreservation
    );
  }

  const activities =
    Number(breakdown.activities ?? 0);

  const convenience =
    Number(breakdown.convenience ?? 0);

  const preservation =
    ((activities + convenience) / 50) * 100;

  return Math.round(
    Math.max(
      0,
      Math.min(100, preservation)
    )
  );
}

/* ==================================================
   RECOVERY DATA
================================================== */

function getRecoveryData(plan) {

  if (!plan) {
    return {
      flight: {
        time: "14:10 — 20:10",
        originalTime: null,
        booking: "AI 182",
        status: "CONFIRMED",
      },

      transfer: {
        time: "21:15",
        originalTime: null,
        booking: "Reserved",
        status: "CONFIRMED",
      },

      hotel: {
        title: "Le Meurice",
        time: "Check-in 22:30",
        originalTime: null,
        booking: "7 nights",
        status: "CONFIRMED",
      },

      activity: {
        title: "Eiffel Tower",
        date: "15 SEP",
        time: "19:00",
        originalTime: null,
        booking: "Reserved",
        status: "CONFIRMED",
      },

      changeHeadline:
        "The important parts didn't.",

      changes: [],
    };
  }

  if (plan.id === "recommended") {
    return {
      flight: {
        time: "16:10 — 22:10",
        originalTime: "14:10 — 20:10",
        booking: "AF 217 · REBOOKED",
        status: "REBOOKED",
      },

      transfer: {
        time: "23:00",
        originalTime: "21:15",
        booking: "Updated · VERIFIED",
        status: "UPDATED",
      },

      hotel: {
        title: "Le Meurice",
        time: "Check-in 23:30",
        originalTime: "Check-in 22:30",
        booking: "7 nights · UPDATED",
        status: "UPDATED",
      },

      activity: {
        title: "Eiffel Tower",
        date: "15 SEP",
        time: "19:00",
        originalTime: "15 SEP · 19:00",
        booking: "Reserved · VERIFIED",
        status: "PRESERVED",
      },

      changeHeadline:
        "The important parts didn't.",

      changes: [
        {
          title: "Flight",
          text: "Alternative service assigned",
          detail: "AI 182 → AF 217",
        },

        {
          title: "Transfer",
          text: "Pickup time recalculated",
          detail: "21:15 → 23:00",
        },

        {
          title: "Hotel",
          text: "Check-in time adjusted",
          detail: "22:30 → 23:30",
        },

        {
          title: "Experience",
          text: "Schedule compatibility verified",
          detail: "Eiffel Tower preserved",
        },
      ],
    };
  }

  if (plan.id === "low-cost") {
    return {
      flight: {
        time: "22:10 — 04:10",
        originalTime: "14:10 — 20:10",
        booking: "AI 326 · ALTERNATIVE",
        status: "REBOOKED",
      },

      transfer: {
        time: "05:00",
        originalTime: "21:15",
        booking: "Rescheduled · VERIFIED",
        status: "RESCHEDULED",
      },

      hotel: {
        title: "Le Meurice",
        time: "Check-in 06:00",
        originalTime: "Check-in 22:30",
        booking: "7 nights · LATE CHECK-IN",
        status: "UPDATED",
      },

      activity: {
        title: "Eiffel Tower",
        date: "16 SEP",
        time: "19:00",
        originalTime: "15 SEP · 19:00",
        booking: "Rescheduled · VERIFIED",
        status: "RESCHEDULED",
      },

      changeHeadline:
        "More savings. A later arrival.",

      changes: [
        {
          title: "Flight",
          text: "Lower-cost alternative selected",
          detail: "AI 182 → AI 326",
        },

        {
          title: "Transfer",
          text: "Pickup moved to arrival",
          detail: "21:15 → 05:00",
        },

        {
          title: "Hotel",
          text: "Late check-in arranged",
          detail: "22:30 → 06:00",
        },

        {
          title: "Experience",
          text: "Activity moved to next day",
          detail: "15 SEP → 16 SEP",
        },
      ],
    };
  }

  if (plan.id === "flexible") {
    return {
      flight: {
        time: "08:40 — 20:15",
        originalTime: "14:10 — 20:10",
        booking: "ALTERNATE ROUTE · 1 STOP",
        status: "REROUTED",
      },

      transfer: {
        time: "21:00",
        originalTime: "21:15",
        booking: "New transfer · VERIFIED",
        status: "CHANGED",
      },

      hotel: {
        title: "Le Meurice",
        time: "Check-in 22:00",
        originalTime: "Check-in 22:30",
        booking: "7 nights · CONFIRMED",
        status: "RESHAPED",
      },

      activity: {
        title: "Eiffel Tower",
        date: "16 SEP",
        time: "19:00",
        originalTime: "15 SEP · 19:00",
        booking: "Rescheduled",
        status: "MOVED",
      },

      changeHeadline:
        "Maximum savings. A reshaped journey.",

      changes: [
        {
          title: "Flight",
          text: "Alternate route selected",
          detail: "1-stop recovery route",
        },

        {
          title: "Transfer",
          text: "New pickup arranged",
          detail: "Aligned with revised arrival",
        },

        {
          title: "Hotel",
          text: "Schedule reshaped",
          detail: "Check-in aligned with route",
        },

        {
          title: "Experience",
          text: "Activity moved",
          detail: "15 SEP → 16 SEP",
        },
      ],
    };
  }

  return getRecoveryData({
    id: "recommended",
  });
}

/* ==================================================
   TIMELINE ITEM
================================================== */

function TimelineItem({
  number,
  icon,
  type,
  title,
  date,
  time,
  location,
  booking,
  important,
  recovered,
  originalTime,
  status,
  visualImage,
}) {
  return (
    <article
      className={`timeline-item ${
        important
          ? "timeline-important"
          : ""
      } ${
        recovered
          ? "timeline-recovered"
          : ""
      }`}
    >

      <div className="timeline-number">
        {number}
      </div>

      <div className="timeline-icon">
        {icon}
      </div>

      <div className="timeline-main">

        <div className="timeline-type-row">

          <span>{type}</span>

          {recovered && (
            <small className="timeline-updated-label">
              {status || "UPDATED"}
            </small>
          )}

        </div>

        <h2>{title}</h2>

        <p>{location}</p>

      </div>

      {/* VISUAL THUMBNAIL */}

      {visualImage && (
        <div className="timeline-visual">

          <img
            src={visualImage}
            alt=""
          />

        </div>
      )}

      <div className="timeline-details">

        <div>
          <CalendarDays size={13} />
          {date}
        </div>

        <div>

          <Clock3 size={13} />

          <span>

            {time}

            {recovered &&
              originalTime && (
                <small className="timeline-original-time">
                  Originally{" "}
                  {originalTime}
                </small>
              )}

          </span>

        </div>

        <small>{booking}</small>

      </div>

    </article>
  );
}

/* ==================================================
   CHANGE ITEM
================================================== */

function ChangeItem({
  title,
  text,
  detail,
}) {
  return (
    <div className="change-item">

      <div className="change-check">
        <Check size={13} />
      </div>

      <div>

        <span>{title}</span>

        <strong>{text}</strong>

        <small>{detail}</small>

      </div>

    </div>
  );
}