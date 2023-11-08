class User {
  constructor(id, fullName, login, balance) {
    this.id = id;
    this.full_name = fullName;
    this.login = login;
    this.balance = balance;
  }
}

module.exports = { User };
