function sum(...args) {
  return args.reduce((curr, acc) => curr + acc);
}

function product(...args) {
  return args.reduce((curr, acc) => curr * acc);
}

// module.exports is basically a empty object {}
// so these are the different ways to set the object.

module.exports = {
  sum,
  product,
};

module.exports = [sum, product];

module.exports.sum = sum;
module.exports.product = product;
