import React, { useState } from 'react';
import { 
  X, Image as ImageIcon, Sparkles, Upload, Wand2, Download, 
  RefreshCw, Film, Check, AlertCircle 
} from 'lucide-react';
import { apiGenerateOrEditImage } from '../services/api';
import { Dish } from '../types/meal';

interface ImageStudioModalProps {
  onClose: () => void;
  initialDish?: Dish | null;
  onAnimateInVeo?: (imageUrl: string, promptText: string) => void;
}

const PRESET_IMAGE_PROMPTS = [
  {
    title: 'Ghee Roast Dosa',
    prompt: 'Crispy paper-thin golden cone Ghee Roast Dosa on a vibrant fresh green banana leaf with three colorful chutneys (coconut, spicy tomato, coriander) and sambar in steel bowls.',
  },
  {
    title: 'South Indian Virundhu',
    prompt: 'Lavish traditional South Indian wedding feast (Virundhu) served on a glossy banana leaf: steamed rice, murungakkai sambar, aviyal, beetroot poriyal, crispy appalam, vadai, and payasam.',
  },
  {
    title: 'Filter Coffee',
    prompt: 'Steaming hot authentic Kumbakonam degree filter coffee poured high between traditional South Indian brass davarah and tumbler, thick frothy crema on top, morning kitchen sunlight.',
  },
  {
    title: 'Ghee Pongal & Vada',
    prompt: 'Piping hot steaming Ven Pongal with golden roasted whole cashews and crushed black pepper, paired with a crispy medu vada and rich coconut chutney.',
  }
];

