import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const messages = [
  "Calculating your CPF LIFE payout at 65...",
  "Projecting your retirement income sources...",
  "Modelling how far your savings can stretch...",
  "Preparing your personalised snapshot...",
];

const LoadingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [msgIndex, setMsgIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/claim", { state: location.state });
    }, 3500);
    return () => clearTimeout(timer);
  }, [navigate, location.state]);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % messages.length);
    }, 1100);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const start = performance.now();
    let raf: number;
    const tick = (now: number) => {
      const elapsed = now - start;
      setProgress(Math.min((elapsed / 3500) * 100, 100));
      if (elapsed < 3500) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="min-h-screen bg-secondary flex flex-col items-center justify-center px-4">
      <svg width="100" height="100" className="mb-8">
        <circle cx="50" cy="50" r={radius} stroke="hsl(var(--border))" strokeWidth="6" fill="none" />
        <circle
          cx="50"
          cy="50"
          r={radius}
          stroke="hsl(var(--primary))"
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 50 50)"
          style={{ transition: "stroke-dashoffset 0.1s linear" }}
        />
      </svg>
      <p className="text-foreground font-medium text-center transition-opacity duration-300" key={msgIndex}>
        {messages[msgIndex]}
      </p>
    </div>
  );
};

export default LoadingPage;
