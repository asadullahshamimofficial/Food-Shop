// use local storage to manage cart data
const addToDb = id => {
  let buyingCart = getbuyingCart();
  // add quantity
  const quantity = buyingCart[id];
  if (!quantity) {
    buyingCart[id] = 1;
  }
  else {
      const newQuantity = quantity + 1;
    buyingCart[id] = newQuantity;
  }
  localStorage.setItem('buying-cart', JSON.stringify(buyingCart));
}

const removeFromDb = id => {
  const buyingCart = getBuyingCart();
  if (id in buyingCart) {
    delete buyingCart[id];
    localStorage.setItem('buying-cart', JSON.stringify(buyingCart));
  }
}

const getBuyingCart = () => {
  let buyingCart = {};

  //get the buying cart from local storage
  const storedCart = localStorage.getItem('buying-cart');
  if (storedCart) {
    buyingCart = JSON.parse(storedCart);
  }
  return buyingCart;
}

const deleteBuyingCart = () => {
  localStorage.removeItem('buying-cart');
}

export {
  addToDb,
  removeFromDb,
  getBuyingCart,
  deleteBuyingCart
}