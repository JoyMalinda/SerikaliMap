import React from 'react';
import Flag from "../assets/Flag_of_Kenya_(shield).svg.png" 

export default function Loader() {
  return (
    <div className="flex justify-center items-center h-screen">
        <img src={Flag} alt="Loading..." className="animate-pulse h-16 w-12"/>
    </div>
  );
}