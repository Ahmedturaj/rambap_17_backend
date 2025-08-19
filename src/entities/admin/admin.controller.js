import { generateResponse } from "../../lib/responseFormate.js";
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
