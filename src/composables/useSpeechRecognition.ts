import { ref } from 'vue';

declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }

  interface SpeechRecognition extends EventTarget {
    lang: string;
    continuous: boolean;
    interimResults: boolean;
    start(): void;
    stop(): void;
    onstart: () => void;
    onend: () => void;
    onresult: (event: SpeechRecognitionEvent) => void;
  }

  interface SpeechRecognitionEvent extends Event {
    results: SpeechRecognitionResultList;
  }
}

interface ExtendedSpeechRecognitionEvent extends SpeechRecognitionEvent {
  resultIndex: number;
}


export function useSpeechRecognition() {

  const transcript = ref('');
  const isListening = ref(false);
  let recognition: SpeechRecognition | null = null;

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    console.warn('SpeechRecognition is not supported in this browser.');
    return undefined;
  }



  recognition = new SpeechRecognition();
  const finalTranscript = ref('');
  const interimTranscript = ref('');

  if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {

    if (recognition) {
      recognition.lang = 'es-ES';
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onstart = () => {
        isListening.value = true;
      };

      recognition.onend = () => {
        isListening.value = false;
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const e = event as ExtendedSpeechRecognitionEvent;
        interimTranscript.value = '';

        for (let i = e.resultIndex; i < e.results.length; ++i) {
          const result = e.results[i];
          if (result.isFinal) {
            finalTranscript.value += result[0].transcript;
          } else {
            interimTranscript.value += result[0].transcript;
          }
        }

        transcript.value = finalTranscript.value + interimTranscript.value;
      };



    }
  }

  const startListening = () => {
    if (recognition) recognition.start();
    console.log('Listening');
  };

  const stopListening = () => {
    if (recognition) recognition.stop();
    console.log('stopListening');
  };


  const clearTranscript = () => {
    transcript.value = '';
    finalTranscript.value = '';
    interimTranscript.value = '';
    console.log('Transcript cleared');
  };


  return {
    transcript,
    isListening,
    startListening,
    stopListening,
    clearTranscript
  };
}
