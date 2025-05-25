const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  details: { type: Map, of: String }, // to store key-value pairs
  date: { type: Date, default: Date.now },
  read: { type: Boolean, default: false }
});

const UserSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },

  age: { type: Number },
  gender: { type: String, enum: ['Male', 'Female', 'Other'] },
  bloodGroup: {
    type: String, 
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] 
  },
  location: { type: String },
  donorStatus: { type: String, enum: ['Regular', 'Occasional'], default: 'Occasional' },
  lastDonation: { type: Date },
  availability: { type: Boolean, default: false },
  phone: { type: String },

  emergencyAvailability: { type: Boolean, default: false },

  notifications: [NotificationSchema]
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
