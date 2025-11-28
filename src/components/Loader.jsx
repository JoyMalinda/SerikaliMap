import React from 'react';
import Flag from "../assets/Flag_of_Kenya_(shield).svg.png" 

export default function Loader() {
  return (
    <div className="flex justify-center items-center h-screen dark:bg-gray-900">
      <div className="loader"></div>
    </div>
  );
}