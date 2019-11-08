const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({

    email: {
        type: String,
        unique: true,
        required: true
    },

    password: {
        type: String,
        required: true
    },

},{timestamps:true});


userSchema.pre('save', function(next) {
    const user = this;
    if(!user.isModified('password')) {
        return next();
    }
    bcrypt.genSalt(10, (err,salt) => {
        if (err) {
            return next(err);
        }

        bcrypt.hash(user.password, salt, (err, hash) => {
            if(err) {
                return next(err);
            }
            user.password = hash;
            next();
        });
    });
});

userSchema.methods.comparePassword = function (candidatePassword) {
    const user = this;

    return new Promise((resolve, reject) => {
        bcrypt.compare(candidatePassword, user.password, (err, isMatch) => {
            if (err) {
                return reject(err);
            }

            if (!isMatch) {
                return reject(false);
            }

            resolve(true);
        });
    });
}

mongoose.model('User', userSchema);





const messageSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    title: {type: String,},

    content: {type: String,},

    users: [userSchema],

    user_who_like: [userSchema],
    user_who_dislike: [userSchema],
    user_who_wild: [userSchema],
    user_who_hide: [userSchema],
    user_who_report: [userSchema],

    // like: {type:Number},
    // dislike: {type:Number},
    // wild: {type:Number},

},{timestamps:true});


mongoose.model('Message', messageSchema);
