// AudioStream.tsx
import React, { useState } from "react";
import axios from "axios";

async function AudioStream(text) {
  const voiceId = "21m00Tcm4TlvDq8ikWAM";
  const apiKey = "b94c6a82ff9d19f7b2791e27f2cd4dc2";
  const voiceSettings = {
    stability: 0,
    similarity_boost: 0,
  };
  const baseUrl = "https://api.elevenlabs.io/v1/text-to-speech";
  const headers = {
    "Content-Type": "application/json",
    "xi-api-key": apiKey,
  };

  const requestBody = {
    text,
    voice_settings: voiceSettings,
  };

  try {
    const response = await axios.post(`${baseUrl}/${voiceId}`, requestBody, {
      headers,
      responseType: "blob",
    });

    if (response.status === 200) {
      const audio = new Audio(URL.createObjectURL(response.data));
      audio.play();
    } else {
      console.log("Error: Unable to stream audio.");
    }
  } catch (error) {
    // console.log("Error: Unable to stream audio.");
  } finally {
    // console.log(false);
  }
}

export default AudioStream;
