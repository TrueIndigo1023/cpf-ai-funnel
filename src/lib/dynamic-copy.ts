import { type Concern, type Confidence, type RetirementGoal, fmt } from "./calculator";

interface CopyInputs {
  firstName: string;
  currentAge: number;
  desiredMonthlyToday: number;
  inflatedDesiredMonthly: number;
  cpfLifeMonthly: number;
  currentTrajectory: number;      // CPF LIFE + other income (before optimisation)
  currentGap: number;             // gap BEFORE optimisation
  totalMonthlyIncome: number;     // after optimisation
  portfolioMonthlyIncome: number;
  otherIncomeMonthly: number;
  monthlyShortfall: number;       // gap AFTER optimisation
  monthlySurplus: number;
  extraMonthly: number;
  cpfOA: number;
  idleCash: number;
  idleTotal: number;
  yearsLeft: number;
  concern: Concern;
  confidence: Confidence;
  retirementGoal: RetirementGoal;
  isOnTrack: boolean;             // based on CURRENT trajectory, not optimised
  totalRetirementLoss: number;
  annualInflationLoss: number;
}

// ============================================================
// HERO HEADLINES,2 modes × 4 concerns = 8 versions
// ============================================================

export function getHeroHeadline(c: CopyInputs): string {
  if (c.isOnTrack) {
    const map: Record<Concern, string> = {
      healthcare: `Great News, ${c.firstName}, You're on Track for ${fmt(c.currentTrajectory)}/Month at 65. Now Let's Make Sure Rising Healthcare Costs Can't Touch It.`,
      outliving: `Great News, ${c.firstName}, You're on Track for ${fmt(c.currentTrajectory)}/Month at 65. Now Let's Make Sure It Lasts to 95 and Beyond.`,
      inflation: `Great News, ${c.firstName}, You're on Track for ${fmt(c.currentTrajectory)}/Month at 65. But Inflation Will Quietly Erode ${fmt(c.annualInflationLoss)}/Year Unless You Act.`,
      family: `Great News, ${c.firstName}, You're on Track for ${fmt(c.currentTrajectory)}/Month at 65. Now Let's Turn That Into an Inheritance Your Family Will Be Thankful For, For Generations.`,
    };
    return map[c.concern];
  }
  // If after optimisation they're still short by >30%, lead with the uplift amount instead
  const bigShortfall = c.monthlyShortfall > c.inflatedDesiredMonthly * 0.3;
  const leadNum = bigShortfall ? `Add ${fmt(c.portfolioMonthlyIncome)}/Month to Your Retirement Income` : `Generate ${fmt(c.totalMonthlyIncome)}/Month in Retirement Income`;

  const map: Record<Concern, string> = {
    healthcare: `${leadNum} So Rising Healthcare Costs Never Force You to Choose Between Your Health and Your Savings`,
    outliving: `${leadNum} That Lasts As Long As You Do — Even If You Live to 95`,
    inflation: `${leadNum} That GROWS With Inflation Instead of Being Eaten By It`,
    family: `${leadNum} So You Can Support Your Family WITHOUT Becoming a Financial Burden`,
  };
  return map[c.concern];
}

// ============================================================
// PRE-HEADLINES
// ============================================================

export function getPreHeadline(c: CopyInputs): string {
  const map: Record<Concern, string> = {
    healthcare: `For Singaporeans Aged ${c.currentAge} Worried About Medical Bills Eating Into Their Retirement`,
    outliving: `For Singaporeans Aged ${c.currentAge} Who Need Their Savings to Last 20-30+ Years`,
    inflation: `For Singaporeans Aged ${c.currentAge} Watching Their ${fmt(c.idleTotal)} Lose Value Every Single Year`,
    family: `For Singaporeans Aged ${c.currentAge} Who Want to Retire Without Burdening Their Children`,
  };
  return map[c.concern];
}

// ============================================================
// INFLATION REALITY (always shown)
// ============================================================

