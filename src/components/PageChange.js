import React from "react";

const PageLoader = () => {
  return (
    <div>
      <div className="top-0 left-0 w-full h-full block z-50 fixed bg-gray-300 dark:bg-black  bg-opacity-25"></div>
      <div className="my-4 mx-auto w-full  text-center   z-50">
        <div className="absolute  top-80 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div class="loading">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageLoader;
