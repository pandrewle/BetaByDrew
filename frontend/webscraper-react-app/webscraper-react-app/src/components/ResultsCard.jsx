import React, { forwardRef } from "react";

const ResultsCard = forwardRef((props, ref) => {
  const { results } = props;
  const cardRefs = ref;

  return (
    <>
      {results && results.length > 0 ? (
        results
          .filter((result) => result.fullPrice > 0) // Filter out items with price of 0.00
          .map((result, index) => (
            <div
              key={index}
              id={`item-${index}`}
              className={`result-item p-4 flex flex-col justify-center gap-1 lg:gap-4 w-[80%] rounded-md transform ${
                index === 0 ? "z-10" : "z-0"
              }`}
              ref={(el) => (cardRefs.current[index] = el)}
              style={{
                top: `${index * 20}px`,
                left: `${index * 20}px`,
                zIndex: index === 0 ? 10 : results.length - index,
              }}
            >
              {index === 0 && (
                <div className="flex w-full items-start justify-end mb-4">
                  <span className="lowest-price-tag absolute top-0 right-0 bg-secondaryaccent text-white text-s font-bold py-1 px-2 rounded-tr-md rounded-bl-md">
                    Lowest Price!
                  </span>
                </div>
              )}
              <div className="product-info flex items-center gap-4">
                <img
                  src={result.logo}
                  alt={`${result.websiteName} logo`}
                  className="w-24 h-24 object-contain"
                />
                <div className="results-info">
                  <h2 className="text-xl font-bold">{result.product}</h2>
                  <p className="text-xl font-bold text-secondaryaccent">
                    ${result.discountedPrice}
                    <span className="text-lg text-gray-400 font-normal line-through decoration-1 mx-2">
                      ${result.fullPrice}
                    </span>
                    <span className="bg-secondaryaccent bg-opacity-20 inline-block rounded-lg px-1">
                      <span className="text-lg text-secondaryaccent">
                        Save {result.discount}%
                      </span>
                    </span>
                  </p>
                  <a
                    href={result.productUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:underline hover:text-white"
                  >
                    View Product
                  </a>
                </div>
              </div>
              <h3 className="size-header text-lg font-semibold mt-4 flex">
                Sizes:
              </h3>
              <div className="results-sizes flex flex-wrap gap-2">
                {result.productSizes && result.productSizes.length > 0 ? (
                  result.productSizes.map((size, sizeIndex) => (
                    <span
                      key={sizeIndex}
                      className="size-item px-2 py-1 border rounded-md w-9 h-7 lg:w-10 lg:h-8 flex items-center justify-center"
                    >
                      {size}
                    </span>
                  ))
                ) : (
                  <span className="no-sizes text-gray-500">
                    No sizes available
                  </span>
                )}
              </div>
            </div>
          ))
      ) : (
        <p className="text-lg text-gray-500">No results found</p>
      )}
    </>
  );
});

export default ResultsCard;
