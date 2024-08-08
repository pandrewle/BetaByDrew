import React, { forwardRef } from "react";

const ResultsCard = forwardRef((props, ref) => {
  const { results } = props;
  const cardRefs = ref;

  return (
    <>
      {results && results.length > 0 ? (
        results
          .filter((result) => result.price > 0) // Filter out items with price of 0.00
          .map((result, index) => (
            <div
              key={index}
              className={`result-item lg:absolute p-4 flex flex-col justify-center gap-1 lg:gap-4 w-[80%] rounded-md transform ${
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
                  <span className="absolute top-0 right-0 bg-blue-600 text-white text-s font-bold py-1 px-2 rounded-tr-md rounded-bl-md">
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
                  <p className="text-lg font-bold text-blue-500">
                    ${result.price}
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
                      className="size-item px-2 py-1 border rounded-md"
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
