import { useState, useCallback, useRef } from 'react';
import { useToast } from './use-toast';

export const useVoiceRecognition = () => {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [volume, setVolume] = useState(0);
    const recognitionRef = useRef<any>(null);
    const transcriptRef = useRef('');
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const animationFrameRef = useRef<number | null>(null);
    const { toast } = useToast();

    const stopListening = useCallback(() => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
        }
        if (audioContextRef.current) {
            audioContextRef.current.close();
            audioContextRef.current = null;
        }
        setIsListening(false);
        setVolume(0);
    }, []);

    const startListening = useCallback((onResult?: (text: string) => void) => {
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
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
            console.log("Voice recognition started");
            setIsListening(true);
            setTranscript('');
            transcriptRef.current = '';

            // Start volume analysis
            try {
                navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
                    const audioContext = new AudioContext();
                    const analyser = audioContext.createAnalyser();
                    const source = audioContext.createMediaStreamSource(stream);
                    source.connect(analyser);
                    analyser.fftSize = 256;

                    const bufferLength = analyser.frequencyBinCount;
                    const dataArray = new Uint8Array(bufferLength);

                    const updateVolume = () => {
                        analyser.getByteFrequencyData(dataArray);
                        let sum = 0;
                        for (let i = 0; i < bufferLength; i++) {
                            sum += dataArray[i];
                        }
                        const average = sum / bufferLength;
                        setVolume(average);
                        animationFrameRef.current = requestAnimationFrame(updateVolume);
                    };

                    audioContextRef.current = audioContext;
                    analyserRef.current = analyser;
                    updateVolume();
                }).catch(err => console.error("Volume analysis failed:", err));
            } catch (err) {
                console.error("Audio Context initialization failed:", err);
            }
        };

        recognition.onresult = (event: any) => {
            let interimText = '';
            let finalText = '';

            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalText += event.results[i][0].transcript;
                } else {
                    interimText += event.results[i][0].transcript;
                }
            }

            const bestTranscript = finalText || interimText;
            if (bestTranscript) {
                setTranscript(bestTranscript);
                // ALWAYS update the ref with the best we have, not just the "final" one
                // This ensures that if the recognition ends abruptly, we send what we heard
                transcriptRef.current = finalText || interimText;
                console.log("Voice update:", { best: bestTranscript, isFinal: !!finalText });
            }
        };

        recognition.onnomatch = () => {
            console.log("Voice recognition: No match found.");
        };

        recognition.onerror = (event: any) => {
            console.error("Speech recognition error:", event.error);
            stopListening();

            if (event.error === 'not-allowed') {
                toast({
                    title: "Microphone Access Denied",
                    description: "Please enable microphone permissions.",
                    variant: "destructive"
                });
            } else if (event.error === 'no-speech') {
                console.log("No speech detected.");
            }
        };

        recognition.onend = () => {
            const final = transcriptRef.current.trim();
            console.log("Voice recognition onend. Finalizing with:", final);
            if (final && onResult) {
                onResult(final);
            }
            stopListening();
        };

        recognition.start();
        recognitionRef.current = recognition;
    }, [toast, stopListening]);

    return {
        isListening,
        transcript,
        volume,
        startListening,
        stopListening,
        setTranscript
    };
};
