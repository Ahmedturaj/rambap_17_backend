import User from "../auth/auth.model.js";


export const updateUserDecision = async (adminId, userId, decisionData) => {
  const { status, approveDetail, rejectionReason } = decisionData;

  // --- Validate status ---
  if (!["approved", "rejected", "pending"].includes(status)) {
    throw new Error(
      "Invalid decision status. Must be 'approved', 'rejected', or 'pending'."
    );
  }

  // --- Build update object ---
  const update = {
    decision: {
      status,
      approveDetail: undefined,
      rejectionReason: undefined,
      updatedBy: adminId,
      updatedAt: new Date()
    }
  };

  if (status === "approved") {
    if (
      !approveDetail ||
      !approveDetail.loanAmount ||
      !approveDetail.interestRate ||
      !approveDetail.term
    ) {
      throw new Error(
        "Approval details (loanAmount, interestRate, term) are required for approved decision."
      );
    }
    update.decision.approveDetail = approveDetail;
  }

  if (status === "rejected") {
    if (!rejectionReason) {
      throw new Error("Rejection reason is required for rejected decision.");
    }
    update.decision.rejectionReason = rejectionReason;
  }

  // --- Update user ---
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $set: update },
    { new: true }
  ).select("-password -refreshToken");

  if (!updatedUser) {
    throw new Error("User not found.");
  }

  return updatedUser;
};

