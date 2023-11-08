const path = require("path");
const DataSource = require("../../lib/dataSource");
const bodyParser = require("../../lib/bodyParser");
const { User } = require("../../lib/userClass");

const userDatabasePath = path.join(__dirname, "../../database", "users.json");
const userData = new DataSource(userDatabasePath);

class UserModule {
  static getUsers(req, res) {
    const users = userData.read();

    res.writeHead(200, { "Content-Type": "Application/json" });
    res.end(JSON.stringify(users));
  }

  static getUserById(req, res, userId) {
    const users = userData.read();

    const foundUser = users.find((user) => user.id === userId);

    if (foundUser) {
      res.writeHead(200, { "Content-Type": "Application/json" });
      res.end(JSON.stringify(foundUser));
    } else {
      res.writeHead(404, { "Content-Type": "Application/json" });
      res.end(JSON.stringify("User not found"));
    }
  }

  static async createUser(req, res) {
    const body = await bodyParser(req);

    if (!body.fullName || !body.login || isNaN(body.balance)) {
      res.writeHead(400, { "Content-Type": "Application/json" });
      return res.end(
        JSON.stringify("fullName and login and balance must be required")
      );
    }

    const users = userData.read();

    const foundUserByLogin = users.find((user) => user.login === body.login);

    if (foundUserByLogin) {
      res.writeHead(400, { "Content-Type": "Application/json" });
      return res.end(JSON.stringify("This login already exist"));
    }

    let generateId = 0;

    users.forEach((user) => {
      if (generateId < user.id) {
        generateId = user.id;
      }
    });

    const newUser = new User(
      generateId + 1,
      body.fullName,
      body.login,
      body.balance
    );

    users.push(newUser);

    userData.write(users);

    res.writeHead(201, { "Content-Type": "Application/json" });
    res.end(JSON.stringify(newUser));
  }

  static async updateUser(req, res, userId) {
    const body = await bodyParser(req);

    if (!body.fullName || !body.login || isNaN(body.balance)) {
      res.writeHead(400, { "Content-Type": "Application/json" });
      return res.end(JSON.stringify("fullName must be required"));
    }

    const users = userData.read();

    const foundUserIndex = users.findIndex((user) => user.id === userId);

    const foundUserByLogin = users.find((user) => user.login === body.login);

    if (foundUserIndex === -1) {
      res.writeHead(404, { "Content-Type": "Application/json" });
      return res.end(JSON.stringify("User not found"));
    }

    const [foundUser] = users.splice(foundUserIndex, 1);

    if (foundUserByLogin && foundUser.login !== body.login) {
      res.writeHead(400, { "Content-Type": "Application/json" });
      return res.end(JSON.stringify("This login already exist"));
    }

    foundUser.full_name = body.fullName;
    foundUser.login = body.login;
    foundUser.balance = body.balance;

    users.push(foundUser);

    userData.write(users);

    res.writeHead(200, { "Content-Type": "Application/json" });
    return res.end(JSON.stringify(foundUser));
  }

  static deleteUser(req, res, userId) {
    const users = userData.read();

    const foundUserIndex = users.findIndex((user) => user.id === userId);

    if (foundUserIndex === -1) {
      res.writeHead(404, { "Content-Type": "Application/json" });
      return res.end(JSON.stringify("User not found"));
    }

    const [deletedUser] = users.splice(foundUserIndex, 1);

    userData.write(users);

    res.writeHead(200, { "Content-Type": "Application/json" });
    res.end(JSON.stringify(deletedUser));
  }
}

module.exports = UserModule;