export const ImageStudioModal: React.FC<ImageStudioModalProps> = ({
  onClose,
  initialDish,
  onAnimateInVeo
}) => {
  const [prompt, setPrompt] = useState(
    initialDish 
      ? `Authentic home-cooked ${initialDish.name} (${initialDish.tamilName || ''}), beautifully plated on a banana leaf with authentic South Indian garnishes, steaming hot.` 
      : PRESET_IMAGE_PROMPTS[0].prompt
  );
  const [aspectRatio, setAspectRatio] = useState<'1:1' | '16:9' | '9:16' | '4:3' | '3:4'>('1:1');
  const [baseImage, setBaseImage] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [imageDescription, setImageDescription] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Handle local image upload for editing
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setBaseImage(reader.result as string);
        setIsEditing(true);
        setPrompt('Add fresh curry leaves on top and place a bowl of coconut chutney on the side');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;
    setIsGenerating(true);
    setErrorMessage(null);

    try {
      const result = await apiGenerateOrEditImage(
        prompt,
        aspectRatio,
        baseImage || undefined
      );
      setGeneratedImage(result.imageUrl);
      setImageDescription(result.description || null);
    } catch (err: any) {
      console.error('Image creation failed:', err);
      setErrorMessage(err?.message || 'Failed to generate image. Please verify your prompt or API key.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!generatedImage) return;
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `enna-samayal-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-xl max-h-[92vh] bg-[#FAF7F2] rounded-3xl shadow-2xl border border-[#E8DFC8] flex flex-col overflow-hidden text-[#2D241E]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#A84B2C] to-[#C75B35] text-white p-5 relative flex-shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-2 text-amber-200 text-xs font-semibold uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Gemini 3.1 Flash Image Studio</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold font-display text-white">
            {isEditing ? 'Edit & Style Food Photo' : 'Visualize Dish with AI'}
          </h2>
          <p className="text-white/80 text-xs mt-0.5">
            Use text prompts to create authentic South Indian dish plating or edit existing photos.
          </p>
        </div>

        {/* Scrollable Form Body */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1 text-xs sm:text-sm">
          {/* Mode Switcher / Upload section */}
          <div className="flex items-center justify-between bg-[#F3ECE2] p-2 rounded-2xl border border-[#E2D5C3]">
            <button
              onClick={() => {
                setIsEditing(false);
                setBaseImage(null);
              }}
              className={`flex-1 py-1.5 px-3 rounded-xl font-bold transition-all text-xs cursor-pointer ${
                !isEditing ? 'bg-white text-[#A84B2C] shadow-xs' : 'text-[#7A6A5D]'
              }`}
            >
              ✨ Create from Text
            </button>

            <label
              className={`flex-1 py-1.5 px-3 rounded-xl font-bold transition-all text-xs text-center cursor-pointer ${
                isEditing ? 'bg-white text-[#A84B2C] shadow-xs' : 'text-[#7A6A5D]'
              }`}
            >
              <span>📷 Edit Photo</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* Reference / Base Image Preview (if editing) */}
          {baseImage && (
            <div className="relative bg-white p-3 rounded-2xl border border-[#E8DFC8] space-y-2">
              <div className="flex items-center justify-between text-xs text-[#7A6A5D]">
                <span className="font-semibold">Original Image to Edit:</span>
                <button
                  onClick={() => {
                    setBaseImage(null);
                    setIsEditing(false);
                  }}
                  className="text-rose-600 hover:underline font-medium text-[11px]"
                >
                  Remove
                </button>
              </div>
              <img
                src={baseImage}
                alt="Source to edit"
                className="w-full h-36 object-cover rounded-xl border border-[#E8DFC8]"
              />
            </div>
          )}

          {/* Text Prompt Input */}
          <div className="space-y-1.5">
            <label className="block font-bold text-[#2D241E] text-xs">
              {isEditing ? 'What edits would you like to make?' : 'Describe the dish & presentation:'}
            </label>
            <textarea
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. Crispy golden dosa on banana leaf with fresh coconut chutney..."
              className="w-full bg-white border border-[#E8DFC8] rounded-2xl p-3 text-xs sm:text-sm text-[#2D241E] focus:outline-none focus:ring-2 focus:ring-[#A84B2C]/30 resize-none"
            />
          </div>

          {/* Aspect Ratio Selector */}
          <div className="space-y-1.5">
            <label className="block font-bold text-[#2D241E] text-xs">
              Aspect Ratio:
            </label>
            <div className="flex items-center gap-2">
              {(['1:1', '16:9', '9:16', '4:3', '3:4'] as const).map((ratio) => (
                <button
                  key={ratio}
                  onClick={() => setAspectRatio(ratio)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    aspectRatio === ratio
                      ? 'bg-[#A84B2C] text-white shadow-xs'
                      : 'bg-white text-[#5A4B3E] border border-[#E8DFC8] hover:bg-[#FAF7F2]'
                  }`}
                >
                  {ratio}
                </button>
              ))}
            </div>
          </div>

          {/* Inspiration Presets */}
          {!isEditing && (
            <div className="space-y-2">
              <label className="block font-bold text-[#2D241E] text-xs">
                Inspiration Presets:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {PRESET_IMAGE_PROMPTS.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => setPrompt(p.prompt)}
                    className="p-2.5 bg-white border border-[#E8DFC8] rounded-xl text-left hover:border-[#A84B2C] hover:bg-amber-50/50 transition-colors cursor-pointer"
                  >
                    <span className="font-bold text-xs text-[#2D241E] block">
                      {p.title}
                    </span>
                    <span className="text-[10px] text-[#7A6A5D] line-clamp-1">
                      {p.prompt}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Result Preview */}
          {generatedImage && (
            <div className="space-y-3 pt-2 border-t border-[#E8DFC8]">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-[#2D241E]">
                  Generated Visual:
                </span>
                <span className="text-[10px] text-emerald-700 bg-emerald-100 font-bold px-2 py-0.5 rounded-full flex items-center">
                  <Check className="w-3 h-3 mr-1" /> Ready
                </span>
              </div>

              <div className="overflow-hidden rounded-2xl border border-[#E8DFC8] bg-black/5 shadow-md">
                <img
                  src={generatedImage}
                  alt="Generated South Indian culinary creation"
                  className="w-full h-auto object-contain max-h-72 mx-auto"
                />
              </div>

              {imageDescription && (
                <p className="text-xs text-[#7A6A5D] italic">
                  {imageDescription}
                </p>
              )}

              {/* Action Buttons for Result */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={handleDownload}
                  className="flex-1 py-2 px-3 bg-white border border-[#E8DFC8] hover:bg-[#FAF7F2] text-[#2D241E] font-bold text-xs rounded-xl flex items-center justify-center space-x-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <Download className="w-4 h-4 text-[#A84B2C]" />
                  <span>Download Image</span>
                </button>

                {onAnimateInVeo && (
                  <button
                    onClick={() => onAnimateInVeo(generatedImage, prompt)}
                    className="flex-1 py-2 px-3 bg-[#1C442A] hover:bg-[#255A38] text-white font-bold text-xs rounded-xl flex items-center justify-center space-x-1.5 transition-colors cursor-pointer shadow-xs"
                  >
                    <Film className="w-4 h-4 text-emerald-300" />
                    <span>Animate with Veo</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer CTA */}
        <div className="p-4 bg-[#F3ECE2] border-t border-[#E2D5C3] flex items-center justify-between">
          <span className="text-[11px] text-[#7A6A5D]">
            Model: <code className="bg-[#EAE2D5] px-1 py-0.5 rounded font-mono">gemini-3.1-flash-image-preview</code>
          </span>

          <button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            className="py-2.5 px-5 bg-gradient-to-r from-[#A84B2C] to-[#C75B35] hover:from-[#923C20] hover:to-[#B34E2A] disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center space-x-2 cursor-pointer"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-amber-200" />
                <span>Crafting Visual...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4 text-amber-200" />
                <span>{isEditing ? 'Apply Edits' : 'Generate Image'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
