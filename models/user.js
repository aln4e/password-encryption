'use strict';
const crypto = require('crypto')
const uuid = require('uuid/v1')

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    encryptedPassword: {type: DataTypes.STRING,
                      allowNull: false},
    authToken: DataTypes.STRING,
    authTokenExpiration: DataTypes.DATE,
    salt: DataTypes.STRING
  }, {
      setterMethods:{
        password(value){
            if(value){
              //our salt will use the uuid npm package
              const salt = uuid()
              //define the data value for salt in the User model to whatever the random salt from the previous line
              this.setDataValue('salt', salt)
              //takes the value that the user types and runs the encrypt instanceMethod (below) on the password
              const hash = this.encrypt(value)
              //define the data value for encrypted password in the User model to the hash on previous line
              this.setDataValue('encryptedPassword', hash)
            }
        }
      },
    instanceMethods:{
      encrypt(value){
        //this calls the salt in the User model
        const salt = this.get('salt')
        //sha512 is the hasher encryption we're using. We'll append the salt to our password
        return crypto.createHmac('sha512', salt)
        //this is the desired password
          .update(value)
          //digest returns the encrypted value of the combined password+salt.
          .digest('hex')
      },

      verifyPassword(unverifiedPassword){
        //encrypt unverifiedPassword
        const encryptedUnverifiedPassword = this.encrypt(unverifiedPassword)

        //compare encryptedUnverifiedPassword with password
        return encryptedUnverifiedPassword === this.get('encryptedPassword')
      },
    },
  });
  return User;
};
