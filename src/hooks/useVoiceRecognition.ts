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

        stopListening(); // Ensure clean state

        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        const resetSilenceTimer = () => {
            if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
            silenceTimerRef.current = setTimeout(() => {
                console.log("Silence detected, stopping...");
                recognition.stop();
            }, 3000);
        };

        recognition.onstart = () => {
            console.log("Voice recognition started");
            setIsListening(true);
            setTranscript('');
            transcriptRef.current = '';
            resetSilenceTimer();

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
                        if (!analyser) return;
                        analyser.getByteFrequencyData(dataArray);
                        let sum = 0;
                        for (let i = 0; i < bufferLength; i++) {
                            sum += dataArray[i];
                        }
                        const average = sum / bufferLength;
                        setVolume(average);

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
            let fullTranscript = '';

            for (let i = 0; i < event.results.length; ++i) {
                fullTranscript += event.results[i][0].transcript;
            }

            if (fullTranscript) {
                setTranscript(fullTranscript);
                transcriptRef.current = fullTranscript;
                console.log("Voice update:", fullTranscript);
            }
        };

        recognition.onerror = (event: any) => {
            console.error("Speech recognition error:", event.error);
            setIsListening(false);

            let errorMsg = "An error occurred with voice recognition.";
            if (event.error === 'not-allowed') {
                errorMsg = "Microphone access denied. Please enable it in browser settings.";
            } else if (event.error === 'no-speech') {
                errorMsg = "No speech was detected. Try speaking closer to the mic.";
            } else if (event.error === 'network') {
                errorMsg = "Network error. Voice recognition requires an internet connection.";
            }

            toast({
                title: "Voice Error",
                description: errorMsg,
                variant: "destructive"
            });

            stopListening();
        };

        recognition.onend = () => {
            console.log("Voice recognition onend triggered.");
            const final = transcriptRef.current.trim();
            if (final && onResult) {
                console.log("Dispatching result to callback:", final);
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
