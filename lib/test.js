const Exchange = require('./index.js')

let nameBase = new Exchange();

nameBase.sell(1, 5);
nameBase.sell(2,2);
// console.log(nameBase.getQuantityAtPrice(2));
nameBase.buy(5,2);
nameBase.buy(3,2);

// console.log(nameBase.getQuantityAtPrice(2));
// console.log(nameBase.getOrder(2));
// nameBase.buy(3,2);
// nameBase.buy(3,3);
// nameBase.buy(3,2);