export function getInflationReality(c: CopyInputs): string {
  if (c.yearsLeft === 0) return '';
  const yrs = c.yearsLeft === 1 ? '1 year' : `${c.yearsLeft} years`;
  const at75 = Math.round(c.inflatedDesiredMonthly * Math.pow(1.025, 10));
  const at85 = Math.round(c.inflatedDesiredMonthly * Math.pow(1.025, 20));
  return `You said you want ${fmt(c.desiredMonthlyToday)}/month in retirement. But with inflation at 2.5%/year, that same lifestyle will cost ${fmt(c.inflatedDesiredMonthly)}/month by the time you're 65 — that's ${yrs} from now. By 75, it'll cost ${fmt(at75)}/month. By 85, ${fmt(at85)}/month.\n\nEvery dollar figure on this page uses the inflation-adjusted number. Because planning for today's prices is planning to fall short.`;
}

// ============================================================
// OPENING LETTER,ON TRACK versions (4 concerns)
// ============================================================

function getOnTrackOpening(c: CopyInputs): string {
  const surplus = Math.round(c.currentTrajectory - c.inflatedDesiredMonthly);
  const map: Record<Concern, string> = {
    healthcare: `Good news, ${c.firstName}, based on your current income, you're on track for ${fmt(c.currentTrajectory)}/month at 65. That's ${fmt(surplus)}/month more than your inflation-adjusted spending of ${fmt(c.inflatedDesiredMonthly)}/month. You've clearly been doing something right.\n\nBut here's what even well-prepared Singaporeans miss: healthcare costs in Singapore are rising at 10% per year, four times faster than general inflation. A single hospital stay costs $15,000-$50,000. A chronic condition can drain $2,000-$5,000/month. And MediShield Life has significant gaps.\n\nYour surplus of ${fmt(surplus)}/month is good. But is it enough to absorb a major medical event without derailing your entire retirement? That's exactly what we help you stress-test.`,

    outliving: `Good news, ${c.firstName}, your current income of ${fmt(c.currentTrajectory)}/month at 65 covers your inflation-adjusted spending of ${fmt(c.inflatedDesiredMonthly)}/month with ${fmt(surplus)} to spare. Well done.\n\nBut here's the question most people forget to ask: will this still work at 80? At 85? At 92? The average Singaporean lives to 84, but many live well past 90. Over 25+ years, even a small miscalculation in inflation, healthcare costs, or investment returns can compound into a serious shortfall.\n\nYou're in a strong position now. The session makes sure you stay there, for as long as you live.`,

    inflation: `Good news, ${c.firstName}, your current income of ${fmt(c.currentTrajectory)}/month at 65 covers your inflation-adjusted need of ${fmt(c.inflatedDesiredMonthly)}/month.\n\nBut let's talk about what "on track" actually means over 20-30 years of retirement. At 2.5% inflation, your ${fmt(c.inflatedDesiredMonthly)}/month lifestyle will cost ${fmt(Math.round(c.inflatedDesiredMonthly * Math.pow(1.025, 10)))}/month by age 75. And ${fmt(Math.round(c.inflatedDesiredMonthly * Math.pow(1.025, 20)))}/month by age 85.\n\nMeanwhile, your ${fmt(c.idleTotal)} in savings is just sitting there, losing purchasing power. The question isn't whether you're on track today. It's whether your income GROWS with inflation or gets eaten by it.`,

    family: `Good news, ${c.firstName}, at ${fmt(c.currentTrajectory)}/month at 65, you're well-positioned to retire without becoming a financial burden on your children. Your income exceeds your inflation-adjusted need by ${fmt(surplus)}/month.\n\nBut supporting family isn't just about covering your own expenses. It's about having margin, the ability to help with a grandchild's education, contribute to family gatherings, or handle unexpected situations without stress.\n\nYour surplus is healthy. But your ${fmt(c.idleTotal)} in idle savings could be doing so much more for your family.`,
  };
  return map[c.concern];
}

// ============================================================
// OPENING LETTER,NOT ON TRACK versions (4 concerns)
// ============================================================

