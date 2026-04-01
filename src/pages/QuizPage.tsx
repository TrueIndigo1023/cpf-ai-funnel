import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Clock, TrendingDown, Users } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { type QuizState, type Concern, type Confidence, type RetirementGoal, defaultQuizState, fmt } from "@/lib/calculator";

const QuizPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [state, setState] = useState<QuizState>(defaultQuizState);

  const update = useCallback(<K extends keyof QuizState>(key: K, val: QuizState[K]) => {
    setState((prev) => ({ ...prev, [key]: val }));
  }, []);

  const step1Valid = state.currentAge > 0 && state.retireAge > 0 && state.desiredMonthly > 0;
  const step2Valid = state.raBracket !== null;
  const step3Valid = state.concern !== null && state.confidence !== null && state.retirementGoal !== null;

  const handleFinalContinue = () => {
    const combined = state.cpfOA + state.idleCash;
    if (combined < 100000) {
      navigate("/not-eligible", { state });
    } else {
      navigate("/loading", { state });
    }
  };

  const ages = Array.from({ length: 15 }, (_, i) => 50 + i);
  const retireAges = Array.from({ length: 16 }, (_, i) => 55 + i);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <div className="flex-1 max-w-[680px] mx-auto w-full px-4 py-8">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-sm text-foreground/60 mb-2">
            <span>Step {step} of 3</span>
            <span>{step === 1 ? "Your Goals" : step === 2 ? "CPF & Savings" : "Your Priorities"}</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* ===== STEP 1: Goals ===== */}
        {step === 1 && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-1">Your Retirement Goals</h2>
              <p className="text-foreground/70">Tell us what you're planning for</p>
            </div>

            {/* Current Age */}
            <div>
              <label className="block font-medium text-foreground mb-2">Your current age</label>
              <select
                value={state.currentAge || ""}
                onChange={(e) => update("currentAge", Number(e.target.value))}
                className="w-full border border-input rounded-xl px-4 py-3 bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                <option value="">Select your age</option>
                {ages.map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>

            {/* Retirement Age */}
            <div>
              <label className="block font-medium text-foreground mb-2">Planned retirement age</label>
              <select
                value={state.retireAge || ""}
                onChange={(e) => update("retireAge", Number(e.target.value))}
                className="w-full border border-input rounded-xl px-4 py-3 bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                <option value="">Select retirement age</option>
                {retireAges.map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
              <p className="text-xs text-foreground/60 mt-1">CPF LIFE payouts begin at 65</p>
            </div>

            {/* Desired Monthly */}
            <div>
              <label className="block font-medium text-foreground mb-2">Desired monthly retirement income</label>
              <div className="relative pt-8 pb-2">
                <div
                  className="absolute top-0 bg-primary text-primary-foreground text-sm font-semibold rounded-full px-3 py-1 -translate-x-1/2 tabular-nums"
                  style={{ left: `${((state.desiredMonthly - 1000) / 9000) * 100}%` }}
                >
                  {fmt(state.desiredMonthly)}
                </div>
                <input
                  type="range"
                  min={1000}
                  max={10000}
                  step={100}
                  value={state.desiredMonthly || 1000}
                  onChange={(e) => update("desiredMonthly", Number(e.target.value))}
                  className="w-full accent-primary h-2 bg-muted rounded-full appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-foreground/60 mt-1">
                  <span>$1,000</span>
                  <span>$10,000</span>
                </div>
              </div>
              <p className="text-xs text-foreground/60 mt-1">Include housing, food, lifestyle, healthcare & leisure</p>
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!step1Valid}
              className="btn-primary-cpf w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue →
            </button>
          </div>
        )}

        {/* ===== STEP 2: CPF & Savings ===== */}
        {step === 2 && (
          <div className="space-y-8">
            <div className="flex items-center gap-2">
              <button onClick={() => setStep(1)} className="text-primary text-sm hover:underline">← Back</button>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-1">Your CPF & Savings</h2>
              <p className="text-foreground/70">We'll calculate your projected retirement income at 65</p>
            </div>

            {/* RA Bracket */}
            <div>
              <label className="block font-medium text-foreground mb-2">
                Your CPF Retirement Account (RA) bracket at 55
              </label>
              <p className="text-xs text-foreground/60 mb-4">Not yet 55? Choose the bracket you expect to reach.</p>

              <div className="space-y-3">
                {([
                  { key: "BRS" as const, title: "Basic Retirement Sum (BRS)", badge: "Below $180,000", badgeColor: "bg-muted text-muted-foreground", desc: "Basic monthly CPF LIFE income from 65" },
                  { key: "FRS" as const, title: "Full Retirement Sum (FRS)", badge: "$180,000 – $220,400", badgeColor: "bg-secondary text-primary", desc: "Moderate, stable monthly income for life from 65" },
                  { key: "ERS" as const, title: "Enhanced Retirement Sum (ERS)", badge: "Above $280,000", badgeColor: "bg-accent/10 text-accent", desc: "Highest CPF LIFE monthly payout available" },
                ]).map((card) => (
                  <div
                    key={card.key}
                    onClick={() => update("raBracket", card.key)}
                    className={state.raBracket === card.key ? "quiz-card-selected" : "quiz-card"}
                  >
                    <div className="font-semibold text-foreground mb-1">{card.title}</div>
                    <span className={`inline-block text-xs rounded-full px-3 py-0.5 mb-2 ${card.badgeColor}`}>{card.badge}</span>
                    <p className="text-sm text-foreground/70">{card.desc}</p>
                  </div>
                ))}
              </div>
              <p className="text-xs text-foreground/60 italic mt-3">2025–2026 reference amounts. Actual sums depend on the year you turn 55.</p>
            </div>

            {/* CPF OA Slider */}
            <div>
              <label className="block font-medium text-foreground mb-2">CPF Ordinary Account (OA) balance <span className="text-foreground/60 font-normal">(Pls slide)</span></label>
              <div className="relative pt-8 pb-2">
                <div
                  className="absolute top-0 bg-primary text-primary-foreground text-sm font-semibold rounded-full px-3 py-1 -translate-x-1/2 tabular-nums"
                  style={{ left: `${(state.cpfOA / 500000) * 100}%` }}
                >
                  {fmt(state.cpfOA)}
                </div>
                <input
                  type="range"
                  min={0}
                  max={500000}
                  step={5000}
                  value={state.cpfOA}
                  onChange={(e) => update("cpfOA", Number(e.target.value))}
                  className="w-full accent-primary h-2 bg-muted rounded-full appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-foreground/60 mt-1">
                  <span>$0</span>
                  <span>$500,000</span>
                </div>
              </div>
              <p className="text-xs text-foreground/60 mt-1">Check cpf.gov.sg for your exact balance</p>
            </div>

            {/* Idle Cash Slider */}
            <div>
              <label className="block font-medium text-foreground mb-2">Idle cash & low-yield savings <span className="text-foreground/60 font-normal">(Pls slide)</span></label>
              <div className="relative pt-8 pb-2">
                <div
                  className="absolute top-0 bg-primary text-primary-foreground text-sm font-semibold rounded-full px-3 py-1 -translate-x-1/2 tabular-nums"
                  style={{ left: `${(state.idleCash / 1000000) * 100}%` }}
                >
                  {fmt(state.idleCash)}
                </div>
                <input
                  type="range"
                  min={0}
                  max={1000000}
                  step={5000}
                  value={state.idleCash}
                  onChange={(e) => update("idleCash", Number(e.target.value))}
                  className="w-full accent-primary h-2 bg-muted rounded-full appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-foreground/60 mt-1">
                  <span>$0</span>
                  <span>$1,000,000</span>
                </div>
              </div>
              <p className="text-xs text-foreground/60 mt-1">Bank savings, fixed deposits, T-bills, SSB, or uninvested cash</p>
            </div>

            <button
              onClick={() => setStep(3)}
              disabled={!step2Valid}
              className="btn-primary-cpf w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue →
            </button>
          </div>
        )}

        {/* ===== STEP 3: Priorities & Concerns ===== */}
        {step === 3 && (
          <div className="space-y-8">
            <div className="flex items-center gap-2">
              <button onClick={() => setStep(2)} className="text-primary text-sm hover:underline">← Back</button>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-1">Almost Done</h2>
              <p className="text-foreground/70">Help us personalise your retirement report</p>
            </div>

            {/* Biggest Concern */}
            <div>
              <label className="block font-medium text-foreground mb-3">What worries you most about retirement?</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {([
                  { key: "healthcare" as Concern, icon: Heart, label: "Rising healthcare costs", sub: "Medical bills eating into savings" },
                  { key: "outliving" as Concern, icon: Clock, label: "Outliving my savings", sub: "Will my money last 20-30 years?" },
                  { key: "inflation" as Concern, icon: TrendingDown, label: "Inflation eroding my money", sub: "Purchasing power declining yearly" },
                  { key: "family" as Concern, icon: Users, label: "Supporting my family", sub: "Ongoing financial obligations" },
                ]).map((item) => (
                  <div
                    key={item.key}
                    onClick={() => update("concern", item.key)}
                    className={`cursor-pointer rounded-xl border-2 p-4 transition-all ${
                      state.concern === item.key
                        ? "border-primary bg-primary/5"
                        : "border-border bg-card hover:border-primary/30"
                    }`}
                  >
                    <item.icon className={`h-5 w-5 mb-2 ${state.concern === item.key ? "text-primary" : "text-foreground/40"}`} />
                    <p className="font-semibold text-foreground text-sm">{item.label}</p>
                    <p className="text-xs text-foreground/60">{item.sub}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Retirement Goal */}
            <div>
              <label className="block font-medium text-foreground mb-3">What does your ideal retirement look like?</label>
              <div className="space-y-2">
                {([
                  { key: "basic" as RetirementGoal, label: "Simple & stress-free", desc: "Cover essentials, no financial worry" },
                  { key: "comfortable" as RetirementGoal, label: "Comfortable lifestyle", desc: "Eat out, enjoy hobbies, occasional treats" },
                  { key: "travel" as RetirementGoal, label: "Travel & experiences", desc: "Regular holidays, bucket list trips" },
                  { key: "legacy" as RetirementGoal, label: "Leave a legacy", desc: "Support children, grandchildren, give back" },
                ]).map((item) => (
                  <div
                    key={item.key}
                    onClick={() => update("retirementGoal", item.key)}
                    className={`cursor-pointer rounded-xl border-2 p-4 transition-all ${
                      state.retirementGoal === item.key
                        ? "border-primary bg-primary/5"
                        : "border-border bg-card hover:border-primary/30"
                    }`}
                  >
                    <p className="font-semibold text-foreground text-sm">{item.label}</p>
                    <p className="text-xs text-foreground/60">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Confidence Level */}
            <div>
              <label className="block font-medium text-foreground mb-3">How confident are you in your retirement plan right now?</label>
              <div className="space-y-2">
                {([
                  { key: "not_confident" as Confidence, label: "Not confident at all", desc: "I haven't really planned and I'm worried" },
                  { key: "somewhat" as Confidence, label: "Somewhat confident", desc: "I have some savings but not sure if it's enough" },
                  { key: "confident" as Confidence, label: "Fairly confident", desc: "I have a plan but want to optimise it" },
                ]).map((item) => (
                  <div
                    key={item.key}
                    onClick={() => update("confidence", item.key)}
                    className={`cursor-pointer rounded-xl border-2 p-4 transition-all ${
                      state.confidence === item.key
                        ? "border-primary bg-primary/5"
                        : "border-border bg-card hover:border-primary/30"
                    }`}
                  >
                    <p className="font-semibold text-foreground text-sm">{item.label}</p>
                    <p className="text-xs text-foreground/60">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleFinalContinue}
              disabled={!step3Valid}
              className="btn-primary-cpf w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
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
