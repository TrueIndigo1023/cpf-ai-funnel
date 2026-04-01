export type Concern = 'healthcare' | 'outliving' | 'inflation' | 'family';
export type Confidence = 'not_confident' | 'somewhat' | 'confident';
export type RetirementGoal = 'comfortable' | 'travel' | 'basic' | 'legacy';

export interface QuizState {
  currentAge: number;
  retireAge: number;
  desiredMonthly: number;
  raBracket: 'BRS' | 'FRS' | 'ERS' | null;
  cpfOA: number;
  idleCash: number;
  concern: Concern | null;
  confidence: Confidence | null;
  retirementGoal: RetirementGoal | null;
  fullName: string;
  email: string;
  mobile: string;
}

export const defaultQuizState: QuizState = {
  currentAge: 0,
  retireAge: 0,
  desiredMonthly: 1000,
  raBracket: null,
  cpfOA: 100000,
  idleCash: 50000,
  concern: null,
  confidence: null,
  retirementGoal: null,
  fullName: '',
  email: '',
  mobile: '',
};

export const fmt = (n: number) => `$${Math.abs(Math.round(n)).toLocaleString('en-SG')}`;

export function calculateResults(state: QuizState) {
  const { currentAge, raBracket, cpfOA, idleCash, desiredMonthly } = state;

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

  const totalMonthlyIncome = cpfLifeMonthly + portfolioMonthlyIncome;

  const yearsToInflate = Math.max(0, 65 - currentAge);
  const inflatedIncome = desiredMonthly * Math.pow(1.03, yearsToInflate);

  const monthlyShortfall = inflatedIncome - totalMonthlyIncome;
  const isOnTrack = monthlyShortfall <= 0;

  return {
    birthYear,
    raAtFiftyFive,
    raAtSixtyFive,
    cpfLifeMonthly,
    drawdownRate,
    portfolioMonthlyIncome,
    combinedAssets,
    combinedAtSixtyFive,
    totalMonthlyIncome,
    inflatedIncome,
    monthlyShortfall,
    isOnTrack,
    ersMultiplier,
    yearsToGrow,
  };
}