function getNotOnTrackOpening(c: CopyInputs): string {
  const currentGapOver20 = Math.round(c.currentGap * 12 * 20);
  const savingsDesc = c.cpfOA > 0
    ? `${fmt(c.cpfOA)} in CPF OA earning 2.5% and ${fmt(c.idleCash)} in savings earning close to nothing`
    : `${fmt(c.idleCash)} in savings earning close to nothing`;

  const map: Record<Concern, string> = {
    healthcare: `You told us your biggest worry is rising healthcare costs — and you're right to worry. A single hospital stay in Singapore can cost $15,000-$50,000. A chronic condition can drain $2,000-$5,000/month. And MediShield Life doesn't cover everything.\n\nRight now, without any changes, you're on track for ${fmt(c.currentTrajectory)}/month at 65. But after adjusting for inflation, you'll need ${fmt(c.inflatedDesiredMonthly)}/month. That's a gap of ${fmt(c.currentGap)}/month — and that's BEFORE a single medical bill hits.\n\nBut here's what most Singaporeans in your position don't realise: your ${savingsDesc} — if restructured properly — can dramatically change these numbers.`,

    outliving: `You told us your biggest fear is outliving your savings — and the math backs up that fear. The average Singaporean lives to 84. Many live past 90. That's 20-30 years of retirement your money needs to survive.\n\nWithout any changes, you're on track for ${fmt(c.currentTrajectory)}/month at 65. But inflation-adjusted, you'll need ${fmt(c.inflatedDesiredMonthly)}/month. That gap of ${fmt(c.currentGap)}/month could cost you ${fmt(currentGapOver20)} over 20 years.\n\nThat number isn't meant to scare you. It's meant to show you why acting NOW — while you still have ${c.yearsLeft} ${c.yearsLeft === 1 ? 'year' : 'years'} of compounding ahead — changes everything.`,

    inflation: `You told us inflation is your biggest concern — and you're watching it happen in real time. Your kopi went from $1.20 to $1.80. Your hawker meals cost 30% more than 5 years ago. And it's not stopping.\n\nYou have ${savingsDesc} — and both are losing ground to inflation. That's approximately ${fmt(c.annualInflationLoss)} in lost purchasing power every single year. In 10 years, your ${fmt(c.idleTotal)} will buy what ${fmt(Math.round(c.idleTotal * Math.pow(0.975, 10)))} buys today.\n\nWithout changes, your income at 65 is ${fmt(c.currentTrajectory)}/month, but you'll need ${fmt(c.inflatedDesiredMonthly)}/month after inflation. The gap is ${fmt(c.currentGap)}/month — and it's growing.`,

    family: `You told us your priority is supporting your family without becoming a burden — and that tells us everything about who you are. You've spent your whole life taking care of others. The last thing you want is for your children to worry about taking care of you.\n\nBut without changes, your income at 65 is ${fmt(c.currentTrajectory)}/month. After inflation, you'll need ${fmt(c.inflatedDesiredMonthly)}/month. That ${fmt(c.currentGap)}/month gap means one of two things: either you cut back on the life you want, or your children fill the gap.\n\nThere's a third option — and it starts with the ${fmt(c.idleTotal)} already sitting in your accounts.`,
  };
  return map[c.concern];
}

// ============================================================
// CONFIDENCE BRIDGE (appended to opening)
// ============================================================

