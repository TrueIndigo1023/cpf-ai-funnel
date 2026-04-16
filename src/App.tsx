import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MetaPixelPageView } from "@/components/MetaPixelPageView";
import LandingPage from "./pages/LandingPage";
import QuizPage from "./pages/QuizPage";
import NotEligiblePage from "./pages/NotEligiblePage";
import LoadingPage from "./pages/LoadingPage";
import ClaimPage from "./pages/ClaimPage";
import ResultsPage from "./pages/ResultsPage";
import NotFound from "./pages/NotFound";
import PreviewResults from "./pages/PreviewResults";
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <MetaPixelPageView />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/not-eligible" element={<NotEligiblePage />} />
          <Route path="/loading" element={<LoadingPage />} />
          <Route path="/claim" element={<ClaimPage />} />
          <Route path="/results" element={<ResultsPage />} />
          <Route path="/preview" element={<PreviewResults />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
