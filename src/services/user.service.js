const User = require('../models/user.model');
const { generateToken, generateResetToken, hashToken } = require('../utils/token.util');
const { sendPasswordResetEmail, sendWelcomeEmail } = require('../utils/email.util');

class UserService {
  
  async register(userData) {
    const { firstName, lastName, email, password } = userData;

    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error('User already exists with this email');
    }

    
    const user = await User.create({
      firstName,
      lastName,
      email,
      password
    });

    
    await sendWelcomeEmail(email, firstName);

    
    const token = generateToken(user._id);

    return {
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      },
      token
    };
  }

  
  async login(email, password) {
    
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isPasswordValid = await user.comparePassword(password);
    
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    
    const token = generateToken(user._id);

    return {
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      },
      token
    };
  }

  
  async forgotPassword(email) {
    const user = await User.findOne({ email });
    
    if (!user) {
      throw new Error('No user found with this email');
    }

    
    const resetToken = generateResetToken();
    const hashedToken = hashToken(resetToken);

    
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = Date.now() + 60 * 60 * 1000; // 1 hour
    await user.save();

    
    await sendPasswordResetEmail(email, resetToken);

    return { message: 'Password reset email sent' };
  }

  
  async resetPassword(resetToken, newPassword) {
    const hashedToken = hashToken(resetToken);

   
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      throw new Error('Invalid or expired reset token');
    }

    
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    return { message: 'Password reset successful' };
  }

  
  async getProfile(userId) {
    const user = await User.findById(userId);
    
    if (!user) {
      throw new Error('User not found');
    }

    return {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email
    };
  }
}

module.exports = new UserService();