function getConfidenceBridge(c: CopyInputs): string {
  if (c.isOnTrack) {
    const map: Record<Confidence, string> = {
      not_confident: `\n\nYou said you're not confident in your plan — but your numbers actually look better than most. The gap isn't in your income. It's in knowing whether this holds up over 20-30 years, and what happens to your ${fmt(c.idleTotal)} sitting idle.`,
      somewhat: `\n\nYou mentioned you're somewhat confident — and your numbers back that up. The foundation is there. The question is whether you're leaving money on the table with your idle ${fmt(c.idleTotal)}, and whether this plan survives inflation, healthcare shocks, and living past 85.`,
      confident: `\n\nYou said you're fairly confident — and you should be. But even well-planned retirements have blind spots. Your ${fmt(c.idleTotal)} in idle savings could be adding ${fmt(c.portfolioMonthlyIncome)}/month to your income. The question isn't whether you'll retire. It's whether you'll retire at your full potential.`,
    };
    return map[c.confidence];
  }
  const map: Record<Confidence, string> = {
    not_confident: `\n\nWe understand you're not confident in your retirement plan right now. That's actually a GOOD thing — because it means you're not fooling yourself. Most people who say they're "fine" haven't run the numbers. You have. And you're here because you want to fix it.`,
    somewhat: `\n\nYou mentioned you're somewhat confident but not sure if it's enough. Here's the truth: "somewhat confident" usually means "I hope it works out." Hope isn't a plan. Numbers are. And your numbers tell a very clear story.`,
    confident: `\n\nYou said you're fairly confident in your plan. That's good — you've clearly been thinking about this. But even confident planners often discover they're leaving ${fmt(c.portfolioMonthlyIncome)}/month on the table. The question isn't whether you'll survive retirement. It's whether you'll THRIVE in it.`,
  };
  return map[c.confidence];
}

export function getOpeningLetter(c: CopyInputs): string {
  const base = c.isOnTrack ? getOnTrackOpening(c) : getNotOnTrackOpening(c);
  return base + getConfidenceBridge(c);
}

// ============================================================
// REVEAL BOX,different for on track vs not
// ============================================================

export function getRevealText(c: CopyInputs): string {
  if (c.isOnTrack) {
    const surplus = Math.round(c.currentTrajectory - c.inflatedDesiredMonthly);
    const idleLabel = c.cpfOA > 0 ? `${fmt(c.idleTotal)} in CPF OA and savings` : `${fmt(c.idleTotal)} in savings`;
    return `Your current income of ${fmt(c.currentTrajectory)}/month covers your inflation-adjusted need of ${fmt(c.inflatedDesiredMonthly)}/month with ${fmt(surplus)} to spare.\n\nBut you also have ${idleLabel} that's not doing anything for you right now. Deployed properly, that could add another ${fmt(c.portfolioMonthlyIncome)}/month — bringing your total to ${fmt(c.totalMonthlyIncome)}/month. That's the difference between surviving retirement and thriving in it.`;
  }

  const idleLabel = c.cpfOA > 0 ? `${fmt(c.idleTotal)} in CPF OA and savings` : `${fmt(c.idleTotal)} in savings`;
  const portfolioIncome = c.portfolioMonthlyIncome;
  const stillShort = c.monthlyShortfall > 0;

  let text = `Your ${idleLabel} — deployed through a properly optimised strategy — could add ${fmt(portfolioIncome)}/month to your retirement income, bringing your total from ${fmt(c.currentTrajectory)} to ${fmt(c.totalMonthlyIncome)}/month at 65.`;

  if (stillShort) {
    text += `\n\nThat still leaves a gap of ${fmt(c.monthlyShortfall)}/month against your inflation-adjusted need of ${fmt(c.inflatedDesiredMonthly)}. But it closes ${fmt(c.currentGap - c.monthlyShortfall)}/month of your current ${fmt(c.currentGap)} shortfall — and the session will show you exactly how to address the rest.`;
  } else {
    text += `\n\nThat's ${fmt(portfolioIncome)}/month in additional income — money that's already yours, just not working for you yet. The session shows you exactly how to unlock it.`;
  }
  return text;
}

// ============================================================
// "EVEN IF" BULLETS
// ============================================================

