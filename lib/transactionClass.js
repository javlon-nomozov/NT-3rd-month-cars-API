class Transaction {
  constructor(id, userId, carId, price, status) {
    this.id = id;
    this.user_id = userId;
    this.car_id = carId;
    this.price = price;
    this.status = status;

    const date = new Date();
    const days = date.getDate();
    const months = date.getMonth() + 1;
    const years = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    this.date = `${days}-${months}-${years} ${hours}:${minutes}:${seconds}`;
  }
}

module.exports = { Transaction };
