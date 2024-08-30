"use client";

import React, { useState, useEffect, useRef } from "react";
import AudioStream from "@/components/elevenlabs/AudioStream";
import useMqtt from "@/hooks/useMqtt";

import {
  MQTT_API_CLASSROOM,
  MQTT_API_GARDEN,
  MQTT_API_WATERTANK,
} from "@/lib/MQTTapi";
import useMethod from "@/hooks/useCommandMethod";

// TypeScript interface for the Window object to include SpeechRecognition
interface WindowWithSpeechRecognition extends Window {
  webkitSpeechRecognition: any;
}

const ChatBot = () => {
  const [method, updateMethod] = useMethod();

  useEffect(() => {}, [method, updateMethod]);

  /* ------------------------------- //classroom ------------------------------ */
  const { publishMessage: publishMessage_led } = useMqtt(
    MQTT_API_CLASSROOM,
    "esp8266/led-classroom-200"
  );
  const { publishMessage: publishMessage_led_2nd_floor } = useMqtt(
    MQTT_API_CLASSROOM,
    "esp8266/led-classroom-200-2nd-floor"
  );
  const { publishMessage: publishMessage_led_3rd_floor } = useMqtt(
    MQTT_API_CLASSROOM,
    "esp8266/led-classroom-200-3rd-floor"
  );
  const { publishMessage: publishMessage_fan } = useMqtt(
    MQTT_API_CLASSROOM,
    "esp8266/fan-classroom-200"
  );
  const { publishMessage: publishMessage_door } = useMqtt(
    MQTT_API_CLASSROOM,
    "esp8266/door-classroom-200"
  );
  const { publishMessage: publishMessage_buzzer } = useMqtt(
    MQTT_API_CLASSROOM,
    "esp8266/door-classroom-200"
  );

  const { message: temperatureClassroom } = useMqtt(
    MQTT_API_CLASSROOM,
    "sensor/temperature"
  );

  const { message: humidityClassroom } = useMqtt(
    MQTT_API_CLASSROOM,
    "sensor/humidity"
  );

  /* -------------------------------- // garden ------------------------------- */
  const { message: temperatureGarden } = useMqtt(
    MQTT_API_GARDEN,
    "sensor/temperature"
  );
  const { message: humidityGarden } = useMqtt(
    MQTT_API_GARDEN,
    "sensor/humidity"
  );
  const { message: moistureGarden } = useMqtt(
    MQTT_API_GARDEN,
    "sensor/moisture"
  );
  const { publishMessage: publishMessage_garden_led } = useMqtt(
    MQTT_API_GARDEN,
    "esp8266/led"
  );
  const { publishMessage: publishMessage_garden_motor } = useMqtt(
    MQTT_API_GARDEN,
    "esp8266/water-pump"
  );

  /* --------------------------- // water tank pump --------------------------- */
  const { publishMessage: publishMessage_water_tank } = useMqtt(
    MQTT_API_WATERTANK,
    "esp8266/water-pump-tank"
  );

  const [isListening, setIsListening] = useState(false);
  const [recognizedText, setRecognizedText] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const silenceTimeoutRef = useRef<number | null>(null);
  const stopListenRef = useRef(false); // Ref to track stopListen state

  /* ------------------------------- //classroom ------------------------------ */
  const toggleFirstFloorLight = (message) => {
    publishMessage_led(message);
  };
  const toggleSecondFloorLight = (message) => {
    publishMessage_led_2nd_floor(message);
  };
  const toggleThirdFloorLight = (message) => {
    publishMessage_led_3rd_floor(message);
  };
  const toggleFan = (message) => {
    publishMessage_fan(message);
  };
  /* -------------------------------- //garden -------------------------------- */
  const toggleGardenMotor = (message) => {
    publishMessage_garden_motor(message);
  };

  const toggleGardenLight = (message) => {
    publishMessage_garden_led(message);
  };

  /* ------------------------------ //water tank ------------------------------ */
  const { message: waterLevel } = useMqtt(
    MQTT_API_WATERTANK,
    "sensor/distance"
  );
  const toggleWaterTankMotor = (message) => {
    publishMessage_water_tank(message);
  };

  useEffect(() => {}, [recognizedText]);

  function handleCommand(recognizedText) {
    const lowerCaseText = recognizedText.toLowerCase();

    if (
      lowerCaseText.includes("1st floor light on") ||
      lowerCaseText.includes("first floor light on")
    ) {
      console.log("Turning the first floor light on...");
      AudioStream("Turning the first floor light on");
      toggleFirstFloorLight("1");
    } else if (
      lowerCaseText.includes("1st floor light off") ||
      lowerCaseText.includes("first floor light off")
    ) {
      console.log("Turning the first floor light off...");
      AudioStream("Turning the first floor light off");
      toggleFirstFloorLight("0");
    } else if (
      lowerCaseText.includes("2nd floor light on") ||
      lowerCaseText.includes("second floor light on")
    ) {
      console.log("Turning the second floor light on...");
      AudioStream("Turning the second floor light on");
      toggleSecondFloorLight("1");
    } else if (
      lowerCaseText.includes("2nd floor light off") ||
      lowerCaseText.includes("second floor light off")
    ) {
      console.log("Turning the second floor light off...");
      AudioStream("Turning the second floor light off");
      toggleSecondFloorLight("0");
    } else if (
      lowerCaseText.includes("3rd floor light on") ||
      lowerCaseText.includes("third floor light on")
    ) {
      console.log("Turning the third floor light on...");
      AudioStream("Turning the third floor light on");
      toggleThirdFloorLight("1");
    } else if (
      lowerCaseText.includes("3rd floor light off") ||
      lowerCaseText.includes("third floor light off")
    ) {
      console.log("Turning the third floor light off...");
      AudioStream("Turning the third floor light off");
      toggleThirdFloorLight("0");
    } else if (lowerCaseText.includes("garden light on")) {
      console.log("Turning the garden light on...");
      AudioStream("Turning the garden light on");
      toggleGardenLight("1");
    } else if (lowerCaseText.includes("garden light off")) {
      console.log("Turning the garden light off...");
      AudioStream("Turning the garden light off");
      toggleGardenLight("0");
    } else if (lowerCaseText.includes("garden motor on")) {
      console.log("Turning the garden motor on...");
      AudioStream("Turning the garden motor on");
      toggleGardenMotor("1");
    } else if (lowerCaseText.includes("garden motor off")) {
      console.log("Turning the garden motor off...");
      AudioStream("Turning the garden motor off");
      toggleGardenMotor("0");
    } else if (lowerCaseText.includes("water tank motor on")) {
      console.log("Turning the water tank motor on...");
      AudioStream("Turning the water tank motor on");
      toggleWaterTankMotor("1");
    } else if (lowerCaseText.includes("water tank motor off")) {
      console.log("Turning the water tank motor off...");
      AudioStream("Turning the water tank motor off");
      toggleWaterTankMotor("0");
    } else if (lowerCaseText.includes("temperature in garden")) {
      console.log(
        "The temperature in the garden is " +
          temperatureGarden +
          " degree Celsius."
      );
      AudioStream(
        "The temperature in the garden is " +
          temperatureGarden +
          " degree Celsius."
      );
    } else if (lowerCaseText.includes("temperature in classroom")) {
      console.log(
        "The temperature in the classroom is " +
          temperatureClassroom +
          " degree Celsius."
      );
      AudioStream(
        "The temperature in the classroom is " +
          temperatureClassroom +
          " degree Celsius."
      );
    } else if (lowerCaseText.includes("humidity in garden")) {
      console.log("The humidity in the garden is " + humidityGarden + "%.");
      AudioStream("The humidity in the garden is " + humidityGarden + "%.");
    } else if (lowerCaseText.includes("humidity in classroom")) {
      console.log(
        "The humidity in the classroom is " + humidityClassroom + "%."
      );
      AudioStream(
        "The humidity in the classroom is " + humidityClassroom + "%."
      );
    } else if (lowerCaseText.includes("moisture in garden")) {
      console.log("The moisture in the garden is " + moistureGarden + "%.");
      AudioStream("The moisture in the garden is " + moistureGarden + "%.");
    } else if (lowerCaseText.includes("water level")) {
      console.log("The water level is " + waterLevel + ".");
      AudioStream("The water level is " + waterLevel + ".");
    } else {
      // console.log("No recognizable command detected.");
      AudioStream("I don't know that");
    }
  }

  useEffect(() => {
    handleCommand(recognizedText);
  }, [recognizedText]);

  useEffect(() => {
    // Check if the browser supports SpeechRecognition
    const SpeechRecognition =
      (window as WindowWithSpeechRecognition).webkitSpeechRecognition ||
      window.SpeechRecognition;

    if (SpeechRecognition) {
      const recognizer = new SpeechRecognition();
      recognizer.continuous = false; // Change to false for single recognition session
      recognizer.interimResults = true; // Show interim results
      recognizer.lang = "en-US";

      recognizer.onstart = () => {
        console.log("Speech recognition started");
        setIsListening(true);
        setShowDialog(false);
      };

      recognizer.onresult = (event: any) => {
        let interimTranscript = "";
        let finalTranscript = "";
        for (let i = 0; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        if (finalTranscript) {
          console.log("Final recognized text:", finalTranscript);
          setRecognizedText(finalTranscript);

          stopListening(); // Stop listening after final transcript
        } else if (interimTranscript) {
          console.log("Interim recognized text:", interimTranscript);
        }

        // Restart the silence timeout
        startSilenceTimeout();
      };

      recognizer.onend = () => {
        console.log("Speech recognition ended");

        // if (!stopListenRef.current) {
        //   console.log("restart");
        //   restartListening();
        // } else {
        //   setIsListening(false);
        //   console.log("stop");
        // }

        setIsListening(false);
        setShowDialog(true);
        console.log("stop");
      };

      recognizer.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        stopListening(); // Stop listening on error
      };

      recognitionRef.current = recognizer;
    } else {
      console.error("Browser does not support Speech Recognition API");
    }

    // Cleanup function to stop recognition when the component unmounts
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
      }
    };
  }, []);

  // Effect to handle stop listening
  useEffect(() => {
    if (stopListenRef.current) {
      stopListening();
    }
  }, [stopListenRef.current]);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      recognitionRef.current.start();
      setIsListening(true);
      stopListenRef.current = false; // Reset stopListen ref
      // Start the silence timeout
      startSilenceTimeout();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);

      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
      }
    }
  };

  const restartListening = () => {
    if (recognitionRef.current && !isListening) {
      recognitionRef.current.start();
      setIsListening(true);
      startSilenceTimeout();
    } else {
      console.log("Recognition is already active");
    }
  };

  const startSilenceTimeout = () => {
    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current);
    }
    silenceTimeoutRef.current = window.setTimeout(() => {
      stopListening();
    }, 5000);
  };

  return (
    <>
      {recognizedText !== "" && !isListening && showDialog && (
        <>
          <div className="fixed bottom-20 right-[130px] bg-white border border-gray-300 rounded shadow-lg z-40 ">
            <p className="m-3">{recognizedText}</p>
            <button
              onClick={() => {
                setShowDialog(false);
              }}
              className="bg-slate-900 rounded text-white m-2 p-2"
            >
              Close
            </button>
          </div>
        </>
      )}

      <div className="fixed bottom-8 right-8 bg-slate-900 text-white shadow-lg rounded-full flex w-[5rem] h-[5rem] items-center justify-center z-50">
        {isListening ? (
          <>
            <button
              onClick={() => {
                stopListenRef.current = true;
                setRecognizedText("");
                stopListening();
              }}
              disabled={!isListening}
            >
              <img
                src="./assets/wave-white.gif"
                alt="Example GIF"
                className="h-auto"
              />
            </button>
          </>
        ) : (
          <>
            <button onClick={startListening} disabled={isListening}>
              <img
                src="./assets/robot.png"
                alt="Example GIF"
                className="h-12 w-12"
              />
            </button>
          </>
        )}
      </div>
    </>
    // <>
    //   {recognizedText !== "" && !isListening && showDialog && (
    //     <>
    //       <div className="fixed bottom-20 right-[130px] bg-white border border-gray-300 rounded shadow-lg z-40">
    //         <p className="m-3">{recognizedText}</p>
    //         <button
    //           onClick={() => {
    //             setShowDialog(false);
    //           }}
    //           className="bg-slate-900 rounded text-white m-2 p-2"
    //         >
    //           Close
    //         </button>
    //       </div>
    //     </>
    //   )}

    //   <div className="fixed bottom-8 right-8 bg-slate-900 text-white shadow-lg rounded-full flex w-[5rem] h-[5rem] items-center justify-center z-50">
    //     {isListening ? (
    //       <>
    //         <button
    //           onClick={() => {
    //             stopListenRef.current = true;
    //             setRecognizedText("");
    //             stopListening();
    //           }}
    //           disabled={!isListening}
    //         >
    //           <img
    //             src="./assets/wave-white.gif"
    //             alt="Example GIF"
    //             className="h-auto"
    //           />
    //         </button>
    //       </>
    //     ) : (
    //       <>
    //         <button onClick={startListening} disabled={isListening}>
    //           <img
    //             src="./assets/robot.png"
    //             alt="Example GIF"
    //             className="h-12 w-12"
    //           />
    //         </button>
    //       </>
    //     )}
    //   </div>
    //   {localStorage.getItem("method") == "text-command" ? (
    //     <>
    //       {" "}
    //       <div className="fixed bottom-24 right-8 bg-white text-black shadow-lg rounded-lg p-4 z-50">
    //         <input
    //           type="text"
    //           className="border border-gray-300 rounded p-2 w-full"
    //           placeholder="Type your command here"
    //           value={recognizedText}
    //           onChange={(e) => setRecognizedText(e.target.value)}
    //         />
    //         <button
    //           onClick={() => handleCommand(recognizedText)}
    //           className="bg-slate-900 rounded text-white mt-2 p-2 w-full"
    //         >
    //           Submit
    //         </button>
    //       </div>
    //     </>
    //   ) : (
    //     <></>
    //   )}
    // </>
  );
};

export default ChatBot;
