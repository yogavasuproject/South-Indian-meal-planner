import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Film, Upload, Sparkles, RefreshCw, Download, 
  Play, Pause, AlertCircle, CheckCircle, Video 
} from 'lucide-react';
import { apiStartVeoVideo, apiCheckVeoStatus, apiDownloadVeoVideo } from '../services/api';

interface VeoVideoModalProps {
  onClose: () => void;
  initialImage?: string | null;
  initialPrompt?: string;
}

const SAMPLE_VEO_PROMPTS = [
  "Hot steam rising gracefully from fresh steamed idlis, with a drizzle of golden ghee melting on top, cinematic kitchen lighting.",
  "Sizzling hot tadka pan with mustard seeds crackling, curry leaves crisping, and dried red chilies releasing fragrant aroma in smoking ghee.",
  "Slow motion pour of authentic South Indian filter coffee from a brass tumbler into a davarah, creating luxurious thick foam.",
  "Crispy golden masala dosa being folded cleanly on a sizzling flat tawa, steam gently escaping from the spiced potato filling."
];

const REASSURING_MESSAGES = [
  "Analyzing image composition & food textures...",
  "Synthesizing fluid thermal dynamics and rising steam...",
  "Rendering realistic South Indian kitchen movement...",
  "Polishing motion smoothness and color grading...",
  "Encoding high-definition video with Veo...",
  "Almost ready for your culinary presentation..."
];

