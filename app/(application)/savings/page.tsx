"use client"
import { useEffect } from "react";
import SavingsView from "../../components/Savings/SavingsView";
import { getSavings } from "../../lib/savingsApi";

export default function Savings() {
  // TODO: this should be a part of the initial data load
  useEffect(() => {
    getSavings(true);
  })

  return <SavingsView />;
}
