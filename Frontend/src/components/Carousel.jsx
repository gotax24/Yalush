import PropTypes from "prop-types";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import "../css/Carousel.css";

const Carousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex + 1 === images.length ? 0 : prevIndex + 1
    );
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex - 1 < 0 ? images.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="carousel">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.5 }}
        >
          <div className="carousel-overlay">
            <h2>On look! it's crochet <br /> O'clock</h2>
        
            <button className="carousel-button">Descubre mas</button>
          </div>
          <img
            src={images[currentIndex].src}
            alt={`Imagen ${currentIndex + 1}`}
          />
          <div className="image-footer">
            <p
              dangerouslySetInnerHTML={{
                __html: images[currentIndex].footer,
              }}
            />
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="slide_direction">
        <button
          aria-label="Imagen anterior"
          className="left"
          onClick={handlePrevious}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="20"
            viewBox="0 96 960 960"
            width="20"
          >
            <path d="M400 976 0 576l400-400 56 57-343 343 343 343-56 57Z" />
          </svg>
        </button>

        <button
          aria-label="Imagen siguiente"
          className="right"
          onClick={handleNext}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="20"
            viewBox="0 96 960 960"
            width="20"
          >
            <path d="m304 974-56-57 343-343-343-343 56-57 400 400-400 400Z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

Carousel.propTypes = {
  images: PropTypes.arrayOf(
    PropTypes.shape({
      src: PropTypes.string.isRequired,
      footer: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default Carousel;