export const VeoVideoModal: React.FC<VeoVideoModalProps> = ({
  onClose,
  initialImage,
  initialPrompt
}) => {
  const [imageBase64, setImageBase64] = useState<string | null>(initialImage || null);
  const [prompt, setPrompt] = useState<string>(
    initialPrompt || SAMPLE_VEO_PROMPTS[0]
  );
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [isGenerating, setIsGenerating] = useState(false);
  const [operationName, setOperationName] = useState<string | null>(null);
  const [progressMsgIdx, setProgressMsgIdx] = useState(0);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const pollIntervalRef = useRef<any>(null);

  // Rotate reassuring messages while video is generating
  useEffect(() => {
    let timer: any;
    if (isGenerating) {
      timer = setInterval(() => {
        setProgressMsgIdx((prev) => (prev + 1) % REASSURING_MESSAGES.length);
      }, 7000);
    }
    return () => clearInterval(timer);
  }, [isGenerating]);

  // Handle local image upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Start Veo generation
  const handleStartGeneration = async () => {
    if (!prompt.trim() || isGenerating) return;
    setIsGenerating(true);
    setErrorMessage(null);
    setVideoUrl(null);
    setProgressMsgIdx(0);

    try {
      const { operationName: opName } = await apiStartVeoVideo(
        prompt,
        aspectRatio,
        imageBase64 || undefined
      );
      setOperationName(opName);

      // Start polling status
      pollIntervalRef.current = setInterval(async () => {
        try {
          const status = await apiCheckVeoStatus(opName);
          if (status.done) {
            clearInterval(pollIntervalRef.current);
            if (status.error) {
              setErrorMessage(`Video generation error: ${status.error.message || 'Unknown error'}`);
              setIsGenerating(false);
            } else {
              // Download video
              const url = await apiDownloadVeoVideo(opName);
              setVideoUrl(url);
              setIsGenerating(false);
            }
          }
        } catch (pollErr: any) {
          console.warn('Polling error:', pollErr);
        }
      }, 5000);

    } catch (err: any) {
      console.error('Veo video generation error:', err);
      setErrorMessage(err?.message || 'Failed to start video generation.');
      setIsGenerating(false);
    }
  };

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-xl max-h-[92vh] bg-[#FAF7F2] rounded-3xl shadow-2xl border border-[#E8DFC8] flex flex-col overflow-hidden text-[#2D241E]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#2F1E4B] to-[#4A2D73] text-white p-5 relative flex-shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-2 text-purple-200 text-xs font-semibold uppercase tracking-wider mb-1">
            <Film className="w-3.5 h-3.5" />
            <span>Veo Video Generation • veo-3.1-fast-generate-preview</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold font-display text-white">
            Animate Food Photos into Video
          </h2>
          <p className="text-purple-100/80 text-xs mt-0.5">
            Turn South Indian dishes and kitchen moments into cinematic steaming videos.
          </p>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1 text-xs sm:text-sm">
          {/* Photo Source Upload / Preview */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-bold text-xs text-[#2D241E]">
                Source Photo to Animate:
              </label>
              {imageBase64 && (
                <button
                  onClick={() => setImageBase64(null)}
                  className="text-rose-600 hover:underline text-[11px]"
                >
                  Clear Photo
                </button>
              )}
            </div>

            {imageBase64 ? (
              <div className="relative rounded-2xl overflow-hidden border border-[#E8DFC8] bg-black/5 shadow-xs max-h-48">
                <img
                  src={imageBase64}
                  alt="Source photo"
                  className="w-full h-48 object-cover"
                />
                <span className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-xs text-white text-[10px] px-2 py-0.5 rounded-full font-medium">
                  Photo loaded for motion
                </span>
              </div>
            ) : (
              <label className="border-2 border-dashed border-[#D5C7B3] hover:border-[#A84B2C] bg-white p-6 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-colors space-y-2 text-center">
                <div className="w-10 h-10 rounded-full bg-[#FAF7F2] border border-[#E8DFC8] flex items-center justify-center text-[#A84B2C]">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-xs text-[#2D241E] block">
                    Upload a dish photo to animate
                  </span>
                  <span className="text-[11px] text-[#7A6A5D]">
                    PNG, JPG, or WEBP (or select from generated images)
                  </span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Aspect Ratio Selector (16:9 or 9:16) */}
          <div className="space-y-1.5">
            <label className="block font-bold text-xs text-[#2D241E]">
              Video Format / Aspect Ratio:
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setAspectRatio('16:9')}
                className={`py-2 px-3 rounded-xl font-bold text-xs border transition-all flex items-center justify-center space-x-2 cursor-pointer ${
                  aspectRatio === '16:9'
                    ? 'bg-[#3D2660] text-white border-transparent shadow-xs'
                    : 'bg-white text-[#5A4B3E] border-[#E8DFC8] hover:bg-[#FAF7F2]'
                }`}
              >
                <span>Landscape (16:9)</span>
              </button>

              <button
                type="button"
                onClick={() => setAspectRatio('9:16')}
                className={`py-2 px-3 rounded-xl font-bold text-xs border transition-all flex items-center justify-center space-x-2 cursor-pointer ${
                  aspectRatio === '9:16'
                    ? 'bg-[#3D2660] text-white border-transparent shadow-xs'
                    : 'bg-white text-[#5A4B3E] border-[#E8DFC8] hover:bg-[#FAF7F2]'
                }`}
              >
                <span>Reel / Portrait (9:16)</span>
              </button>
            </div>
          </div>

          {/* Motion Prompt Textarea */}
          <div className="space-y-1.5">
            <label className="block font-bold text-xs text-[#2D241E]">
              Motion & Cinematic Prompt:
            </label>
            <textarea
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the desired movement (steam, sizzling tadka, pouring coffee)..."
              className="w-full bg-white border border-[#E8DFC8] rounded-2xl p-3 text-xs sm:text-sm text-[#2D241E] focus:outline-none focus:ring-2 focus:ring-purple-400/40 resize-none"
            />
          </div>

          {/* Preset Prompts */}
          <div className="space-y-1.5">
            <span className="text-[10px] uppercase font-bold text-[#8A796C] block">
              Suggested Food Motion Prompts:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {SAMPLE_VEO_PROMPTS.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => setPrompt(p)}
                  className="p-2.5 bg-white border border-[#E8DFC8] rounded-xl text-left hover:border-purple-600 hover:bg-purple-50/50 transition-colors cursor-pointer text-[11px] text-[#4A3B2E] line-clamp-2"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Loading Animation / Status */}
          {isGenerating && (
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-2xl space-y-3 animate-pulse">
              <div className="flex items-center space-x-3">
                <RefreshCw className="w-5 h-5 text-purple-700 animate-spin flex-shrink-0" />
                <div>
                  <span className="font-bold text-xs text-purple-900 block">
                    Generating Video with Veo...
                  </span>
                  <span className="text-[11px] text-purple-700">
                    {REASSURING_MESSAGES[progressMsgIdx]}
                  </span>
                </div>
              </div>
              <div className="w-full bg-purple-200 h-1.5 rounded-full overflow-hidden">
                <div className="bg-purple-600 h-full rounded-full w-2/3 animate-pulse" />
              </div>
              <p className="text-[10px] text-purple-800/80 italic text-center">
                Veo video synthesis typically takes 1-2 minutes for high fidelity.
              </p>
            </div>
          )}

          {/* Error Notice */}
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Completed Video Player */}
          {videoUrl && (
            <div className="space-y-3 pt-2 border-t border-[#E8DFC8]">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-[#2D241E] flex items-center">
                  <Video className="w-4 h-4 mr-1 text-purple-700" />
                  Veo Generated Video Result:
                </span>
                <span className="text-[10px] text-purple-800 bg-purple-100 font-bold px-2 py-0.5 rounded-full flex items-center">
                  <CheckCircle className="w-3 h-3 mr-1" /> Complete
                </span>
              </div>

              <div className="rounded-2xl overflow-hidden border border-[#E8DFC8] bg-black shadow-lg">
                <video
                  src={videoUrl}
                  controls
                  autoPlay
                  loop
                  className="w-full max-h-72 mx-auto object-contain"
                />
              </div>

              <div className="flex items-center justify-end">
                <a
                  href={videoUrl}
                  download={`enna-samayal-veo-${Date.now()}.mp4`}
                  className="py-2 px-4 bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs rounded-xl flex items-center space-x-1.5 transition-colors shadow-xs"
                >
                  <Download className="w-4 h-4" />
                  <span>Download MP4</span>
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#F3ECE2] border-t border-[#E2D5C3] flex items-center justify-between">
          <span className="text-[11px] text-[#7A6A5D]">
            Model: <code className="bg-[#EAE2D5] px-1 py-0.5 rounded font-mono">veo-3.1-fast-generate-preview</code>
          </span>

          <button
            onClick={handleStartGeneration}
            disabled={isGenerating || !prompt.trim()}
            className="py-2.5 px-5 bg-gradient-to-r from-[#2F1E4B] to-[#4A2D73] hover:from-[#23153A] hover:to-[#3B225E] disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center space-x-2 cursor-pointer"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-purple-200" />
                <span>Simulating Video...</span>
              </>
            ) : (
              <>
                <Film className="w-4 h-4 text-purple-200" />
                <span>Generate Video</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
