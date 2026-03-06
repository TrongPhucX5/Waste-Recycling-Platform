// Container ghép hook và view
import React from "react";
import EnterpriseDashboard from "./components/EnterpriseDashboard";
import { useEnterprise } from "./hooks/useEnterprise";

const Enterprise = () => {
  // const enterprise = useEnterprise();
  return <EnterpriseDashboard />;
};

export default Enterprise;
