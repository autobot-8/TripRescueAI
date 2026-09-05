// ============================================================
// TRIPRESCUE AI — RECOVERY ENGINE
// ============================================================

const DEFAULT_PREFERENCES = {
    cost: 20,
    time: 25,
    activities: 25,
    convenience: 20,
    reliability: 10,
};


// ============================================================
// MAIN FUNCTION
// ============================================================

export function generateRecoveryPlans(
    trip,
    disruption,
    analysis
) {
    const preferences = normalizePreferences(
        trip.preferences
    );

    const candidates = buildRecoveryCandidates(
        trip,
        disruption,
        analysis
    );

    const scoredPlans = candidates.map((candidate) => {
        const score = calculateRecoveryScore(
            candidate,
            preferences
        );

        return {
            ...candidate,
            ...score,
        };
    });

    // Highest score becomes the recommendation.
    scoredPlans.sort(
        (a, b) => b.totalScore - a.totalScore
    );

    const rankedPlans = scoredPlans.map(
        (plan, index) => ({
            ...plan,
            rank: index + 1,
        })
    );

    // Keep the UI ordering:
    // Recommended → Lower Cost → Maximum Savings
    return orderForUI(rankedPlans);
}


// ============================================================
// NORMALIZE USER PREFERENCES
// ============================================================

function normalizePreferences(preferences) {
    if (!preferences) {
        return DEFAULT_PREFERENCES;
    }

    const normalized = {
        cost:
            Number(preferences.cost) ||
            DEFAULT_PREFERENCES.cost,

        time:
            Number(preferences.time) ||
            DEFAULT_PREFERENCES.time,

        activities:
            Number(preferences.activities) ||
            DEFAULT_PREFERENCES.activities,

        convenience:
            Number(preferences.convenience) ||
            DEFAULT_PREFERENCES.convenience,

        reliability:
            Number(preferences.reliability) ||
            DEFAULT_PREFERENCES.reliability,
    };

    const total =
        normalized.cost +
        normalized.time +
        normalized.activities +
        normalized.convenience +
        normalized.reliability;

    if (total === 0) {
        return DEFAULT_PREFERENCES;
    }

    // Convert preferences to a 100-point weighting.
    return {
        cost: (normalized.cost / total) * 100,
        time: (normalized.time / total) * 100,
        activities:
            (normalized.activities / total) * 100,
        convenience:
            (normalized.convenience / total) * 100,
        reliability:
            (normalized.reliability / total) * 100,
    };
}


// ============================================================
// BUILD RECOVERY CANDIDATES
// ============================================================

function buildRecoveryCandidates(
    trip,
    disruption,
    analysis
) {
    switch (disruption?.id) {
        case "flight-cancel":
            return buildFlightCancellationPlans(
                trip,
                analysis
            );

        case "flight-delay":
            return buildFlightDelayPlans(
                trip,
                analysis
            );

        case "hotel-cancel":
            return buildHotelCancellationPlans(
                trip,
                analysis
            );

        case "weather":
            return buildWeatherPlans(
                trip,
                analysis
            );

        default:
            return buildGenericPlans(
                trip,
                analysis
            );
    }
}


// ============================================================
// FLIGHT CANCELLATION
// ============================================================

function buildFlightCancellationPlans(
    trip,
    analysis
) {
    return [
        {
            id: "recommended",
            type: "RECOMMENDED",
            name: "Keep the trip intact",

            description:
                "Rebook the disrupted flight and preserve the majority of your original itinerary.",

            additionalCost: 4200,
            arrivalChange: "+2h",

            preferenceScore: 96,

            preserved: [
                "Airport transfer",
                "Hotel reservation",
                "Eiffel Tower",
            ],

            changed: [
                "Disrupted flight",
                "Transfer pickup time",
                "Hotel check-in time",
            ],

            reasoning:
                "The alternative flight keeps the trip structure intact while minimizing time loss and schedule changes.",

            metrics: {
                cost: 78,
                time: 94,
                activities: 98,
                convenience: 95,
                reliability: 96,
                itineraryPreservation: 98,
            },
        },

        {
            id: "low-cost",
            type: "LOWER COST",
            name: "Save money, change the schedule",

            description:
                "Choose a cheaper alternative and accept a larger schedule change to reduce additional cost.",

            additionalCost: 1100,
            arrivalChange: "+8h",

            preferenceScore: 84,

            preserved: [
                "Hotel reservation",
                "Most activities",
            ],

            changed: [
                "Disrupted flight",
                "Airport transfer",
                "Hotel check-in",
            ],

            reasoning:
                "This option prioritizes cost savings while keeping most of the trip usable.",

            metrics: {
                cost: 97,
                time: 61,
                activities: 82,
                convenience: 76,
                reliability: 88,
                itineraryPreservation: 82,
            },
        },

        {
            id: "flexible",
            type: "MAXIMUM SAVINGS",
            name: "Maximum savings",

            description:
                "Accept a refund and allow the itinerary to be reshaped around the disruption.",

            additionalCost: 0,
            arrivalChange: "+8h",

            preferenceScore: 72,

            preserved: [
                "Trip destination",
            ],

            changed: [
                "Disrupted flight",
                "Airport transfer",
                "Hotel check-in",
                "One activity",
            ],

            reasoning:
                "This option eliminates additional cost but requires the largest itinerary change.",

            metrics: {
                cost: 100,
                time: 54,
                activities: 62,
                convenience: 58,
                reliability: 78,
                itineraryPreservation: 61,
            },
        },
    ];
}