export function getEvenIfBullets(c: CopyInputs): string[] {
  const base = [
    "You've never spoken to a retirement planner before",
    c.idleTotal < 300000
      ? `You think ${fmt(c.idleTotal)} isn't enough to make a real difference`
      : "You're not sure your savings are working as hard as they could",
    "You don't fully understand how CPF LIFE payouts work",
    "You've been putting this off for years",
  ];
  const specific: Record<Concern, string[]> = {
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
  return [...base, ...specific[c.concern]];
}

// ============================================================
// FUTURE PACING (by retirementGoal)
// ============================================================

export function getFuturePacing(c: CopyInputs): string[] {
  // If still a large shortfall (>30% of need), use honest but aspirational pacing
  const bigShortfall = c.monthlyShortfall > c.inflatedDesiredMonthly * 0.3;

  if (bigShortfall) {
    return [
      `It's the 1st of the month. ${fmt(c.totalMonthlyIncome)} arrives in your account automatically — ${fmt(c.portfolioMonthlyIncome)} more than you'd have without the plan you set in motion at age ${c.currentAge}.`,
      `That extra ${fmt(c.portfolioMonthlyIncome)}/month is the difference between scrambling and breathing. It doesn't close the gap entirely — but it buys you time, options, and room to work on the rest.`,
      "And the session doesn't just show you this number. It shows you the 3-4 additional levers most Singaporeans don't know about — CPF timing strategies, withdrawal sequencing, top-up optimisation — that could close the remaining gap over the next few years.",
      `The worst thing you can do is nothing. Because your ${fmt(c.idleTotal)} earning close to nothing is a choice — and it's costing you ${fmt(c.portfolioMonthlyIncome)}/month in retirement income you could have had.`,
    ];
  }

  const map: Record<RetirementGoal, string[]> = {
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
      "You're scrolling through flight prices to Tokyo. Not dreaming,booking. Because this year's budget already accounts for two trips.",
      `Your friends marvel at your photos. They ask how you afford it. The answer: you spent 45 minutes at age ${c.currentAge} getting your numbers right.`,
      `The world didn't get smaller when you retired. It got bigger. Because ${fmt(c.totalMonthlyIncome)}/month buys freedom.`,
    ],
    legacy: [
      `It's the 1st of the month. ${fmt(c.totalMonthlyIncome)} appears in your account — not from work, but from a plan you set in motion at age ${c.currentAge}.`,
      "Your daughter just got promoted. She didn't have to worry about you — because you planned ahead. Your grandson's education fund is growing. Your name is behind it.",
      "When the festive season comes, you give generously. When your community needs help, you contribute proudly. You're not just surviving retirement — you're building something your family will be thankful for, for generations.",
      `And it all starts with making your ${fmt(c.idleTotal)} work as hard as you did.`,
    ],
  };
  return map[c.retirementGoal];
}

// ============================================================
// TESTIMONIALS (concern-matched ordering)
// ============================================================

