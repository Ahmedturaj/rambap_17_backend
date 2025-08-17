export const calculateCreditScore = (user) => {
  let totalScore = 0;
  let breakdown = {};

  // ---------- AGE ----------
  if (user.dateOfBirth) {
    const age = Math.floor(
      (Date.now() - new Date(user.dateOfBirth)) / (365 * 24 * 60 * 60 * 1000)
    );
    let ageScore = 0;
    if (age >= 18 && age <= 30) ageScore = 200;
    else if (age >= 31 && age <= 50) ageScore = 250;
    else if (age > 50) ageScore = 300;
    breakdown.age = { score: ageScore, percent: 0 };
    totalScore += ageScore;
  }

  // ---------- ANNUAL INCOME ----------
  const income = user.annualIncome || 0;
  let incomeScore = 0;
  if (income <= 0) incomeScore = 50;
  else if (income <= 10000) incomeScore = 100;
  else if (income <= 50000) incomeScore = 200;
  else incomeScore = 300;
  breakdown.annualIncome = { score: incomeScore, percent: 0 };
  totalScore += incomeScore;

  // ---------- ELECTRIC BILL ----------
  const bill = user.electricBill || 0;
  let billScore = 0;
  if (bill <= 0) billScore = 50;
  else if (bill <= 5000) billScore = 100;
  else if (bill <= 20000) billScore = 200;
  else billScore = 300;
  breakdown.electricBill = { score: billScore, percent: 0 };
  totalScore += billScore;

  // ---------- MOBILE BALANCE ----------
  const balance = user.mobileBalance || 0;
  let balanceScore = 0;
  if (balance <= 0) balanceScore = 50;
  else if (balance <= 50000) balanceScore = 100;
  else if (balance <= 200000) balanceScore = 200;
  else balanceScore = 300;
  breakdown.mobileBalance = { score: balanceScore, percent: 0 };
  totalScore += balanceScore;

  // ---------- CALCULATE PERCENTAGES ----------
  const maxScore = 1200; // 4 x 300
  const overallPercent = Math.round((totalScore / maxScore) * 100);
  let sumOfPercents = 0;
  Object.keys(breakdown).forEach((key) => {
    const percent = Math.round((breakdown[key].score / 300) * 100);
    breakdown[key].percent = percent;
    sumOfPercents += percent;
  });

  // ---------- CATEGORY & LOAN ----------
  let category = "Low";
  let loan = 30000;
  if (overallPercent <= 40) {
    category = "Low";
    loan = 30000;
  } else if (overallPercent <= 70) {
    category = "Medium";
    loan = 50000;
  } else {
    category = "High";
    loan = 100000;
  }

  return {
    totalScore,
    overallPercent, // from score/maxScore (main 100%)
    avgPercent: Math.round(sumOfPercents / 4), // 4 ta percent er combined avg
    category,
    loan,
    breakdown,
  };
};