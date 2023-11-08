const path = require("path");
const DataSource = require("../../lib/dataSource");
const bodyParser = require("../../lib/bodyParser");
const { UserCar } = require("../../lib/userCarClass");
const { Transaction } = require("../../lib/transactionClass");

const userCarDatabasePath = path.join(
  __dirname,
  "../../database",
  "user_cars.json"
);
const carDatabasePath = path.join(__dirname, "../../database", "cars.json");
const userDatabasePath = path.join(__dirname, "../../database", "users.json");
const transactionDatabasePath = path.join(__dirname, "../../database", "transaction.json");


const userCarData = new DataSource(userCarDatabasePath);
const carData = new DataSource(carDatabasePath);
const userData = new DataSource(userDatabasePath);
const transactionData = new DataSource(transactionDatabasePath);

class UserCarModule {
  static getUserCarByUserId(req, res, userId) {
    const userCars = userCarData.read();

    const cars = carData.read();

    const filterCars = [];

    for (let i = 0; i < cars.length; i++) {
      const car = cars[i];

      for (let l = 0; l < userCars.length; l++) {
        const userCar = userCars[l];

        if (car.id === userCar.car_id && userCar.user_id === userId) {
          filterCars.push(car);
        }
      }
    }

    res.writeHead(200, { "Content-Type": "Application/json" });
    res.end(JSON.stringify(filterCars));
  }
  static getUserCarByCarId(req, res, carId) {
    const userCars = userCarData.read();

    const users = userData.read();

    const filterUsers = [];

    for (let i = 0; i < users.length; i++) {
      const user = users[i];

      for (let l = 0; l < userCars.length; l++) {
        const userCar = userCars[l];

        if (
          user.id === userCar.user_id &&
          userCar.car_id === carId
        ) {
          filterUsers.push(user);
        }
      }
    }

    res.writeHead(200, { "Content-Type": "Application/json" });
    res.end(JSON.stringify(filterUsers));
  }
  static async postUserCarData(req,res){
    
    const body = await bodyParser(req);

    if (!body.userId || !body.carId) {
      res.writeHead(400, { "Content-Type": "Application/json" });
      return res.end(JSON.stringify("userId and carId must be required"));
    }

    const users = userData.read();
    const cars = carData.read();

    const foundUser = users.find((user) => user.id === body.userId);
    const foundCar = cars.find((car) => car.id === body.carId);

    if (!foundUser) {
      res.writeHead(404, { "Content-Type": "Application/json" });
      return res.end(JSON.stringify("user not found"));
    }
    if (!foundCar) {
      res.writeHead(404, { "Content-Type": "Application/json" });
      return res.end(JSON.stringify("car not found"));
    }

    if (foundCar.count === 0) {
      res.writeHead(400, { "Content-Type": "Application/json" });
      return res.end(JSON.stringify("car have not got"));
    }

    if (foundUser.balance < foundCar.price) {
      res.writeHead(400, { "Content-Type": "Application/json" });
      return res.end(JSON.stringify("user balance is not enough"));
    }

    const filterUsers = users.filter((user) => user.id !== foundUser.id);

    foundUser.balance = foundUser.balance - foundCar.price;

    filterUsers.push(foundUser);

    userData.write(filterUsers);

    const filterCars = cars.filter((car) => car.id !== foundCar.id);

    foundCar.count = foundCar.count - 1;

    filterCars.push(foundCar);

    carData.write(filterCars);

    const userCars = userCarData.read();

    const foundUserCar = userCars.find(
      (userCar) =>
        userCar.user_id === body.userId && userCar.car_id === body.carId
    );

    if (foundUserCar) {
      res.writeHead(400, { "Content-Type": "Application/json" });
      return res.end(JSON.stringify("This user already had a car"));
    }

    let generateId = 0;

    for (let i = 0; i < userCars.length; i++) {
      const userCar = userCars[i];

      if (generateId < userCar.id) {
        generateId = userCar.id;
      }
    }

    const newUserCar = new UserCar(generateId + 1, body.userId, body.carId);

    userCars.push(newUserCar);

    userCarData.write(userCars);

    const transactions = transactionData.read();

    let generateTrId = 0;

    for (let j = 0; j < transactions.length; j++) {
      const transaction = transactions[j];

      if (generateTrId < transaction.id) {
        generateTrId = transaction.id;
      }
    }

    const newTransaction = new Transaction(
      generateTrId + 1,
      body.userId,
      body.carId,
      foundCar.price,
      "chiqim"
    );

    transactions.push(newTransaction);

    transactionData.write(transactions);

    res.writeHead(201, { "Content-Type": "Application/json" });
    res.end(JSON.stringify(newUserCar));
  }
  static async deleteUserCar(req,res,userId, carId){
    // const userId = Number(url[2]);
    //   const carId = Number(url[3]);

      const userCars = await userCarData.readAsync();

      const founUserCarIndex = userCars.findIndex(
        (userCar) => userCar.user_id === userId && userCar.car_id === carId
      );

      if (founUserCarIndex === -1) {
        res.writeHead(404, { "Content-Type": "Application/json" });
        return res.end(JSON.stringify("userCar not found"));
      }

      const users = userData.read();
      const cars = carData.read();

      let foundUser;
      let foundCar;

      const usersFilter = users.filter((user) => {
        if (user.id !== userId) {
          return true;
        } else {
          foundUser = user;
        }
      });

      const carsFilter = cars.filter((car) => {
        if (car.id !== carId) {
          return true;
        } else {
          foundCar = car;
        }
      });

      foundUser.balance = foundUser.balance + foundCar.price;
      foundCar.count = foundCar.count + 1;

      usersFilter.push(foundUser);
      carsFilter.push(foundCar);

      const transactions = transactionData.read();

      let generateTrId = 0;

      for (let j = 0; j < transactions.length; j++) {
        const transaction = transactions[j];

        if (generateTrId < transaction.id) {
          generateTrId = transaction.id;
        }
      }

      const newTransaction = new Transaction(
        generateTrId + 1,
        userId,
        carId,
        foundCar.price,
        "kirim"
      );

      transactions.push(newTransaction);

      const [deleteUserCar] = userCars.splice(founUserCarIndex, 1);

      userData.write(usersFilter);
      carData.write(carsFilter);
      transactionData.write(transactions);
      userCarData.write(userCars);

      res.writeHead(200, { "Content-Type": "Application/json" });
      return res.end(JSON.stringify(deleteUserCar));
  }
}

module.exports = UserCarModule;