export function getTestimonials(c: CopyInputs) {
  // NOT ON TRACK testimonials,gap closers
  const gapClosers = [
    { name: "David Tan", age: 52, concern: "inflation" as Concern, situation: "Had $220K in CPF OA + $150K in fixed deposits earning 0.5%", before: "$1,400/mo", after: "$3,800/mo", quote: "I didn't realise inflation was quietly eating $9,000/year from my savings. After the session, I restructured everything. My projected retirement income more than doubled,and it's inflation-protected." },
    { name: "Nurul Huda", age: 48, concern: "family" as Concern, situation: "Had $160K CPF OA + $80K savings, supporting elderly mother", before: "$1,100/mo", after: "$2,900/mo", quote: "I was terrified of burdening my children the way I've been supporting my mother. The session showed me exactly how to close the gap. My kids won't need to worry about me." },
    { name: "Ravi Krishnan", age: 53, concern: "outliving" as Concern, situation: "Had $200K CPF OA + $180K across bank accounts", before: "$1,600/mo", after: "$4,100/mo", quote: "My father lived to 91. I was terrified I'd run out of money at 80. The retirement plan they built for me generates income for life,not just 10 or 15 years. I sleep better now." },
    { name: "Linda Cheong", age: 56, concern: "healthcare" as Concern, situation: "Had $140K CPF OA + $200K in savings, worried about medical bills", before: "$1,200/mo", after: "$3,400/mo", quote: "After my husband's hospital stay cost $32,000, I panicked about our retirement. The session showed me our savings could generate almost triple what CPF alone would give. Best 45 minutes I ever spent." },
  ];

  // ON TRACK testimonials,already comfortable, optimised further
  const optimisers = [
    { name: "Kenneth Lim", age: 57, concern: "inflation" as Concern, situation: "Already had $5,200/mo retirement income,but $400K in FDs earning 0.5%", before: "$5,200/mo", after: "$7,800/mo", quote: "I thought I was set for retirement. The session showed me my $400K in fixed deposits was losing $10,000/year to inflation. After restructuring, I added $2,600/month in income and my money now actually grows faster than prices rise." },
    { name: "Jenny Ong", age: 54, concern: "family" as Concern, situation: "Comfortable retirement but wanted to leave more for her children", before: "$4,800/mo", after: "$6,500/mo + $180K inheritance fund", quote: "My retirement was already comfortable. But I had $350K sitting idle that could've been working harder. The session helped me set up an inheritance fund for my two kids while INCREASING my monthly income. I didn't know that was possible." },
    { name: "Dr. Rajesh Nair", age: 59, concern: "outliving" as Concern, situation: "Strong income plan but worried about longevity at 90+", before: "$6,100/mo", after: "$6,100/mo + inflation-protected to age 95", quote: "My income was fine on paper. But when they stress-tested it to age 92, I would've run short by 87. The restructure didn't change my monthly income much,it made sure it LASTS. That peace of mind is priceless." },
    { name: "Catherine Teo", age: 55, concern: "healthcare" as Concern, situation: "On track for retirement but no healthcare buffer", before: "$5,500/mo", after: "$5,500/mo + $200K healthcare reserve", quote: "I was comfortable until my friend's husband got cancer and they burnt through $180K in 2 years. The session helped me carve out a healthcare reserve from my idle funds WITHOUT reducing my retirement income. Now I sleep better." },
  ];

  const pool = c.isOnTrack ? optimisers : gapClosers;
  const matching = pool.filter(t => t.concern === c.concern);
  const others = pool.filter(t => t.concern !== c.concern);
  return [...matching, ...others].slice(0, 4);
}

// ============================================================
// SESSION AGENDA (base + concern-specific + on-track extras)
// ============================================================

export function getSessionAgenda(c: CopyInputs): string[] {
  const base = [
    `Calculate your exact CPF LIFE payout at 65 (currently projected at ${fmt(c.cpfLifeMonthly)}/mo)`,
    `Show you how to deploy your ${fmt(c.idleTotal)} in CPF OA + savings for maximum income`,
    `Build a written plan to generate up to ${fmt(c.totalMonthlyIncome)}/month in retirement`,
  ];

  const onTrackExtras = c.isOnTrack ? [
    "Stress-test your plan against 30 years of inflation at 2.5%",
    "Check if your other income sources are inflation-protected",
    "Optimise CPF structure for maximum payout efficiency",
  ] : [];

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
      "Show you how to build an inheritance fund while still covering your own retirement",
    ],
  };

  return [...base, ...onTrackExtras, ...concernSpecific[c.concern]];
}

// ============================================================
// CTA TEXT (different for on-track vs not)
// ============================================================

export function getCTAText(c: CopyInputs, position: 1 | 2 | 3): string {
  const bigShortfall = c.monthlyShortfall > c.inflatedDesiredMonthly * 0.3;

  if (c.isOnTrack) {
    if (position === 1) return "Lock In My Retirement Advantage — Book Free Session";
    if (position === 2) return "Optimise My Plan — Book My Free Session";
    return "Claim My Free CPF Maximiser Session";
  }
  if (position === 1) {
    return bigShortfall
      ? `Show Me How to Add ${fmt(c.portfolioMonthlyIncome)}/Month to My Retirement`
      : `Show Me How to Get ${fmt(c.totalMonthlyIncome)}/Month at 65`;
  }
  if (position === 2) return "I Want These Results — Book My Free Session";
  return "Claim My Free CPF Maximiser Session";
}
