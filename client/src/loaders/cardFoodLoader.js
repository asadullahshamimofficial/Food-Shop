import React from 'react';
import { getBuyingCart } from '../utilities/db';

const cardFoodLoader = async () => {
  const storedCart = getBuyingCart();

  const storedCartIds = Object.keys(storedCart);
  console.log(storedCartIds);
  
  const loadedFoods = await fetch(`${import.meta.env.VITE_Server_Host_Link}/productByIds`, {
    method: 'POST',
    headers: {'content-type': 'application/json'},
    body: JSON.stringify()
  });
  
  const foods = await loadedFoods.json();

  const savedCart = [];

  for (const id in storedCart) {
    const addedFood = foods.find(pd => pd._id === id);
    if (addedFood) {
      const quantity = storedCart[id];
      addedFood.quantity = quantity;
      savedCart.push(addedFood);
    }
  }
  
  return savedCart;
};

export default cardFoodLoader;