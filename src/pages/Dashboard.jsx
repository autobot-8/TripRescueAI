import { useState } from "react";

import {
  ArrowRight,
  Bell,
  CalendarDays,
  ChevronRight,
  Clock3,
  Hotel,
  MapPin,
  Plane,
  ShieldCheck,
  SlidersHorizontal,
} from "lucide-react";

const itinerary = [
  {
    date: "14 SEP",
    time: "08:20",
    title: "Mumbai → Delhi",
    subtitle: "AI 102 · Economy",
    type: "flight",
    status: "ON TIME",
  },
  {
    date: "14 SEP",
    time: "14:10",
    title: "Delhi → Paris",
    subtitle: "AI 182 · Business",
    type: "flight",
    status: "MONITORED",
  },
  {
    date: "15 SEP",
    time: "20:40",
    title: "Le Meurice",
    subtitle: "Check-in · 15 Sep — 21 Sep",
    type: "hotel",
    status: "CONFIRMED",
  },
];

const defaultPreferences = {
  cost: 20,
  time: 25,
  activities: 25,
  convenience: 20,
  reliability: 10,
};

const preferenceLabels = {
  cost: "Cost",
  time: "Travel time",
  activities: "Activities",
  convenience: "Convenience",
  reliability: "Reliability",
};

function EventIcon({ type }) {
  return type === "hotel" ? (
    <Hotel size={17} strokeWidth={1.4} />
  ) : (
    <Plane size={17} strokeWidth={1.4} />
  );
}

function normalizePreferences(values) {
  const total = Object.values(values).reduce(
    (sum, value) => sum + value,
    0
  );

  if (total === 100) {
    return values;
  }

  const scale = 100 / total;
  const normalized = {};

  Object.entries(values).forEach(([key, value]) => {
    normalized[key] = Math.round(value * scale);
  });

  const normalizedTotal = Object.values(normalized).reduce(
    (sum, value) => sum + value,
    0
  );

  const difference = 100 - normalizedTotal;

  normalized.convenience += difference;

  return normalized;
}

