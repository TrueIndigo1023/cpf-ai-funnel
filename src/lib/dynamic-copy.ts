import { type Concern, type Confidence, type RetirementGoal, fmt } from "./calculator";

// ============================================================
// DYNAMIC COPY ENGINE
// Generates hyper-specific copy based on quiz inputs
// Modeled after Naction 1/3 long-form sales letter structure
// ============================================================

interface CopyInputs {
  firstName: string;
  currentAge: number;
  desiredMonthly: number;
  cpfLifeMonthly: number;
  totalMonthlyIncome: number;
  monthlyShortfall: number;
  extraMonthly: number;
  cpfOA: number;
  idleCash: number;
  idleTotal: number;
  yearsLeft: number;
  concern: Concern;
  confidence: Confidence;
  retirementGoal: RetirementGoal;
  totalRetirementLoss: number;
  annualInflationLoss: number;
}

// ---- HERO HEADLINES (per concern) ----
export function getHeroHeadline(c: CopyInputs): string {
  const map: Record<Concern, string> = {
    healthcare: `Generate ${fmt(c.totalMonthlyIncome)}/Month in Retirement Income So Rising Healthcare Costs Never Force You to Choose Between Your Health and Your Savings`,
    outliving: `Generate ${fmt(c.totalMonthlyIncome)}/Month in Retirement Income That Lasts As Long As You Do — Even If You Live to 95`,
    inflation: `Generate ${fmt(c.totalMonthlyIncome)}/Month in Retirement Income That GROWS With Inflation Instead of Being Eaten By It`,
    family: `Generate ${fmt(c.totalMonthlyIncome)}/Month in Retirement Income So You Can Support Your Family WITHOUT Becoming a Financial Burden`,
  };
  return map[c.concern];
}

// ---- QUALIFYING PRE-HEADLINE (per concern) ----
export function getPreHeadline(c: CopyInputs): string {
  const map: Record<Concern, string> = {
    healthcare: `For Singaporeans Aged ${c.currentAge} Worried About Medical Bills Eating Into Their Retirement`,
    outliving: `For Singaporeans Aged ${c.currentAge} Who Need Their Savings to Last 20-30+ Years`,
    inflation: `For Singaporeans Aged ${c.currentAge} Watching Their ${fmt(c.idleTotal)} Lose Value Every Single Year`,
    family: `For Singaporeans Aged ${c.currentAge} Who Want to Retire Without Burdening Their Children`,
  };
  return map[c.concern];
}

// ---- OPENING "DEAR READER" LETTER (per concern + confidence) ----
export function getOpeningLetter(c: CopyInputs): string {
  const concernOpening: Record<Concern, string> = {
    healthcare: `You told us your biggest worry is rising healthcare costs — and you're right to worry. A single hospital stay in Singapore can cost $15,000-$50,000. A chronic condition can drain $2,000-$5,000/month. And MediShield Life doesn't cover everything.\n\nRight now, your CPF is on track to pay you just ${fmt(c.cpfLifeMonthly)}/month at 65. You said you need ${fmt(c.desiredMonthly)}/month. That leaves you with ${fmt(c.monthlyShortfall)}/month LESS than what you need — and that's BEFORE a single medical bill hits.\n\nBut here's what most Singaporeans don't realise...`,
    outliving: `You told us your biggest fear is outliving your savings — and the math backs up that fear. The average Singaporean lives to 84. Many live past 90. That's 20-30 years of retirement your money needs to survive.\n\nRight now, your CPF is on track to pay you just ${fmt(c.cpfLifeMonthly)}/month at 65. You said you need ${fmt(c.desiredMonthly)}/month. At that rate, the gap between what you have and what you need could cost you ${fmt(c.totalRetirementLoss)} over 20 years.\n\nThat number isn't meant to scare you. It's meant to show you why acting NOW — while you still have ${c.yearsLeft} years of compounding ahead — changes everything.`,
    inflation: `You told us inflation is your biggest concern — and you're watching it happen in real time. Your kopi went from $1.20 to $1.80. Your hawker meals cost 30% more than 5 years ago. And it's not stopping.\n\nYour ${fmt(c.idleTotal)} sitting in bank accounts earning 0.05% is LOSING approximately ${fmt(c.annualInflationLoss)} every single year to inflation. That's not an opinion — it's basic math. In 10 years, your ${fmt(c.idleTotal)} will buy what ${fmt(Math.round(c.idleTotal * Math.pow(0.97, 10)))} buys today.\n\nMeanwhile, your CPF alone will pay just ${fmt(c.cpfLifeMonthly)}/month at 65. You need ${fmt(c.desiredMonthly)}/month. The gap is real and it's growing.`,
    family: `You told us your priority is supporting your family without becoming a burden — and that tells us everything about who you are. You've spent your whole life taking care of others. The last thing you want is for your children to worry about taking care of you.\n\nBut right now, your CPF is on track to pay just ${fmt(c.cpfLifeMonthly)}/month at 65. You said you need ${fmt(c.desiredMonthly)}/month. That ${fmt(c.monthlyShortfall)}/month gap means one of two things: either you cut back on the life you want, or your children fill the gap.\n\nThere's a third option. And it starts with the ${fmt(c.idleTotal)} already sitting in your accounts.`,
  };

  const confidenceBridge: Record<Confidence, string> = {
    not_confident: `\n\nWe understand you're not confident in your retirement plan right now. That's actually a GOOD thing — because it means you're not fooling yourself. Most people who say they're "fine" haven't run the numbers. You have. And you're here because you want to fix it.`,
    somewhat: `\n\nYou mentioned you're somewhat confident but not sure if it's enough. Here's the truth: "somewhat confident" usually means "I hope it works out." Hope isn't a plan. Numbers are. And your numbers tell a very clear story.`,
    confident: `\n\nYou said you're fairly confident in your plan. That's good — you've clearly been thinking about this. But even confident planners often discover they're leaving ${fmt(c.extraMonthly)}/month on the table. The question isn't whether you'll survive retirement. It's whether you'll THRIVE in it.`,
  };

  return concernOpening[c.concern] + confidenceBridge[c.confidence];
}

