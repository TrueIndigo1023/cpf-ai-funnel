# CPF AI Funnel — Auto-Anneal System

## How It Works

The funnel tracks every user interaction via Meta Pixel custom events:

### Events Tracked

| Event | Where | What It Tells Us |
|-------|-------|-----------------|
| `FunnelView` | Landing page | Total visitors |
| `QuizStart` | Landing CTA click | % who start quiz (landing page effectiveness) |
| `QuizStep1Complete` | Step 1 → 2 | % who complete goals (step 1 friction) |
| `QuizStep2Complete` | Step 2 → 3 | % who complete finances (step 2 friction) |
| `QuizStep3Complete` | Step 3 → loading | % who complete priorities (step 3 friction) |
| `QuizComplete` | All steps done | Full quiz completion rate |
| `ClaimPageView` | Claim form shown | % reaching lead capture |
| `Lead` | Form submitted | Lead conversion rate |
| `ResultsPageView` | Results page loaded | % who view results |
| `ResultsScroll25` | 25% scroll | Reading past the opening |
| `ResultsScroll50` | 50% scroll | Reading past mechanism |
| `ResultsScroll75` | 75% scroll | Reading past testimonials |
| `ResultsScroll100` | 100% scroll | Read entire page |
| `CTAClick1` | First CTA button | Early intent |
| `CTAClick2` | Second CTA button | Post-proof intent |
| `CTAClick3` | Final CTA button | Bottom-of-page intent |

### How to Read the Data

In Meta Ads Manager → Events Manager → Custom Conversions, you'll see all these events.

**Key funnel ratios to watch:**

| Metric | Formula | Healthy Benchmark | Action If Below |
|--------|---------|-------------------|-----------------|
| Landing → Quiz Start | QuizStart / FunnelView | > 30% | Rewrite hero headline/CTA |
| Quiz Start → Complete | QuizComplete / QuizStart | > 60% | Simplify quiz, reduce steps |
| Quiz → Lead | Lead / QuizComplete | > 70% | Rewrite claim page copy |
| Lead → Results View | ResultsPageView / Lead | > 90% | Technical issue if < 90% |
| Results → Scroll 50% | ResultsScroll50 / ResultsPageView | > 40% | Opening letter too weak |
| Results → Scroll 100% | ResultsScroll100 / ResultsPageView | > 20% | Page too long or copy loses them |
| Results → Any CTA Click | (CTA1+CTA2+CTA3) / ResultsPageView | > 10% | Weak offer/CTA/guarantee |
| CTA Click → Booking | Check LeadConnector | > 30% | Calendar availability issue |

### Where Drop-Off = What to Fix

| Drop-off Point | What's Broken | What to Anneal |
|----------------|---------------|----------------|
| Landing → Quiz | Hero doesn't hook | Rewrite headline, subtext, or CTA button text |
| Quiz Step 1 → 2 | Too many fields or confusing | Simplify step 1 |
| Quiz Step 2 → 3 | Finance questions too personal | Add reassurance copy |
| Quiz Step 3 → Claim | Priorities feel unnecessary | Consider removing step 3 or making it optional |
| Claim → Results | Form friction | Reduce fields, make WhatsApp optional |
| Results 0-25% scroll | Opening letter doesn't grip | Rewrite concern opening paragraph |
| Results 25-50% scroll | Inflation/reveal section weak | Strengthen the "gap" messaging |
| Results 50-75% scroll | Mechanism or testimonials weak | Better proof, more specific numbers |
| Results 75-100% scroll | Future pacing or reverse qualification | Tonal issue or too aggressive |
| Results → CTA click | Offer not compelling enough | Strengthen value stack, add urgency |

## Daily Anneal Process

**When Fahim says "anneal the funnel" or this runs as a daily check:**

1. **Pull data** from Meta Events Manager (or Fahim provides screenshot)
2. **Calculate all ratios** above
3. **Identify the weakest link** — the biggest drop-off
4. **Generate 2-3 copy variants** for that section using the dynamic copy engine
5. **Present to Fahim** for approval before changing
6. **Update the code** in the GitHub repo
7. **Track results** for 48 hours before next anneal

**Rules:**
- Only change ONE section per anneal cycle (isolate variables)
- Never change the quiz structure without asking Fahim
- Keep all copy changes in the dynamic-copy.ts file
- Always commit with a clear message describing what was changed and why
- If a change makes things worse after 48 hours, revert it

## How to Set Up Auto-Monitoring

### Option A: Manual Daily Check (Current)
Fahim checks Ads Manager daily, shares drop-off data, Claude anneals.

### Option B: Meta Conversions API Webhook
Set up a Make.com/n8n workflow that:
1. Pulls custom event counts from Meta Marketing API daily
2. Calculates funnel ratios
3. Sends a summary to Fahim's WhatsApp/email
4. Flags any ratio that dropped below benchmark
5. Claude auto-generates suggested fixes

### Option C: PostHog (Future)
Add PostHog for heatmaps, session recordings, and detailed funnel analytics.
Free tier handles 1M events/month. Self-hosted option available.
