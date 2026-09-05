import { useState } from "react";
import {
    BrowserRouter,
    Routes,
    Route,
    useNavigate,
} from "react-router-dom";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Itinerary from "./pages/Itinerary";
import Disruption from "./pages/Disruption";
import Recovery from "./pages/Recovery";

function AppContent() {
    const navigate = useNavigate();

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
        navigate("/");
        setTimeout(() => {
            window.scrollTo(0, 0);
        }, 50);
    };

    const goDashboard = () => {
        navigate("/dashboard");
        setTimeout(() => {
            window.scrollTo(0, 0);
        }, 50);
    };

    const goItinerary = () => {
        navigate("/itinerary");
        setTimeout(() => {
            window.scrollTo(0, 0);
        }, 50);
    };

    const goDisruption = () => {
        navigate("/disruption");
        setTimeout(() => {
            window.scrollTo(0, 0);
        }, 50);
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

        navigate("/recovery");
    };

    const selectRecoveryPlan = (plan) => {
        setSelectedPlan(plan);
        setRecovered(false);

        setTimeout(() => {
            setRecovered(true);
        }, 2800);
    };

    return (
        <Routes>
            {/* HOMEPAGE */}
            <Route
                path="/"
                element={
                    <Home
                        onEnterApp={goDashboard}
                    />
                }
            />

            {/* DASHBOARD */}
            <Route
                path="/dashboard"
                element={
                    <Dashboard
                        onOpenDisruption={goDisruption}
                        onOpenJourney={goItinerary}
                        onPreferencesChange={
                            setTripPreferences
                        }
                    />
                }
            />

            {/* ITINERARY */}
            <Route
                path="/itinerary"
                element={
                    <Itinerary
                        onBack={goDashboard}
                        onOpenDisruption={
                            goDisruption
                        }
                        selectedPlan={selectedPlan}
                        recovered={recovered}
                    />
                }
            />

            {/* DISRUPTION CENTER */}
            <Route
                path="/disruption"
                element={
                    <Disruption
                        onBack={goDashboard}
                        onFindRecovery={
                            openRecovery
                        }
                        tripPreferences={
                            tripPreferences
                        }
                    />
                }
            />

            {/* RECOVERY CENTER */}
            <Route
                path="/recovery"
                element={
                    <Recovery
                        plans={recoveryPlans}
                        disruption={
                            selectedDisruption
                        }
                        selectedPlan={
                            selectedPlan
                        }
                        recovered={recovered}
                        aiAnalysis={aiAnalysis}
                        onBack={goDisruption}
                        onSelectPlan={
                            selectRecoveryPlan
                        }
                        onViewItinerary={
                            goItinerary
                        }
                    />
                }
            />
        </Routes>
    );
}

function App() {
    return (
        <BrowserRouter>
            <AppContent />
        </BrowserRouter>
    );
}

export default App;