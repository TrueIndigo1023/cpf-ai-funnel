import { ShieldCheck } from "lucide-react";
import Navbar from "@/components/Navbar";

const NotEligiblePage = () => {

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="card-cpf max-w-lg w-full p-10 text-center">
          <ShieldCheck className="h-16 w-16 text-success mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-foreground mb-4">You're in a Good Position</h1>
          <p className="text-foreground/70 leading-relaxed mb-4">
            Based on what you've shared, your CPF LIFE is well-positioned to form a strong foundation for your retirement. The CPF system is designed to provide reliable, lifelong income — and for your situation, it looks like it's doing its job.
          </p>
          <p className="text-xs text-foreground/60 mt-8">
            This assessment is for educational purposes only and does not constitute financial advice.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotEligiblePage;
