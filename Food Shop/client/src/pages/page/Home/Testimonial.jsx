import React, { useState } from "react";
import { Star, ArrowLeft, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const testimonials = [
  {
    name: "Rahul Islam",
    role: "Food Blogger",
    review:
      "The food was absolutely delicious! The flavors were well-balanced, and every bite was a delight. The ambiance of the restaurant added to the experience, making it even more enjoyable. Highly recommended!",
    rating: 5,
    image: "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp",
  },
  {
    name: "Tahsin Ahmed",
    role: "Customer",
    review:
      "I ordered a pizza, and it was just perfect! The crust was crispy, the cheese was melted beautifully, and the toppings were fresh. I will definitely order again. The delivery was also super fast!",
    rating: 4,
    image: "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp",
  },
  {
    name: "Mahin Khan",
    role: "Food Lover",
    review:
      "The burger and french fries were outstanding! The burger was juicy, and the fries were crispy and perfectly salted. The quality of the ingredients was evident in every bite. Amazing experience!",
    rating: 5,
    image: "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp",
  },
  {
    name: "Rubaiya Hasan",
    role: "Food Enthusiast",
    review:
      "The restaurant's environment was clean, cozy, and welcoming. The staff was very polite and attentive. I had a great time enjoying my meal, and I appreciate their excellent service. Will visit again soon!",
    rating: 4,
    image: "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp",
  },
];

const TestimonialSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length
    );
  };

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-3xl font-bold text-gray-800 py-10"> What Our Customers Say </h2>
      <div className="flex items-center justify-center gap-6">
        <button onClick={prevTestimonial} className="p-2 h-fit border  border-yellow-700 rounded-full hover:bg-yellow-800">
          <ArrowLeft className="w-6 h-6 text-yellow-700 hover:text-white" />
        </button>
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }} 
            className="relative w-full max-w-2xl bg-yellow-50 p-6 rounded-lg shadow-md text-center"
          >
            <div>
              <p className="text-gray-700 mb-4">{testimonials[currentIndex].review}</p>
              <div className="flex justify-center mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < testimonials[currentIndex].rating
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <div className="flex flex-col items-center">
                <img
                  src={testimonials[currentIndex].image}
                  alt={testimonials[currentIndex].name}
                  className="w-16 h-16 rounded-full mb-2"
                />
                <h3 className="font-bold">{testimonials[currentIndex].name}</h3>
                <p className="text-gray-500">{testimonials[currentIndex].role}</p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
        <button onClick={nextTestimonial} className="p-2 h-fit border  border-yellow-700 rounded-full hover:bg-yellow-800">
          <ArrowRight className="w-6 h-6 text-yellow-700 hover:text-white" />
        </button>
      </div>
    </div>
  );
};

export default TestimonialSlider;