const { BadRequestError, UnauthorizedError } = require("../utils/errors");
const db = require("../db");
const bcrypt = require("bcrypt");
const { BCRYPT_WORK_FACTOR } = require("../config");

class User {
  static async makePublicUser(user) {
    return {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      location: user.location,
      date: user.date,
    };
  }

  static async login(credentials) {
    // user should submit their email and password
    // if any of these fields are missing throw error
    const requiredFields = ["email", "password"];
    requiredFields.forEach((field) => {
      if (!credentials.hasOwnProperty(field)) {
        throw new BadRequestError(`Missing ${field} in request body`);
      }
    });
    // look up user in db by email
    const user = await User.fetchUserByEmail(credentials.email);
    // if a user is found, compare the submitted password
    // to the password in the db
    // if there is a match, return the user
    if (user) {
      const isValid = await bcrypt.compare(credentials.password, user.password);
      if (isValid) {
        return User.makePublicUser(user);
      }
    }
    // if any of this goes wrong, throw an error
    throw new UnauthorizedError("Invalid email/password combination");
  }

  static async register(credentials) {
    // user should submit their email and password
    // if any of those are missing, throw error
    const requiredFields = ["email", "password", "firstName", "lastName", "location", "date"];
    requiredFields.forEach((field) => {
      if (!credentials.hasOwnProperty(field)) {
        throw new BadRequestError(`Missing ${field} in request body`);
      }
    });

    if (credentials.email.indexOf("@") <= 0) {
      throw new BadRequestError("Invalid email");
    }
    // make sure no user already exists in system
    // with that same email. If so, throw error
    const existingUser = await User.fetchUserByEmail(credentials.email);
    if (existingUser) {
      throw new BadRequestError(`Duplicate email: ${email}`);
    }
    // take the users password and hash it
    const hashedPassword = await bcrypt.hash(credentials.password, BCRYPT_WORK_FACTOR);
    // take the users email and lowercase it
    const lowercasedEmail = credentials.email.toLowerCase();
    // create a new user in the db with all their info
    const result = await db.query(
      `
    INSERT INTO users (
      email,
      password,
      first_name,
      last_name,
      location,
      date
    )
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING id, email, first_name, last_name, location, date;
    `,
      [
        lowercasedEmail,
        hashedPassword,
        credentials.firstName,
        credentials.lastName,
        credentials.location,
        credentials.date,
      ]
    );
    // return the user
    const user = result.rows[0];
    return User.makePublicUser(user);
  }

  static async fetchUserByEmail(email) {
    if (!email) {
      throw new BadRequestError("No email provided.");
    }

    const query = "SELECT * FROM users WHERE email = $1";

    const result = await db.query(query, [email.toLowerCase()]);

    const user = result.rows[0];

    return user;
  }
}
module.exports = User;
