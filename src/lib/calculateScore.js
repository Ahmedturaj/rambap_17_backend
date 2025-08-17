export const calculateCreditScore = (user) => {
  let score = 0;

  // If no info → 300
  if (!user.personalInfo?.dateOfBirth &&
      !user.financialInfo?.nbCredits &&
      !user.financialInfo?.soldeMoMo &&
      !user.financialInfo?.mtFacture &&
      !user.financialInfo?.terrain) {
    return { score: 300, category: "Low", loan: 30000 };
  }

  // Age
  if (user.personalInfo?.dateOfBirth) {
    const age = Math.floor((Date.now() - new Date(user.personalInfo.dateOfBirth)) / (365 * 24 * 60 * 60 * 1000));
    if (age >= 18 && age <= 30) score += 200;
    else if (age >= 31 && age <= 50) score += 250;
    else score += 300;
  }

  // Nb Credits
  score += user.financialInfo?.nbCredits === 0 ? 100 : 200;

  // MoMo balance
  const momo = user.financialInfo?.soldeMoMo || 0;
  if (momo <= 0) score += 50;
  else if (momo <= 50000) score += 100;
  else score += 200;

  // Bill Amount
  score += user.financialInfo?.mtFacture > 10000 ? 200 : 50;

  // Land Ownership
  score += user.financialInfo?.terrain ? 100 : 0;

  // Category + Loan Eligibility
  let category = "Low";
  let loan = 30000;
  if (score >= 300 && score <= 500) {
    category = "Low"; loan = 30000;
  } else if (score >= 501 && score <= 700) {
    category = "Medium"; loan = 50000;
  } else if (score > 700) {
    category = "High"; loan = 100000;
  }

  return { score, category, loan };
};
