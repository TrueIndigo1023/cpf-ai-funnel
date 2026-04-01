export type Concern = 'healthcare' | 'outliving' | 'inflation' | 'family';
export type Confidence = 'not_confident' | 'somewhat' | 'confident';
export type RetirementGoal = 'comfortable' | 'travel' | 'basic' | 'legacy';

export type OtherIncomeSource = 'rental' | 'investments' | 'part_time' | 'pension' | 'business' | 'none';

export interface QuizState {
  currentAge: number;
  retireAge: number;
  desiredMonthly: number;
  raBracket: 'BRS' | 'FRS' | 'ERS' | null;
  cpfOA: number;
  idleCash: number;
  otherIncomeSources: OtherIncomeSource[];
  otherIncomeMonthly: number;
  concern: Concern | null;
  confidence: Confidence | null;
  retirementGoal: RetirementGoal | null;
  fullName: string;
  email: string;
  mobile: string;
}

export const defaultQuizState: QuizState = {
  currentAge: 50,
  retireAge: 65,
  desiredMonthly: 1000,
  raBracket: null,
  cpfOA: 100000,
  idleCash: 50000,
  otherIncomeSources: [],
  otherIncomeMonthly: 0,
  concern: null,
  confidence: null,
  retirementGoal: null,
  fullName: '',
  email: '',
  mobile: '',
};

export const fmt = (n: number) => `$${Math.abs(Math.round(n)).toLocaleString('en-SG')}`;

export const INFLATION_RATE = 0.025; // 2.5% inflation for spending adjustment

export function calculateResults(state: QuizState) {
  const { currentAge, raBracket, cpfOA, idleCash, desiredMonthly, otherIncomeMonthly } = state;

  const FRS_2026 = 220400;
  const FRS_GROWTH_RATE = 0.0350821;

  const birthYear = 2026 - currentAge;
  const yearsSinceFiftyFive = currentAge - 55;

  const frsAtFiftyFive = yearsSinceFiftyFive >= 0
    ? FRS_2026 / Math.pow(1 + FRS_GROWTH_RATE, yearsSinceFiftyFive)
    : FRS_2026 * Math.pow(1 + FRS_GROWTH_RATE, Math.abs(yearsSinceFiftyFive));

  const brsAtFiftyFive = frsAtFiftyFive / 2;
  const ersMultiplier = birthYear <= 1969 ? 3 : 4;
  const ersAtFiftyFive = brsAtFiftyFive * ersMultiplier;

  const raAtFiftyFive =
    raBracket === 'BRS' ? brsAtFiftyFive :
    raBracket === 'FRS' ? frsAtFiftyFive :
    ersAtFiftyFive;

  const raAtSixtyFive = raAtFiftyFive * Math.pow(1.04, 10);
  const drawdownRate = raBracket === 'ERS' ? 0.005 : 0.0053;
  const cpfLifeMonthly = raAtSixtyFive * drawdownRate;

  const yearsToGrow = Math.max(0, 65 - currentAge);
  const combinedAssets = cpfOA + idleCash;
  const combinedAtSixtyFive = combinedAssets * Math.pow(1.06, yearsToGrow);
  const portfolioMonthlyIncome = (combinedAtSixtyFive * 0.06) / 12;

  // Current trajectory = what they get WITHOUT optimisation (CPF LIFE + other income only)
  const currentTrajectory = cpfLifeMonthly + otherIncomeMonthly;

  // Optimised total = current + portfolio income from deploying idle assets
  const totalMonthlyIncome = currentTrajectory + portfolioMonthlyIncome;

  // Inflation-adjusted spending: what $5K today costs at retirement
  const inflatedDesiredMonthly = desiredMonthly * Math.pow(1 + INFLATION_RATE, yearsToGrow);

  // On track = CURRENT trajectory (before optimisation) already covers needs
  const isOnTrack = currentTrajectory >= inflatedDesiredMonthly;

  // Gaps/surpluses based on CURRENT trajectory (not optimised)
  const currentGap = Math.max(0, inflatedDesiredMonthly - currentTrajectory);
  const currentSurplus = isOnTrack ? currentTrajectory - inflatedDesiredMonthly : 0;

  // Gap after optimisation
  const monthlyShortfall = Math.max(0, inflatedDesiredMonthly - totalMonthlyIncome);
  const monthlySurplus = totalMonthlyIncome > inflatedDesiredMonthly ? totalMonthlyIncome - inflatedDesiredMonthly : 0;

  return {
    birthYear,
    raAtFiftyFive,
    raAtSixtyFive,
    cpfLifeMonthly,
    drawdownRate,
    portfolioMonthlyIncome,
    otherIncomeMonthly,
    combinedAssets,
    combinedAtSixtyFive,
    currentTrajectory,
    totalMonthlyIncome,
    desiredMonthlyToday: desiredMonthly,
    inflatedDesiredMonthly,
    currentGap,
    currentSurplus,
    monthlyShortfall,
    monthlySurplus,
    isOnTrack,
    ersMultiplier,
    yearsToGrow,
  };
}
