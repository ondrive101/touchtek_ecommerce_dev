"use client";
import React from "react";
import { CountdownCircleTimer } from "react-countdown-circle-timer";


const Timer = ({ time, totalTime }) => {
  const MAX_DURATION = 60; // Set max duration from the prop

  return (
    <div className="flex flex-col items-center"> {/* Centering everything */}
      <div className="flex justify-center mb-4">
        <div className="mr-4 text-center">
          <CountdownCircleTimer
            initialRemainingTime={time.minutes} // Set the remaining time from the prop
            key={time.seconds} // Re-render the timer whenever time.seconds changes
            colors={"#004777"}
            size={110}
            strokeWidth={10}
            onComplete={() => console.log("Time's up!")}
          >
            {() => (
              <>
                <div className="flex flex-col items-center">
                  <h1 className="text-2xl font-bold text-indigo-600">
                    {time.minutes}
                  </h1>
                  <span className="text-sm text-gray-500">Minutes</span>
                </div>
              </>
            )}
          </CountdownCircleTimer>
        </div>

        <div>
          <CountdownCircleTimer
            isPlaying={true}
            duration={MAX_DURATION} // Dynamic duration based on time.seconds
            initialRemainingTime={time.seconds} // Set the remaining time from the prop
            key={time.seconds} // Re-render the timer whenever time.seconds changes
            colors={["#004777", "#F7B801", "#f76d6d", "#eb1717"]}
            colorsTime={[MAX_DURATION, MAX_DURATION * 0.5, MAX_DURATION * 0.2, 0]} // Adjust colors based on dynamic duration
            size={110}
            strokeWidth={10}
            onComplete={() => console.log("Time's up!")}
          >
            {() => (
              <>
                <div className="flex flex-col items-center">
                  <h1 className="text-2xl font-bold text-indigo-600">
                    {time.seconds}
                  </h1>
                  <span className="text-sm text-gray-500">Seconds</span>
                </div>
              </>
            )}
          </CountdownCircleTimer>
        </div>
      </div>

      {/* Placing 'Please wait...' at the bottom of both timers */}
      <div className="mt-4 text-center">
        <span className="text-lg font-semibold text-gray-600">
          Please wait...
        </span>
      </div>
    </div>
  );
};
export { Timer };
