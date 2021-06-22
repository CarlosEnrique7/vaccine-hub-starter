const { UnauthorizedError } = require("../utils/errors");
const db = require("../db");

class User {
  static async login(credentials) {
    // user should submit their email and password
    // if any of these fields are missing throw error
    //
    // look up user in db by email
    // if a user is found, compare the submitted password
    // to the password in the db
    // if there is a match, return the user
    //
    // if any of this goes wrong, throw an error
    throw new UnauthorizedError("Invalid email/password combination");
  }

  static async register(credentials) {
    // user should submit their email and password
    // if any of those are missing, throw error
    //
    // make sure no user already exists in system
    // with that same email. If so, throw error
    //
    // take the users password and hash it
    // take the users email and lowercase it
    //
    // create a new user in the db with all their info
    // return the user
  }
}
