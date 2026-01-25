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
            if (currentTranscript) {
                setTranscript(currentTranscript);
                if (finalTranscript) {
                    transcriptRef.current = finalTranscript;
                    console.log("Final transcript captured:", finalTranscript);
                }
            }
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
            }
        };

        recognition.onend = () => {
            console.log("Voice recognition onend. Result:", transcriptRef.current);
            const final = transcriptRef.current.trim();
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
