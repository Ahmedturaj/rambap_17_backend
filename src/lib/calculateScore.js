export const calculateCreditScore = (user) => {
  if (!user) {
    return {
      totalScore: 15,
      overallPercent: 15,
      category: "Faible",
      breakdown: {},
    };
  }

  let totalScore = 0;
  let breakdown = {};

  // ---------------- Annual Income ----------------
  const income =
    user.annualIncome ??
    user.financialInfo?.annualIncome ??
    0;

  let incomeScore = 0;
  if (income > 0 && income < 15000) incomeScore = 5;
  else if (income >= 15000 && income <= 50000) incomeScore = 10;
  else if (income > 50000) incomeScore = 25;

  breakdown.annualIncome = { score: incomeScore, max: 25 };
  totalScore += incomeScore;

  // ---------------- Existing Loan ----------------
  const loan =
    user.existingLoan ??
    user.financialInfo?.existingLoan?.amount ??
    (user.financialInfo?.existingLoan?.hasLoan ? 1 : 0) ??
    0;

  let loanScore = loan === 0 ? 15 : 5;
  breakdown.existingLoan = { score: loanScore, max: 15 };
  totalScore += loanScore;

  // ---------------- Mobile Money Balance ----------------
  const balance =
    user.mobileBalance ??
    user.financialInfo?.mobileBalance ??
    0;

  let balanceScore = 0;
  if (balance <= 0) balanceScore = 1;
  else if (balance <= 50000) balanceScore = 10;
  else balanceScore = 20;

  breakdown.mobileBalance = { score: balanceScore, max: 20 };
  totalScore += balanceScore;

  // ---------------- Electricity Bill ----------------
  const bill =
    user.electricBill ??
    user.financialInfo?.electricityBill ??
    0;

  let billScore = bill > 30000 ? 3 : 10;
  breakdown.electricBill = { score: billScore, max: 10 };
  totalScore += billScore;

  // ---------------- Land Ownership ----------------
  const land =
    user.landValue ??
    user.financialInfo?.valueOfLandOwnership ??
    0;

  let landScore = land > 0 ? 13 : 1;
  breakdown.landValue = { score: landScore, max: 13 };
  totalScore += landScore;

  // ---------------- Ratio Debt / Income ----------------
  const ratio = income > 0 ? loan / income : undefined;
  let ratioScore = 0;
  if (ratio === 0 || ratio === undefined || ratio < 0.1) ratioScore = 17;
  else if (ratio >= 0.1 && ratio <= 0.5) ratioScore = 5;
  else ratioScore = 0;


  breakdown.ratioDebtIncome = { score: ratioScore, max: 17 };
  totalScore += ratioScore;

  // ---------------- Percentages ----------------
  const maxScore = 100;
  const overallPercent = Math.round((totalScore / maxScore) * 100);

  // ---------------- Category ----------------
  let category = "Faible";
  if (overallPercent >= 56 && overallPercent <= 79) category = "Moyen";
  else if (overallPercent >= 80) category = "Élevé";

  return {
    totalScore,
    overallPercent,
    category,
    breakdown,
  };
};
