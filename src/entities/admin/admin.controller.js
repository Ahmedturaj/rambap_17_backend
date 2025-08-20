import { calculateCreditScore } from "../../lib/calculateScore.js";
import { generateResponse } from "../../lib/responseFormate.js";
import User from "../auth/auth.model.js";
import { updateUserDecision } from "./admin.service.js";


export const updateUserDecisionController = async (req, res) => {
  try {
    const { id } = req.params;
    const adminId = req.user._id;
    const updatedUser = await updateUserDecision(adminId, id, req.body);

    return generateResponse(
      res,
      200,
      true,
      "Decision updated successfully",
      updatedUser
    );
  } catch (error) {
    return generateResponse(res, 400, false, error.message, null);
  }
};


export const getAllUsersControllerByAdmin = async (req, res) => {
  try {
    // ----------- Query Params -----------
    const {
      page = 1,
      limit = 10,
      search = "",
      sort = "newest",
      role,
      minIncome,
      maxIncome,
      decisionStatus,
      category // Faible | Moyen | Élevé
    } = req.query;

    const query = {};

    // ----------- Filtering -----------
    if (role) query.role = role;

    if (minIncome || maxIncome) {
      query.annualIncome = {};
      if (minIncome) query.annualIncome.$gte = Number(minIncome);
      if (maxIncome) query.annualIncome.$lte = Number(maxIncome);
    }

    if (decisionStatus) {
      query["decision.status"] = decisionStatus;
    }

    // ----------- Search (name/email) -----------
    if (search) {
      query.$or = [
        { "personalInfo.firstName": { $regex: search, $options: "i" } },
        { "personalInfo.lastName": { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    // ----------- Pagination -----------
    const skip = (Number(page) - 1) * Number(limit);

    // ----------- Sorting -----------
    let sortOption = {};
    if (sort === "newest") sortOption = { createdAt: -1 };
    else if (sort === "oldest") sortOption = { createdAt: 1 };
    else if (sort === "incomeHigh") sortOption = { annualIncome: -1 };
    else if (sort === "incomeLow") sortOption = { annualIncome: 1 };
    // score sort handled later

    // ----------- Fetch Users -----------
    let users = await User.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit));

    // ----------- Add Score + Category -----------
    users = users.map((user) => {
      const scoreData = calculateCreditScore(user);
      return {
        ...user.toObject(),
        creditScore: scoreData,
      };
    });

    // ----------- Score Filtering (category) -----------
    if (category) {
      users = users.filter((u) => u.creditScore.category === category);
    }

    // ----------- Score Sorting (if chosen) -----------
    if (sort === "scoreHigh") {
      users = users.sort((a, b) => b.creditScore.overallPercent - a.creditScore.overallPercent);
    } else if (sort === "scoreLow") {
      users = users.sort((a, b) => a.creditScore.overallPercent - b.creditScore.overallPercent);
    }

    // ----------- Count for Pagination -----------
    const totalUsers = await User.countDocuments(query);
    const totalPages = Math.ceil(totalUsers / limit);

    // ----------- Count by Decision Status -----------
    const totalPending = await User.countDocuments({ "decision.status": "pending" });
    const totalApproved = await User.countDocuments({ "decision.status": "approved" });
    const totalRejected = await User.countDocuments({ "decision.status": "rejected" });

    // ----------- Response -----------
    const paginationInfo = {
      totalUsers,
      currentPage: Number(page),
      totalPages,
      limit: Number(limit),
    };

    const decisionCounts = {
      pending: totalPending,
      approved: totalApproved,
      rejected: totalRejected
    };

    generateResponse(res, 200, true, "Users fetched successfully", { users, paginationInfo, decisionCounts });
  } catch (error) {
    console.error(error);
    generateResponse(res, 500, false, "Failed to fetch users", null);
  }
};
