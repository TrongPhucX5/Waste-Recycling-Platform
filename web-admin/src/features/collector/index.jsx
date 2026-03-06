// Container ghép hook và view
import React from "react";
import CollectorDashboard from "./components/CollectorDashboard";
import { useCollector } from "./hooks/useCollector";

const Collector = () => {
  // const collector = useCollector();
  return <CollectorDashboard />;
};

export default Collector;
