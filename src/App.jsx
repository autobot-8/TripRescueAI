import { useState } from "react";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Itinerary from "./pages/Itinerary";
import Disruption from "./pages/Disruption";
import Recovery from "./pages/Recovery";

function App() {
    const [page, setPage] = useState("home");

    const [recoveryPlans, setRecoveryPlans] = useState([]);
    const [selectedDisruption, setSelectedDisruption] =
        useState(null);

    const [aiAnalysis, setAiAnalysis] = useState(null);

    const [recovered, setRecovered] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);

    const [tripPreferences, setTripPreferences] =
        useState({
            cost: 20,
            time: 25,
            activities: 25,
            convenience: 20,
            reliability: 10,
        });

    const goHome = () => {
        setPage("home");
    };

    const goDashboard = () => {
        setPage("dashboard");
    };

    const goItinerary = () => {
        setPage("itinerary");
    };

    const goDisruption = () => {
        setPage("disruption");
    };

    const openRecovery = (
        plans,
        disruption,
        aiResult
    ) => {
        setRecoveryPlans(plans || []);

        setSelectedDisruption(
            disruption || null
        );

        setAiAnalysis(
            aiResult || null
        );

        setSelectedPlan(null);
        setRecovered(false);

        setPage("recovery");
    };

    const selectRecoveryPlan = (plan) => {
        setSelectedPlan(plan);
        setRecovered(false);

        setTimeout(() => {
            setRecovered(true);
        }, 2800);
    };

    /*
     * LANDING PAGE
     */
    if (page === "home") {
        return (
            <Home
                onEnterApp={goDashboard}
            />
        );
    }

    /*
     * RECOVERY
     */
    if (page === "recovery") {
        return (
            <Recovery
                plans={recoveryPlans}
                disruption={selectedDisruption}
                selectedPlan={selectedPlan}
                recovered={recovered}
                aiAnalysis={aiAnalysis}
                onBack={goDisruption}
                onSelectPlan={selectRecoveryPlan}
                onViewItinerary={goItinerary}
            />
        );
    }

    /*
     * DISRUPTION
     */
    if (page === "disruption") {
        return (
            <Disruption
                onBack={goDashboard}
                onFindRecovery={openRecovery}
                tripPreferences={tripPreferences}
            />
        );
    }

    /*
     * ITINERARY
     */
    if (page === "itinerary") {
        return (
            <Itinerary
                onBack={goDashboard}
                onOpenDisruption={goDisruption}
                selectedPlan={selectedPlan}
                recovered={recovered}
            />
        );
    }

    /*
     * DASHBOARD
     */
    return (
        <Dashboard
            onOpenDisruption={goDisruption}
            onOpenJourney={goItinerary}
            onPreferencesChange={setTripPreferences}
        />
    );
}

export default App;