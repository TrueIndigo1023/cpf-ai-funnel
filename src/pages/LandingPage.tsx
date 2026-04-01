import { useNavigate } from "react-router-dom";
import { CheckCircle, AlertTriangle, TrendingUp, ShieldCheck, Wallet } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="section-dark py-16 sm:py-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-amber-400 text-xs font-bold uppercase tracking-[0.2em] mb-6"
             style={{ fontFamily: "'DM Sans', sans-serif" }}>
            For Singaporeans & PRs · Ages 50 to 64 🇸🇬
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-[1.15] mb-5">
            Discover How Much Retirement Income Your CPF & Savings Can{" "}
            <span className="text-emerald-400">Actually Generate</span>
          </h1>
          <p className="text-stone-400 max-w-xl mx-auto mb-8 text-lg leading-relaxed"
             style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Most Singaporeans leave $1,000-$3,000/month on the table because they've never seen their full picture. This 2-minute assessment changes that.
          </p>
          <button onClick={() => navigate("/quiz")} className="btn-cta max-w-md mx-auto text-xl">
            Get My Free Retirement Report →
          </button>
          <p className="text-stone-500 text-xs mt-4" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Takes 2 minutes · No login · 100% Confidential
          </p>
        </div>
      </section>

      {/* Problem Stats */}
      <section className="bg-stone-900 py-10 px-4">
        <div className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { num: "$1,200–$1,700", label: "Typical CPF LIFE payout per month at 65", color: "text-red-400" },
            { num: "$3,000–$4,500", label: "What most Singaporeans say they need per month", color: "text-amber-400" },
            { num: "$1,300+", label: "The monthly gap that goes unaddressed for years", color: "text-red-400" },
          ].map((s) => (
            <div key={s.num} className="text-center py-4">
              <p className={`text-2xl sm:text-3xl font-bold mb-1 ${s.color}`}>{s.num}</p>
              <p className="text-stone-400 text-xs leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif" }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* What You'll Discover */}
      <section className="section-warm py-16 sm:py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="section-label">What You'll Discover</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 mb-3">
            Your Personalised Retirement Income Picture
          </h2>
          <p className="text-stone-500 text-sm mb-10" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            In under 2 minutes, you'll know exactly where you stand
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { icon: ShieldCheck, title: "Your CPF LIFE Payout at 65", desc: "See your projected monthly income based on your Retirement Account — tied to exactly how much you've set aside." },
              { icon: TrendingUp, title: "What Your CPF OA Could Generate", desc: "Your Ordinary Account has real income potential. We'll show what it could add monthly." },
              { icon: Wallet, title: "Your Idle Savings' Hidden Power", desc: "Cash in low-yield accounts is retirement income waiting to happen. See what it could generate." },
              { icon: AlertTriangle, title: "Your Retirement Income Gap", desc: "Are you on track, or is there a shortfall? We'll tell you clearly — and how much your assets can close.", amber: true },
            ].map((d) => (
              <div key={d.title} className="card-premium p-6 text-left">
                <d.icon className={`h-7 w-7 mb-3 ${d.amber ? "text-amber-500" : "text-emerald-600"}`} />
                <h3 className="font-bold text-stone-900 mb-1.5 text-[15px]" style={{ fontFamily: "'DM Sans', sans-serif" }}>{d.title}</h3>
                <p className="text-sm text-stone-500 leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif" }}>{d.desc}</p>
              </div>
            ))}
          </div>
          <button onClick={() => navigate("/quiz")} className="btn-cta max-w-md mx-auto mt-10 text-lg">
            Get My Free Retirement Report →
          </button>
        </div>
      </section>

      {/* Who This Is For */}
      <section className="bg-white py-16 sm:py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <p className="section-label">Is This For You?</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 mb-8">
            Built for Singaporeans Who...
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
            {[
              "Are between 50 and 64 years old",
              "Have CPF but haven't modelled actual monthly income at 65",
              "Have cash sitting in low-yield accounts",
              "Want an honest picture — not a sales pitch",
              "Are within 5–15 years of retirement",
              "Wonder if CPF alone will be enough",
            ].map((item) => (
              <div key={item} className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-stone-600" style={{ fontFamily: "'DM Sans', sans-serif" }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="section-warm py-16 sm:py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="section-label">Real Results</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 mb-8">
            What Other Singaporeans Discovered
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { name: "Mdm R., 56, Bishan", badge: "Discovered a $1,700/month gap — and a path to close it", quote: "Seeing the actual number made it real — and showed me there were things I could still do." },
              { name: "Mr K., 58, Tampines", badge: "Unlocked income from existing savings", quote: "This showed me my existing savings weren't being put to work. Changed how I think about money." },
              { name: "Mr & Mrs W., 61, Clementi", badge: "Built a shared retirement income plan", quote: "Having the actual figures made it much easier to have the retirement conversation we'd been putting off." },
              { name: "Mr A., 52, Punggol", badge: "Started optimising with 13 years of runway", quote: "At 52 I thought this was future me's problem. The calculator showed me every year I wait is compounding I can't get back." },
            ].map((cs) => (
              <div key={cs.name} className="card-premium p-5 text-left flex flex-col">
                <p className="font-bold text-stone-900 text-sm mb-2" style={{ fontFamily: "'DM Sans', sans-serif" }}>{cs.name}</p>
                <p className="text-xs text-stone-500 italic mb-3 flex-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>"{cs.quote}"</p>
                <div className="bg-emerald-50 text-emerald-700 text-xs font-medium rounded-full px-3 py-1.5 text-center"
                     style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  {cs.badge}
                </div>
              </div>
            ))}
          </div>
          <button onClick={() => navigate("/quiz")} className="btn-cta max-w-md mx-auto mt-10 text-lg">
            Get My Free Retirement Report →
          </button>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section-dark py-16 sm:py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            See Where You Stand Before It's Too Late to Act
          </h2>
          <p className="text-stone-400 mb-8" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Your personalised retirement income report — free, in under 2 minutes.
          </p>
          <button onClick={() => navigate("/quiz")} className="btn-cta-white max-w-md mx-auto text-lg">
            Start My Free Report →
          </button>
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            {["🔒 Confidential", "⏱ 2 Minutes", "📊 Personalised", "🎓 Educational Only"].map((tag) => (
              <span key={tag} className="text-stone-500 text-xs" style={{ fontFamily: "'DM Sans', sans-serif" }}>{tag}</span>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
