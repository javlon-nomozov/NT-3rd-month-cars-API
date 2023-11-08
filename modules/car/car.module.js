const path = require("path");
const DataSource = require("../../lib/dataSource");
const bodyParser = require("../../lib/bodyParser");
const { Car } = require("../../lib/carClass");

const carDatabasePath = path.join(__dirname, "../../database", "cars.json");
const carData = new DataSource(carDatabasePath);

class CarModule {
  static getCars(req, res) {
    const cars = carData.read();
    res.writeHead(200, { "Content-Type": "Application/json" });
    res.end(JSON.stringify(cars));
  }

  static getCarById(req, res, carId) {
    const cars = carData.read();

    const foundCar = cars.find((car) => car.id === carId);

    if (!foundCar) {
      res.writeHead(404, { "Content-Type": "Application/json" });
      return res.end(JSON.stringify("Car not found"));
    }

    res.writeHead(200, { "Content-Type": "Application/json" });
    res.end(JSON.stringify(foundCar));
  }

  static async createCar(req, res) {
    const body = await bodyParser(req);
    const cars = carData.read();

    if (!body.model || isNaN(body.count) || isNaN(body.price)) {
      res.writeHead(400, { "Content-Type": "Application/json" });
      return res.end(
        JSON.stringify("model and count and price must be required")
      );
    }
    if (cars.some((car)=>car.model == body.model)) {
      res.writeHead(403, { "Content-Type": "Application/json" });
      return res.end(
        JSON.stringify("This model already exist")
      );
    }


    let generateId = 0;

    for (let i = 0; i < cars.length; i++) {
      const car = cars[i];

      if (generateId < car.id) {
        generateId = car.id;
      }
    }

    const newCar = new Car(generateId + 1, body.model, body.count, body.price);

    cars.push(newCar);

    carData.write(cars);

    res.writeHead(201, { "Content-Type": "Application/json" });
    return res.end(JSON.stringify(newCar));
  }

  static async updateCar(req, res, carId) {
    const body = await bodyParser(req);

    if (!body.model || isNaN(body.count) || isNaN(body.price)) {
      res.writeHead(400, { "Content-Type": "Application/json" });
      return res.end(
        JSON.stringify("model and count and price must be required")
      );
    }

    const cars = carData.read();

    let foundCar;

    const filterCars = cars.filter((car) => {
      if (car.id !== carId) {
        return true;
      } else {
        foundCar = car;
      }
    });

    if (!foundCar) {
      res.writeHead(404, { "Content-Type": "Application/json" });
      return res.end(JSON.stringify("Car not found"));
    }

    foundCar.model = body.model;
    foundCar.count = body.count;
    foundCar.price = body.price;

    filterCars.push(foundCar);

    carData.write(filterCars);

    res.writeHead(201, { "Content-Type": "Application/json" });
    return res.end(JSON.stringify(foundCar));
  }

  static deleteUser(req, res, carId) {}
}

module.exports = CarModule;
