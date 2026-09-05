export function analyzeDisruption(trip, disruption) {
    const eventMap = new Map(
        trip.events.map((event) => [event.id, event])
    );

    const directEvent = eventMap.get(disruption.eventId);

    if (!directEvent) {
        return {
            severity: "LOW",
            directImpact: null,
            downstreamImpacts: [],
            unaffectedEvents: trip.events,
            totalAffected: 0,
            totalUnaffected: trip.events.length,
        };
    }

    const impactedEvents = [];
    const unaffectedEvents = [];
    const visited = new Set();

    // --------------------------------------------------
    // DIRECT DISRUPTION
    // --------------------------------------------------

    const disruptedEvent = {
        ...directEvent,
        status: "affected",
    };

    impactedEvents.push({
        event: disruptedEvent,
        impactType: "DIRECT IMPACT",
        impactLevel: "critical",
        reason: disruption.reason,
        level: 0,
    });

    visited.add(directEvent.id);

    // --------------------------------------------------
    // TRACE DEPENDENCY GRAPH
    // --------------------------------------------------

    function traceDependencies(sourceEvent, level = 1) {
        const dependencies = trip.dependencies.filter(
            (dependency) => dependency.source === sourceEvent.id
        );

        for (const dependency of dependencies) {
            const targetEvent = eventMap.get(dependency.target);

            if (!targetEvent || visited.has(targetEvent.id)) {
                continue;
            }

            visited.add(targetEvent.id);

            // IMPORTANT:
            // We now calculate the impact using the CURRENT
            // source event instead of always using the original
            // disrupted flight.
            const impact = calculateImpact(
                sourceEvent,
                targetEvent,
                dependency,
                disruption
            );

            if (impact.status === "affected") {
                impactedEvents.push({
                    event: {
                        ...targetEvent,
                        status: "affected",
                    },
                    impactType: "DOWNSTREAM IMPACT",
                    impactLevel: impact.level,
                    reason: impact.reason,
                    level,
                });

                traceDependencies(targetEvent, level + 1);
            } else if (impact.status === "at-risk") {
                impactedEvents.push({
                    event: {
                        ...targetEvent,
                        status: "at-risk",
                    },
                    impactType: "AT RISK",
                    impactLevel: impact.level,
                    reason: impact.reason,
                    level,
                });

                traceDependencies(targetEvent, level + 1);
            } else {
                unaffectedEvents.push({
                    event: targetEvent,
                    impactType: "UNAFFECTED",
                    reason: impact.reason,
                });
            }
        }
    }

    traceDependencies(directEvent);

    // --------------------------------------------------
    // ADD EVENTS THAT WERE NEVER REACHED
    // --------------------------------------------------

    trip.events.forEach((event) => {
        if (!visited.has(event.id)) {
            unaffectedEvents.push({
                event,
                impactType: "UNAFFECTED",
                reason: "No dependency on the disrupted event.",
            });
        }
    });

    // --------------------------------------------------
    // CALCULATE OVERALL SEVERITY
    // --------------------------------------------------

    let severity = "LOW";

    const criticalCount = impactedEvents.filter(
        (item) => item.impactLevel === "critical"
    ).length;

    const highCount = impactedEvents.filter(
        (item) => item.impactLevel === "high"
    ).length;

    if (
        criticalCount >= 1 ||
        impactedEvents.length >= 4
    ) {
        severity = "HIGH";
    } else if (
        highCount >= 1 ||
        impactedEvents.length >= 2
    ) {
        severity = "MEDIUM";
    }

    return {
        severity,
        directImpact: impactedEvents[0],
        downstreamImpacts: impactedEvents.slice(1),
        unaffectedEvents,
        totalAffected: impactedEvents.length,
        totalUnaffected: unaffectedEvents.length,
    };
}


// ======================================================
// IMPACT CALCULATION
// ======================================================

