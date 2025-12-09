import React, { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const proxyImageUrl = (url) =>
  `https://beta-by-drew-d328f6616559.herokuapp.com/proxy-image?url=${encodeURIComponent(
    url
  )}`;

const ImageSlider = ({ results }) => {
  const [imageIndex, setImageIndex] = useState(0);
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      const fetchedImages = results[0].productImages.map((image) =>
        proxyImageUrl(image)
      );
      const processedImages = await Promise.all(
        fetchedImages.map(async (image) => {
          try {
            const response = await fetch(image);
            if (!response.ok) throw new Error("Image fetch failed");
            return image; // Return the proxied image URL if it is valid
          } catch (error) {
            // console.error(`Error fetching image ${image}: ${error.message}`);
            return decodeURIComponent(image.split("url=")[1]); // Return the original URL if there is an error
          }
        })
      );
      setImages(processedImages);
    };

    fetchImages();
  }, [results]);

  const handlePrev = () => {
    setImageIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };

  const handleNext = () => {
    setImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  return (
    <div className="flex flex-col mx-8 lg:flex-row justify-center items-center gap-4 lg:w-1/2">
      <div className="flex flex-row lg:flex-col lg:items-end justify-center gap-2 lg:gap-2 lg:w-1/6 order-2 lg:order-1 overflow-x-auto lg:overflow-y-auto flex-wrap">
        {images.map((image, idx) => (
          <img
            key={idx}
            src={image}
            alt={`Thumbnail ${idx}`}
            className={`w-16 h-16 lg:w-20 lg:h-20 rounded-md cursor-pointer p-2 transform transition-transform duration-200 
                        ${
                          imageIndex === idx
                            ? "border-4 border-secondaryaccent opacity-80"
                            : ""
                        }`}
            onClick={() => setImageIndex(idx)}
            loading="lazy"
          />
        ))}
      </div>
      <div className="w-full lg:w-5/6 order-1 lg:order-2">
        <div className="max-w-full max-h-full w-[400px] h-[400px] lg:w-[500px] lg:h-[500px] overflow-hidden flex items-center justify-center relative">
          <img
            src={images[imageIndex]}
            alt="Active Product"
            className="w-full h-full object-cover rounded-xl"
            loading="lazy"
          />
          <button
            className="absolute top-1/2 left-0 ml-1 transform -translate-y-1/2 bg-primarycolor text-secondarycolor p-2 rounded-full hover:bg-secondaryaccent"
            onClick={handlePrev}
          >
            <FaChevronLeft size={24} />
          </button>
          <button
            className="absolute top-1/2 right-0 transform mr-1 -translate-y-1/2 bg-primarycolor text-secondarycolor p-2 rounded-full hover:bg-secondaryaccent"
            onClick={handleNext}
          >
            <FaChevronRight size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};
export default ImageSlider;
