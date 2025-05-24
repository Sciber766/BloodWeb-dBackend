const mongoose = require('mongoose');
const User = require('./models/User'); // Adjust path as needed

async function deleteUser() {
  try {
    await mongoose.connect('mongodb+srv://naman:Sciber766@cluster0.ofnbch7.mongodb.net/bloodweb?retryWrites=true&w=majority'); // No extra options needed now

    const result = await User.deleteOne({ email: "www.skynetc52@gmail.com" });
    console.log('Delete result:', result);

    await mongoose.disconnect();
  } catch (err) {
    console.error('Error deleting user:', err);
  }
}

deleteUser();
