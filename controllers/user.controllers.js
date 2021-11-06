// const users = require("../models/users");
const db = require("../config/db.config");
const config = require("../config/auth.config");
const User = db.User;
const Op = db.Sequelize.Op;

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.createUser = (req, res) => {
  let user = {};

  try {
   
    // Building Product object from upoading request's body
    user.firstname = req.body.firstname;
    user.lastname = req.body.lastname;
    user.email = req.body.email;
    user.username = req.body.username;
    user.password= bcrypt.hashSync(req.body.password, 8);

    // Save to PostgreSQL database

    User.create(user).then((result) => {
        res.status(200).json({
            message: "Upload Successfully a User with id = " + result.id,
            user: result,
        });
    });
  } catch (error) {
    res.status(500).json({
      message: "Fail!",
      error: error.message,
    });
  }
};
exports.retrieveAllUser = (req, res) => {

    User.findAll()
        .then(userInfo => {
            res.status(200).json({
                message: "Get all user' Infos Successfully!",
                user: userInfo
            });
        })
        .catch(error => {
          // log on console
          console.log(error);

          res.status(500).json({
              message: "Error!",
              error: error
          });
        });
}

exports.getUserById = (req, res) => {
  // find all Product information from 
  let userId = req.params.id;
  User.findByPk(userId)
      .then(user => {
          res.status(200).json({
              message: " Successfully Get a User with id = " + userId,
              user: user
          });
      })
      . catch(error => {
        // log on console
        console.log(error);

        res.status(500).json({
            message: "Error!",
            error: error
        });
      });
}
exports.updateById = async (req, res) => {
    try{
        let userId = req.params.id;
        let user = await User.findByPk(userId);
    
        if(!user){
            // return a response to client
            res.status(404).json({
                message: "Not Found for updating a user with id = " + userId,
                user: "",
                error: "404"
            });
        } else {    
            // update new change to database
            let updatedObject = {
                firstname : req.body.firstname,
                lastname : req.body.lastname,
                email : req.body.email,
                username: req.body.username,
               
            }
            let result = await User.update(updatedObject, {returning: true, where: {id: userId}});
            
            // return the response to client
            if(!result) {
                res.status(500).json({
                    message: "Error -> Can not update a User with id = " + req.params.id,
                    error: "Can NOT Updated",
                });
            }

            res.status(200).json({
                message: "Update successfully a User with id = " + userId,
                user: updatedObject,
            });
        }
    } catch(error){
        res.status(500).json({
            message: "Error -> Can not update a User with id = " + req.params.id,
            error: error.message
        });
    }
}
exports.signin = (req, res) => {
    User.findOne({
      where: {
        username: req.body.username
      }
    })
      .then(user => {
        if (!user) {
          return res.status(404).send({ message: "User Not found." });
        }
  
        var passwordIsValid = bcrypt.compareSync(
          req.body.password,
          user.password
        );
  
        if (!passwordIsValid) {
          return res.status(401).send({
            accessToken: null,
            message: "Invalid Password!"
          });
        }
  
        var token = jwt.sign({ id: user.id }, config.secret, {
          expiresIn: 86400 // 24 hours
        });
  
       
          res.status(200).send({
            id: user.id,
            username: user.username,
            email: user.email,
            accessToken: token
          });
     
      })
      .catch(err => {
        res.status(500).send({ message: err.message });
      });
  };

exports.deleteById = async (req, res) => {
    try{
        let userId = req.params.id;
        let user = await User.findByPk(userId);

        if(!user){
            res.status(404).json({
                message: "Does Not exist a user with id = " + userid,
                error: "404",
            });
        } else {
            await user.destroy();
            res.status(200).json({
                message: "Delete Successfully a user with id = " + userId,
                user: user,
            });
        }
    } catch(error) {
        res.status(500).json({
            message: "Error -> Can NOT delete a user with id = " + req.params.id,
            error: error.message,
        });
    }
}

