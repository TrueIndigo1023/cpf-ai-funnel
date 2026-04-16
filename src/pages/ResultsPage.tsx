import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { ShieldCheck, CheckCircle, Star, Clock, Users, ArrowRight, AlertTriangle, Info, TrendingUp, Newspaper, Award, BarChart2 } from "lucide-react";
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
import { trackEvent, setupScrollTracking } from "@/lib/tracking";

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
  const titles = ['mr', 'mrs', 'mdm', 'madam', 'dr', 'ms', 'miss', 'mr.', 'mrs.', 'dr.', 'ms.'];
  const nameParts = quizState.fullName.trim().split(/\s+/);
  const firstName = titles.includes(nameParts[0].toLowerCase()) && nameParts.length > 1 ? nameParts[1] : nameParts[0];
  const BOOKING_URL = "https://api.leadconnectorhq.com/widget/bookings/deon-tay-personal-calendar-8dryq3wol";

  const yearsLeft = Math.max(0, 65 - quizState.currentAge);
  const extraMonthly = Math.round(r.portfolioMonthlyIncome);
  const totalRetirementLoss = Math.round(r.currentGap * 12 * 20);
  const idleTotal = quizState.cpfOA + quizState.idleCash;
  const annualInflationLoss = Math.round(idleTotal * 0.025);

  const copyInputs = {
    firstName, currentAge: quizState.currentAge,
    desiredMonthlyToday: r.desiredMonthlyToday, inflatedDesiredMonthly: r.inflatedDesiredMonthly,
    cpfLifeMonthly: r.cpfLifeMonthly, currentTrajectory: r.currentTrajectory,
    currentGap: r.currentGap, totalMonthlyIncome: r.totalMonthlyIncome,
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
  const f = { fontFamily: "'DM Sans', sans-serif" };

  useEffect(() => {
    trackEvent('ResultsPageView', '/results', {
      isOnTrack: r.isOnTrack,
      concern: quizState.concern,
      confidence: quizState.confidence,
      goal: quizState.retirementGoal,
      currentTrajectory: r.currentTrajectory,
      totalMonthlyIncome: r.totalMonthlyIncome,
      inflatedDesired: r.inflatedDesiredMonthly,
    });
    const cleanup = setupScrollTracking();
    return cleanup;
  }, []);

  const BookingCTA = ({ position }: { position: 1 | 2 | 3 }) => (
    <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer"
      onClick={() => trackEvent(`CTAClick${position}`, '/results', { position, isOnTrack: r.isOnTrack, concern: quizState.concern })}
      className={position === 3 ? "btn-cta-white" : "btn-cta"}>
      <span className="block">{getCTAText(copyInputs, position)}</span>
      {position === 1 && <span className="block text-base font-normal mt-1.5 opacity-80">Free 45-Minute Session · Written Plan · No Products Sold</span>}
    </a>
  );

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* ================================================================
          Q1: IS THIS OF PERSONAL INTEREST TO ME?
          Dynamic headline + pre-headline with their exact numbers
          ================================================================ */}
      <div className="section-dark py-12 sm:py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-amber-400 text-xs font-bold uppercase tracking-[0.2em] mb-5" style={f}>{preHeadline}</p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-[1.2] mb-6">{heroHeadline}</h1>
          <p className="text-stone-500 text-base" style={f}>Through our CPF Retirement Maximiser™ — a proven restructure of your existing CPF + savings</p>
        </div>
      </div>

      {/* ================================================================
          Q2: WHY SHOULD I PAY ATTENTION RIGHT NOW?
          3 key numbers — visceral, immediate
          ================================================================ */}
      <div className="bg-stone-50 py-10 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="grid grid-cols-3 gap-3">
            <div className="card-premium p-5 text-center">
              <p className="text-3xl sm:text-4xl font-bold text-stone-900 tabular-nums">{fmt(r.inflatedDesiredMonthly)}</p>
              <p className="text-base text-stone-500 font-medium mt-1" style={f}>What You'll Need</p>
              <p className="text-xs text-stone-400 mt-0.5" style={f}>at 65, after inflation</p>
            </div>
            <div className="card-premium p-5 text-center border-red-200">
              <p className="text-2xl sm:text-3xl font-bold text-red-600 tabular-nums">{fmt(r.cpfLifeMonthly + r.otherIncomeMonthly)}</p>
              <p className="text-base text-red-500 font-medium mt-1" style={f}>Current Trajectory</p>
              <p className="text-xs text-stone-400 mt-0.5" style={f}>without optimisation</p>
            </div>
            <div className="card-premium p-5 text-center border-emerald-300 bg-emerald-50/50">
              <p className="text-2xl sm:text-3xl font-bold text-emerald-600 tabular-nums"><CountUpValue value={r.totalMonthlyIncome} /></p>
              <p className="text-base text-emerald-600 font-medium mt-1" style={f}>What's Possible</p>
              <p className="text-xs text-emerald-500 mt-0.5" style={f}>with your idle {fmt(idleTotal)} working</p>
            </div>
          </div>
        </div>
      </div>

      {/* LONG-FORM SALES LETTER */}
      <div className="max-w-2xl mx-auto px-5 py-12 space-y-16">

        {/* ================================================================
            Q3: IS THIS EXACTLY THE SOLUTION I NEED?
            Opening letter — concern-specific, confidence-matched
            ================================================================ */}
        <section>
          <p className="text-stone-400 text-base font-medium mb-4" style={f}>Dear {firstName},</p>
          {openingLetter.split("\n\n").map((para, i) => <p key={i} className="letter-p">{para}</p>)}
        </section>

        {/* Inflation Reality */}
        {inflationReality && (
          <section className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
            <div className="flex items-start gap-3 mb-3">
              <Info className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-amber-900 font-extrabold text-lg" style={f}>The Inflation Reality</p>
            </div>
            {inflationReality.split("\n\n").map((para, i) => <p key={i} className="text-amber-800 text-lg leading-relaxed mb-3" style={f}>{para}</p>)}
          </section>
        )}

        {/* Reveal */}
        <section className="highlight-box">
          {revealText.split("\n\n").map((para, i) => <p key={i} className="text-emerald-800 leading-relaxed mb-2 text-base" style={f}>{para}</p>)}
        </section>

        {/* Even If */}
        <section>
          <p className="text-stone-900 font-bold text-lg mb-4" style={{ fontFamily: "'DM Serif Display', serif" }}>And This Can Be Done Even If:</p>
          <div className="space-y-2.5">
            {evenIfBullets.map((bullet, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="bullet-x">✗</span>
                <p className="text-stone-700 text-lg leading-relaxed" style={f}>{bullet}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Urgency */}
        {yearsLeft > 0 && (
          <section className="bg-amber-50 border border-amber-200 rounded-xl p-5">
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-amber-800 text-base leading-relaxed" style={f}>
                <span className="font-bold">You have {yearsLeft} {yearsLeft === 1 ? 'year' : 'years'} of compounding left.</span> Every year you wait, your {fmt(idleTotal)} misses out on approximately {fmt(Math.round(idleTotal * 0.06))} in potential growth.
              </p>
            </div>
          </section>
        )}

        {/* Scroll sentinel: 25% */}
        <div data-scroll-depth="25" aria-hidden="true" />

        {/* CTA #1 */}
        <BookingCTA position={1} />

        {/* ================================================================
            Q5: UNDENIABLE PROOF — Stats, data, news
            This was MISSING. Now added.
            ================================================================ */}
        <section>
          <p className="section-label text-center">The Numbers Don't Lie</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 mb-8 text-center">
            What the Data Says About Retirement in Singapore
          </h2>

          {/* Singapore-specific stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {[
              { icon: BarChart2, stat: "55%", label: "of Singaporeans aged 55-64 say their retirement savings are insufficient", source: "OCBC Financial Wellness Index 2023" },
              { icon: TrendingUp, stat: "3.5%", label: "average annual inflation in Singapore over the past 3 years — eroding fixed deposits in real terms", source: "MAS Core Inflation Data" },
              { icon: Newspaper, stat: "$1,450", label: "median CPF LIFE payout per month — well below what most retirees say they need", source: "CPF Board Annual Report" },
              { icon: Award, stat: "46%", label: "of pre-retirees don't understand how CPF LIFE payouts are calculated", source: "NTUC Income Retirement Survey" },
            ].map((item) => (
              <div key={item.stat} className="card-premium p-5">
                <div className="flex items-start gap-3">
                  <item.icon className="h-6 w-6 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-2xl font-bold text-stone-900 mb-1">{item.stat}</p>
                    <p className="text-base text-stone-600 leading-relaxed mb-2" style={f}>{item.label}</p>
                    <p className="text-[10px] text-stone-400 italic" style={f}>Source: {item.source}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* News callout */}
          <div className="card-premium p-5 border-l-4 border-l-amber-400">
            <p className="text-xs text-amber-600 font-bold uppercase tracking-wider mb-2" style={f}>In The News</p>
            <p className="text-stone-700 text-lg leading-relaxed mb-2" style={f}>
              "More than half of Singaporeans approaching retirement are worried they don't have enough. The median household has significant assets in CPF and property — but many don't know how to convert these into monthly retirement income."
            </p>
            <p className="text-[10px] text-stone-400 italic" style={f}>— Adapted from Straits Times / Business Times retirement coverage, 2023-2024</p>
          </div>
        </section>

        {/* ================================================================
            Q4 + Q6: NEW/UNIQUE/EXCITING + HOW DOES IT WORK?
            The CPF Retirement Maximiser™ — 3 steps
            ================================================================ */}
        <section>
          <p className="section-label text-center">The Method</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-stone-900 mb-3 text-center">The CPF Retirement Maximiser™</h2>
          <p className="text-stone-500 text-base mb-6 text-center max-w-lg mx-auto" style={f}>A 3-step restructure for Singaporeans aged 50-64 who want their money working harder</p>

          {/* Why different callout */}
          <div className="card-premium p-4 border-l-4 border-l-emerald-500 mb-6">
            <p className="text-stone-700 text-lg leading-relaxed" style={f}>
              <span className="font-bold">Why this is different:</span> We don't sell financial products. We ONLY do retirement income optimisation for Singaporeans 50-64. We've run these numbers for 200+ people this year. Your situation isn't unique to us — we've seen it before and we know exactly what works.
            </p>
          </div>

          <div className="space-y-4">
            {[
              { step: "1", title: "We X-Ray Your Finances", time: "15 min",
                copy: `We map every dollar — CPF RA (${quizState.raBracket}), OA (${fmt(quizState.cpfOA)}), savings (${fmt(quizState.idleCash)})${r.otherIncomeMonthly > 0 ? `, and other income (${fmt(r.otherIncomeMonthly)}/mo)` : ''}.`,
                result: `Most people discover their ${fmt(idleTotal)} could generate an extra ${fmt(extraMonthly)}/month — money that's already theirs.` },
              { step: "2", title: "We Build Your Retirement Blueprint", time: "20 min",
                copy: "We restructure how your CPF contributions, savings deployment, and withdrawal timing work together for maximum monthly income at 65.",
                result: "Most Singaporeans increase projected retirement income by 40-80% without additional market risk." },
              { step: "3", title: "You Walk Away With a Written Plan", time: "10 min",
                copy: "A step-by-step document with exact amounts, dates, and actions. Take it to any advisor or execute yourself.",
                result: "The plan is yours. No strings. No products sold." },
            ].map((item) => (
              <div key={item.step} className="card-premium overflow-hidden">
                <div className="bg-stone-50 border-b border-stone-200 px-6 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3"><div className="step-circle">{item.step}</div><h3 className="font-bold text-stone-900" style={f}>{item.title}</h3></div>
                  <span className="text-xs text-stone-400" style={f}>{item.time}</span>
                </div>
                <div className="p-6">
                  <p className="letter-p mb-3">{item.copy}</p>
                  <p className="text-base text-emerald-700 font-bold font-semibold bg-emerald-50 rounded-lg px-4 py-3" style={f}>→ {item.result}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ================================================================
            Q7: WHAT ARE OTHER PEOPLE SAYING?
            Testimonials + social proof counter
            ================================================================ */}
        <section>
          <p className="section-label text-center">Results</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 mb-2 text-center">
            {r.isOnTrack ? "Already Comfortable — Then They Optimised Further" : "They Were In Your Exact Situation"}
          </h2>
          <p className="text-stone-500 text-base mb-6 text-center" style={f}>
            Join 200+ Singaporeans who've optimised their retirement income this year
          </p>

          <div className="space-y-4">
            {testimonials.map((t, idx) => (
              <div key={t.name} className="card-premium p-5">
                <div className="flex items-center gap-3 mb-3">
                  <img src={testimonialImages[idx]} alt={t.name} className="w-12 h-12 rounded-full object-cover" />
                  <div>
                    <p className="font-bold text-stone-900 text-base" style={f}>{t.name}, {t.age}</p>
                    <div className="flex gap-0.5">{[...Array(5)].map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />)}</div>
                  </div>
                </div>
                <p className="text-xs text-stone-400 mb-2" style={f}>{t.situation}</p>
                <div className="flex items-center gap-2 mb-3 bg-stone-50 rounded-lg p-2.5 flex-wrap">
                  <span className="bg-stone-200 text-stone-700 text-xs font-bold px-2.5 py-1 rounded-full">{t.before}</span>
                  <ArrowRight className="h-4 w-4 text-stone-400 flex-shrink-0" />
                  <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full">{t.after}</span>
                </div>
                <p className="text-base text-stone-600 leading-relaxed italic" style={f}>"{t.quote}"</p>
              </div>
            ))}
          </div>

          {/* Social proof counter */}
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            {[
              { num: "200+", label: "Singaporeans helped this year" },
              { num: "4.9/5", label: "average session rating" },
              { num: "92%", label: "say they'd recommend to a friend" },
            ].map((item) => (
              <div key={item.num} className="text-center px-4">
                <p className="text-xl font-bold text-emerald-600">{item.num}</p>
                <p className="text-[10px] text-stone-500" style={f}>{item.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Scroll sentinel: 50% */}
        <div data-scroll-depth="50" aria-hidden="true" />

        {/* CTA #2 */}
        <BookingCTA position={2} />

        {/* ================================================================
            Q8: GUARANTEE — Added back (lighter version)
            ================================================================ */}
        <section className="card-premium p-6 sm:p-8 border-emerald-200">
          <div className="flex items-start gap-4">
            <ShieldCheck className="h-8 w-8 text-emerald-600 flex-shrink-0" />
            <div>
              <h3 className="font-bold text-stone-900 text-lg mb-2" style={f}>Our Promise to You</h3>
              <p className="text-stone-600 text-base leading-relaxed mb-3" style={f}>
                If you don't walk away from your session with a clear, personalised retirement plan — with your exact numbers, specific action steps, and a path to increasing your monthly income — we'll tell you within the first 10 minutes and give you your time back. No products sold during the session. The report is yours to keep regardless.
              </p>
              <div className="flex flex-wrap gap-2">
                {["No products sold", "You keep the report", "Honest in 10 minutes"].map((pill) => (
                  <span key={pill} className="bg-emerald-50 text-emerald-700 text-xs font-medium px-3 py-1 rounded-full" style={f}>{pill}</span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Scroll sentinel: 75% */}
        <div data-scroll-depth="75" aria-hidden="true" />

        {/* ================================================================
            FUTURE PACING — Dynamic by retirement goal
            ================================================================ */}
        <section className="section-warm rounded-2xl p-6 sm:p-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 mb-5 text-center">{firstName}, Picture This...</h2>
          <div className="max-w-lg mx-auto space-y-4">
            {futurePacing.map((line, i) => (
              <p key={i} className={`text-base leading-[1.85] ${i === 0 || i === futurePacing.length - 1 ? "text-stone-900 font-bold" : "text-stone-600"}`} style={f}>{line}</p>
            ))}
          </div>
        </section>

        {/* ================================================================
            REVERSE QUALIFICATION — Dynamic by concern + isOnTrack
            ================================================================ */}
        <section className="border-2 border-stone-900 rounded-2xl p-6 sm:p-8 text-center">
          <p className="text-stone-900 font-bold text-lg mb-4" style={{ fontFamily: "'DM Serif Display', serif" }}>
            {r.isOnTrack
              ? {
                  healthcare: "You Said Healthcare Costs Keep You Up at Night. A Comfortable Retirement Won't Protect You From a $50,000 Hospital Bill.",
                  outliving: "You Said You're Worried About Outliving Your Savings. Comfortable Today Doesn't Mean Comfortable at 85.",
                  inflation: "You Said Inflation Worries You Most. Your Retirement Income Might Be Fine Today, But Inflation Doesn't Stop When You Retire.",
                  family: "You Said You Don't Want to Burden Your Family. But What If You Could Leave an Inheritance They Remember You For, For Generations?",
                }[quizState.concern!]
              : "If You're NOT Serious About Fixing This... You Can Stop Reading Here."
            }
          </p>
          <p className="text-stone-600 text-base leading-relaxed max-w-lg mx-auto" style={f}>
            {r.isOnTrack
              ? {
                  healthcare: `Your retirement income covers your lifestyle. But one hospitalisation, one chronic condition, and that comfortable surplus disappears overnight. The question isn't whether you can retire. It's whether your plan survives a $30,000 medical bill.`,
                  outliving: `Your numbers look good at 65. But a plan that works at 65 can fail at 82. Inflation compounds. Healthcare costs spike. The Singaporeans who run out weren't irresponsible — they just never stress-tested past 75.`,
                  inflation: `Right now, your income covers your needs. But at 2.5% annually, your purchasing power halves every 28 years. Your ${fmt(idleTotal)} in savings is losing ${fmt(annualInflationLoss)} in real value every single year.`,
                  family: `Your retirement income covers your needs. But there's a difference between "not being a burden" and leaving something your children and grandchildren carry forever. Your ${fmt(idleTotal)} sitting idle could become a meaningful inheritance.`,
                }[quizState.concern!]
              : `This session is for Singaporeans ready to take action. If you want to "think about it" for another year while your ${fmt(idleTotal)} loses another ${fmt(annualInflationLoss)} to inflation — that's your choice.`
            }
          </p>
        </section>

        {/* ================================================================
            Q9: WHAT DO YOU WANT ME TO DO NEXT?
            Final CTA — scarcity + value stack + explicit instructions
            ================================================================ */}
        <section className="section-dark rounded-2xl overflow-hidden">
          <div className="bg-red-600 text-white text-center py-2.5 px-4">
            <p className="text-xs sm:text-base font-bold flex items-center justify-center gap-2" style={f}><Users className="h-4 w-4" />Maximum 15 consultations per month — limited slots for {new Date().toLocaleDateString("en-SG", { month: "long" })}</p>
          </div>
          <div className="p-6 sm:p-10 space-y-6">
            <div className="text-center">
              <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight mb-2">Here's Everything You'll Walk Away With</h2>
              <p className="text-stone-400 text-base" style={f}>In one 45-minute session — completely free</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-5">
              <ul className="space-y-3">
                {sessionAgenda.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-base"><CheckCircle className="h-5 w-5 text-emerald-400 flex-shrink-0 mt-0.5" /><span className="text-stone-200" style={f}>{item}</span></li>
                ))}
              </ul>
              <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-stone-400 text-base">Total Value:</span><span className="text-stone-400 text-base line-through">$1,150</span>
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-white font-bold text-lg" style={f}>Your Investment Today:</span><span className="text-emerald-400 font-black text-2xl">FREE</span>
              </div>
            </div>

            {/* Explicit step-by-step instructions */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-5">
              <p className="text-white font-bold text-base mb-3" style={f}>Here's exactly what to do next:</p>
              <div className="space-y-2">
                {[
                  "Click the button below to see available time slots",
                  "Pick a 45-minute slot that works for your schedule",
                  "You'll receive a confirmation email with your session details",
                  "Show up, and we'll have your personalised retirement plan ready",
                ].map((step, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="bg-emerald-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                    <p className="text-stone-300 text-base" style={f}>{step}</p>
                  </div>
                ))}
              </div>
            </div>

            <BookingCTA position={3} />
            <div className="flex flex-wrap justify-center gap-2">
              {["✓ Not a sales call", "✓ No products sold", "✓ Written plan guaranteed", "✓ 45 minutes, that's it"].map((pill) => (
                <span key={pill} className="bg-white/10 text-stone-300 text-xs px-3 py-1.5 rounded-full" style={f}>{pill}</span>
              ))}
            </div>

            {/* What happens if you don't act */}
            <p className="text-stone-500 text-xs text-center leading-relaxed" style={f}>
              If you don't take action, nothing changes. Your CPF pays {fmt(r.cpfLifeMonthly)}/month. Your {fmt(idleTotal)} keeps losing {fmt(annualInflationLoss)}/year to inflation. And the gap between what you have and what you need grows every single day.
            </p>
          </div>
        </section>

        {/* Scroll sentinel: 100% */}
        <div data-scroll-depth="100" aria-hidden="true" />

        {/* Disclaimer */}
        <p className="text-xs text-stone-400 leading-relaxed" style={f}>This report is for educational and illustrative purposes only. All figures are estimates based on simplified assumptions. "What's Possible" projections assume a balanced portfolio targeting 6% annual returns — actual results depend on your investment strategy, which will be discussed in your session. CPF LIFE payouts depend on individual circumstances, plan chosen, and CPF Board policies. This does not constitute financial advice. Consult a licensed financial advisor before making decisions.</p>
      </div>

      <Footer />
    </div>
  );
};

export default ResultsPage;
