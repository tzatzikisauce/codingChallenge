var Order = function(id, isBuyOrder, quantity, price, executedQuantity) {
  this.id = id;
  this.isBuyOrder = isBuyOrder;
  this.quantity = quantity;
  this.price = price;
  this.executedQuantity = executedQuantity;
}

class Exchange {
  constructor() {
    let fs = require("fs");
    this.buys = JSON.parse(fs.readFileSync('Buys.txt', 'utf8'));
    this.sells = JSON.parse(fs.readFileSync('Sells.txt', 'utf8'));
  }

  sync() {
    // SYNC Buys and Sells
    let fs = require("fs");
    fs.writeFileSync('Buys.txt', JSON.stringify(this.buys));
    fs.writeFileSync('Sells.txt', JSON.stringify(this.sells));
  }

  buy(quantity, price) {
    let buyLen = this.buys.length;
    let sellLen = this.sells.length;
    let id = buyLen + sellLen + 1;
    let executedQuantity = quantity;

    // Checks sell orders for new buy order
    for (let i = 0; i < sellLen; i++) {
      if(executedQuantity === 0 || price < this.sells[i].price) break;
      if(this.sells[i].executedQuantity > 0 && this.sells[i].price <= price) {
        
        if(this.sells[i].executedQuantity >= executedQuantity) {
          this.sells[i].executedQuantity -= executedQuantity;
          executedQuantity = 0;
          break;
        }else {
          executedQuantity -= this.sells[i].executedQuantity;
          this.sells[i].executedQuantity = 0;
        }
      }
    }

    let order = new Order(id, true, quantity, price, executedQuantity)

    // Places buy order in descending order
    if( buyLen === 0) this.buys.push(order);
    else {
      for(let i = 0; i < buyLen; i++) {
        if(this.buys[i].price < price) {
          this.buys.splice(i, 0, order);
          break;
        }if(i === buyLen - 1 && this.buys[i].price >= price) {
          this.buys.push(order);
        }
      }
    }
    // Update database
    this.sync()
    return order;
  }

  sell(quantity, price) {
    let buyLen = this.buys.length;
    let sellLen = this.sells.length;
    let id = buyLen + sellLen + 1;
    let executedQuantity = quantity;

    for (let i = 0; i < buyLen; i++) {
      if(executedQuantity === 0 || price > this.buys[i].price) break;
      if(this.buys[i].executedQuantity > 0 && this.buys[i].price <= price) {
        // Complete an order
        if(this.buys[i].executedQuantity >= executedQuantity) {
          this.buys[i].executedQuantity -= executedQuantity;
          executedQuantity = 0;
          break;
        }else {
          executedQuantity -= this.buys[i].executedQuantity;
          this.buys[i].executedQuantity = 0;
        }
      }
    }

    let order = new Order(id, false, quantity, price, executedQuantity)

    // Places sell order in ascending order
    if (sellLen === 0) this.sells.push(order);
    else{
      for(let i = 0; i < sellLen; i++) {
        if(this.sells[i].price > price) {
          this.sells.splice(i, 0, order);
          break;
        }if(i === sellLen - 1 && this.sells[i].price <= price) {
          this.sells.push(order);
        }
      }
    }
    // Update database
    this.sync()
    return order;
  }

  getQuantityAtPrice(price) {
    let total = 0;
    let len = this.sells.length;

    for(let i = 0; i < len; i++) {
      if(this.sells[i].price === price) {
        total += this.sells[i].executedQuantity;
      }
    }return total;
  }

  getOrder(id) {
    let buyLen = this.buys.length;
    // Check id among buys
    for(let i = 0; i < buyLen; i++) {
      if(this.buys[i].id === id){
        return this.buys[i];
      }
    }
    let sellLen = this.sells.length;
    // Check id among sells
    for(let i = 0; i < sellLen; i++) {
      if(this.sells[i].id === id){
        return this.sells[i];
      }
    }
  }
}

module.exports = Exchange;
