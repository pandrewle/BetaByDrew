import { useEffect, useState } from "react";

const TextCarousel = () => {
  const textSlides = [
    "It looks like this is a new search! Please wait a moment while we fetch the best prices for you.",
    "To save resources, Beta started with 0 products in its database. Every search contributes by adding products to our database.",
    "These products are tracked for daily price updates.",
    "We appreciate your patience! 🚀",
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Start the fade-out process after the text is visible for 3 seconds
    const fadeOutTimeout = setTimeout(() => {
      setIsFadingOut(true);
    }, 7000);

    // Change slide after fade-out completes (1 second fade-out time)
    const slideChangeTimeout = setTimeout(() => {
      setIsFadingOut(false);
      setCurrentSlide((prevSlide) => (prevSlide + 1) % textSlides.length);
    }, 8000); // 3 seconds for display + 1 second for fade-out

    return () => {
      clearTimeout(fadeOutTimeout);
      clearTimeout(slideChangeTimeout);
    };
  }, [currentSlide]);

  return (
    <div className="relative w-full lg:w-full text-center">
      {textSlides.map((slide, index) => (
        <h1
          key={index}
          className={`header text-sm lg:text-lg font-semibold m-4 absolute top-0 left-0 right-0 transition-opacity duration-1000 ${
            index === currentSlide
              ? isFadingOut
                ? "opacity-0" // Start fading out
                : "opacity-100" // Fully visible
              : "opacity-0" // Hidden
          }`}
        >
          {slide}
        </h1>
      ))}
    </div>
  );
};

export default TextCarousel;
