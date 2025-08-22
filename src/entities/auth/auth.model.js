import RoleType from '../../lib/types.js';
import mongoose from 'mongoose';
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';
import { accessTokenExpires, accessTokenSecrete, refreshTokenExpires, refreshTokenSecrete } from '../../core/config/config.js';


const personalInfoSchema = new mongoose.Schema({
  firstName: { type: String, default: '' },
  lastName: { type: String, default: '' },
  dateOfBirth: { type: Date, default: null }, 
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
  mobileBalance: { type: Number, default: 0 }, 
  existingLoan: {
    hasLoan: { type: Boolean, default: false },
    loanAmount: { type: Number, default: 0 }, 
  },
}, { _id: false });


const decisionSchema = new mongoose.Schema({
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  approveDetail: {
    loanAmount: { type: Number },
    interestRate: { type: Number },
    term: { type: Number },
    notes: { type: String }
  },
  rejectionReason: { type: String }
}, { _id: false });


// ---------- USER SCHEMA ----------

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },

  role: {
    type: String,
    enum: [RoleType.USER, RoleType.ADMIN],
    default: RoleType.USER,
  },
  personalInfo: { type: personalInfoSchema, default: () => ({}) },
  address: { type: addressSchema, default: () => ({}) },
  financialInfo: { type: financialInfoSchema, default: () => ({}) },
  requestedLoan: { type: Number, default: 0 },
  profileImage: { type: String, default: '' },
  multiProfileImage: { type: [String], default: [] },
  pdfFile: { type: String, default: '' },
  decision: { type: decisionSchema, default: () => ({}) },
  otp: { type: String, default: null },
  otpExpires: { type: Date, default: null },

  isVerified: { type: Boolean, default: false },
  refreshToken: { type: String, default: '' },

  hasActiveSubscription: { type: Boolean, default: false },
  subscriptionExpireDate: { type: Date, default: null },
  blockedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  language: { type: String, default: 'en' },
  isComplete: { type: Boolean, default: false }

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


const User = mongoose.models.User || mongoose.model('User', UserSchema);
export default User;