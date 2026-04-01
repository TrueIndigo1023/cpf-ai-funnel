import { useNavigate, useLocation } from "react-router-dom";
import { ShieldCheck, CheckCircle, Star, Clock, Users, ArrowRight, XCircle, AlertTriangle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { type QuizState, calculateResults, fmt } from "@/lib/calculator";
import { useCountUp } from "@/hooks/use-count-up";
import {
  getHeroHeadline, getPreHeadline, getOpeningLetter,
  getEvenIfBullets, getFuturePacing, getTestimonials,
  getSessionAgenda,
} from "@/lib/dynamic-copy";
import testimonial1 from "@/assets/testimonial-1.jpg";
import testimonial2 from "@/assets/testimonial-2.jpg";
import testimonial3 from "@/assets/testimonial-3.jpg";
import testimonial4 from "@/assets/testimonial-4.jpg";

const testimonialImages = [testimonial1, testimonial2, testimonial3, testimonial4];

const CountUpValue = ({ value }: { value: number }) => {
  const animated = useCountUp(Math.round(value));
  return <>{`$${animated.toLocaleString("en-SG")}`}</>;
};

const ResultsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const quizState = location.state as QuizState | null;

  if (!quizState || !quizState.currentAge || !quizState.fullName || !quizState.concern) {
    navigate("/quiz", { replace: true });
    return null;
  }

  const r = calculateResults(quizState);
  const firstName = quizState.fullName.trim().split(" ")[0];
  const BOOKING_URL = "https://api.leadconnectorhq.com/widget/bookings/deon-tay-personal-calendar-8dryq3wol";

  const yearsLeft = Math.max(0, 65 - quizState.currentAge);
  const extraMonthly = Math.round(r.totalMonthlyIncome - r.cpfLifeMonthly);
  const totalRetirementLoss = Math.round((r.inflatedIncome - r.cpfLifeMonthly) * 12 * 20);
  const idleTotal = quizState.cpfOA + quizState.idleCash;
  const annualInflationLoss = Math.round(idleTotal * 0.03);

  const copyInputs = {
    firstName, currentAge: quizState.currentAge, desiredMonthly: quizState.desiredMonthly,
    cpfLifeMonthly: r.cpfLifeMonthly, totalMonthlyIncome: r.totalMonthlyIncome,
    monthlyShortfall: r.monthlyShortfall, extraMonthly, cpfOA: quizState.cpfOA,
    idleCash: quizState.idleCash, idleTotal, yearsLeft,
    concern: quizState.concern, confidence: quizState.confidence!,
    retirementGoal: quizState.retirementGoal!, totalRetirementLoss, annualInflationLoss,
  };

  const heroHeadline = getHeroHeadline(copyInputs);
  const preHeadline = getPreHeadline(copyInputs);
  const openingLetter = getOpeningLetter(copyInputs);
  const evenIfBullets = getEvenIfBullets(copyInputs);
  const futurePacing = getFuturePacing(copyInputs);
  const testimonials = getTestimonials(copyInputs);
  const sessionAgenda = getSessionAgenda(copyInputs);

  const BookingButton = ({ children, variant = "primary" }: { children: React.ReactNode; variant?: "primary" | "white" }) => (
    <a
      href={BOOKING_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`block w-full rounded-2xl px-8 py-7 font-extrabold text-xl sm:text-2xl transition-all text-center shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] ${
        variant === "primary"
          ? "bg-emerald-600 text-white hover:bg-emerald-700"
          : "bg-white text-gray-900 hover:bg-gray-50"
      }`}
    >
      {children}
    </a>
  );

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* ==================================================================
          SECTION 1: HERO — Naction pattern
          Qualifying pre-headline + exact $ outcome + mechanism
          ================================================================== */}
      <div className="bg-gradient-to-b from-gray-900 to-gray-800 py-12 sm:py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-amber-400 text-xs font-bold uppercase tracking-widest mb-5">
            {preHeadline}
          </p>
          <h1 className="text-2xl sm:text-3xl lg:text-[2.5rem] font-black text-white leading-[1.2] mb-6">
            {heroHeadline}
          </h1>
          <p className="text-gray-400 text-sm">
            Through our CPF Retirement Maximiser™ — a proven restructure of your existing CPF + savings
          </p>
        </div>
      </div>

      {/* ==================================================================
          SECTION 2: THE NUMBERS — Show the gap viscerally
          Naction pattern: Specific $ repeated, visual contrast
          ================================================================== */}
      <div className="bg-gray-50 py-10 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            <div className="bg-white border border-red-200 rounded-xl p-4 sm:p-5 text-center">
              <p className="text-2xl sm:text-3xl font-black text-red-600 mb-1">
                <CountUpValue value={r.cpfLifeMonthly} />
              </p>
              <p className="text-[10px] sm:text-xs text-gray-500 font-medium">CPF LIFE Only</p>
              <p className="text-[10px] text-gray-400">If you do nothing</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 text-center">
              <p className="text-2xl sm:text-3xl font-black text-gray-900 mb-1">{fmt(quizState.desiredMonthly)}</p>
              <p className="text-[10px] sm:text-xs text-gray-500 font-medium">What You Need</p>
              <p className="text-[10px] text-gray-400">Your target income</p>
            </div>
            <div className="bg-white border border-emerald-200 rounded-xl p-4 sm:p-5 text-center">
              <p className="text-2xl sm:text-3xl font-black text-emerald-600 mb-1">
                <CountUpValue value={r.totalMonthlyIncome} />
              </p>
              <p className="text-[10px] sm:text-xs text-gray-500 font-medium">What's Possible</p>
              <p className="text-[10px] text-gray-400">With optimisation</p>
            </div>
          </div>
        </div>
      </div>

      {/* ==================================================================
          LONG-FORM SALES LETTER — Naction style
          Single column, generous spacing, conversational
          ================================================================== */}
      <div className="max-w-2xl mx-auto px-5 py-12 space-y-10">

        {/* ---- OPENING LETTER (dynamic per concern + confidence) ---- */}
        <section>
          <p className="text-gray-500 text-sm font-medium mb-4">Dear {firstName},</p>
          {openingLetter.split("\n\n").map((para, i) => (
            <p key={i} className="text-gray-700 leading-[1.85] mb-4 text-[15px]">
              {para}
            </p>
          ))}
        </section>

        {/* ---- THE REVEAL — What's possible ---- */}
        <section className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-6 sm:p-8">
          <p className="text-emerald-800 font-bold text-lg mb-3">Here's What Your Numbers Actually Show:</p>
          <p className="text-emerald-700 leading-relaxed mb-3">
            Your {fmt(idleTotal)} in CPF OA and savings — combined with a properly optimised CPF LIFE strategy —
            could generate up to <span className="font-black text-emerald-900">{fmt(r.totalMonthlyIncome)}/month</span> at 65.
          </p>
          <p className="text-emerald-700 leading-relaxed">
            That's <span className="font-bold">{fmt(extraMonthly)}/month MORE</span> than CPF alone.
            That's an extra <span className="font-bold">{fmt(extraMonthly * 12)}/year</span>.
            Over 20 years of retirement, that's <span className="font-bold">{fmt(extraMonthly * 12 * 20)}</span> in additional income
            — money that's already yours, just not working for you yet.
          </p>
        </section>

        {/* ---- "EVEN IF" OBJECTION DEMOLITION — Naction 1 pattern ---- */}
        <section>
          <p className="text-gray-900 font-black text-lg mb-4">
            And This Can Be Done Even If You've:
          </p>
          <div className="space-y-2.5">
            {evenIfBullets.map((bullet, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="text-red-500 font-bold text-sm mt-0.5">✗</span>
                <p className="text-gray-700 text-[15px] leading-relaxed">{bullet}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ---- TRANSITION + URGENCY ---- */}
        {yearsLeft > 0 && (
          <section className="bg-amber-50 border border-amber-200 rounded-xl p-5">
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-amber-900 font-bold text-sm mb-1">
                  You have {yearsLeft} years of compounding left.
                </p>
                <p className="text-amber-800 text-sm leading-relaxed">
                  Every year you wait, your {fmt(idleTotal)} misses out on approximately {fmt(Math.round(idleTotal * 0.06))} in potential growth.
                  That's {fmt(Math.round(idleTotal * 0.06 / 12))}/month of retirement income — gone forever. The math doesn't wait for anyone.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* ---- CTA #1 ---- */}
        <BookingButton>
          Show Me How to Get {fmt(r.totalMonthlyIncome)}/Month at 65
          <span className="block text-sm font-normal mt-1.5 opacity-80">
            Free 45-Minute Session · Written Plan · No Products Sold
          </span>
        </BookingButton>

        {/* ==================================================================
            THE MECHANISM — "CPF Retirement Maximiser™"
            Naction pattern: Named system, 3-step breakdown
            ================================================================== */}
        <section>
          <p className="text-emerald-600 text-xs font-bold uppercase tracking-widest mb-2 text-center">The Method</p>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2 text-center">
            The CPF Retirement Maximiser™
          </h2>
          <p className="text-gray-500 text-sm mb-8 text-center max-w-lg mx-auto">
            A 3-step restructure designed specifically for Singaporeans aged 50-64 who want their money working harder than they did
          </p>

          <div className="space-y-6">
            {[
              {
                step: "1", title: "We X-Ray Your Finances", time: "15 minutes",
                copy: `We map every dollar — your CPF RA (${quizState.raBracket}), OA (${fmt(quizState.cpfOA)}), idle savings (${fmt(quizState.idleCash)}), and any existing investments. No guesswork. Just your real numbers, laid bare.`,
                result: `Most people discover they have ${fmt(idleTotal)} sitting in accounts earning 0.05% when it could be generating ${fmt(extraMonthly)}/month.`,
                bullets: [
                  "Your exact CPF LIFE payout projection at 65",
                  "How much your idle cash is losing to inflation yearly",
                  "Your total retirement income picture in one clear view",
                ]
              },
              {
                step: "2", title: "We Build Your Retirement Blueprint", time: "20 minutes",
                copy: "Using your exact numbers, we restructure how your CPF contributions, savings deployment, and withdrawal timing work together. This isn't theory — it's a specific, personalised calculation.",
                result: "Most Singaporeans find they can increase projected retirement income by 40-80% without taking on additional market risk.",
                bullets: [
                  "Optimal CPF LIFE plan selection for your RA bracket",
                  "How to deploy OA + idle cash for maximum monthly income",
                  "Withdrawal timing that maximises payout, not minimises tax",
                ]
              },
              {
                step: "3", title: "You Walk Away With a Written Plan", time: "10 minutes",
                copy: "Not vague advice. Not a product pitch. A step-by-step document with exact amounts, exact dates, and exact actions. Take it to any advisor, your bank, or execute it yourself.",
                result: "The plan is yours. Unconditionally. No strings. No follow-up pressure. No products sold.",
                bullets: [
                  "Specific action steps with timelines",
                  "Exact amounts to move and where to move them",
                  "A personalised retirement report you keep forever",
                ]
              },
            ].map((item) => (
              <div key={item.step} className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="bg-gray-50 border-b border-gray-200 px-6 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-emerald-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-black text-sm">
                      {item.step}
                    </div>
                    <h3 className="font-bold text-gray-900">{item.title}</h3>
                  </div>
                  <span className="text-xs text-gray-400">{item.time}</span>
                </div>
                <div className="p-6">
                  <p className="text-gray-700 text-[15px] leading-relaxed mb-3">{item.copy}</p>
                  <div className="space-y-1.5 mb-4">
                    {item.bullets.map((b, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-gray-600">{b}</p>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-emerald-700 font-semibold bg-emerald-50 rounded-lg px-4 py-3">
                    → {item.result}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ==================================================================
            PROOF — Testimonials matched to concern
            Naction pattern: Situation + before/after + quote
            ================================================================== */}
        <section>
          <p className="text-emerald-600 text-xs font-bold uppercase tracking-widest mb-2 text-center">Results</p>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-6 text-center">
            They Were In Your Exact Situation
          </h2>

          <div className="space-y-4">
            {testimonials.map((t, idx) => (
              <div key={t.name} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <img src={testimonialImages[idx]} alt={t.name} className="w-12 h-12 rounded-full object-cover" />
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{t.name}, {t.age}</p>
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-400 mb-2">{t.situation}</p>
                <div className="flex items-center gap-2 mb-3 bg-gray-50 rounded-lg p-2.5">
                  <span className="bg-red-100 text-red-700 text-xs font-bold px-2.5 py-1 rounded-full">{t.before}</span>
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                  <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full">{t.after}</span>
                  <span className="text-xs text-gray-500 ml-auto font-medium">/month at 65</span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed italic">"{t.quote}"</p>
              </div>
            ))}
          </div>
        </section>

        {/* ---- CTA #2 ---- */}
        <BookingButton>
          I Want These Results — Book My Free Session
        </BookingButton>

        {/* ==================================================================
            GUARANTEE — Naction pattern: Named guarantee, bold
            ================================================================== */}
        <section>
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-4 text-center">
            "What If It's Just a Sales Pitch?"
          </h2>
          <p className="text-gray-500 text-sm mb-6 text-center max-w-lg mx-auto">
            We get it. You've seen enough "free consultations" that were just product pushes in disguise.
          </p>

          <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-6 sm:p-8 mb-6">
            <div className="flex items-start gap-4">
              <ShieldCheck className="h-10 w-10 text-emerald-600 flex-shrink-0" />
              <div>
                <h3 className="font-black text-gray-900 text-lg mb-2">The "Written Plan or We Pay You" Guarantee</h3>
                <p className="text-gray-700 leading-relaxed text-[15px]">
                  If you don't leave your 45-minute session with a <span className="font-bold">clear, written retirement plan</span> — with your exact numbers, specific action steps, and a path to {fmt(r.totalMonthlyIncome)}/month — we'll donate $50 to the Community Chest on your behalf.
                </p>
                <p className="text-gray-700 leading-relaxed text-[15px] mt-2">
                  You keep everything. No obligation. No follow-up pressure. <span className="font-bold">No products sold during the session. Ever.</span>
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { icon: "🚫", title: "Zero Products Sold", desc: "Not insurance, not unit trusts, not endowment plans. Planning only." },
              { icon: "📋", title: "You Own Everything", desc: "Your report, your plan, your numbers. Take it anywhere." },
              { icon: "🤝", title: "Honest in 10 Minutes", desc: "If we can't help, we tell you upfront and return your time." },
            ].map((item) => (
              <div key={item.title} className="bg-white border border-gray-200 rounded-xl p-4 text-center">
                <p className="text-2xl mb-2">{item.icon}</p>
                <h4 className="font-bold text-gray-900 text-sm mb-1">{item.title}</h4>
                <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ==================================================================
            FUTURE PACING — Dynamic per retirement goal
            ================================================================== */}
        <section className="bg-gray-50 rounded-2xl p-6 sm:p-8">
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-5 text-center">
            {firstName}, Picture This...
          </h2>
          <div className="max-w-lg mx-auto space-y-4">
            {futurePacing.map((line, i) => (
              <p key={i} className={`text-[15px] leading-[1.85] ${
                i === 0 || i === futurePacing.length - 1
                  ? "text-gray-900 font-bold"
                  : "text-gray-600"
              }`}>
                {line}
              </p>
            ))}
          </div>
          <p className="text-center mt-6 text-sm text-gray-500">
            The difference between this life and scraping by on {fmt(r.cpfLifeMonthly)}/month? <span className="font-bold text-gray-900">One 45-minute conversation.</span>
          </p>
        </section>

        {/* ==================================================================
            REVERSE QUALIFICATION — Naction pattern
            ================================================================== */}
        <section className="border-2 border-gray-900 rounded-2xl p-6 sm:p-8 text-center">
          <p className="text-gray-900 font-black text-lg mb-4">
            If You're NOT Serious About Maximising Your Retirement Income... You Can Stop Reading Here.
          </p>
          <p className="text-gray-600 text-sm leading-relaxed max-w-lg mx-auto">
            This session is for Singaporeans who are ready to take action. If you just want to "think about it" for another year while your {fmt(idleTotal)} loses another {fmt(annualInflationLoss)} to inflation — that's your choice. But if you're serious, keep reading.
          </p>
        </section>

        {/* ==================================================================
            FINAL CTA — Naction pattern: Scarcity + value stack + close
            ================================================================== */}
        <section className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl overflow-hidden">
          <div className="bg-red-600 text-white text-center py-2.5 px-4">
            <p className="text-xs sm:text-sm font-bold flex items-center justify-center gap-2">
              <Users className="h-4 w-4" />
              Maximum 15 consultations per month — limited slots for {new Date().toLocaleDateString("en-SG", { month: "long" })}
            </p>
          </div>

          <div className="p-6 sm:p-10 space-y-6">
            <div className="text-center">
              <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight mb-2">
                Here's Everything You'll Walk Away With
              </h2>
              <p className="text-gray-400 text-sm">
                In one 45-minute session — completely free, no strings attached
              </p>
            </div>

            {/* Value stack */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-5">
              <ul className="space-y-3">
                {sessionAgenda.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm">
                    <CheckCircle className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-200">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-gray-400 text-sm">Total Consultation Value:</span>
                <span className="text-gray-400 text-sm line-through">$1,150</span>
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-white font-bold text-lg">Your Investment Today:</span>
                <span className="text-emerald-400 font-black text-2xl">FREE</span>
              </div>
            </div>

            {/* Final CTA */}
            <BookingButton variant="white">
              Claim My Free CPF Maximiser Session
              <span className="block text-sm font-normal mt-1.5 text-gray-500">
                Before slots run out for {new Date().toLocaleDateString("en-SG", { month: "long" })}
              </span>
            </BookingButton>

            <div className="flex flex-wrap justify-center gap-2">
              {[
                "✓ Not a sales call",
                "✓ No products sold",
                "✓ Written plan guaranteed",
                "✓ 45 minutes, that's it",
              ].map((pill) => (
                <span key={pill} className="bg-white/10 text-gray-300 text-xs px-3 py-1.5 rounded-full">{pill}</span>
              ))}
            </div>
          </div>
        </section>

        {/* Disclaimer */}
        <p className="text-xs text-gray-400 leading-relaxed">
          This report is generated for educational and illustrative purposes only. All figures are estimates based on simplified assumptions and do not represent actual CPF Board calculations or guaranteed investment returns. CPF LIFE payouts depend on individual circumstances, plan chosen, and CPF Board policies at the time of retirement. Investment returns shown are illustrative projections, not guaranteed. Past performance is not indicative of future results. This does not constitute financial advice. Please consult a licensed financial advisor before making any retirement or investment decisions.
        </p>
      </div>

      <Footer />
    </div>
  );
};

export default ResultsPage;
