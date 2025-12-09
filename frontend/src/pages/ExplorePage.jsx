import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import transition from "../components/PageTransitions";
import { API_BASE_URL } from "../config";

const ExploreComponent = ({ isFullPage = false }) => {
  const [exploreProducts, setExploreProducts] = useState([]);
  const [section, setSection] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch products from the API
    const fetchProducts = async (section = 1) => {
      // console.log("Fetching products...");
      try {
        const response = await fetch(
          `${API_BASE_URL}/explore?page=${section}&limit=9`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();
        if (data.length < 9) {
          setHasMore(false);
        }

        // Set the products in the state
        setExploreProducts(
          isFullPage
            ? (prevProducts) => [...prevProducts, ...data]
            : data.slice(0, 3)
        ); // Display limited or all products
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts(section);
  }, [isFullPage]);

  const loadMoreProducts = () => {
    setSection((prevSection) => prevSection + 1);
  };

  return (
    <div className="explore-container bg-primarycolor flex flex-col gap-8 items-center lg:items-center lg:justify-start py-8">
      <div className="explore-section flex flex-col gap-4 items-center md:px-16 px-4">
        <h1 className="text-6xl font-extrabold text-center mt-12">Explore</h1>
        {exploreProducts.length > 0 ? (
          <div className="card-container grid grid-cols-2 lg:grid-cols-3 py-4 gap-4 lg:gap-6">
            {exploreProducts
              .filter((products) => products.fullPrice > 0)
              .map((product, index) => (
                <div
                  key={index}
                  className="product-card lg:max-w-[400px] bg-secondarydark p-4 gap-2 flex flex-col items-center justify-center rounded-md transform"
                >
                  <a
                    href={product.productUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className="w-full flex justify-center items-center max-h-[300px] md:h-[375px]">
                      <img
                        src={product.productImages[0]}
                        alt={product.product}
                        className="object-contain max-h-full max-w-full py-4"
                        loading="lazy"
                      />
                    </div>
                  </a>
                  <div className="flex flex-col items-start justify-start gap-2 w-full lg:px-4">
                    <a
                      href={product.productUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {/* Set a fixed height for product name */}
                      <h3 className="hover:underline text-xl font-bold h-32 lg:h-16 overflow-hidden">
                        {product.product}
                      </h3>
                    </a>
                    <span className="text-xl font-bold text-secondaryaccent bg-secondaryaccent bg-opacity-20 inline-block rounded-lg px-1">
                      <span className="text-lg text-secondaryaccent">
                        Save {product.discount}%
                      </span>
                    </span>
                    {/* Min height to ensure consistent spacing for price and discount section */}
                    <p className="text-xl font-bold text-secondaryaccent lg:min-h-[40px] flex flex-wrap">
                      ${product.discountedPrice}
                      <span className="text-lg text-gray-400 font-normal line-through decoration-1 ml-2">
                        ${product.fullPrice}
                      </span>
                    </p>
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <p className="text-2xl font-bold text-secondaryaccent text-center my-8">
            No recent discounts to explore currently, please check back later.
          </p>
        )}
        {hasMore && isFullPage && (
          <button
            className="bg-secondarydark text-secondarycolor font-bold py-2 px-4 rounded-lg hover:bg-secondaryaccent hover:text-secondarycolor transition duration-300 ease-in-out"
            onClick={loadMoreProducts}
          >
            See More
          </button>
        )}
        {!isFullPage && exploreProducts.length > 0 && (
          <button
            className="bg-secondarydark text-secondarycolor font-bold py-2 px-4 rounded-lg hover:bg-secondaryaccent hover:text-secondarycolor transition duration-300 ease-in-out"
            onClick={() => navigate("/explore")}
          >
            See More
          </button>
        )}
      </div>
    </div>
  );
};

// Conditionally wrap the component with the transition if it's full-page
const Explore = (props) => {
  const ExploreWithTransition = transition(ExploreComponent);

  return props.isFullPage ? (
    <ExploreWithTransition {...props} />
  ) : (
    <ExploreComponent {...props} />
  );
};

export default Explore;