export default function Dashboard({
  onOpenDisruption,
  onOpenJourney,
  onPreferencesChange,
}) {
  const [preferences, setPreferences] = useState(
    defaultPreferences
  );

  const [showPreferences, setShowPreferences] =
    useState(false);

  const updatePreference = (key, value) => {
    const numericValue = Number(value);

    const updated = {
      ...preferences,
      [key]: numericValue,
    };

    const normalized = normalizePreferences(updated);

    setPreferences(normalized);

    if (onPreferencesChange) {
      onPreferencesChange(normalized);
    }
  };

  return (
    <div className="dashboard-page">
      {/* TOP BAR */}

      <div className="dashboard-topbar">
        <div>
          <span className="dashboard-eyebrow">
            GOOD MORNING, SWAYAM
          </span>

          <h1>Your journeys</h1>
        </div>

        <div className="dashboard-actions">
          <button className="dashboard-icon">
            <Bell size={17} strokeWidth={1.4} />
            <span />
          </button>

          <button className="dashboard-profile">
            SM
          </button>
        </div>
      </div>

      {/* ACTIVE JOURNEY */}

      <section className="active-journey">
        <div className="journey-image">
          <img
            src="https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1800&q=88"
            alt="Paris skyline"
          />

          <div className="journey-image-overlay" />

          <div className="journey-image-content">
            <span>ACTIVE JOURNEY</span>

            <h2>Europe Escape</h2>

            <p>14 — 21 September 2026</p>
          </div>

          {/* NEW VISUAL LOCATION TAG */}
          <div className="dashboard-destination-tag">
            <span>DESTINATION</span>
            <strong>PARIS</strong>
            <small>FRANCE</small>
          </div>
        </div>

        <div className="journey-details">
          <div className="journey-status">
            <div>
              <span className="status-live" />
              JOURNEY PROTECTED
            </div>

            <ShieldCheck
              size={18}
              strokeWidth={1.25}
            />
          </div>

          {/* ROUTE VISUAL */}

          <div className="journey-route">
            <div className="journey-city">
              <small>MUMBAI</small>
              <strong>BOM</strong>
            </div>

            <div className="route-visual">
              <span />
              <div>
                <Plane
                  size={13}
                  strokeWidth={1.2}
                />
              </div>
              <span />
            </div>

            <div className="journey-city">
              <small>PARIS</small>
              <strong>CDG</strong>
            </div>
          </div>

          {/* ROUTE CAPTION */}

          <div className="dashboard-route-caption">
            <span>MUMBAI</span>
            <span>DELHI</span>
            <span>PARIS</span>
          </div>

          <div className="journey-stats">
            <div>
              <span>FLIGHTS</span>
              <strong>03</strong>
            </div>

            <div>
              <span>HOTEL</span>
              <strong>01</strong>
            </div>

            <div>
              <span>EXPERIENCES</span>
              <strong>04</strong>
            </div>
          </div>

          <button
            className="journey-button"
            onClick={onOpenJourney}
          >
            Open journey
            <ArrowRight size={15} />
          </button>
        </div>
      </section>

      {/* MAIN GRID */}

      <section className="dashboard-grid">
        {/* ITINERARY */}

        <div className="dashboard-card itinerary-card">
          <div className="card-header">
            <div>
              <span className="dashboard-eyebrow">
                UPCOMING
              </span>

              <h2>Your itinerary</h2>
            </div>

            <button
              className="text-button"
              onClick={onOpenJourney}
            >
              View all
              <ChevronRight size={14} />
            </button>
          </div>

          {/* NEW DESTINATION STRIP */}

          <div className="dashboard-destination-strip">
            <div className="dashboard-mini-destination-image">
              <img
                src="https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=500&q=80"
                alt="Paris"
              />
            </div>

            <div>
              <span>YOUR NEXT DESTINATION</span>
              <strong>Paris, France</strong>
            </div>

            <div className="dashboard-destination-date">
              <span>ARRIVAL</span>
              <strong>14 SEP</strong>
            </div>
          </div>

          <div className="dashboard-timeline">
            {itinerary.map((item, index) => (
              <div
                className="dashboard-event"
                key={item.title}
              >
                <div className="event-date">
                  <strong>{item.date}</strong>
                  <span>2026</span>
                </div>

                <div className="event-line">
                  <div className="event-dot" />

                  {index !== itinerary.length - 1 && (
                    <div className="event-vertical-line" />
                  )}
                </div>

                <div className="event-main">
                  <div className="event-time">
                    <Clock3 size={13} />
                    {item.time}
                  </div>

                  <h3>{item.title}</h3>

                  <p>{item.subtitle}</p>
                </div>

                <div className="event-meta">
                  <div className="event-type">
                    <EventIcon type={item.type} />
                  </div>

                  <span>{item.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* MONITORING */}

        <div
          className="dashboard-card monitoring-card"
          onClick={onOpenDisruption}
          style={{ cursor: "pointer" }}
        >
          <div className="card-header">
            <div>
              <span className="dashboard-eyebrow">
                TRIPRESCUE
              </span>

              <h2>Monitoring</h2>
            </div>

            <span className="monitoring-live">
              LIVE
            </span>
          </div>

          <div className="monitoring-number">
            04
          </div>

          <p className="monitoring-description">
            itinerary elements are currently being
            monitored for disruption.
          </p>

          {/* NEW MONITORING VISUAL */}

          <div className="dashboard-monitor-visual">
            <div className="monitor-visual-line">
              <span className="monitor-visual-node active" />
              <span className="monitor-visual-connector" />
              <span className="monitor-visual-node active" />
              <span className="monitor-visual-connector" />
              <span className="monitor-visual-node active" />
              <span className="monitor-visual-connector" />
              <span className="monitor-visual-node active" />
            </div>

            <div className="monitor-visual-labels">
              <span>FLIGHT</span>
              <span>STAY</span>
              <span>TRANSFER</span>
              <span>EXPERIENCE</span>
            </div>
          </div>

          <div className="monitoring-items">
            <div>
              <span className="monitor-dot safe" />
              <span>Flights</span>
              <strong>03</strong>
            </div>

            <div>
              <span className="monitor-dot safe" />
              <span>Accommodation</span>
              <strong>01</strong>
            </div>

            <div>
              <span className="monitor-dot safe" />
              <span>Experiences</span>
              <strong>04</strong>
            </div>
          </div>

          <div className="monitoring-footer">
            <ShieldCheck size={15} />
            <span>
              Everything is operating normally.
            </span>
          </div>
        </div>

        {/* NEXT EVENT */}

        <div className="dashboard-card next-card">
          <div className="card-header">
            <div>
              <span className="dashboard-eyebrow">
                NEXT EVENT
              </span>

              <h2>Delhi → Paris</h2>
            </div>

            <Plane
              size={19}
              strokeWidth={1.3}
            />
          </div>

          <div className="next-time">
            <strong>14:10</strong>
            <span>14 SEP</span>
          </div>

          <div className="next-route">
            <div>
              <small>DEL</small>
              <span>Delhi</span>
            </div>

            <div className="next-line">
              <span />
              <div />
              <span />
            </div>

            <div>
              <small>CDG</small>
              <span>Paris</span>
            </div>
          </div>

          {/* NEW AIRCRAFT INFORMATION */}

          <div className="dashboard-flight-detail">
            <div>
              <span>FLIGHT</span>
              <strong>AI 182</strong>
            </div>

            <div>
              <span>CABIN</span>
              <strong>BUSINESS</strong>
            </div>

            <div>
              <span>DURATION</span>
              <strong>~9H 30M</strong>
            </div>
          </div>

          <div className="next-footer">
            <div>
              <MapPin size={14} />
              <span>Terminal 3</span>
            </div>

            <span>AI 182</span>
          </div>
        </div>

        {/* TRAVEL SUMMARY */}

        <div className="dashboard-card summary-card">
          <span className="dashboard-eyebrow">
            JOURNEY SUMMARY
          </span>

          <div className="summary-title">
            <h2>₹48,500</h2>
            <span>Total trip value</span>
          </div>

          {/* NEW SUMMARY VISUAL */}

          <div className="dashboard-summary-visual">
            <div>
              <strong>14</strong>
              <span>SEP</span>
            </div>

            <div className="summary-visual-line">
              <span />
              <div />
              <span />
            </div>

            <div>
              <strong>21</strong>
              <span>SEP</span>
            </div>
          </div>

          <div className="summary-line">
            <div>
              <CalendarDays size={15} />
              <span>7 nights</span>
            </div>

            <div>
              <MapPin size={15} />
              <span>2 cities</span>
            </div>
          </div>

          <button className="summary-button">
            Manage journey
            <ArrowRight size={14} />
          </button>
        </div>

        {/* TRAVELER PRIORITIES */}

        <div className="dashboard-card preferences-card">
          <div className="card-header">
            <div>
              <span className="dashboard-eyebrow">
                RECOVERY PROFILE
              </span>

              <h2>Traveler priorities</h2>
            </div>

            <button
              className="preferences-toggle"
              onClick={() =>
                setShowPreferences(
                  !showPreferences
                )
              }
              aria-label="Toggle traveler priorities"
            >
              <SlidersHorizontal
                size={17}
                strokeWidth={1.35}
              />
            </button>
          </div>

          <p className="preferences-description">
            TripRescue uses these priorities when
            ranking recovery options.
          </p>

          {!showPreferences ? (
            <div className="preference-preview">
              <div className="preference-primary">
                <span>TOP PRIORITY</span>

                <strong>
                  {Object.entries(preferences)
                    .sort(
                      ([, a], [, b]) => b - a
                    )[0][0]
                    .replace(
                      /^./,
                      (char) =>
                        char.toUpperCase()
                    )}
                </strong>
              </div>

              <div className="preference-bars">
                {Object.entries(preferences).map(
                  ([key, value]) => (
                    <div
                      className="preference-bar-row"
                      key={key}
                    >
                      <span>
                        {preferenceLabels[key]}
                      </span>

                      <div className="preference-bar">
                        <div
                          style={{
                            width: `${value}%`,
                          }}
                        />
                      </div>

                      <strong>{value}%</strong>
                    </div>
                  )
                )}
              </div>
            </div>
          ) : (
            <div className="preference-editor">
              {Object.entries(preferences).map(
                ([key, value]) => (
                  <div
                    className="preference-slider-row"
                    key={key}
                  >
                    <div>
                      <span>
                        {preferenceLabels[key]}
                      </span>

                      <strong>{value}%</strong>
                    </div>

                    <input
                      type="range"
                      min="0"
                      max="60"
                      value={value}
                      onChange={(event) =>
                        updatePreference(
                          key,
                          event.target.value
                        )
                      }
                    />
                  </div>
                )
              )}

              <div className="preference-total">
                <span>
                  Recovery weighting
                </span>

                <strong>100%</strong>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* BOTTOM CTA */}

      <section className="dashboard-bottom">
        <div>
          <span className="dashboard-eyebrow">
            TRIPRESCUE INTELLIGENCE
          </span>

          <h2>
            Your journey is being
            <br />
            <em>watched over.</em>
          </h2>
        </div>

        <div className="bottom-protection">
          <ShieldCheck
            size={21}
            strokeWidth={1.25}
          />

          <p>
            If something changes, we'll trace the
            impact across your itinerary and help you
            find the best way forward.
          </p>

          <button onClick={onOpenDisruption}>
            How protection works
            <ArrowRight size={14} />
          </button>
        </div>
      </section>

      {/* DASHBOARD VISUAL ENHANCEMENTS */}

      <style>{`
        .dashboard-destination-tag {
          position: absolute;
          right: 22px;
          bottom: 22px;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 2px;
          color: #fff;
          text-align: right;
        }

        .dashboard-destination-tag span {
          font-size: 8px;
          letter-spacing: .18em;
          opacity: .7;
        }

        .dashboard-destination-tag strong {
          font-size: 17px;
          font-weight: 500;
          letter-spacing: .08em;
        }

        .dashboard-destination-tag small {
          font-size: 8px;
          letter-spacing: .15em;
          opacity: .72;
        }

        .journey-city {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .dashboard-route-caption {
          display: flex;
          justify-content: space-between;
          margin: -12px 0 18px;
          font-size: 7px;
          letter-spacing: .16em;
          opacity: .42;
        }

        .dashboard-route-caption span:nth-child(2) {
          position: relative;
          left: 1px;
        }

        .dashboard-destination-strip {
          display: flex;
          align-items: center;
          gap: 13px;
          margin: 0 0 20px;
          padding: 10px;
          border: 1px solid rgba(30, 38, 34, .09);
          background: rgba(255,255,255,.38);
        }

        .dashboard-mini-destination-image {
          width: 54px;
          height: 44px;
          overflow: hidden;
          flex-shrink: 0;
        }

        .dashboard-mini-destination-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .dashboard-destination-strip > div:nth-child(2) {
          display: flex;
          flex-direction: column;
          gap: 4px;
          flex: 1;
        }

        .dashboard-destination-strip span {
          font-size: 7px;
          letter-spacing: .16em;
          opacity: .5;
        }

        .dashboard-destination-strip strong {
          font-size: 13px;
          font-weight: 500;
          letter-spacing: .02em;
        }

        .dashboard-destination-date {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 4px;
          padding-right: 5px;
        }

        .dashboard-destination-date strong {
          font-size: 11px;
          letter-spacing: .08em;
        }

        .dashboard-monitor-visual {
          margin: 24px 0 22px;
          padding: 13px 4px 0;
        }

        .monitor-visual-line {
          display: flex;
          align-items: center;
          width: 100%;
        }

        .monitor-visual-node {
          width: 7px;
          height: 7px;
          border: 1px solid currentColor;
          border-radius: 50%;
          opacity: .35;
          flex-shrink: 0;
        }

        .monitor-visual-node.active {
          opacity: .85;
        }

        .monitor-visual-connector {
          height: 1px;
          flex: 1;
          background: currentColor;
          opacity: .14;
        }

        .monitor-visual-labels {
          display: flex;
          justify-content: space-between;
          margin-top: 9px;
          font-size: 6px;
          letter-spacing: .13em;
          opacity: .42;
        }

        .dashboard-flight-detail {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
          margin: 20px 0 18px;
          padding: 13px 0;
          border-top: 1px solid rgba(30, 38, 34, .08);
          border-bottom: 1px solid rgba(30, 38, 34, .08);
        }

        .dashboard-flight-detail div {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .dashboard-flight-detail span {
          font-size: 6px;
          letter-spacing: .15em;
          opacity: .48;
        }

        .dashboard-flight-detail strong {
          font-size: 9px;
          font-weight: 600;
          letter-spacing: .05em;
        }

        .dashboard-summary-visual {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 21px 0;
        }

        .dashboard-summary-visual > div:not(.summary-visual-line) {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .dashboard-summary-visual strong {
          font-size: 15px;
          font-weight: 500;
        }

        .dashboard-summary-visual span {
          font-size: 7px;
          letter-spacing: .14em;
          opacity: .45;
        }

        .summary-visual-line {
          display: flex;
          align-items: center;
          flex: 1;
        }

        .summary-visual-line span {
          width: 5px;
          height: 5px;
          border: 1px solid currentColor;
          border-radius: 50%;
          opacity: .6;
        }

        .summary-visual-line div {
          height: 1px;
          flex: 1;
          background: currentColor;
          opacity: .15;
        }

        @media (max-width: 700px) {
          .dashboard-destination-tag {
            right: 15px;
            bottom: 15px;
          }

          .dashboard-destination-strip {
            gap: 9px;
          }

          .dashboard-mini-destination-image {
            width: 46px;
            height: 40px;
          }

          .dashboard-flight-detail {
            gap: 6px;
          }
        }
      `}</style>
    </div>
  );
}