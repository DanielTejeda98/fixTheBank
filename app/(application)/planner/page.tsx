"use client"
import { useEffect } from "react";
import PlannerView from "../../components/Planner/PlannerView";
import { getSavings } from "../../lib/savingsApi";

export default function Planner () {
    // TODO: this should be a part of the initial data load
    useEffect(() => {
        getSavings(true);
    })

    return <PlannerView />
}