// ---- "EVEN IF" OBJECTION DEMOLITION (per concern) ----
export function getEvenIfBullets(c: CopyInputs): string[] {
  const base = [
    "You've never spoken to a retirement planner before",
    `You think ${fmt(c.idleTotal)} isn't enough to make a meaningful difference`,
    "You're not sure how CPF LIFE actually works",
    "You've been putting this off for years",
  ];

  const concernSpecific: Record<Concern, string[]> = {
    healthcare: [
      "You already have MediShield Life and think you're covered",
      "You have existing health conditions that worry you",
      "You don't have a separate medical fund set aside",
    ],
    outliving: [
      "You have no idea how long your savings will actually last",
      "You've calculated before and the numbers scared you",
      "You've been told CPF LIFE will be enough (it often isn't)",
    ],
    inflation: [
      "You've been keeping money in fixed deposits thinking it's safe",
      "You tried investing before and lost money",
      "You've been waiting for 'the right time' to do something about it",
    ],
    family: [
      "Your children insist they'll take care of you",
      "You're still supporting aging parents yourself",
      "You have ongoing financial obligations that feel permanent",
    ],
  };

  return [...base, ...concernSpecific[c.concern]];
}

// ---- FUTURE PACING (per retirementGoal) ----
export function getFuturePacing(c: CopyInputs): string[] {
  const goalPacing: Record<RetirementGoal, string[]> = {
    basic: [
      `It's the 1st of the month. ${fmt(c.totalMonthlyIncome)} appears in your account — not from work, but from a plan you set in motion at age ${c.currentAge}.`,
      "You wake up without an alarm. There's no rush. You make breakfast, read the papers, take a walk to the market.",
      "When a bill comes, you pay it without checking your balance first. When your body needs attention, you see the doctor without hesitation.",
      "Simple. Stress-free. Exactly the retirement you earned.",
    ],
    comfortable: [
      `It's the 1st of the month. ${fmt(c.totalMonthlyIncome)} appears in your account — not from work, but from a plan you set in motion at age ${c.currentAge}.`,
      "You have breakfast at your favourite hawker centre. You pick up groceries without calculating. You book that restaurant your friend recommended.",
      "When your grandchild wants to go to the zoo, you say yes without thinking about money. When your old friend suggests a weekend in JB, you just go.",
      `This isn't luxury. This is comfort. And it's ${fmt(c.totalMonthlyIncome)}/month away from being your reality.`,
    ],
    travel: [
      `It's the 1st of the month. ${fmt(c.totalMonthlyIncome)} appears in your account — not from work, but from a plan you set in motion at age ${c.currentAge}.`,
      "You're scrolling through flight prices to Tokyo. Not dreaming — booking. Because this year's budget already accounts for two trips.",
      "Your friends marvel at your photos. They ask how you afford it. The answer: you spent 45 minutes at age " + c.currentAge + " getting your numbers right.",
      `The world didn't get smaller when you retired. It got bigger. Because ${fmt(c.totalMonthlyIncome)}/month buys freedom.`,
    ],
    legacy: [
      `It's the 1st of the month. ${fmt(c.totalMonthlyIncome)} appears in your account — not from work, but from a plan you set in motion at age ${c.currentAge}.`,
      "Your daughter just got promoted. She didn't have to worry about you — because you planned ahead. Your grandson's education fund is growing. Your name is behind it.",
      "When you give ang bao at Chinese New Year, it's generous. When your mosque needs donations, you contribute proudly. You're not just surviving retirement — you're building something that outlasts you.",
      `This is legacy. And it starts with making your ${fmt(c.idleTotal)} work as hard as you did.`,
    ],
  };

  return goalPacing[c.retirementGoal];
}

