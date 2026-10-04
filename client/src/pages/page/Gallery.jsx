import { useState, useEffect, useCallback } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { useInView } from "react-intersection-observer";
import Banner from "../shared/Banner";
import { motion } from "framer-motion";

const GalleryPage = () => {
  const [galleryItems, setGalleryItems] = useState([]);
  const [lightboxIndex, setLightboxIndex] = useState(-1); // Index for lightbox
  const [page, setPage] = useState(1); // For infinite scrolling
  const [loading, setLoading] = useState(false);
  const { ref, inView } = useInView({ threshold: 0.1 }); // Observer for scrolling

  const fetchGalleryItems = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_Server_Host_Link}/gallery?page=${page}&limit=12`);
      const data = await response.json();
      setGalleryItems((prev) => [...prev, ...data]); // Append new images
      setLoading(false);
    } catch (error) {
      console.error("Error fetching gallery data:", error);
      setLoading(false);
    }
  }, [page]);

  // Fetch initial gallery items
  useEffect(() => {
    fetchGalleryItems();
  }, [fetchGalleryItems]);

  // Trigger fetch on scroll
  useEffect(() => {
    if (inView) {
      setPage((prev) => prev + 1);
    }
  }, [inView]);

  return (
    <div className="min-h-screen flex flex-col items-center">
      {/* Page Title */}
      <div className="w-full">
        <Banner 
          backgroundImage={"https://i.ibb.co.com/rt935Pq/download-2.jpg"}
          title={"Gallery"}
          links={[
            {
              name: 'Home',
              path: '/'
            },
            {
              name: 'Gallery',
              path: '/gallery'
            }
          ]}
        />
      </div>

      {/* Gallery Section */}
      <motion.div 
        className="container mx-auto px-4 py-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0, y: 50 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { delayChildren: 0.2, staggerChildren: 0.1 }
          }
        }}
      >
        {galleryItems.map((item, index) => (
          <motion.div
            key={item._id || index}
            className="relative group border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition"
            onClick={() => setLightboxIndex(index)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            variants={{
              hidden: { opacity: 0, y: 50 },
              visible: { opacity: 1, y: 0 }
            }}
          >
            <figure>
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-48 object-cover transition-opacity duration-500 ease-in-out opacity-100"
                loading="lazy"
              />
            </figure>
            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex flex-col gap-2 items-center justify-center text-white transition duration-300">
              <h2 className="text-center text-2xl font-semibold"> {item.title} </h2>
              <p className="text-center text-sm px-7">{item.description}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Infinite Scroll Trigger */}
      <div ref={ref} className="h-10"></div>

      {/* Loading Indicator */}
      {loading && (
        <div className="py-4 text-center">
          <span className="loading loading-ring loading-lg"></span>
        </div>
      )}

      {/* Lightbox */}
      {lightboxIndex >= 0 && (
        <Lightbox
          open={lightboxIndex >= 0}
          close={() => setLightboxIndex(-1)}
          slides={galleryItems.map((item) => ({ src: item.image }))}
          index={lightboxIndex}
        />
      )}
    </div>
  );
};

export default GalleryPage;