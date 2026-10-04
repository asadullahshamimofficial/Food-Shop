import React from 'react';
import MainBanner from './MainBanner';
import TopFoods from './TopFoods';
import Contact from './Contact';
import Testimonial from './Testimonial';
import OurFood from './OurFood';

const Home = () => {
  return (
    <div className='flex flex-col gap-10'>
      <MainBanner />
      <TopFoods />
      <OurFood />
      <Testimonial />
      <Contact />
    </div>
  );
};

export default Home;