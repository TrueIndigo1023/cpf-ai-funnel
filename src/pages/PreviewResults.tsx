import { Navigate } from "react-router-dom";
import { type QuizState } from "@/lib/calculator";

/** Temp preview route — DELETE before deploying */
const PreviewResults = () => {
  const s: QuizState = {
    currentAge: 55, retireAge: 65, desiredMonthly: 4000, raBracket: "FRS",
    cpfOA: 180000, idleCash: 120000, otherIncomeSources: ["none"], otherIncomeMonthly: 0,
    concern: "healthcare", confidence: "not_confident", retirementGoal: "basic",
    fullName: "Ahmad Ibrahim", email: "test@test.com", mobile: "91234567",
  };
  return <Navigate to="/results" state={s} replace />;
};

export default PreviewResults;
