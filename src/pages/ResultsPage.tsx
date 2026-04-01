import { useNavigate, useLocation } from "react-router-dom";
import { ShieldCheck, CheckCircle, Star, Clock, Users, ArrowRight, AlertTriangle, Info } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { type QuizState, calculateResults, fmt } from "@/lib/calculator";
import { useCountUp } from "@/hooks/use-count-up";
import {
  getHeroHeadline, getPreHeadline, getOpeningLetter, getInflationReality,
  getRevealText, getEvenIfBullets, getFuturePacing, getTestimonials,
  getSessionAgenda, getCTAText,
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
  const totalRetirementLoss = Math.round(r.monthlyShortfall * 12 * 20);
  const idleTotal = quizState.cpfOA + quizState.idleCash;
  const annualInflationLoss = Math.round(idleTotal * 0.025);

  const copyInputs = {
    firstName, currentAge: quizState.currentAge,
    desiredMonthlyToday: r.desiredMonthlyToday, inflatedDesiredMonthly: r.inflatedDesiredMonthly,
    cpfLifeMonthly: r.cpfLifeMonthly, totalMonthlyIncome: r.totalMonthlyIncome,
    portfolioMonthlyIncome: r.portfolioMonthlyIncome, otherIncomeMonthly: r.otherIncomeMonthly,
    monthlyShortfall: r.monthlyShortfall, monthlySurplus: r.monthlySurplus,
    extraMonthly, cpfOA: quizState.cpfOA, idleCash: quizState.idleCash, idleTotal, yearsLeft,
    concern: quizState.concern, confidence: quizState.confidence!,
    retirementGoal: quizState.retirementGoal!, isOnTrack: r.isOnTrack,
    totalRetirementLoss, annualInflationLoss,
  };

  const heroHeadline = getHeroHeadline(copyInputs);
  const preHeadline = getPreHeadline(copyInputs);
  const openingLetter = getOpeningLetter(copyInputs);
  const inflationReality = getInflationReality(copyInputs);
  const revealText = getRevealText(copyInputs);
  const evenIfBullets = getEvenIfBullets(copyInputs);
  const futurePacing = getFuturePacing(copyInputs);
  const testimonials = getTestimonials(copyInputs);
  const sessionAgenda = getSessionAgenda(copyInputs);

  const BookingCTA = ({ position }: { position: 1 | 2 | 3 }) => (
    <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer"
      className={position === 3 ? "btn-cta-white" : "btn-cta"}>
      <span className="block">{getCTAText(copyInputs, position)}</span>
      {position === 1 && <span className="block text-sm font-normal mt-1.5 opacity-80">Free 45-Minute Session · Written Plan · No Products Sold</span>}
    </a>
  );

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* HERO */}
      <div className="section-dark py-12 sm:py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-amber-400 text-xs font-bold uppercase tracking-[0.2em] mb-5" style={{ fontFamily: "'DM Sans', sans-serif" }}>{preHeadline}</p>
          <h1 className="text-2xl sm:text-3xl lg:text-[2.5rem] font-bold text-white leading-[1.2] mb-6">{heroHeadline}</h1>
          <p className="text-stone-500 text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>Through our CPF Retirement Maximiser™ — a proven restructure of your existing CPF + savings</p>
        </div>
      </div>

      {/* INCOME BREAKDOWN */}
      <div className="bg-stone-50 py-10 px-4">
        <div className="max-w-3xl mx-auto">
          <div className={`grid gap-3 ${r.otherIncomeMonthly > 0 ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-3'}`}>
            <div className="card-premium p-4 text-center">
              <p className="text-xl sm:text-2xl font-bold text-stone-900 mb-1 tabular-nums"><CountUpValue value={r.cpfLifeMonthly} /></p>
              <p className="text-[10px] sm:text-xs text-stone-500 font-medium" style={{ fontFamily: "'DM Sans', sans-serif" }}>CPF LIFE</p>
            </div>
            {r.otherIncomeMonthly > 0 && (
              <div className="card-premium p-4 text-center">
                <p className="text-xl sm:text-2xl font-bold text-stone-900 mb-1 tabular-nums">{fmt(r.otherIncomeMonthly)}</p>
                <p className="text-[10px] sm:text-xs text-stone-500 font-medium" style={{ fontFamily: "'DM Sans', sans-serif" }}>Other Income</p>
              </div>
            )}
            <div className="card-premium p-4 text-center">
              <p className="text-xl sm:text-2xl font-bold text-stone-900 mb-1 tabular-nums"><CountUpValue value={r.portfolioMonthlyIncome} /></p>
              <p className="text-[10px] sm:text-xs text-stone-500 font-medium" style={{ fontFamily: "'DM Sans', sans-serif" }}>Portfolio Income</p>
            </div>
            <div className="card-premium p-4 text-center border-emerald-200">
              <p className="text-xl sm:text-2xl font-bold text-emerald-600 mb-1 tabular-nums"><CountUpValue value={r.totalMonthlyIncome} /></p>
              <p className="text-[10px] sm:text-xs text-emerald-600 font-medium" style={{ fontFamily: "'DM Sans', sans-serif" }}>Total at 65</p>
            </div>
          </div>
          <div className={`mt-4 rounded-xl p-4 flex items-center gap-3 ${r.isOnTrack ? 'bg-emerald-50 border border-emerald-200' : 'bg-red-50 border border-red-200'}`}>
            {r.isOnTrack ? <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0" /> : <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0" />}
            <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
              <p className={`text-sm font-bold ${r.isOnTrack ? 'text-emerald-800' : 'text-red-800'}`}>
                {r.isOnTrack ? `You're on track with ${fmt(r.monthlySurplus)}/month surplus` : `Gap of ${fmt(r.monthlyShortfall)}/month`}
              </p>
              <p className="text-xs text-stone-500">Spending at 65 (inflation-adjusted): {fmt(r.inflatedDesiredMonthly)}/month <span className="text-stone-400">(today: {fmt(r.desiredMonthlyToday)})</span></p>
            </div>
          </div>
        </div>
      </div>

      {/* SALES LETTER */}
      <div className="max-w-2xl mx-auto px-5 py-12 space-y-10">
        <section>
          <p className="text-stone-400 text-sm font-medium mb-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>Dear {firstName},</p>
          {openingLetter.split("\n\n").map((para, i) => <p key={i} className="letter-p">{para}</p>)}
        </section>

        {inflationReality && (
          <section className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
            <div className="flex items-start gap-3 mb-3">
              <Info className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-amber-900 font-bold text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>The Inflation Reality</p>
            </div>
            {inflationReality.split("\n\n").map((para, i) => <p key={i} className="text-amber-800 text-sm leading-relaxed mb-2" style={{ fontFamily: "'DM Sans', sans-serif" }}>{para}</p>)}
          </section>
        )}

        <section className="highlight-box">
          {revealText.split("\n\n").map((para, i) => <p key={i} className="text-emerald-800 leading-relaxed mb-2 text-[15px]" style={{ fontFamily: "'DM Sans', sans-serif" }}>{para}</p>)}
        </section>

        <section>
          <p className="text-stone-900 font-bold text-lg mb-4" style={{ fontFamily: "'DM Serif Display', serif" }}>And This Can Be Done Even If You've:</p>
          <div className="space-y-2.5">
            {evenIfBullets.map((bullet, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="bullet-x">✗</span>
                <p className="text-stone-700 text-[15px] leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif" }}>{bullet}</p>
              </div>
            ))}
          </div>
        </section>

        {yearsLeft > 0 && (
          <section className="bg-amber-50 border border-amber-200 rounded-xl p-5">
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-amber-800 text-sm leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                <span className="font-bold">You have {yearsLeft} years of compounding left.</span> Every year you wait, your {fmt(idleTotal)} misses out on approximately {fmt(Math.round(idleTotal * 0.06))} in potential growth.
              </p>
            </div>
          </section>
        )}

        <BookingCTA position={1} />

        {/* Mechanism */}
        <section>
          <p className="section-label text-center">The Method</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 mb-2 text-center">The CPF Retirement Maximiser™</h2>
          <p className="text-stone-500 text-sm mb-8 text-center max-w-lg mx-auto" style={{ fontFamily: "'DM Sans', sans-serif" }}>A 3-step restructure for Singaporeans aged 50-64</p>
          <div className="space-y-4">
            {[
              { step: "1", title: "We X-Ray Your Finances", time: "15 min",
                copy: `We map every dollar — CPF RA (${quizState.raBracket}), OA (${fmt(quizState.cpfOA)}), savings (${fmt(quizState.idleCash)})${r.otherIncomeMonthly > 0 ? `, and other income (${fmt(r.otherIncomeMonthly)}/mo)` : ''}.`,
                result: `Most people discover ${fmt(idleTotal)} earning 0.05% when it could generate ${fmt(extraMonthly)}/month.` },
              { step: "2", title: "We Build Your Retirement Blueprint", time: "20 min",
                copy: "We restructure how your CPF contributions, savings deployment, and withdrawal timing work together for maximum monthly income at 65.",
                result: "Most Singaporeans increase projected retirement income by 40-80% without additional market risk." },
              { step: "3", title: "You Walk Away With a Written Plan", time: "10 min",
                copy: "A step-by-step document with exact amounts, dates, and actions. Take it to any advisor or execute yourself.",
                result: "The plan is yours. No strings. No products sold." },
            ].map((item) => (
              <div key={item.step} className="card-premium overflow-hidden">
                <div className="bg-stone-50 border-b border-stone-200 px-6 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3"><div className="step-circle">{item.step}</div><h3 className="font-bold text-stone-900" style={{ fontFamily: "'DM Sans', sans-serif" }}>{item.title}</h3></div>
                  <span className="text-xs text-stone-400" style={{ fontFamily: "'DM Sans', sans-serif" }}>{item.time}</span>
                </div>
                <div className="p-6">
                  <p className="letter-p mb-3">{item.copy}</p>
                  <p className="text-sm text-emerald-700 font-semibold bg-emerald-50 rounded-lg px-4 py-3" style={{ fontFamily: "'DM Sans', sans-serif" }}>→ {item.result}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <section>
          <p className="section-label text-center">Results</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 mb-6 text-center">They Were In Your Exact Situation</h2>
          <div className="space-y-4">
            {testimonials.map((t, idx) => (
              <div key={t.name} className="card-premium p-5">
                <div className="flex items-center gap-3 mb-3">
                  <img src={testimonialImages[idx]} alt={t.name} className="w-12 h-12 rounded-full object-cover" />
                  <div>
                    <p className="font-bold text-stone-900 text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>{t.name}, {t.age}</p>
                    <div className="flex gap-0.5">{[...Array(5)].map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />)}</div>
                  </div>
                </div>
                <p className="text-xs text-stone-400 mb-2" style={{ fontFamily: "'DM Sans', sans-serif" }}>{t.situation}</p>
                <div className="flex items-center gap-2 mb-3 bg-stone-50 rounded-lg p-2.5">
                  <span className="bg-red-100 text-red-700 text-xs font-bold px-2.5 py-1 rounded-full">{t.before}</span>
                  <ArrowRight className="h-4 w-4 text-stone-400" />
                  <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full">{t.after}</span>
                  <span className="text-xs text-stone-500 ml-auto font-medium" style={{ fontFamily: "'DM Sans', sans-serif" }}>/month at 65</span>
                </div>
                <p className="text-sm text-stone-600 leading-relaxed italic" style={{ fontFamily: "'DM Sans', sans-serif" }}>"{t.quote}"</p>
              </div>
            ))}
          </div>
        </section>

        <BookingCTA position={2} />

        {/* Guarantee */}
        <section>
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900 mb-4 text-center">"What If It's Just a Sales Pitch?"</h2>
          <div className="highlight-box mb-6">
            <div className="flex items-start gap-4">
              <ShieldCheck className="h-10 w-10 text-emerald-600 flex-shrink-0" />
              <div>
                <h3 className="font-bold text-stone-900 text-lg mb-2" style={{ fontFamily: "'DM Sans', sans-serif" }}>The "Written Plan or We Pay You" Guarantee</h3>
                <p className="text-stone-700 leading-relaxed text-[15px]" style={{ fontFamily: "'DM Sans', sans-serif" }}>If you don't leave with a clear, written plan — with your exact numbers, specific action steps, and a path to {fmt(r.totalMonthlyIncome)}/month — we'll donate $50 to the Community Chest. You keep everything. No products sold. <strong>Ever.</strong></p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { icon: "🚫", title: "Zero Products Sold", desc: "Not insurance, not unit trusts. Planning only." },
              { icon: "📋", title: "You Own Everything", desc: "Your report, your plan. Take it anywhere." },
              { icon: "🤝", title: "Honest in 10 Minutes", desc: "If we can't help, we tell you upfront." },
            ].map((item) => (
              <div key={item.title} className="card-premium p-4 text-center">
                <p className="text-2xl mb-2">{item.icon}</p>
                <h4 className="font-bold text-stone-900 text-sm mb-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>{item.title}</h4>
                <p className="text-xs text-stone-500 leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif" }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Future Pacing */}
        <section className="section-warm rounded-2xl p-6 sm:p-8">
          <h2 className="text-xl sm:text-2xl font-bold text-stone-900 mb-5 text-center">{firstName}, Picture This...</h2>
          <div className="max-w-lg mx-auto space-y-4">
            {futurePacing.map((line, i) => (
              <p key={i} className={`text-[15px] leading-[1.85] ${i === 0 || i === futurePacing.length - 1 ? "text-stone-900 font-bold" : "text-stone-600"}`} style={{ fontFamily: "'DM Sans', sans-serif" }}>{line}</p>
            ))}
          </div>
        </section>

        {/* Reverse Qualification */}
        <section className="border-2 border-stone-900 rounded-2xl p-6 sm:p-8 text-center">
          <p className="text-stone-900 font-bold text-lg mb-4" style={{ fontFamily: "'DM Serif Display', serif" }}>If You're NOT Serious About Maximising Your Retirement Income... You Can Stop Reading Here.</p>
          <p className="text-stone-600 text-sm leading-relaxed max-w-lg mx-auto" style={{ fontFamily: "'DM Sans', sans-serif" }}>This session is for Singaporeans ready to take action. If you want to "think about it" for another year while your {fmt(idleTotal)} loses another {fmt(annualInflationLoss)} to inflation — that's your choice.</p>
        </section>

        {/* Final CTA */}
        <section className="section-dark rounded-2xl overflow-hidden">
          <div className="bg-red-600 text-white text-center py-2.5 px-4">
            <p className="text-xs sm:text-sm font-bold flex items-center justify-center gap-2" style={{ fontFamily: "'DM Sans', sans-serif" }}><Users className="h-4 w-4" />Maximum 15 consultations per month — limited slots for {new Date().toLocaleDateString("en-SG", { month: "long" })}</p>
          </div>
          <div className="p-6 sm:p-10 space-y-6">
            <div className="text-center">
              <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight mb-2">Here's Everything You'll Walk Away With</h2>
              <p className="text-stone-400 text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>In one 45-minute session — completely free</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-5">
              <ul className="space-y-3">
                {sessionAgenda.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm"><CheckCircle className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" /><span className="text-stone-200" style={{ fontFamily: "'DM Sans', sans-serif" }}>{item}</span></li>
                ))}
              </ul>
              <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-stone-400 text-sm">Total Value:</span><span className="text-stone-400 text-sm line-through">$1,150</span>
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-white font-bold text-lg" style={{ fontFamily: "'DM Sans', sans-serif" }}>Your Investment Today:</span><span className="text-emerald-400 font-black text-2xl">FREE</span>
              </div>
            </div>
            <BookingCTA position={3} />
            <div className="flex flex-wrap justify-center gap-2">
              {["✓ Not a sales call", "✓ No products sold", "✓ Written plan guaranteed", "✓ 45 minutes, that's it"].map((pill) => (
                <span key={pill} className="bg-white/10 text-stone-300 text-xs px-3 py-1.5 rounded-full" style={{ fontFamily: "'DM Sans', sans-serif" }}>{pill}</span>
              ))}
            </div>
          </div>
        </section>

        <p className="text-xs text-stone-400 leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif" }}>This report is for educational and illustrative purposes only. All figures are estimates. CPF LIFE payouts depend on individual circumstances and CPF Board policies. Investment returns are projections, not guaranteed. This does not constitute financial advice. Consult a licensed financial advisor before making decisions.</p>
      </div>

      <Footer />
    </div>
  );
};

export default ResultsPage;