// ============================================================
// FLIGHT DELAY
// ============================================================

function buildFlightDelayPlans() {
    return [
        {
            id: "recommended",
            type: "RECOMMENDED",
            name: "Absorb the delay",

            description:
                "Keep the existing booking and intelligently adjust the connected services around the delayed arrival.",

            additionalCost: 900,
            arrivalChange: "+4h",

            preferenceScore: 95,

            preserved: [
                "Flight booking",
                "Hotel reservation",
                "Eiffel Tower",
            ],

            changed: [
                "Airport transfer",
                "Hotel check-in",
            ],

            reasoning:
                "The delay can be absorbed without changing the core journey, making this the lowest-disruption recovery.",

            metrics: {
                cost: 88,
                time: 90,
                activities: 96,
                convenience: 94,
                reliability: 91,
                itineraryPreservation: 97,
            },
        },

        {
            id: "low-cost",
            type: "LOWER COST",
            name: "Adjust ground transport",

            description:
                "Keep the delayed flight and switch to a cheaper transfer option after landing.",

            additionalCost: 300,
            arrivalChange: "+4h",

            preferenceScore: 86,

            preserved: [
                "Flight",
                "Hotel",
                "Activities",
            ],

            changed: [
                "Airport transfer",
            ],

            reasoning:
                "This minimizes additional spending while preserving the main itinerary.",

            metrics: {
                cost: 98,
                time: 86,
                activities: 92,
                convenience: 72,
                reliability: 84,
                itineraryPreservation: 94,
            },
        },

        {
            id: "flexible",
            type: "MAXIMUM FLEXIBILITY",
            name: "Reshape the evening",

            description:
                "Accept the delayed arrival and move the evening experience to create a comfortable schedule.",

            additionalCost: 0,
            arrivalChange: "+4h",

            preferenceScore: 76,

            preserved: [
                "Flight",
                "Hotel",
            ],

            changed: [
                "Evening activity",
                "Transfer timing",
            ],

            reasoning:
                "No additional cost, but the evening schedule needs to be reorganized.",

            metrics: {
                cost: 100,
                time: 70,
                activities: 70,
                convenience: 68,
                reliability: 86,
                itineraryPreservation: 78,
            },
        },
    ];
}


// ============================================================
// HOTEL CANCELLATION
// ============================================================

function buildHotelCancellationPlans() {
    return [
        {
            id: "recommended",
            type: "RECOMMENDED",
            name: "Equivalent luxury stay",

            description:
                "Move the reservation to a comparable property close to your original location.",

            additionalCost: 2400,
            arrivalChange: "No change",

            preferenceScore: 95,

            preserved: [
                "Flight",
                "Airport transfer",
                "Activities",
            ],

            changed: [
                "Hotel property",
            ],

            reasoning:
                "A comparable replacement avoids cascading changes to the rest of the itinerary.",

            metrics: {
                cost: 78,
                time: 98,
                activities: 97,
                convenience: 94,
                reliability: 95,
                itineraryPreservation: 96,
            },
        },

        {
            id: "low-cost",
            type: "LOWER COST",
            name: "Nearby alternative",

            description:
                "Move to a nearby hotel with lower rates while keeping the rest of the itinerary.",

            additionalCost: 500,
            arrivalChange: "No change",

            preferenceScore: 85,

            preserved: [
                "Flight",
                "Transfer",
                "Activities",
            ],

            changed: [
                "Hotel property",
            ],

            reasoning:
                "The cheaper replacement protects the schedule while reducing accommodation cost.",

            metrics: {
                cost: 96,
                time: 96,
                activities: 94,
                convenience: 79,
                reliability: 87,
                itineraryPreservation: 95,
            },
        },

        {
            id: "flexible",
            type: "MAXIMUM SAVINGS",
            name: "Refund and reshape",

            description:
                "Take the hotel refund and rebuild the stay around another available property.",

            additionalCost: 0,
            arrivalChange: "+1h",

            preferenceScore: 73,

            preserved: [
                "Flight",
                "Destination",
            ],

            changed: [
                "Hotel",
                "Transfer",
                "Some schedule timing",
            ],

            reasoning:
                "This eliminates additional accommodation cost but introduces more planning changes.",

            metrics: {
                cost: 100,
                time: 75,
                activities: 76,
                convenience: 61,
                reliability: 80,
                itineraryPreservation: 70,
            },
        },
    ];
}


// ============================================================
// WEATHER DISRUPTION
// ============================================================

