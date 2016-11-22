// Third-party modules
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

// User schema
const userSchema = mongoose.Schema({
    username: String,
    password: String
});

// Compare passwords
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model("User", userSchema);