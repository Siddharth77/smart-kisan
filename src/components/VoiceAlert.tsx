"use client";

import { Button } from "@/components/ui";

export function VoiceAlert({ text, lang = "te-IN" }: { text: string; lang?: string }) {
  function speak() {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  }

  return (
    <Button type="button" variant="secondary" onClick={speak}>
      Listen in Telugu
    </Button>
  );
}
