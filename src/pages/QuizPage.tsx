import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Clock, TrendingDown, Users, Home, BarChart2, Briefcase, Building2, Building, XCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { type QuizState, type Concern, type Confidence, type RetirementGoal, type OtherIncomeSource, defaultQuizState, fmt, INFLATION_RATE } from "@/lib/calculator";
import { trackEvent } from "@/lib/tracking";

const QuizPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [state, setState] = useState<QuizState>(defaultQuizState);

  const update = useCallback(<K extends keyof QuizState>(key: K, val: QuizState[K]) => {
    setState((prev) => ({ ...prev, [key]: val }));
  }, []);

  const toggleIncomeSource = (source: OtherIncomeSource) => {
    setState((prev) => {
      if (source === 'none') {
        return { ...prev, otherIncomeSources: ['none'], otherIncomeMonthly: 0 };
      }
      const without = prev.otherIncomeSources.filter(s => s !== 'none');
      const has = without.includes(source);
      const next = has ? without.filter(s => s !== source) : [...without, source];
      return { ...prev, otherIncomeSources: next.length === 0 ? ['none'] : next };
    });
  };

  const hasOtherIncome = state.otherIncomeSources.length > 0 && !state.otherIncomeSources.includes('none');

  const step1Valid = state.currentAge > 0 && state.retireAge > 0 && state.desiredMonthly > 0;
  const step2Valid = state.raBracket !== null && state.otherIncomeSources.length > 0;
  const step3Valid = state.concern !== null && state.confidence !== null && state.retirementGoal !== null;

  const yearsToRetire = Math.max(0, 65 - state.currentAge);
  const inflatedPreview = state.desiredMonthly > 0 && state.currentAge > 0
    ? Math.round(state.desiredMonthly * Math.pow(1 + INFLATION_RATE, yearsToRetire))
    : 0;

  const handleFinalContinue = () => {
    trackEvent('QuizStep3Complete', '/quiz', { concern: state.concern, confidence: state.confidence, goal: state.retirementGoal });
    const combined = state.cpfOA + state.idleCash;
    if (combined < 100000 && state.otherIncomeMonthly === 0) {
      trackEvent('NotEligible', '/quiz', { combined });
      navigate("/not-eligible", { state });
    } else {
      trackEvent('QuizComplete', '/quiz', { combined, concern: state.concern });
      navigate("/loading", { state });
    }
  };

  const ages = Array.from({ length: 15 }, (_, i) => 50 + i);
  const retireAges = Array.from({ length: 16 }, (_, i) => 55 + i);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      <div className="flex-1 max-w-[680px] mx-auto w-full px-4 py-8">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-sm text-stone-500 mb-2" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            <span>Step {step} of 3</span>
            <span>{step === 1 ? "Your Goals" : step === 2 ? "Income & Savings" : "Your Priorities"}</span>
          </div>
          <div className="h-2 bg-stone-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* ===== STEP 1: Goals ===== */}
        {step === 1 && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-stone-900 mb-1">Your Retirement Goals</h2>
              <p className="text-stone-500" style={{ fontFamily: "'DM Sans', sans-serif" }}>Tell us what you're planning for</p>
            </div>

            <div>
              <label className="block font-medium text-stone-900 mb-2" style={{ fontFamily: "'DM Sans', sans-serif" }}>Your current age</label>
              <div className="relative pt-8 pb-2">
                <div
                  className="absolute top-0 bg-emerald-600 text-white text-sm font-semibold rounded-full px-3 py-1 -translate-x-1/2 tabular-nums"
                  style={{ left: `${((state.currentAge || 50) - 50) / 14 * 100}%` }}
                >
                  {state.currentAge || 50}
                </div>
                <input
                  type="range" min={50} max={64} step={1}
                  value={state.currentAge || 50}
                  onChange={(e) => update("currentAge", Number(e.target.value))}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-stone-400 mt-1">
                  <span>50</span><span>64</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block font-medium text-stone-900 mb-2" style={{ fontFamily: "'DM Sans', sans-serif" }}>Planned retirement age</label>
              <div className="relative pt-8 pb-2">
                <div
                  className="absolute top-0 bg-emerald-600 text-white text-sm font-semibold rounded-full px-3 py-1 -translate-x-1/2 tabular-nums"
                  style={{ left: `${((state.retireAge || 55) - 55) / 15 * 100}%` }}
                >
                  {state.retireAge || 55}
                </div>
                <input
                  type="range" min={55} max={70} step={1}
                  value={state.retireAge || 55}
                  onChange={(e) => update("retireAge", Number(e.target.value))}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-stone-400 mt-1">
                  <span>55</span><span>70</span>
                </div>
              </div>
              <p className="text-xs text-stone-400 mt-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>CPF LIFE payouts begin at 65</p>
            </div>

            <div>
              <label className="block font-medium text-stone-900 mb-2" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Desired monthly retirement spending
              </label>
              <div className="relative pt-8 pb-2">
                <div
                  className="absolute top-0 bg-emerald-600 text-white text-sm font-semibold rounded-full px-3 py-1 -translate-x-1/2 tabular-nums"
                  style={{ left: `${((state.desiredMonthly - 1000) / 9000) * 100}%` }}
                >
                  {fmt(state.desiredMonthly)}
                </div>
                <input
                  type="range" min={1000} max={10000} step={100}
                  value={state.desiredMonthly || 1000}
                  onChange={(e) => update("desiredMonthly", Number(e.target.value))}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-stone-400 mt-1">
                  <span>$1,000</span><span>$10,000</span>
                </div>
              </div>
              <p className="text-xs text-stone-400 mt-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                In today's dollars. Include housing, food, lifestyle, healthcare & leisure.
              </p>
              {inflatedPreview > 0 && inflatedPreview !== state.desiredMonthly && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mt-2">
                  <p className="text-xs text-amber-800" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    💡 With inflation at 2.5%/year, {fmt(state.desiredMonthly)}/month today will cost approximately <strong>{fmt(inflatedPreview)}/month</strong> when you're 65 ({yearsToRetire} years from now). We'll use this adjusted figure in your report.
                  </p>
                </div>
              )}
            </div>

            <button onClick={() => { trackEvent('QuizStep1Complete', '/quiz', { age: state.currentAge, retireAge: state.retireAge, desiredMonthly: state.desiredMonthly }); setStep(2); }} disabled={!step1Valid} className="btn-primary-cpf w-full disabled:opacity-50 disabled:cursor-not-allowed">
              Continue →
            </button>
          </div>
        )}

        {/* ===== STEP 2: Income & Savings ===== */}
        {step === 2 && (
          <div className="space-y-8">
            <div className="flex items-center gap-2">
              <button onClick={() => setStep(1)} className="text-emerald-600 text-sm hover:underline" style={{ fontFamily: "'DM Sans', sans-serif" }}>← Back</button>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-stone-900 mb-1">Your Income & Savings</h2>
              <p className="text-stone-500" style={{ fontFamily: "'DM Sans', sans-serif" }}>We'll project your total retirement income at 65</p>
            </div>

            {/* RA Bracket */}
            <div>
              <label className="block font-medium text-stone-900 mb-2" style={{ fontFamily: "'DM Sans', sans-serif" }}>CPF Retirement Account (RA) bracket at 55</label>
              <p className="text-xs text-stone-400 mb-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>Not yet 55? Choose the bracket you expect to reach.</p>
              <div className="space-y-3">
                {([
                  { key: "BRS" as const, title: "Basic Retirement Sum (BRS)", badge: "Below $180,000", desc: "Basic monthly CPF LIFE income from 65" },
                  { key: "FRS" as const, title: "Full Retirement Sum (FRS)", badge: "$180,000 – $220,400", desc: "Moderate, stable monthly income for life from 65" },
                  { key: "ERS" as const, title: "Enhanced Retirement Sum (ERS)", badge: "Above $280,000", desc: "Highest CPF LIFE monthly payout available" },
                ]).map((card) => (
                  <div key={card.key} onClick={() => update("raBracket", card.key)} className={state.raBracket === card.key ? "quiz-card-selected" : "quiz-card"}>
                    <div className="font-semibold text-stone-900 mb-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>{card.title}</div>
                    <span className="inline-block text-xs rounded-full px-3 py-0.5 mb-2 bg-stone-100 text-stone-600">{card.badge}</span>
                    <p className="text-sm text-stone-500" style={{ fontFamily: "'DM Sans', sans-serif" }}>{card.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* CPF OA */}
            <div>
              <label className="block font-medium text-stone-900 mb-2" style={{ fontFamily: "'DM Sans', sans-serif" }}>CPF Ordinary Account (OA) balance</label>
              <div className="relative pt-8 pb-2">
                <div className="absolute top-0 bg-emerald-600 text-white text-sm font-semibold rounded-full px-3 py-1 -translate-x-1/2 tabular-nums" style={{ left: `${(state.cpfOA / 500000) * 100}%` }}>
                  {fmt(state.cpfOA)}
                </div>
                <input type="range" min={0} max={500000} step={5000} value={state.cpfOA} onChange={(e) => update("cpfOA", Number(e.target.value))} className="w-full h-2 rounded-full appearance-none cursor-pointer" />
                <div className="flex justify-between text-xs text-stone-400 mt-1"><span>$0</span><span>$500,000</span></div>
              </div>
            </div>

            {/* Idle Cash */}
            <div>
              <label className="block font-medium text-stone-900 mb-2" style={{ fontFamily: "'DM Sans', sans-serif" }}>Idle cash & low-yield savings</label>
              <div className="relative pt-8 pb-2">
                <div className="absolute top-0 bg-emerald-600 text-white text-sm font-semibold rounded-full px-3 py-1 -translate-x-1/2 tabular-nums" style={{ left: `${(state.idleCash / 1000000) * 100}%` }}>
                  {fmt(state.idleCash)}
                </div>
                <input type="range" min={0} max={1000000} step={5000} value={state.idleCash} onChange={(e) => update("idleCash", Number(e.target.value))} className="w-full h-2 rounded-full appearance-none cursor-pointer" />
                <div className="flex justify-between text-xs text-stone-400 mt-1"><span>$0</span><span>$1,000,000</span></div>
              </div>
              <p className="text-xs text-stone-400 mt-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>Bank savings, fixed deposits, T-bills, SSB, or uninvested cash</p>
            </div>

            {/* Other Income Sources */}
            <div>
              <label className="block font-medium text-stone-900 mb-2" style={{ fontFamily: "'DM Sans', sans-serif" }}>Other expected income sources at retirement</label>
              <p className="text-xs text-stone-400 mb-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>Select all that apply. These will be added to your CPF income projection.</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {([
                  { key: "rental" as OtherIncomeSource, icon: Home, label: "Rental income" },
                  { key: "investments" as OtherIncomeSource, icon: BarChart2, label: "Investments" },
                  { key: "part_time" as OtherIncomeSource, icon: Briefcase, label: "Part-time work" },
                  { key: "pension" as OtherIncomeSource, icon: Building2, label: "Pension" },
                  { key: "business" as OtherIncomeSource, icon: Building, label: "Business income" },
                  { key: "none" as OtherIncomeSource, icon: XCircle, label: "None,CPF only" },
                ]).map((item) => {
                  const selected = state.otherIncomeSources.includes(item.key);
                  return (
                    <div
                      key={item.key}
                      onClick={() => toggleIncomeSource(item.key)}
                      className={`cursor-pointer rounded-xl border-2 p-3 transition-all text-center ${
                        selected ? "border-emerald-500 bg-emerald-50" : "border-stone-200 bg-white hover:border-stone-300"
                      }`}
                    >
                      <item.icon className={`h-5 w-5 mx-auto mb-1.5 ${selected ? "text-emerald-600" : "text-stone-400"}`} />
                      <p className="text-xs font-medium text-stone-700" style={{ fontFamily: "'DM Sans', sans-serif" }}>{item.label}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Other Income Amount */}
            {hasOtherIncome && (
              <div>
                <label className="block font-medium text-stone-900 mb-2" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  Expected monthly income from these sources at retirement
                </label>
                <div className="relative pt-8 pb-2">
                  <div className="absolute top-0 bg-emerald-600 text-white text-sm font-semibold rounded-full px-3 py-1 -translate-x-1/2 tabular-nums" style={{ left: `${(state.otherIncomeMonthly / 20000) * 100}%` }}>
                    {fmt(state.otherIncomeMonthly)}
                  </div>
                  <input type="range" min={0} max={20000} step={100} value={state.otherIncomeMonthly} onChange={(e) => update("otherIncomeMonthly", Number(e.target.value))} className="w-full h-2 rounded-full appearance-none cursor-pointer" />
                  <div className="flex justify-between text-xs text-stone-400 mt-1"><span>$0</span><span>$20,000</span></div>
                </div>
                <p className="text-xs text-stone-400 mt-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>Your best estimate. Don't worry about being exact.</p>
              </div>
            )}

            <button onClick={() => { trackEvent('QuizStep2Complete', '/quiz', { raBracket: state.raBracket, cpfOA: state.cpfOA, idleCash: state.idleCash, otherIncome: state.otherIncomeMonthly }); setStep(3); }} disabled={!step2Valid} className="btn-primary-cpf w-full disabled:opacity-50 disabled:cursor-not-allowed">
              Continue →
            </button>
          </div>
        )}

        {/* ===== STEP 3: Priorities ===== */}
        {step === 3 && (
          <div className="space-y-8">
            <div className="flex items-center gap-2">
              <button onClick={() => setStep(2)} className="text-emerald-600 text-sm hover:underline" style={{ fontFamily: "'DM Sans', sans-serif" }}>← Back</button>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-stone-900 mb-1">Almost Done</h2>
              <p className="text-stone-500" style={{ fontFamily: "'DM Sans', sans-serif" }}>Help us personalise your retirement report</p>
            </div>

            <div>
              <label className="block font-medium text-stone-900 mb-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>What worries you most about retirement?</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {([
                  { key: "healthcare" as Concern, icon: Heart, label: "Rising healthcare costs", sub: "Medical bills eating into savings" },
                  { key: "outliving" as Concern, icon: Clock, label: "Outliving my savings", sub: "Will my money last 20-30 years?" },
                  { key: "inflation" as Concern, icon: TrendingDown, label: "Inflation eroding my money", sub: "Purchasing power declining yearly" },
                  { key: "family" as Concern, icon: Users, label: "Supporting my family", sub: "Ongoing financial obligations" },
                ]).map((item) => (
                  <div key={item.key} onClick={() => update("concern", item.key)}
                    className={`cursor-pointer rounded-xl border-2 p-4 transition-all ${state.concern === item.key ? "border-emerald-500 bg-emerald-50" : "border-stone-200 bg-white hover:border-stone-300"}`}>
                    <item.icon className={`h-5 w-5 mb-2 ${state.concern === item.key ? "text-emerald-600" : "text-stone-400"}`} />
                    <p className="font-semibold text-stone-900 text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>{item.label}</p>
                    <p className="text-xs text-stone-500" style={{ fontFamily: "'DM Sans', sans-serif" }}>{item.sub}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-medium text-stone-900 mb-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>What does your ideal retirement look like?</label>
              <div className="space-y-2">
                {([
                  { key: "basic" as RetirementGoal, label: "Simple & stress-free", desc: "Cover essentials, no financial worry" },
                  { key: "comfortable" as RetirementGoal, label: "Comfortable lifestyle", desc: "Eat out, enjoy hobbies, occasional treats" },
                  { key: "travel" as RetirementGoal, label: "Travel & experiences", desc: "Regular holidays, bucket list trips" },
                  { key: "legacy" as RetirementGoal, label: "Leave an inheritance", desc: "Support children, grandchildren, give back" },
                ]).map((item) => (
                  <div key={item.key} onClick={() => update("retirementGoal", item.key)}
                    className={`cursor-pointer rounded-xl border-2 p-4 transition-all ${state.retirementGoal === item.key ? "border-emerald-500 bg-emerald-50" : "border-stone-200 bg-white hover:border-stone-300"}`}>
                    <p className="font-semibold text-stone-900 text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>{item.label}</p>
                    <p className="text-xs text-stone-500" style={{ fontFamily: "'DM Sans', sans-serif" }}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-medium text-stone-900 mb-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>How confident are you in your retirement plan right now?</label>
              <div className="space-y-2">
                {([
                  { key: "not_confident" as Confidence, label: "Not confident at all", desc: "I haven't really planned and I'm worried" },
                  { key: "somewhat" as Confidence, label: "Somewhat confident", desc: "I have some savings but not sure if it's enough" },
                  { key: "confident" as Confidence, label: "Fairly confident", desc: "I have a plan but want to optimise it" },
                ]).map((item) => (
                  <div key={item.key} onClick={() => update("confidence", item.key)}
                    className={`cursor-pointer rounded-xl border-2 p-4 transition-all ${state.confidence === item.key ? "border-emerald-500 bg-emerald-50" : "border-stone-200 bg-white hover:border-stone-300"}`}>
                    <p className="font-semibold text-stone-900 text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>{item.label}</p>
                    <p className="text-xs text-stone-500" style={{ fontFamily: "'DM Sans', sans-serif" }}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <button onClick={handleFinalContinue} disabled={!step3Valid} className="btn-primary-cpf w-full disabled:opacity-50 disabled:cursor-not-allowed">
              See My Results →
            </button>
          </div>
        )}
      </div>

      <Footer variant="quiz" />
    </div>
  );
};

export default QuizPage;
