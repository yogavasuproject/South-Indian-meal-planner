import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Mic, MicOff, Volume2, Sparkles, AlertCircle, 
  Flame, Radio, ChefHat, CheckCircle2 
} from 'lucide-react';
import { DailyMenu } from '../types/meal';

interface LiveVoiceModalProps {
  onClose: () => void;
  currentMenu?: DailyMenu;
}

export const LiveVoiceModal: React.FC<LiveVoiceModalProps> = ({
  onClose,
  currentMenu
}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [liveTranscript, setLiveTranscript] = useState<string>(
    "Tap 'Start Voice Cooking' to speak hands-free with Paati at the stove."
  );

  // Audio Contexts & WebSockets refs
  const wsRef = useRef<WebSocket | null>(null);
  const inputAudioCtxRef = useRef<AudioContext | null>(null);
  const outputAudioCtxRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const audioQueueRef = useRef<Float32Array[]>([]);
  const isPlayingAudioRef = useRef<boolean>(false);

  // Helper: Float32Array to 16-bit PCM Base64
  const pcmToBase64 = (float32Array: Float32Array): string => {
    const buffer = new ArrayBuffer(float32Array.length * 2);
    const view = new DataView(buffer);
    for (let i = 0; i < float32Array.length; i++) {
      const s = Math.max(-1, Math.min(1, float32Array[i]));
      view.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    }
    let binary = '';
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  // Helper: Base64 24kHz PCM to AudioBuffer and playback
  const playAudioChunk = (audioCtx: AudioContext, base64PCM: string) => {
    try {
      const binary = atob(base64PCM);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      const int16 = new Int16Array(bytes.buffer);
      const float32 = new Float32Array(int16.length);
      for (let i = 0; i < int16.length; i++) {
        float32[i] = int16[i] / 32768.0;
      }

      audioQueueRef.current.push(float32);
      processAudioQueue(audioCtx);
    } catch (e) {
      console.error('Error decoding audio chunk:', e);
    }
  };

  const processAudioQueue = (audioCtx: AudioContext) => {
    if (isPlayingAudioRef.current || audioQueueRef.current.length === 0) return;
    isPlayingAudioRef.current = true;
    setIsSpeaking(true);

    const chunk = audioQueueRef.current.shift()!;
    const audioBuffer = audioCtx.createBuffer(1, chunk.length, 24000);
    audioBuffer.getChannelData(0).set(chunk);

    const source = audioCtx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioCtx.destination);
    source.onended = () => {
      isPlayingAudioRef.current = false;
      if (audioQueueRef.current.length > 0) {
        processAudioQueue(audioCtx);
      } else {
        setIsSpeaking(false);
      }
    };
    source.start();
  };

  const stopAllAudio = () => {
    audioQueueRef.current = [];
    isPlayingAudioRef.current = false;
    setIsSpeaking(false);
  };

  // Connect to Live API WebSocket
  const startLiveSession = async () => {
    setIsConnecting(true);
    setErrorMessage(null);

    try {
      // Setup Mic Input (16kHz)
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: 16000,
          echoCancellation: true,
          noiseSuppression: true,
        },
      });
      mediaStreamRef.current = stream;

      const inputAudioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({
        sampleRate: 16000,
      });
      inputAudioCtxRef.current = inputAudioCtx;

      // Setup Output Playback (24kHz)
      const outputAudioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({
        sampleRate: 24000,
      });
      outputAudioCtxRef.current = outputAudioCtx;

      // Connect WebSocket to /live
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/live`;
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        setIsConnected(true);
        setIsConnecting(false);
        setIsListening(true);
        setLiveTranscript("Connected to Paati Live API! Say 'Vanakkam' or ask about your dish.");

        // Hook up audio processor
        const source = inputAudioCtx.createMediaStreamSource(stream);
        const processor = inputAudioCtx.createScriptProcessor(4096, 1, 1);
        scriptProcessorRef.current = processor;

        source.connect(processor);
        processor.connect(inputAudioCtx.destination);

        processor.onaudioprocess = (e) => {
          if (isMuted || ws.readyState !== WebSocket.OPEN) return;
          const inputData = e.inputBuffer.getChannelData(0);
          const base64 = pcmToBase64(inputData);
          ws.send(JSON.stringify({ audio: base64 }));
        };
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.error) {
            setErrorMessage(msg.error);
          }
          if (msg.interrupted) {
            stopAllAudio();
          }
          if (msg.audio) {
            playAudioChunk(outputAudioCtx, msg.audio);
            setLiveTranscript("Paati: Speaking advice...");
          }
        } catch (e) {
          console.error('Error handling WebSocket message:', e);
        }
      };

      ws.onerror = (e) => {
        console.error('WebSocket error:', e);
        setErrorMessage('WebSocket connection failed. Ensure server is running.');
        setIsConnecting(false);
      };

      ws.onclose = () => {
        setIsConnected(false);
        setIsConnecting(false);
        setIsListening(false);
      };

    } catch (err: any) {
      console.error('Mic or WebSocket error:', err);
      setErrorMessage(
        err.name === 'NotAllowedError'
          ? 'Microphone permission was denied. Please allow microphone access in your browser.'
          : (err.message || 'Unable to start Live Voice session.')
      );
      setIsConnecting(false);
    }
  };

  const stopLiveSession = () => {
    stopAllAudio();
    if (scriptProcessorRef.current) {
      scriptProcessorRef.current.disconnect();
      scriptProcessorRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (inputAudioCtxRef.current) {
      inputAudioCtxRef.current.close();
      inputAudioCtxRef.current = null;
    }
    if (outputAudioCtxRef.current) {
      outputAudioCtxRef.current.close();
      outputAudioCtxRef.current = null;
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setIsConnected(false);
    setIsConnecting(false);
    setIsListening(false);
  };

  useEffect(() => {
    return () => {
      stopLiveSession();
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-[#FAF7F2] rounded-3xl shadow-2xl border border-[#E8DFC8] flex flex-col overflow-hidden text-[#2D241E]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1C442A] to-[#2B603D] text-white p-5 relative flex-shrink-0">
          <button
            onClick={() => {
              stopLiveSession();
              onClose();
            }}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-2 text-emerald-200 text-xs font-semibold uppercase tracking-wider mb-1">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>Gemini 3.8 Live API • Hands-Free Voice</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold font-display text-white">
            Kitchen Voice Assistant
          </h2>
          <p className="text-white/80 text-xs mt-0.5">
            Real-time conversational audio with Paati while your hands are busy cooking.
          </p>
        </div>

        {/* Central Visualizer Area */}
        <div className="p-6 sm:p-8 flex flex-col items-center justify-center space-y-6 flex-1 text-center">
          {/* Animated Pulsing Voice Orb */}
          <div className="relative flex items-center justify-center">
            {/* Outer Waves when speaking / listening */}
            {(isListening || isSpeaking) && (
              <>
                <div className={`absolute w-44 h-44 rounded-full transition-all duration-700 animate-ping opacity-20 ${
                  isSpeaking ? 'bg-amber-500' : 'bg-emerald-500'
                }`} />
                <div className={`absolute w-36 h-36 rounded-full transition-all duration-500 animate-pulse opacity-30 ${
                  isSpeaking ? 'bg-orange-400' : 'bg-teal-400'
                }`} />
              </>
            )}

            {/* Core Orb */}
            <div className={`w-28 h-28 rounded-full shadow-xl flex items-center justify-center transition-all duration-300 ${
              isConnected
                ? isSpeaking
                  ? 'bg-gradient-to-br from-amber-500 to-orange-600 ring-4 ring-orange-300 scale-105'
                  : 'bg-gradient-to-br from-emerald-600 to-teal-700 ring-4 ring-emerald-300'
                : 'bg-gradient-to-br from-[#7A6A5D] to-[#4A3B2E]'
            }`}>
              {isConnected ? (
                isSpeaking ? (
                  <Volume2 className="w-12 h-12 text-white animate-bounce" />
                ) : (
                  <Mic className="w-12 h-12 text-white animate-pulse" />
                )
              ) : (
                <ChefHat className="w-12 h-12 text-amber-200" />
              )}
            </div>
          </div>

          {/* Status Label */}
          <div className="space-y-1">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
              isConnected
                ? isSpeaking
                  ? 'bg-orange-100 text-orange-800'
                  : 'bg-emerald-100 text-emerald-800'
                : 'bg-[#EAE2D5] text-[#5A4B3E]'
            }`}>
              <span className={`w-2 h-2 rounded-full mr-2 ${
                isConnected
                  ? isSpeaking
                    ? 'bg-orange-500 animate-ping'
                    : 'bg-emerald-500 animate-pulse'
                  : 'bg-gray-400'
              }`} />
              {isConnected
                ? isSpeaking
                  ? 'Paati is Speaking...'
                  : 'Listening to your kitchen voice...'
                : 'Voice Session Idle'}
            </span>

            <p className="text-xs sm:text-sm text-[#4A3B2E] max-w-sm mx-auto font-medium pt-2">
              {liveTranscript}
            </p>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center space-x-2 text-left w-full">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Cooking Context Pill */}
          {currentMenu && (
            <div className="bg-[#F3ECE2] px-3 py-1.5 rounded-xl border border-[#E2D5C3] text-[11px] text-[#7A6A5D] flex items-center space-x-1.5">
              <Flame className="w-3.5 h-3.5 text-[#A84B2C]" />
              <span>Context: {currentMenu.title}</span>
            </div>
          )}
        </div>

        {/* Control Toolbar */}
        <div className="p-4 bg-[#F3ECE2] border-t border-[#E2D5C3] flex items-center justify-between">
          <div className="text-[11px] text-[#7A6A5D] flex items-center space-x-1">
            <Radio className="w-3.5 h-3.5 text-emerald-600" />
            <span>Model: <code className="font-mono font-bold">gemini-3.8-live</code></span>
          </div>

          <div className="flex items-center space-x-2">
            {isConnected ? (
              <>
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className={`p-2.5 rounded-xl border font-bold text-xs transition-colors cursor-pointer flex items-center space-x-1 ${
                    isMuted
                      ? 'bg-rose-100 text-rose-800 border-rose-300'
                      : 'bg-white text-[#2D241E] border-[#E8DFC8] hover:bg-[#FAF7F2]'
                  }`}
                  title={isMuted ? 'Unmute microphone' : 'Mute microphone'}
                >
                  {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  <span>{isMuted ? 'Muted' : 'Mute'}</span>
                </button>

                <button
                  onClick={stopLiveSession}
                  className="py-2 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-colors cursor-pointer shadow-xs"
                >
                  End Voice
                </button>
              </>
            ) : (
              <button
                onClick={startLiveSession}
                disabled={isConnecting}
                className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-[#1C442A] to-[#2B603D] hover:from-[#153420] hover:to-[#224C30] text-white font-bold text-xs transition-all shadow-md flex items-center space-x-2 cursor-pointer disabled:opacity-50"
              >
                <Mic className="w-4 h-4 text-emerald-300" />
                <span>{isConnecting ? 'Starting Mic...' : 'Start Voice Cooking'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
