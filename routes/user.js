//Requiring libraries
const express = require("express");
const bcrypt = require("bcrypt"); // bcrypt is used to hash password before saving it to database
const fs = require("fs"); // fs is node's inbuilt file system module used to manage files
const usersDb = require("../database/db.json"); // import existing data from db.json file
const utils = require("../utils");

const router = express.Router(); // we create a new router using express's inbuilt Router method

// user registration / sign-up
//Create a new user with the given email, name and hashed password
router.post("/sign-up", async (req, res) => {
  //get the name, email and password from the body
  const { name, email, password } = req.body;

  //make sure there is no existing user with this email
  const existingUser = usersDb.find((user) => user.email == email);
  if (existingUser) {
    //if there is, return an error
    res.status(400).send("User already exists");
    return;
  }

  //calculate the hash for the given password
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);

  //create the new user object with the email, name and hashed password
  const user = {
    id: usersDb.length,
    name: name,
    email: email,
    password: hashedPassword,
  };
  //push that user object into the userdb array
  usersDb.push(user);
  //save that userdb array to the filesystem as db.jso
  fs.writeFileSync("./database/db.json", JSON.stringify(usersDb));

  //generate a JWT for this user's ID
  const jwt = utils.generateJWT(user.id);

  //Return the JWT so they can start making authenticated requests

  res.status(201).send({ jwt: jwt });

  // try {
  //   const user = await usersDb.filter((user) => user.email === email);

  //   if (user.length > 0) {
  //     return res.status(400).json({ error: "User already exist!" });
  //   }

  //   const salt = await bcrypt.genSalt(10);
  //   const bcryptPassword = await bcrypt.hash(password, salt);

  //   let newUser = {
  //     id: usersDb.length,
  //     name: name,
  //     email: email,
  //     password: bcryptPassword,
  //   };

  //   usersDb.push(newUser); // we add newUser to usersDb array

  //   // we save the updated array to db.json file by using fs module of node

  //   await fs.writeFileSync("./database/db.json", JSON.stringify(usersDb));

  //   /* Once the user registration is done successfully, we will generate a
  //     jsonwebtoken and send it back to user. This token will be used for
  //     accessing other resources to verify identity of the user.

  //     The following generateJWT function does not exist till now but we
  //     will create it in the next step. */

  //   const jwtToken = generateJWT(newUser.id);

  //   return res.status(201).send({ jwtToken: jwtToken, isAuthenticated: true });
  // } catch (error) {
  //   console.error(error.message);
  //   res.status(500).send({ error: error.message });
  // }
});

router.post("/sign-in", function (req, res) {
  //get email and password from body
  const { email, password } = req.body;
  //find user with email address
  const user = usersDb.find((user) => user.email == email);
  if (!user) {
    //if none exists return error 404 - unauthorized
    res.status(401).send();
    return;
  }
  //get the hashedPassword from the user object and compare it to the password from body
  const hashedPassword = user.password;
  const isValid = bcrypt.compareSync(password, hashedPassword);
  if (!isValid) {
    //if they do not match return 401 - unauthorized
    res.status(401).send();
    return;
  }
  //calculate a jwt for this user's id
  const jwt = utils.generateJWT(user.id);
  //return it with status 200
  res.status(200).send({ jwt : jwt });
  return;
});

module.exports = router; // we need to export this router to implement it inside our server.js file
