const path = require("path");
const mongoose = require("mongoose");
const { randomBytes, createHmac } = require("crypto");
const authController = require(path.join(
  __dirname,
  "./../controllers/auth-controller"
));

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    salt: {
      type: String,
    },
    profileImageURL: {
      type: String,
      default: "/images/default.jpg",
    },
    role: {
      type: String,
      default: "User",
      enum: ["User", "Admin"],
    },
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
  const user = this;

  if (!user.isModified("password")) return next();

  const salt = randomBytes(16).toString();
  const hashedPassword = createHmac("sha512", salt)
    .update(user.password)
    .digest("hex");

  this.salt = salt;
  this.password = hashedPassword;

  next();
});

userSchema.statics.matchPasswordAndGenerateToken = async function (
  email,
  password
) {
  const user = await this.findOne({ email });
  if (!user) throw new Error("Invalid Email or Passsword");

  const salt = user.salt;
  const hashedPassword = user.password;

  const userProvidedHash = createHmac("sha512", salt)
    .update(password)
    .digest("hex");

  if (hashedPassword !== userProvidedHash)
    throw new Error("Invalid Email or Passsword");

  const token = authController.createTokenForUser(user);

  return token;
};

const User = mongoose.model("user", userSchema);

module.exports = User;
