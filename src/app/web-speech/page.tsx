"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";

const Page = () => {
  const [textValue, setTextValue] = useState<string>("");
  const [selectedVoice, setSelectedVoice] = useState<number>(0);
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

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

  if (!isMounted || !window.speechSynthesis) {
    return <span>Aw... your browser does not support Speech Synthesis</span>;
  }

  const speak = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(textValue);
    utterance.voice = voices[selectedVoice];
    console.log("Speaking:", utterance); // Debug log for utterance
    synth.speak(utterance);
  };

  return (
    <form onSubmit={speak}>
      <input
        type="text"
        value={textValue}
        onChange={(e) => setTextValue(e.target.value)}
      />
      <VoiceSelector
        selected={selectedVoice}
        setSelected={setSelectedVoice}
        voices={voices}
      />
      <button type="submit">Speak</button>
    </form>
  );
};

export default Page;

const VoiceSelector = ({ selected = 0, setSelected, voices }: any) => {
  return (
    <select
      value={selected}
      onChange={(e) => setSelected(parseInt(e.target.value))}
    >
      {voices.map((voice: SpeechSynthesisVoice, index: number) => (
        <option key={index} value={index}>
          {voice.name} ({voice.lang}) {voice.default && " [Default]"}
        </option>
      ))}
    </select>
  );
};
