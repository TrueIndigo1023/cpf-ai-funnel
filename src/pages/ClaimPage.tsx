import { useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { type QuizState, calculateResults } from "@/lib/calculator";
import { Loader2 } from "lucide-react";

declare global {
  interface Window {
    fbq: (...args: unknown[]) => void;
  }
}

const ClaimPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const quizState = location.state as QuizState | null;

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [whatsappConsent, setWhatsappConsent] = useState(false);

  if (!quizState || !quizState.currentAge) {
    navigate("/quiz", { replace: true });
    return null;
  }

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const cleanMobile = mobile.replace(/\D/g, "");
  const isValidMobile = /^[89]\d{7}$/.test(cleanMobile);
  const isValid = fullName.trim() !== "" && isValidEmail && isValidMobile && whatsappConsent;

  const handleSubmit = async () => {
    if (!isValid) return;
    setIsSubmitting(true);

    const results = calculateResults(quizState);

    const payload = {
      fullName,
      email,
      mobile,
      currentAge: quizState.currentAge,
      retireAge: quizState.retireAge,
      desiredMonthly: quizState.desiredMonthly,
      raBracket: quizState.raBracket,
      cpfOA: quizState.cpfOA,
      idleCash: quizState.idleCash,
      calculatedResults: {
        raAtFiftyFive: results.raAtFiftyFive,
        raAtSixtyFive: results.raAtSixtyFive,
        cpfLifeMonthly: results.cpfLifeMonthly,
        drawdownRateUsed: results.drawdownRate,
        portfolioMonthlyIncome: results.portfolioMonthlyIncome,
        combinedAssetsAtSixtyFive: results.combinedAtSixtyFive,
        totalMonthlyIncome: results.totalMonthlyIncome,
        inflatedTargetMonthly: results.inflatedIncome,
        monthlyShortfall: results.monthlyShortfall,
        isOnTrack: results.isOnTrack,
        ersMultiplierUsed: results.ersMultiplier,
        birthYear: results.birthYear,
      },
      submittedAt: new Date().toISOString(),
    };

    try {
      await fetch("https://hook.eu2.make.com/pn9p0iatg9cp7zgtzlzm9mh4dd4v2jgj", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch (err) {
      console.error("Webhook error:", err);
    }

    if (typeof window.fbq === "function") {
      window.fbq("init", "2103853790453019", {
        em: email.toLowerCase().trim(),
        ph: mobile.replace(/\D/g, ""),
        fn: fullName.trim().split(" ")[0].toLowerCase(),
        ln: fullName.trim().split(" ").slice(1).join(" ").toLowerCase(),
      });
      window.fbq("track", "Lead", {
        content_name: "CPF Retirement Income Calculator",
        content_category: "Retirement Planning",
        value: 0,
        currency: "SGD",
      });
    }

    navigate("/results", { state: { ...quizState, fullName, email, mobile } });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2 text-center">
          Your Retirement Income Report Is Ready
        </h1>
        <p className="text-muted-foreground mb-8 text-center">
          Enter your details below to view your results and receive a personalised copy.
        </p>

        <div className="card-cpf max-w-lg w-full p-8 border-t-4 border-t-primary shadow-md">
          <div className="inline-block bg-accent/10 text-accent text-xs font-semibold rounded-full px-3 py-1 mb-4">
            ✦ FREE REVIEW · NO OBLIGATION
          </div>
          <h2 className="text-xl font-bold text-foreground mb-6">
            Access Your CPF Report
          </h2>

          <div className="space-y-4 mb-6">
            <input
              type="text"
              placeholder="Your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              autoComplete="name"
              className="w-full border border-input rounded-xl px-4 py-3 bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              className="w-full border border-input rounded-xl px-4 py-3 bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            {email.trim() !== "" && !isValidEmail && (
              <p className="text-xs text-destructive mt-1">Please enter a valid email address</p>
            )}
            <input
              type="tel"
              placeholder="+65 XXXX XXXX"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              autoComplete="tel"
              className="w-full border border-input rounded-xl px-4 py-3 bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            {cleanMobile.length > 0 && !isValidMobile && (
              <p className="text-xs text-destructive mt-1">Enter a valid 8-digit SG number starting with 8 or 9</p>
            )}
          </div>

          <label className="flex items-start gap-3 mb-6 cursor-pointer">
            <input
              type="checkbox"
              checked={whatsappConsent}
              onChange={(e) => setWhatsappConsent(e.target.checked)}
              className="mt-1 h-4 w-4 accent-primary rounded border-input"
            />
            <span className="text-sm text-muted-foreground">I consent to receiving my report and related updates via WhatsApp</span>
          </label>

          <button
            onClick={handleSubmit}
            disabled={!isValid || isSubmitting}
            className="btn-primary-cpf w-full rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : "View My Results Now →"}
          </button>
        </div>
      </div>
      <Footer variant="quiz" />
    </div>
  );
};

export default ClaimPage;
