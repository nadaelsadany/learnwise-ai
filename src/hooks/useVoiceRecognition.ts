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

    const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);

    const stopListening = useCallback(() => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
            recognitionRef.current = null;
        }
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
            animationFrameRef.current = null;
        }
        if (audioContextRef.current) {
            audioContextRef.current.close().catch(() => { });
            audioContextRef.current = null;
        }
        if (silenceTimerRef.current) {
            clearTimeout(silenceTimerRef.current);
            silenceTimerRef.current = null;
        }
        setIsListening(false);
        setVolume(0);
        console.log("Voice recognition fully stopped.");
    }, []);

    const startListening = useCallback((onResult?: (text: string) => void) => {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

        if (!SpeechRecognition) {
            toast({
                title: "Not Supported",
                description: "Voice recognition is not supported in this browser.",
                variant: "destructive"
            });
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = true; // Stay active to prevent early cut-offs
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        const resetSilenceTimer = () => {
            if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
            silenceTimerRef.current = setTimeout(() => {
                console.log("Silence detected, stopping...");
                stopListening();
            }, 2000); // 2 seconds of silence to auto-stop
        };

        recognition.onstart = () => {
            console.log("Voice recognition started");
            setIsListening(true);
            setTranscript('');
            transcriptRef.current = '';
            resetSilenceTimer();

            // Start volume analysis for visual feedback and silence detection
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

                        // If user is speaking (volume > some threshold), reset silence timer
                        if (average > 5) {
                            resetSilenceTimer();
                        }

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
            resetSilenceTimer();
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
                transcriptRef.current = finalText || interimText;
                console.log("Voice update:", { best: bestTranscript, isFinal: !!finalText });
            }
        };

        recognition.onnomatch = () => {
            console.log("Voice recognition: No match found.");
        };

        recognition.onerror = (event: any) => {
            console.error("Speech recognition error:", event.error);
            if (event.error !== 'no-speech') {
                stopListening();
            }

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
            console.log("Voice recognition onend. Result:", final);
            if (final && onResult) {
                onResult(final);
            }
            // Explicitly ensure cleanup happens
            if (isListening) stopListening();
        };

        recognition.start();
        recognitionRef.current = recognition;
    }, [toast, stopListening, isListening]);

    return {
        isListening,
        transcript,
        volume,
        startListening,
        stopListening,
        setTranscript
    };
};
