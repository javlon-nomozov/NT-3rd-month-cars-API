const http = require("http");
const { isBoolean } = require("./lib/isBoolean");
const UserModule = require("./modules/user/user.module");
const CarModule = require("./modules/car/car.module");
const UserCarModule = require("./modules/userCar/userCar.module");

const moduls = async (req, res) => {
  const url = req.url.split("/");
  const method = req.method;
  const now = new Date()
  // logger
  console.log(`${req.method}: ${req.url} at  ${now}`)
  try {
    // status code larni  ? "" : "" <-- bular bilan qib bo'madi shuning uchun buardan oldinga 
    res.writeHead(400, { "Content-Type": "Application/json" });
    (method === "GET" && url[1] === "user" && !url[2])?UserModule.getUsers(req, res): (method === "GET" && url[1] === "user" && url[2])? UserModule.getUserById(req, res, Number(url[2])): (method === "POST" && url[1] === "user") ? await UserModule.createUser(req, res): (method === "PUT" && url[1] === "user" && url[2])? await UserModule.updateUser(req, res, Number(url[2])): (method === "DELETE" && url[1] === "user" && url[2]) ? UserModule.deleteUser(req, res, Number(url[2])) : (method === "GET" && url[1] === "car" && !url[2]) ? CarModule.getCars(req, res) : (method === "GET" && url[1] === "car" && url[2]) ? CarModule.getCarById(req, res, Number(url[2])) : (method === "POST" && url[1] === "car") ? await CarModule.createCar(req, res) : (method === "PUT" && url[1] === "car" && url[2]) ? CarModule.updateCar(req, res, Number(url[2])) : ( method === "GET" && url[1] === "user-car" && url[2] === "user" && url[3]) ? UserCarModule.getUserCarByUserId(req, res, Number(url[3])) : ( method === "GET" && url[1] === "user-car" && url[2] === "car" && url[3]) ? UserCarModule.getUserCarByCarId(req, res, Number(url[3])) : (method === "POST" && url[1] === "user-car") ? await UserCarModule.postUserCarData(req, res) : (method === "DELETE" && url[1] === "user-car" && url[2] && url[3]) ? UserCarModule.deleteUserCar(req, res, Number(url[2]),Number(url[3])) : res.end(JSON.stringify("Method is not allowed"))
    
    /* if (method === "GET" && url[1] === "user" && !url[2]) {
      // UserModule.getUsers(req, res);
    // } else if (method === "GET" && url[1] === "user" && url[2]) {
      // UserModule.getUserById(req, res, Number(url[2]));
    // } else if (method === "POST" && url[1] === "user") {
      // await UserModule.createUser(req, res);
    // } else if (method === "PUT" && url[1] === "user" && url[2]) {
      // await UserModule.updateUser(req, res, Number(url[2]));
    // } else if (method === "DELETE" && url[1] === "user" && url[2]) {
      // UserModule.deleteUser(req, res, Number(url[2]));
    // } else if (method === "GET" && url[1] === "car" && !url[2]) {
      // CarModule.getCars(req, res);
    // } else if (method === "GET" && url[1] === "car" && url[2]) {
      // CarModule.getCarById(req, res, Number(url[2]));
    // } else if (method === "POST" && url[1] === "car") {
      // await CarModule.createCar(req, res);
    // } else if (method === "PUT" && url[1] === "car" && url[2]) {
      // CarModule.updateCar(req, res, Number(url[2]));
    // } else if (
    //   method === "GET" &&
    //   url[1] === "user-car" &&
    //   url[2] === "user" &&
    //   url[3]
    // ) {
      // UserCarModule.getUserCarByUserId(req, res, Number(url[3]));
    // } else if (
    //   method === "GET" &&
    //   url[1] === "user-car" &&
    //   url[2] === "car" &&
    //   url[3]
    // ) {
      // UserCarModule.getUserCarByCarId(req, res, Number(url[3]));
    // } else if (method === "POST" && url[1] === "user-car") {
      await UserCarModule.postUserCarData(req, res);
    } else if (
      method === "DELETE" &&
      url[1] === "user-car" &&
      url[2] &&
      url[3]
    ) {
      UserCarModule.deleteUserCar(req, res, Number(url[2]),Number(url[3]))
      
    } else {
      res.writeHead(405, { "Content-Type": "Application/json" });
      res.end(JSON.stringify("Method not allowed"));
    }*/

  } catch (error) {
    // status code larni  ? "" : "" <-- bular bilan qib bo'madi shuning uchun buardan oldinga 
    res.writeHead(400, { "Content-Type": "Application/json" })
    (isBoolean(error)) ? res.end(JSON.stringify("Bady must be required")) : res.end(JSON.stringify(error.message ?? "Server error"))
    
    // res.writeHead(500, { "Content-Type": "Application/json" });
    
  }
};

const server = http.createServer(moduls);

const port = 7777;

server.listen(port, () => {
  console.log(`server running on port: ${port}`);
});
