const mongoose = require('mongoose');
let Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
require('dotenv').config();

let userSchema = new Schema({
    userName: {
        type: String,
        unique: true,
    },
    password: String,
    email: String,
    loginHistory: [{
        dateTime: Date,
        userAgent: String
    }],
})
let User; // to be defined on new connection (see initialize)

function initialize(){
    return new Promise((resolve, reject)=> {
        let db = mongoose.createConnection(process.env.MONGODB);

        db.on('error', (err)=>{
            reject(err);
        });
        db.once('open', ()=>{
           User = db.model("users", userSchema);
           resolve();
        });
    });

}

function registerUser(userData) {
    return new Promise((resolve, reject) => {
      if (userData.password !== userData.password2) {
        reject(new Error("Passwords do not match"));
        return;
      }
      bcrypt.hash(userData.password, 10)
        .then((hashedPassword) => {
          userData.password = hashedPassword;
          const newUser = new User(userData);
          newUser.save()
            .then(() => {
              resolve();
            })
            .catch((err) => {
              reject(new Error(`There was an error creating the user: ${err.message}`));
            });
        })
        .catch((err) => {
          reject(new Error("There was an error encrypting the password"));
        });
    });
  }
  function checkUser(userData) {
    return new Promise((resolve, reject) => {
        User.find({ userName: userData.userName })
            .exec()
            .then((users) => {
                if (users.length === 0) {
                    reject(`Unable to find user: ${userData.userName}`);
                } else {
                    const user = users[0];
                    bcrypt.compare(userData.password, user.password).then((result) => {
                        if (result) {
                            if (user.loginHistory.length === 8) {
                                user.loginHistory.pop();
                            }
                            const loginHistoryObj = { dateTime: new Date(), userAgent: userData.userAgent };
                            user.loginHistory.unshift(loginHistoryObj);

                            User.updateOne({ userName: user.userName }, { $set: { loginHistory: user.loginHistory } })
                                .exec()
                                .then(() => {
                                    resolve(user);
                                })
                                .catch((err) => {
                                    reject(`There was an error updating login history: ${err}`);
                                });
                        } else {
                            reject(`Incorrect Password for user: ${userData.userName}`);
                        }
                    })
                    .catch((err) => {
                        reject(`Credentials incorrect: ${err}`);
                    });
                }
            })
            .catch((err) => {
                reject(`Unable to find user: ${userData.userName}`);
            });
    });
}



module.exports = { initialize,registerUser,checkUser }