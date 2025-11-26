import React from "react";
import { Player } from '@lottiefiles/react-lottie-player'; 
import successAnimation from "../assets/Success.json";

export default function SuccessMail() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-green-100 p-4">
            <Player
                autoplay
                loop={false}
                src={successAnimation}
                style={{ height: '300px', width: '300px' }}
            />
            <h2 className="text-2xl font-semibold text-green-900 mt-4">Success!</h2>
            <p className="text-green-800 mt-2 text-center">Your message has been sent successfully. We will get back to you shortly.</p>

        </div>
    )
}