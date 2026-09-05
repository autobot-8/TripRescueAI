// ============================================================
// TRIPRESCUE AI — DEMO TRIP DATA
// ============================================================

export const tripData = {
    id: "TRIP-001",

    name: "Europe Escape",

    startDate: "14 Sep 2026",
    endDate: "21 Sep 2026",

    route: "Mumbai → Delhi → Paris",

    status: "PROTECTED",

    totalCost: 48500,

    // ========================================================
    // TRAVELER PREFERENCES
    // ========================================================
    //
    // These weights control how TripRescue ranks recovery
    // options.
    //
    // Total = 100
    //
    // Higher value = more important to this traveler.
    // ========================================================

    preferences: {
        cost: 20,
        time: 25,
        activities: 25,
        convenience: 20,
        reliability: 10,
    },

    // ========================================================
    // ITINERARY EVENTS
    // ========================================================

    events: [
        {
            id: "flight-1",

            type: "flight",

            title: "Mumbai → Delhi",

            location: "Mumbai → Delhi",

            startTime: "2026-09-14T08:30:00",

            endTime: "2026-09-14T10:45:00",

            bookingId: "AI101",

            status: "confirmed",

            provider: "Air India",

            details: "AI 101 · Economy",
        },

        {
            id: "flight-2",

            type: "flight",

            title: "Delhi → Paris",

            location: "Delhi → Paris",

            startTime: "2026-09-14T16:10:00",

            endTime: "2026-09-14T22:10:00",

            bookingId: "AI182",

            status: "confirmed",

            provider: "Air India",

            details: "AI 182 · Economy",
        },

        {
            id: "transfer-1",

            type: "transfer",

            title: "Paris Airport Transfer",

            location: "Charles de Gaulle → Paris",

            startTime: "2026-09-14T23:00:00",

            endTime: "2026-09-15T00:00:00",

            bookingId: "TR-4821",

            status: "confirmed",

            provider: "Private Transfer",

            details: "Airport pickup",
        },

        {
            id: "hotel-1",

            type: "hotel",

            title: "Le Meurice",

            location: "Paris, France",

            startTime: "2026-09-15T00:00:00",

            endTime: "2026-09-21T11:00:00",

            bookingId: "LM-7294",

            status: "confirmed",

            provider: "Le Meurice",

            details: "7 nights · Deluxe Room",
        },

        {
            id: "activity-1",

            type: "activity",

            title: "Eiffel Tower",

            location: "Paris, France",

            startTime: "2026-09-15T19:00:00",

            endTime: "2026-09-15T21:00:00",

            bookingId: "ET-5512",

            status: "confirmed",

            provider: "Eiffel Tower",

            details: "Summit access · 19:00",
        },
    ],

    // ========================================================
    // DEPENDENCY GRAPH
    // ========================================================
    //
    // This is the core of TripRescue.
    //
    // Flight
    //   ↓
    // Transfer
    //   ↓
    // Hotel
    //   ↓
    // Activity
    //
    // bufferMinutes tells the impact engine how much
    // safety margin is required between connected events.
    // ========================================================

    dependencies: [
        {
            id: "dep-1",

            source: "flight-2",

            target: "transfer-1",

            dependencyType: "arrival-to-transfer",

            bufferMinutes: 30,

            riskLevel: "HIGH",
        },

        {
            id: "dep-2",

            source: "transfer-1",

            target: "hotel-1",

            dependencyType: "transfer-to-checkin",

            bufferMinutes: 30,

            riskLevel: "HIGH",
        },

        {
            id: "dep-3",

            source: "hotel-1",

            target: "activity-1",

            dependencyType: "hotel-to-activity",

            bufferMinutes: 120,

            riskLevel: "MEDIUM",
        },
    ],
};


// ============================================================
// DEMO DISRUPTIONS
// ============================================================

export const disruptions = [
    {
        id: "flight-cancel",

        eventId: "flight-2",

        type: "Flight Cancellation",

        reason:
            "AI 182 has been cancelled by the airline.",

        severity: "HIGH",
    },

    {
        id: "flight-delay",

        eventId: "flight-2",

        type: "Flight Delay",

        reason:
            "AI 182 has been delayed by 4 hours.",

        severity: "MEDIUM",
    },

    {
        id: "hotel-cancel",

        eventId: "hotel-1",

        type: "Hotel Cancellation",

        reason:
            "Le Meurice is no longer available for your stay.",

        severity: "HIGH",
    },

    {
        id: "weather",

        eventId: "flight-2",

        type: "Weather Disruption",

        reason:
            "Severe weather is affecting your Paris arrival.",

        severity: "HIGH",
    },
];


// ============================================================
// TRAVELER PROFILE
// ============================================================

export const travelerProfile = {
    name: "Alex Morgan",

    tripCount: 12,

    preferenceSummary: {
        primary: "Balanced traveler",

        priorities: [
            "Preserve planned activities",
            "Minimize travel delays",
            "Keep the itinerary convenient",
        ],
    },
};