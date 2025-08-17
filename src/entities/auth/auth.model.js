import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import RoleType from "../../lib/types.js";
import {
  accessTokenSecrete,
  refreshTokenSecrete,
  accessTokenExpires,
  refreshTokenExpires
} from "../../core/config/config.js";

const personalInfoSchema = new mongoose.Schema({
  firstName: { type: String, default: "" },
  lastName: { type: String, default: "" },
  dateOfBirth: { type: Date, default: null }, // changed to Date for age calc
  gender: { type: String, default: "" }
}, { _id: false });

const AddressSchema = new mongoose.Schema({
  address: { type: String, default: "" },
  city: { type: String, default: "" },
  state: { type: String, default: "" },
  zipCode: { type: String, default: "" },
}, { _id: false });

const FinancialInfoSchema = new mongoose.Schema({
  annualIncome: { type: Number, default: 0 },
  employmentStatus: { type: String, enum: ["employee", "unemployee"], default: "unemployee" },
  electricityBill: { type: Number, default: 0 },
  nbCredits: { type: Number, default: 0 },         // number of credits
  soldeMoMo: { type: Number, default: 0 },        // mobile money balance
  mtFacture: { type: Number, default: 0 },        // bill amount
  terrain: { type: Boolean, default: false },     // land ownership
}, { _id: false });

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    phone: { type: Number, required: true },
    password: { type: String, required: true },

    role: {
      type: String,
      default: RoleType.USER,
      enum: [RoleType.USER, RoleType.ADMIN],
    },

    personalInfo: { type: personalInfoSchema, default: () => ({}) },
    address: { type: AddressSchema, default: () => ({}) },
    financialInfo: { type: FinancialInfoSchema, default: () => ({}) },

    profileImage: { type: String, default: "" },
    otp: { type: String, default: null },
    otpExpires: { type: Date, default: null },
    isVerified: { type: Boolean, default: false },
    refreshToken: { type: String, default: "" },
    hasActiveSubscription: { type: Boolean, default: false },
    subscriptionExpireDate: { type: Date, default: null },
    blockedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    language: { type: String, default: "en" },

    // new fields for scoring
    creditScore: { type: Number, default: 300 }, 
    scoreCategory: { type: String, enum: ["Low", "Medium", "High"], default: "Low" },
    loanEligibility: { type: Number, default: 0 }
  },
  { timestamps: true }
);

// 🔐 Hash password before save
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

UserSchema.methods.comparePassword = async function (plainPassword) {
  return await bcrypt.compare(plainPassword, this.password);
};

UserSchema.methods.generateAccessToken = function (payload) {
  return jwt.sign(payload, accessTokenSecrete, { expiresIn: accessTokenExpires });
};

UserSchema.methods.generateRefreshToken = function (payload) {
  return jwt.sign(payload, refreshTokenSecrete, { expiresIn: refreshTokenExpires });
};

const User = mongoose.models.User || mongoose.model("User", UserSchema);
export default User;
