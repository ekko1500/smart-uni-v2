"use client";

import React, { useState, useEffect, useRef } from "react";
import AudioStream from "@/components/elevenlabs/AudioStream";
import useMqtt from "@/hooks/useMqtt";

import { MQTT_API_CLASSROOM } from "@/lib/MQTTapi";

// TypeScript interface for the Window object to include SpeechRecognition
interface WindowWithSpeechRecognition extends Window {
  webkitSpeechRecognition: any;
}

const text = "Hello, this is a sample text to stream as speech.";

const VoiceAssistant = () => {
  const { message, client, publishMessage } = useMqtt(
    MQTT_API_CLASSROOM,
    "esp8266/led"
  );
  const { message: temperature } = useMqtt(
    MQTT_API_CLASSROOM,
    "sensor/temperature"
  );
  const { message: humidity } = useMqtt(MQTT_API_CLASSROOM, "sensor/humidity");

  const [isListening, setIsListening] = useState(false);
  const [recognizedText, setRecognizedText] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const silenceTimeoutRef = useRef<number | null>(null);
  const stopListenRef = useRef(false); // Ref to track stopListen state

  const toggleLed = (message) => {
    publishMessage(message);
  };

  useEffect(() => {}, [recognizedText]);

  useEffect(() => {
    if (recognizedText.toLowerCase().includes("led on")) {
      console.log("Turning LED on...");
      AudioStream("Turning LED on");
      toggleLed("1");
      // Perform actions for turning LED on
    } else if (recognizedText.toLowerCase().includes("led off")) {
      console.log("Turning LED off...");
      AudioStream("Turning LED off");
      toggleLed("0");
      // Perform actions for turning LED off
    } else if (recognizedText.toLowerCase().includes("temperature")) {
      console.log(temperature);
      AudioStream(temperature);

      // Perform actions for turning LED off
    } else {
      console.log("No LED command detected.");
    }
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
    }, 5000); // Adjust the timeout duration as needed (5 seconds)
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Jarvis-like Voice Assistant</h1>
      <button onClick={toggleLed}>
        {message === "1" ? "Turn Off LED" : "Turn On LED"}
      </button>

      {recognizedText != "" && !isListening && showDialog && (
        <>
          <div className="fixed bottom-20 left-[120px]   bg-white border border-gray-300 rounded shadow-lg">
            <p className=" m-3">{recognizedText}</p>
            <button
              onClick={() => {
                setShowDialog(false);
              }}
              className=" bg-slate-900 rounded text-white m-2  p-2  "
            >
              close
            </button>
          </div>
        </>
      )}

      <div className="absolute bottom-0 left-0 m-8 bg-slate-900 text-white shadow-lg rounded-full flex w-[5rem] h-[5rem] items-center justify-center  ">
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
                className=" h-auto"
              />
            </button>
          </>
        ) : (
          <>
            <button onClick={startListening} disabled={isListening}>
              <img
                src="./assets/robot.png"
                alt="Example GIF"
                className=" h-12 w-12"
              />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default VoiceAssistant;
