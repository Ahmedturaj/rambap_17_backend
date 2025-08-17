import RoleType from '../../lib/types.js';
import mongoose from 'mongoose';
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';
import { accessTokenExpires, accessTokenSecrete, refreshTokenExpires, refreshTokenSecrete } from '../../core/config/config.js';


const personalInfoSchema = new mongoose.Schema({
  firstName: { type: String, default: '' },
  lastName: { type: String, default: '' },
  dateOfBirth: { type: Number, default: null },
  gender: { type: String, default: '' }
}, { _id: false });

const AddressSchema = new mongoose.Schema({
  address: { type: String, default: '' },
  city: { type: String, default: '' },
  state: { type: String, default: '' },
  zipCode: { type: String, default: '' },
}, { _id: false });

const FinancialInfoSchema= new mongoose.Schema({
  annualIncome:{type:Number, default:''},
  employmantStatus:{type:String, enum:["employee", "unemployee"], default:''},
  ellectricityBill:{
    type:Number,
    default:''
  }
  
}, {_id:false})

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    phone:{type:Number, required:true}
    password: { type: String, required: true },


    role: {
      type: String,
      default: RoleType.USER,
      enum: [RoleType.USER, RoleType.ADMIN],
    },
    personalInfo: { type: personalInfoSchema, default: () => ({}) },
    address: { type: AddressSchema, default: () => ({}) },
    financeialInfo: { type: FinancialInfoSchema, default: () => ({}) },
    profileImage: { type: String, default: '' },
    multiProfileImage: { type: [String], default: [] },
    pdfFile: { type: String, default: '' },

    otp: {
      type: String,
      default: null
    },

    otpExpires: {
      type: Date,
      default: null
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    refreshToken: {
      type: String,
      default: ''
    },

    hasActiveSubscription: { type: Boolean, default: false },
    subscriptionExpireDate: { type: Date, default: null },
    blockedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    language: { type: String, default: 'en' }
  },
  { timestamps: true }
);


// Hashing password
UserSchema.pre("save", async function (next) {

  if (!this.isModified("password")) return next();

  const hashedPassword = await bcrypt.hash(this.password, 10);

  this.password = hashedPassword;
  next();
});

// Password comparison method (bcrypt)
UserSchema.methods.comparePassword = async function (id, plainPassword) {
  const { password: hashedPassword } = await User.findById(id).select('password')

  const isMatched = await bcrypt.compare(plainPassword, hashedPassword)

  return isMatched
}

// Generate ACCESS_TOKEN
UserSchema.methods.generateAccessToken = function (payload) {
  return jwt.sign(payload, accessTokenSecrete, { expiresIn: accessTokenExpires });
};

// Generate REFRESH_TOKEN
UserSchema.methods.generateRefreshToken = function (payload) {
  return jwt.sign(payload, refreshTokenSecrete, { expiresIn: refreshTokenExpires });
};

const User = mongoose.models.User || mongoose.model('User', UserSchema);
export default User;