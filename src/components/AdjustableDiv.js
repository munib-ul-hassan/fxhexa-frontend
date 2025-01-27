import React, { useState } from "react";

const MyComponent = ({ children, setDragging }) => {
  const [height, setHeight] = useState(120);

  // const handleMouseDown = (event) => {
  //   // const draggingPromise = new Promise((res , rej) => {

  //   // })
  //   const initialMousePosition = event.pageY;
  //   const initialHeight = height;

  //   document.addEventListener("mousemove", handleMouseMove);
  //   document.addEventListener("mouseup", handleMouseUp);

  //   function handleMouseMove(event) {
  //     const newHeight = initialHeight + (initialMousePosition - event.pageY);
  //     // Set lower and upper limits for the height
  //     const minHeight = 0; // Change this as needed
  //     const maxHeight = 600; // Change this as needed

  //     if (newHeight < minHeight) {
  //       setHeight(minHeight);
  //     } else if (newHeight > maxHeight) {
  //       setHeight(maxHeight);
  //     } else {
  //       setHeight(newHeight);
  //     }
  //   }

  //   function handleMouseUp() {
  //     document.removeEventListener("mousemove", handleMouseMove);
  //     document.removeEventListener("mouseup", handleMouseUp);
  //   }
  // };

  const handleMouseDown = (event) => {
    setDragging(true);
    const initialMousePosition = event.pageY;
    const initialHeight = height;

    const handleMouseMove = (event) => {
      const newHeight = initialHeight + (initialMousePosition - event.pageY);
      // Set lower and upper limits for the height
      const minHeight = 0; // Change this as needed
      const maxHeight = 600; // Change this as needed

      if (newHeight < minHeight) {
        setHeight(minHeight);
      } else if (newHeight > maxHeight) {
        setHeight(maxHeight);
      } else {
        setHeight(newHeight);
      }
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      setDragging(false); // Call the callback when mouse is released
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <div
      style={{
        height,
        borderBottom: "none", // Hide the bottom border
        cursor: "ns-resize", // Set the cursor for resizing
        userSelect: "none", // Prevent text selection
      }}
      className="absolute bottom-0 mt-20 z-50 w-full border-t-4 border-[#f69320]"
      //   onMouseUp={handleMouseDown}
      onMouseDown={handleMouseDown}
      //   onMouseUp={handleMouseDown}
    >
      {/* <div className="flex flex-row justify-center" style={{ height: "100%" }}> */}
      {/* Your content goes here */}
      {children}
      {/* </div> */}
    </div>
  );
};

export default MyComponent;

// import React, { useState } from "react";
// import { ResizableBox } from "react-resizable";
// import "react-resizable/css/styles.css";

// const MyResizableComponent = () => {
//   const [width, setWidth] = useState(200);
//   const [height, setHeight] = useState(200);

//   const handleResize = (e, { size }) => {
//     setWidth(size.width);
//     setHeight(size.height);
//   };

//   return (
//     <div className="resizable-container">
//       <ResizableBox
//         width={width}
//         height={height}
//         onResize={handleResize}
//         handle={<div className="resize-handle" />}
//       >
//         <div className="resizable-div border ">Resizable Div</div>
//       </ResizableBox>
//     </div>
//   );
// };

// export default MyResizableComponent;
