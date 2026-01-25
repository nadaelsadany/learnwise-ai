import { useState, useCallback, useRef } from 'react';
import { useToast } from './use-toast';

export const useVoiceRecognition = () => {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const recognitionRef = useRef<any>(null);
    const transcriptRef = useRef('');
    const { toast } = useToast();

    const startListening = useCallback(() => {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

        if (!SpeechRecognition) {
            toast({
                title: "Not Supported",
                description: "Voice recognition is not supported in this browser. Try Chrome or Edge.",
                variant: "destructive"
            });
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = false; // Auto-stop after one phrase
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
            console.log("Voice recognition started");
            setIsListening(true);
            setTranscript('');
            transcriptRef.current = '';
        };

        recognition.onresult = (event: any) => {
            let interimTranscript = '';
            let finalTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; ++i) {
                const transcriptPart = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    finalTranscript += transcriptPart;
                } else {
                    interimTranscript += transcriptPart;
                }
            }

            const currentTranscript = finalTranscript || interimTranscript;
            console.log("Voice recognition result:", { final: finalTranscript, interim: interimTranscript });
            if (currentTranscript) {
                setTranscript(currentTranscript);
                if (finalTranscript) {
                    transcriptRef.current = finalTranscript;
                }
            }
        };

        recognition.onerror = (event: any) => {
            console.error("Speech recognition error:", event.error);
            setIsListening(false);

            if (event.error === 'not-allowed') {
                toast({
                    title: "Microphone Access Denied",
                    description: "Please enable microphone permissions.",
                    variant: "destructive"
                });
            }
        };

        recognition.onend = () => {
            console.log("Voice recognition ended. Final transcript ref:", transcriptRef.current);
            setIsListening(false);
        };

        recognition.start();
        recognitionRef.current = recognition;
    }, [toast]);

    const stopListening = useCallback(() => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
    }, []);

    return {
        isListening,
        transcript,
        startListening,
        stopListening,
        setTranscript
    };
};