function calculateImpact(
    sourceEvent,
    targetEvent,
    dependency,
    disruption
) {
    const sourceEnd = new Date(sourceEvent.endTime);
    const targetStart = new Date(targetEvent.startTime);

    const bufferMinutes = dependency.bufferMinutes || 0;

    const availableMinutes =
        (targetStart - sourceEnd) / (1000 * 60);


    // ==================================================
    // FLIGHT → TRANSFER
    // ==================================================

    if (
        sourceEvent.type === "flight" &&
        targetEvent.type === "transfer"
    ) {
        if (disruption.id === "flight-cancel") {
            return {
                status: "affected",
                level: "critical",
                reason:
                    "The cancelled flight removes the arrival needed for the scheduled airport transfer.",
            };
        }

        if (disruption.id === "flight-delay") {
            if (availableMinutes < bufferMinutes) {
                return {
                    status: "affected",
                    level: "high",
                    reason:
                        `The delayed arrival leaves only ${Math.max(
                            0,
                            Math.round(availableMinutes)
                        )} minutes before the transfer, below the required ${bufferMinutes}-minute buffer.`,
                };
            }

            return {
                status: "at-risk",
                level: "medium",
                reason:
                    "The flight delay reduces the buffer available before the airport transfer.",
            };
        }

        if (disruption.id === "weather") {
            return {
                status: "at-risk",
                level: "high",
                reason:
                    "Severe weather may delay the arrival and make the scheduled airport transfer unreliable.",
            };
        }

        return {
            status: "at-risk",
            level: "medium",
            reason:
                "The transfer depends on the disrupted flight arriving on schedule.",
        };
    }


    // ==================================================
    // FLIGHT → HOTEL
    // ==================================================

    if (
        sourceEvent.type === "flight" &&
        targetEvent.type === "hotel"
    ) {
        if (disruption.id === "flight-cancel") {
            return {
                status: "at-risk",
                level: "high",
                reason:
                    "The cancelled flight can cause the planned hotel check-in window to be missed.",
            };
        }

        if (
            disruption.id === "flight-delay" &&
            availableMinutes < bufferMinutes
        ) {
            return {
                status: "affected",
                level: "high",
                reason:
                    "The delayed arrival leaves insufficient time to reach the hotel before the planned check-in.",
            };
        }

        if (disruption.id === "weather") {
            return {
                status: "at-risk",
                level: "high",
                reason:
                    "Weather-related arrival uncertainty may push the hotel arrival beyond the planned check-in time.",
            };
        }

        return {
            status: "at-risk",
            level: "medium",
            reason:
                "The hotel check-in depends on the disrupted flight arriving close to schedule.",
        };
    }


    // ==================================================
    // TRANSFER → HOTEL
    // ==================================================

    if (
        sourceEvent.type === "transfer" &&
        targetEvent.type === "hotel"
    ) {
        if (disruption.id === "flight-cancel") {
            return {
                status: "at-risk",
                level: "high",
                reason:
                    "Because the airport transfer is affected, the planned hotel arrival time is no longer reliable.",
            };
        }

        if (availableMinutes < bufferMinutes) {
            return {
                status: "affected",
                level: "high",
                reason:
                    "The revised transfer timing leaves insufficient buffer before hotel check-in.",
            };
        }

        return {
            status: "at-risk",
            level: "medium",
            reason:
                "Changes to the airport transfer can affect the planned hotel arrival.",
        };
    }


    // ==================================================
    // HOTEL → ACTIVITY
    // ==================================================

    if (
        sourceEvent.type === "hotel" &&
        targetEvent.type === "activity"
    ) {
        if (availableMinutes < bufferMinutes) {
            return {
                status: "affected",
                level: "high",
                reason:
                    "The revised hotel schedule creates a timing conflict with the planned activity.",
            };
        }

        return {
            status: "at-risk",
            level: "medium",
            reason:
                "The activity depends on the hotel schedule remaining within the planned timing.",
        };
    }


    // ==================================================
    // TRANSFER → ACTIVITY
    // ==================================================

    if (
        sourceEvent.type === "transfer" &&
        targetEvent.type === "activity"
    ) {
        if (availableMinutes < bufferMinutes) {
            return {
                status: "affected",
                level: "high",
                reason:
                    "The revised transfer schedule leaves insufficient time before the activity.",
            };
        }

        return {
            status: "at-risk",
            level: "medium",
            reason:
                "Changes to the transfer may reduce the time available before the activity.",
        };
    }


    // ==================================================
    // GENERIC DEPENDENCY
    // ==================================================

    if (availableMinutes < bufferMinutes) {
        return {
            status: "affected",
            level: "high",
            reason:
                "The available time between these dependent itinerary events is below the required buffer.",
        };
    }

    return {
        status: "unaffected",
        level: "low",
        reason:
            "The current timing still provides enough buffer for this dependent event.",
    };
}