// ---- CONCERN-SPECIFIC TESTIMONIALS ----
export function getTestimonials(c: CopyInputs) {
  // Return testimonials weighted toward their concern
  const all = [
    {
      name: "David Tan", age: 52, concern: "inflation" as Concern,
      situation: "Had $220K in CPF OA + $150K in fixed deposits earning 0.5%",
      before: "$1,400/mo", after: "$3,800/mo",
      quote: "I didn't realise inflation was quietly eating $9,000/year from my savings. After the session, I restructured everything. My projected retirement income more than doubled — and it's inflation-protected.",
    },
    {
      name: "Nurul Huda", age: 48, concern: "family" as Concern,
      situation: "Had $160K CPF OA + $80K savings, supporting elderly mother",
      before: "$1,100/mo", after: "$2,900/mo",
      quote: "I was terrified of burdening my children the way I've been supporting my mother. The session showed me exactly how to close the gap. My kids won't need to worry about me — and I didn't need to sell anything or take risks.",
    },
    {
      name: "Ravi Krishnan", age: 53, concern: "outliving" as Concern,
      situation: "Had $200K CPF OA + $180K across bank accounts",
      before: "$1,600/mo", after: "$4,100/mo",
      quote: "My father lived to 91. I was terrified I'd run out of money at 80. The retirement plan they built for me generates income for life — not just 10 or 15 years. I sleep better now.",
    },
    {
      name: "Linda Cheong", age: 56, concern: "healthcare" as Concern,
      situation: "Had $140K CPF OA + $200K in savings, worried about medical bills",
      before: "$1,200/mo", after: "$3,400/mo",
      quote: "After my husband's hospital stay cost $32,000, I panicked about our retirement. The session showed me our savings could generate almost triple what CPF alone would give. Best 45 minutes I ever spent.",
    },
  ];

  // Put matching-concern testimonials first
  const matching = all.filter(t => t.concern === c.concern);
  const others = all.filter(t => t.concern !== c.concern);
  return [...matching, ...others].slice(0, 4);
}

// ---- SESSION VALUE (per concern) ----
export function getSessionAgenda(c: CopyInputs): string[] {
  const base = [
    `Calculate your exact CPF LIFE payout at 65 (currently projected at ${fmt(c.cpfLifeMonthly)}/mo)`,
    `Show you how to deploy your ${fmt(c.idleTotal)} in CPF OA + savings for maximum income`,
    `Build a written plan to generate up to ${fmt(c.totalMonthlyIncome)}/month in retirement`,
  ];

  const concernSpecific: Record<Concern, string[]> = {
    healthcare: [
      "Map out a healthcare buffer that protects your retirement income from medical emergencies",
      "Show you how MediShield, MediSave, and private coverage fit into your overall plan",
    ],
    outliving: [
      "Stress-test your plan to age 90 and 95 so you KNOW your money will last",
      "Structure income sources that pay you for LIFE, not just a fixed period",
    ],
    inflation: [
      "Show you exactly how much inflation is costing your idle savings every year",
      "Build an inflation-resistant portfolio that grows your purchasing power, not just your balance",
    ],
    family: [
      "Create a plan that makes you financially independent from your children",
      "Show you how to build a legacy fund while still covering your own retirement",
    ],
  };

  return [...base, ...concernSpecific[c.concern]];
}
