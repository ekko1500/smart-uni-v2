"use client";

import React, { useState, useEffect, useRef } from "react";
import useMqtt from "@/hooks/useMqtt";
import { MQTT_API_GARDEN } from "@/lib/MQTTapi";

// TypeScript interface for the Window object to include SpeechRecognition
interface WindowWithSpeechRecognition extends Window {
  webkitSpeechRecognition: any;
}

const VoiceAssistant = () => {
  const { message, client, publishMessage } = useMqtt(
    MQTT_API_GARDEN,
    "esp8266/led"
  );
  const { message: temperature } = useMqtt(
    MQTT_API_GARDEN,
    "sensor/temperature"
  );
  const { message: humidity } = useMqtt(MQTT_API_GARDEN, "sensor/humidity");
  const [isListening, setIsListening] = useState(false);
  const [recognizedText, setRecognizedText] = useState("");
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const silenceTimeoutRef = useRef<number | null>(null);
  const stopListenRef = useRef(false); // Ref to track stopListen state

  const [selectedVoice, setSelectedVoice] = useState<number>(0);
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  const toggleLed = (message: string) => {
    publishMessage(message);
  };

  const speak = (text: string) => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = voices[selectedVoice];
    console.log("Speaking:", utterance); // Debug log for utterance

    synth.speak(utterance);
  };

  useEffect(() => {
    setIsMounted(true);

    if (typeof window !== "undefined") {
      const synth = window.speechSynthesis;
      if (synth) {
        const populateVoiceList = () => {
          const newVoices = synth.getVoices();
          setVoices(newVoices);
          console.log("Voices loaded:", newVoices); // Debug log for voices
        };

        populateVoiceList();
        if (synth.onvoiceschanged !== undefined) {
          synth.onvoiceschanged = populateVoiceList;
        }
      }
    }
  }, []);

  const waitAndSpeak = (text) => {
    stopListening();
    speak(text);
    restartListening();
  };

  useEffect(() => {
    if (!isMounted || !window.speechSynthesis) {
      console.error("Browser does not support Speech Synthesis");
      return;
    }

    if (recognizedText) {
      waitAndSpeak(recognizedText);
    }

    if (recognizedText.toLowerCase().includes("led on")) {
      console.log("Turning LED on...");

      toggleLed("1");
    } else if (recognizedText.toLowerCase().includes("led off")) {
      console.log("Turning LED off...");
      toggleLed("0");
    } else if (recognizedText.toLowerCase().includes("temperature")) {
      console.log(temperature);
      stopListening();
      speak(
        temperature
          ? "The temperature is " + temperature + " degrees Celsius"
          : "I don't know the temperature"
      );
      restartListening();
    } else {
      console.log("No LED command detected.");
    }
  }, [recognizedText, isMounted, voices, selectedVoice]);

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

        if (!stopListenRef.current) {
          console.log("restart");
          restartListening();
        } else {
          setIsListening(false);
          console.log("stop");
        }
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

      {recognizedText !== "" && isListening && (
        <>
          <div className="fixed bottom-20 left-[120px] bg-white border border-gray-300 rounded shadow-lg">
            <p className="m-3">{recognizedText}</p>
            <button className="bg-slate-900 rounded text-white m-2 p-2">
              close
            </button>
          </div>
        </>
      )}

      <div className="absolute bottom-0 left-0 m-8 bg-slate-900 text-white shadow-lg rounded-full flex w-[5rem] h-[5rem] items-center justify-center">
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

      <div></div>
    </div>
  );
};

export default VoiceAssistant;
