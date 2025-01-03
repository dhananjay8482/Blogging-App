const {Schema, model} = require('mongoose');
const {createHmac, randomBytes, hex} = require("crypto");
const { create } = require('domain');
const { createTokenForUser } = require('../services/authentication');

const userSchema = new Schema({
    fullName:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
    },
    salt:{
        type: String,
        // required: true,
    },
    password:{
        type: String,
        required: true,
    },
    profileImageURL :{
        type: String,
        default: '/images.default.png'
    },
    enum: {
        type: String,
        enum: ['USER', 'ADMIN'],
        default: 'USER'
    }
}, {timestamps: true})

userSchema.pre("save", function(next){
    const user = this;
    if(!user.isModified('password')) return;
    const salt = randomBytes(16).toString();
    const hashedPassword = createHmac("sha256", salt).update(user.password).digest(hex);

    this.salt = salt;
    this.password = hashedPassword;
    next();
})

// virtual function to check hashed passowrd and user main passsword
userSchema.static("matchPasswordAndGenerateToken", async function(email, password){
    const user = await this.findOne({email});
    if(!user) throw new Error('User not found!');
    
    const salt = user.salt;
    const hashedPassword = user.password;
    
    const userProvidedHashed = createHmac("sha256", salt)
    .update(password)
    .digest(hex);
    
    if(hashedPassword!=userProvidedHashed) throw new Error('Incorrect password');
    // return {...user, password: undefined, salt: undefined} ;
    const token = createTokenForUser(user);
    return token;
} )

const User = model("user", userSchema);

module.exports = User;