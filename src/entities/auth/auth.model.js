import RoleType from '../../lib/types.js';
import mongoose from 'mongoose';
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';
import { accessTokenExpires, accessTokenSecrete, refreshTokenExpires, refreshTokenSecrete } from '../../core/config/config.js';

// ---------- SCHEMAS ----------

const personalInfoSchema = new mongoose.Schema({
  firstName: { type: String, default: '' },
  lastName: { type: String, default: '' },
  dateOfBirth: { type: Number, default: null }, // can be timestamp
  gender: { type: String, default: '' }
}, { _id: false });

const addressSchema = new mongoose.Schema({
  address: { type: String, default: '' },
  city: { type: String, default: '' },
  state: { type: String, default: '' },
  zipCode: { type: String, default: '' },
}, { _id: false });

const financialInfoSchema = new mongoose.Schema({
  annualIncome: { type: Number, default: 0 },
  valueOfLandOwnership: { type: Number, default: 0, required: true },
  electricityBill: { type: Number, default: 0, required: true },
  mobileBalance: { type: Number, default: 0 }, // added for credit score calculation
  existingLoan: {
    hasLoan: { type: Boolean, enum: [true, false], default: false },
    loanAmount: { type: Number, default: 0 }, // only relevant if hasLoan = true
  },
}, { _id: false });

// ---------- USER SCHEMA ----------

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  phone: { type: Number, required: true },
  password: { type: String, required: true },

  role: {
    type: String,
    enum: [RoleType.USER, RoleType.ADMIN],
    default: RoleType.USER,
  },
  personalInfo: { type: personalInfoSchema, default: () => ({}) },
  address: { type: addressSchema, default: () => ({}) },
  financialInfo: { type: financialInfoSchema, default: () => ({}) }, // fixed typo

  profileImage: { type: String, default: '' },
  multiProfileImage: { type: [String], default: [] },
  pdfFile: { type: String, default: '' },
  decision: {
    isApproved: {
      type: Boolean,
      enum: [true, false],
      default: false,
    },
    approveDetail: {
      loanAmount: { type: Number, default: 0 },
      interestRate: { type: Number, default: 0 },
      term: { type: Number, default: 0 },
      notes: { type: String, default: '' }
    },
    isRejected: {
      type: Boolean,
      enum: [true, false],
      default: false,
    },
    rejectionReason: { type: String, default: '' },
  },
  otp: { type: String, default: null },
  otpExpires: { type: Date, default: null },

  isVerified: { type: Boolean, default: false },
  refreshToken: { type: String, default: '' },

  hasActiveSubscription: { type: Boolean, default: false },
  subscriptionExpireDate: { type: Date, default: null },
  blockedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  language: { type: String, default: 'en' }

}, { timestamps: true });

// ---------- PASSWORD HASHING ----------
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// ---------- PASSWORD COMPARISON ----------
UserSchema.methods.comparePassword = async function (id, plainPassword) {
  const { password: hashedPassword } = await User.findById(id).select('password');
  return await bcrypt.compare(plainPassword, hashedPassword);
}

// ---------- TOKEN GENERATION ----------
UserSchema.methods.generateAccessToken = function (payload) {
  return jwt.sign(payload, accessTokenSecrete, { expiresIn: accessTokenExpires });
};

UserSchema.methods.generateRefreshToken = function (payload) {
  return jwt.sign(payload, refreshTokenSecrete, { expiresIn: refreshTokenExpires });
};

// ---------- EXPORT MODEL ----------
const User = mongoose.models.User || mongoose.model('User', UserSchema);
export default User;
