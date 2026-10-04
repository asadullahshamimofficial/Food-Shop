import React, { useState } from 'react';
import useAuth from '../../hooks/useAuth';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const AddFood = () => {

  // TODO 1: Food Name, Food Image, Food Category, quantity, Price, Food Origin (Country), Username & email (read-only), description, Add Item Button.
  
  const {user} = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    origin: '',
    quantity: '',
    category: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddFood = (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value;
    const price = form.price.value;
    const description = form.description.value;
    const image = form.image.value;
    const origin = form.origin.value;
    const quantity = form.quantity.value;
    const category = form.category.value;
  
    const newFood = {
      name,
      price,
      description,
      image,
      origin,
      quantity,
      category,
      owner_email: user.email,
      food_owner: user.name,
    };
  
    fetch(`${import.meta.env.VITE_Server_Host_Link}/foods`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newFood),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.insertedId) {
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Food Added Successfully Done.",
            showConfirmButton: false,
            timer: 1500,
          });
          navigate('/myFood');
        }
      });
  };

  return (
    <div className='container mx-auto pt-28'>
      <h1 className="text-3xl font-bold text-center">Add Food</h1>
      <form
        onSubmit={handleAddFood}
        className="max-w-xl mx-auto p-6 rounded-lg shadow-lg"
      >
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-bold mb-2">
            Food Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter food name"
            className="input input-bordered w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-bold mb-2">
          Food Category
          </label>
          <input
            type="text"
            name="category"
            id="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="Enter food category"
            className="input input-bordered w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-bold mb-2">
          Food Origin (Country)
          </label>
          <input
            type="text"
            name="origin"
            id="origin"
            value={formData.origin}
            onChange={handleChange}
            placeholder="Enter food origin (country)"
            className="input input-bordered w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-bold mb-2">
            Description
          </label>
          <textarea
            name="description"
            id="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter food description"
            className="textarea textarea-bordered w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="price" className="block text-sm font-bold mb-2">
            Price ($)
          </label>
          <input
            type="number"
            name="price"
            id="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="Enter food price"
            className="input input-bordered w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="price" className="block text-sm font-bold mb-2">
            Quantity
          </label>
          <input
            type="number"
            name="quantity"
            id="quantity"
            value={formData.quantity}
            onChange={handleChange}
            placeholder="Enter food quantity"
            className="input input-bordered w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="image" className="block text-sm font-bold mb-2">
            Image URL
          </label>
          <input
            type="url"
            name="image"
            id="image"
            value={formData.image}
            onChange={handleChange}
            placeholder="Enter food image URL"
            className="input input-bordered w-full"
            required
          />
        </div>
        <button
          type="submit"
          className="btn bg-yellow-700 hover:bg-yellow-800 text-white w-full"
        >
          Add Food
        </button>
      </form>
    </div>
  );
};

export default AddFood;