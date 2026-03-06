// Container ghép hook và view
import React from "react";
import { useCitizenReport } from "./hooks/useCitizenReport";
import ReportForm from "./components/ReportForm";

const CitizenReport = () => {
  const { submitReport, loading } = useCitizenReport();

  return (
    <div>
      <h2>Báo cáo rác</h2>
      <ReportForm onSubmit={submitReport} />
      {loading && <div>Đang gửi...</div>}
    </div>
  );
};

export default CitizenReport;