function buildWeatherPlans() {
    return [
        {
            id: "recommended",
            type: "RECOMMENDED",
            name: "Reroute around the weather",

            description:
                "Use the safest available route while preserving the majority of the itinerary.",

            additionalCost: 3200,
            arrivalChange: "+3h",

            preferenceScore: 94,

            preserved: [
                "Hotel",
                "Major activities",
                "Trip destination",
            ],

            changed: [
                "Flight route",
                "Transfer timing",
            ],

            reasoning:
                "This balances safety, reliability and itinerary preservation.",

            metrics: {
                cost: 80,
                time: 88,
                activities: 95,
                convenience: 91,
                reliability: 98,
                itineraryPreservation: 94,
            },
        },

        {
            id: "low-cost",
            type: "LOWER COST",
            name: "Wait and adjust",

            description:
                "Keep the existing route and accept a longer arrival window if conditions improve.",

            additionalCost: 600,
            arrivalChange: "+6h",

            preferenceScore: 82,

            preserved: [
                "Flight route",
                "Hotel",
                "Most activities",
            ],

            changed: [
                "Transfer timing",
                "Arrival time",
            ],

            reasoning:
                "This reduces cost but introduces more uncertainty into the schedule.",

            metrics: {
                cost: 94,
                time: 63,
                activities: 86,
                convenience: 70,
                reliability: 72,
                itineraryPreservation: 87,
            },
        },

        {
            id: "flexible",
            type: "MAXIMUM FLEXIBILITY",
            name: "Move the experiences",

            description:
                "Accept the arrival disruption and shift flexible experiences to later slots.",

            additionalCost: 0,
            arrivalChange: "+6h",

            preferenceScore: 75,

            preserved: [
                "Destination",
                "Hotel",
            ],

            changed: [
                "Activities",
                "Transfer",
                "Arrival schedule",
            ],

            reasoning:
                "This avoids additional spending but requires the most itinerary flexibility.",

            metrics: {
                cost: 100,
                time: 58,
                activities: 65,
                convenience: 63,
                reliability: 78,
                itineraryPreservation: 68,
            },
        },
    ];
}


// ============================================================
// GENERIC RECOVERY
// ============================================================

function buildGenericPlans() {
    return [
        {
            id: "recommended",
            type: "RECOMMENDED",
            name: "Preserve the itinerary",

            description:
                "Choose the option that keeps the greatest number of existing bookings intact.",

            additionalCost: 2500,
            arrivalChange: "+2h",

            preferenceScore: 92,

            preserved: [
                "Major bookings",
                "Activities",
            ],

            changed: [
                "Disrupted service",
            ],

            reasoning:
                "This minimizes cascading changes across the itinerary.",

            metrics: {
                cost: 80,
                time: 92,
                activities: 95,
                convenience: 93,
                reliability: 91,
                itineraryPreservation: 96,
            },
        },

        {
            id: "low-cost",
            type: "LOWER COST",
            name: "Reduce additional cost",

            description:
                "Choose a cheaper alternative while accepting some schedule changes.",

            additionalCost: 800,
            arrivalChange: "+5h",

            preferenceScore: 82,

            preserved: [
                "Most bookings",
            ],

            changed: [
                "Schedule",
                "Transport",
            ],

            reasoning:
                "This favors cost savings over convenience.",

            metrics: {
                cost: 96,
                time: 70,
                activities: 82,
                convenience: 75,
                reliability: 82,
                itineraryPreservation: 84,
            },
        },

        {
            id: "flexible",
            type: "MAXIMUM FLEXIBILITY",
            name: "Reshape the journey",

            description:
                "Allow the largest itinerary changes in exchange for minimizing additional spending.",

            additionalCost: 0,
            arrivalChange: "+7h",

            preferenceScore: 70,

            preserved: [
                "Destination",
            ],

            changed: [
                "Transport",
                "Hotel timing",
                "Activities",
            ],

            reasoning:
                "This removes most additional cost but creates the largest itinerary changes.",

            metrics: {
                cost: 100,
                time: 50,
                activities: 60,
                convenience: 55,
                reliability: 75,
                itineraryPreservation: 60,
            },
        },
    ];
}


// ============================================================
// RECOVERY SCORE
// ============================================================

function calculateRecoveryScore(
    plan,
    preferences
) {
    const metrics = plan.metrics;

    const weightedScore =
        (metrics.cost * preferences.cost) / 100 +
        (metrics.time * preferences.time) / 100 +
        (metrics.activities * preferences.activities) / 100 +
        (metrics.convenience * preferences.convenience) / 100 +
        (metrics.reliability * preferences.reliability) / 100;

    const totalScore = Math.round(
        weightedScore
    );

    return {
        totalScore,

        preferenceScore: totalScore,

        scoreBreakdown: {
            cost: Math.round(metrics.cost),
            time: Math.round(metrics.time),
            preferences: Math.round(
                metrics.activities
            ),
            itineraryPreservation: Math.round(
                metrics.itineraryPreservation
            ),
            convenience: Math.round(
                metrics.convenience
            ),
        },
    };
}


// ============================================================
// UI ORDER
// ============================================================

function orderForUI(plans) {
    const order = [
        "recommended",
        "low-cost",
        "flexible",
    ];

    return plans.sort(
        (a, b) =>
            order.indexOf(a.id) -
            order.indexOf(b.id)
    );
}