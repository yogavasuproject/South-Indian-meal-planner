import React, { useState, useRef, useEffect } from 'react';
import { 
  X, Send, Bot, User, Sparkles, ChefHat, Volume2, 
  RotateCcw, Copy, Check, MessageSquare, Zap, Brain
} from 'lucide-react';
import { ChatMessage, apiSendChatMessage, apiVoiceAssist } from '../services/api';
import { DailyMenu } from '../types/meal';

interface GeminiChatModalProps {
  onClose: () => void;
  currentMenu?: DailyMenu;
  initialPrompt?: string;
}

type ChatRole = 'paati' | 'chef' | 'express';
type ModelChoice = 'gemini-3.5-flash' | 'gemini-3.1-pro-preview' | 'gemini-3.1-flash-lite';

const ROLES: Record<ChatRole, { name: string; title: string; avatar: string; instruction: string; color: string }> = {
  paati: {
    name: 'Paati',
    title: "Grandmother's Secret Recipes & Kaikandham",
    avatar: '👵',
    instruction: `You are Paati, a loving, traditional South Indian grandmother from Thanjavur/Madurai. 
You speak warmly with Tamil culinary proverbs and affectionate phrases like 'Kanna', 'Thambi', or 'Chellam'.
You explain authentic techniques: how to roast coriander seeds without burning, why shallots (chinna vengayam) make sambar sweet, how to balance sourness (pulippu) and salt, and traditional digestive remedies (seeragam, perungayam, ingi).`,
    color: 'from-amber-600 to-orange-700'
  },
  chef: {
    name: 'Chef Sundaram',
    title: 'Master of South Indian Flavors & Techniques',
    avatar: '👨‍🍳',
    instruction: `You are Chef Sundaram, a celebrated chef specializing in authentic Tamil Nadu, Kerala, Karnataka, Andhra & Telangana cuisines.
You provide precise culinary science, oil-to-spice tempering dynamics, texture mastery (crispy dosa, soft mallipoo idlis), restaurant-quality finishing touches, and step-by-step troubleshooting.`,
    color: 'from-emerald-700 to-teal-800'
  },
  express: {
    name: 'Express Kitchen Coach',
    title: '15-Min Meals & Working Parent Hacks',
    avatar: '⚡',
    instruction: `You are a practical, fast-paced South Indian everyday kitchen coach.
You focus on one-pot pressure cooker dishes, batch cooking, pre-made podis, quick kuzhambus, 10-minute chutneys, and meal-prep optimization with zero waste. Keep answers short, bulleted, and immediately actionable.`,
    color: 'from-blue-600 to-indigo-700'
  }
};

const SUGGESTIONS = [
  "How do I fix watery sambar quickly?",
  "Why is my dosa sticking to the cast iron tawa?",
  "Best substitute if I don't have tamarind?",
  "How to get crispy medu vadas with less oil?",
  "How to keep idli batter fresh in hot weather?",
  "Secret to dark, aromatic Chettinad gravies"
];

export const GeminiChatModal: React.FC<GeminiChatModalProps> = ({
  onClose,
  currentMenu,
  initialPrompt
}) => {
  const [selectedRole, setSelectedRole] = useState<ChatRole>('paati');
  const [selectedModel, setSelectedModel] = useState<ModelChoice>('gemini-3.5-flash');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'model',
      content: `Vanakkam! I am your kitchen mentor. ${
        currentMenu 
          ? `I see you are planning "${currentMenu.title}" today. ` 
          : ''
      }Ask me any cooking doubts, spice secrets, flame adjustments, or ingredient substitutions!`
    }
  ]);
  const [inputPrompt, setInputPrompt] = useState(initialPrompt || '');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputPrompt).trim();
    if (!text || isLoading) return;

    const newHistory: ChatMessage[] = [
      ...messages,
      { role: 'user', content: text }
    ];
    setMessages(newHistory);
    setInputPrompt('');
    setIsLoading(true);

    const menuContext = currentMenu 
      ? `Today's Menu: ${currentMenu.title}. Servings: ${currentMenu.servings}. Breakfast: ${currentMenu.breakfast.title}. Lunch: ${currentMenu.lunch.title}. Dinner: ${currentMenu.dinner.title}. Available ingredients: ${currentMenu.shoppingList?.map(c => c.items.map(i => i.name).join(', ')).join('; ')}`
      : undefined;

    try {
      const response = await apiSendChatMessage(
        newHistory,
        ROLES[selectedRole].instruction,
        selectedModel,
        menuContext
      );

      setMessages(prev => [
        ...prev,
        { role: 'model', content: response.reply }
      ]);
    } catch (err: any) {
      console.error('Chat error:', err);
      setMessages(prev => [
        ...prev,
        { 
          role: 'model', 
          content: 'Kanna, I had a momentary hitch reaching my culinary notes. Please check your connection or try asking again!' 
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const handlePlayVoice = async (text: string, idx: number) => {
    if (isPlayingAudio !== null) return;
    setIsPlayingAudio(idx);
    try {
      const base64Audio = await apiVoiceAssist(text.slice(0, 300), selectedRole === 'chef' ? 'Puck' : 'Kore');
      if (base64Audio) {
        const audio = new Audio(`data:audio/mp3;base64,${base64Audio}`);
        audio.onended = () => setIsPlayingAudio(null);
        audio.onerror = () => setIsPlayingAudio(null);
        await audio.play();
      } else {
        setIsPlayingAudio(null);
      }
    } catch {
      setIsPlayingAudio(null);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        role: 'model',
        content: `Vanakkam! Switched to ${ROLES[selectedRole].name}. What would you like help with at the stove?`
      }
    ]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl h-[90vh] bg-[#FAF7F2] rounded-3xl shadow-2xl border border-[#E8DFC8] flex flex-col overflow-hidden text-[#2D241E]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Role Persona & Model Selector */}
        <div className={`bg-gradient-to-r ${ROLES[selectedRole].color} text-white p-4 sm:p-5 relative flex-shrink-0 transition-colors duration-300`}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-3 pr-10">
            <span className="text-3xl p-1.5 bg-white/15 rounded-2xl flex-shrink-0">
              {ROLES[selectedRole].avatar}
            </span>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg sm:text-xl font-bold font-display text-white">
                  {ROLES[selectedRole].name}
                </h2>
                <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full text-white/90 font-medium">
                  Gemini AI Advisor
                </span>
              </div>
              <p className="text-xs text-white/80 line-clamp-1">
                {ROLES[selectedRole].title}
              </p>
            </div>
          </div>

          {/* Model Selector & Role Switcher Bar */}
          <div className="mt-3 pt-3 border-t border-white/15 flex flex-wrap items-center justify-between gap-2 text-xs">
            {/* Role Switcher */}
            <div className="flex items-center bg-black/20 p-1 rounded-xl">
              {(Object.keys(ROLES) as ChatRole[]).map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    setSelectedRole(r);
                    setMessages(prev => [
                      ...prev,
                      {
                        role: 'model',
                        content: `Switched persona to ${ROLES[r].name}: ${ROLES[r].title}. How can I assist?`
                      }
                    ]);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center space-x-1 ${
                    selectedRole === r 
                      ? 'bg-white text-[#2D241E] shadow-xs' 
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  <span>{ROLES[r].avatar}</span>
                  <span className="capitalize">{r}</span>
                </button>
              ))}
            </div>

            {/* Model Selector */}
            <div className="flex items-center bg-black/20 p-1 rounded-xl text-[11px]">
              <button
                onClick={() => setSelectedModel('gemini-3.5-flash')}
                title="gemini-3.5-flash: Balanced for general culinary tasks"
                className={`px-2 py-1 rounded-lg font-medium transition-all cursor-pointer flex items-center space-x-1 ${
                  selectedModel === 'gemini-3.5-flash'
                    ? 'bg-amber-300 text-amber-950 font-bold shadow-xs'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                <Sparkles className="w-3 h-3" />
                <span>3.5 Flash</span>
              </button>

              <button
                onClick={() => setSelectedModel('gemini-3.1-pro-preview')}
                title="gemini-3.1-pro-preview: Deep culinary science & reasoning"
                className={`px-2 py-1 rounded-lg font-medium transition-all cursor-pointer flex items-center space-x-1 ${
                  selectedModel === 'gemini-3.1-pro-preview'
                    ? 'bg-purple-300 text-purple-950 font-bold shadow-xs'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                <Brain className="w-3 h-3" />
                <span>3.1 Pro</span>
              </button>

              <button
                onClick={() => setSelectedModel('gemini-3.1-flash-lite')}
                title="gemini-3.1-flash-lite: Fast lightning tips"
                className={`px-2 py-1 rounded-lg font-medium transition-all cursor-pointer flex items-center space-x-1 ${
                  selectedModel === 'gemini-3.1-flash-lite'
                    ? 'bg-emerald-300 text-emerald-950 font-bold shadow-xs'
                    : 'text-white/80 hover:text-white'
                }`}
              >
                <Zap className="w-3 h-3" />
                <span>3.1 Lite</span>
              </button>
            </div>
          </div>
        </div>

        {/* Scrollable Message Thread */}
        <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4 text-xs sm:text-sm">
          {messages.map((msg, idx) => {
            const isModel = msg.role === 'model';
            return (
              <div 
                key={idx} 
                className={`flex items-start gap-2.5 ${isModel ? 'justify-start' : 'justify-end'}`}
              >
                {isModel && (
                  <div className="w-8 h-8 rounded-full bg-[#EAE2D5] border border-[#D5C7B3] flex items-center justify-center flex-shrink-0 text-base shadow-xs">
                    {ROLES[selectedRole].avatar}
                  </div>
                )}

                <div 
                  className={`max-w-[85%] sm:max-w-[80%] rounded-2xl p-3.5 leading-relaxed shadow-xs relative group ${
                    isModel 
                      ? 'bg-white text-[#2D241E] border border-[#E8DFC8]' 
                      : 'bg-[#A84B2C] text-white rounded-tr-xs'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>

                  {/* Message Action toolbar */}
                  {isModel && (
                    <div className="flex items-center space-x-2 mt-2 pt-2 border-t border-[#F3ECE2] text-[#8A796C] text-[11px]">
                      <button
                        onClick={() => handleCopy(msg.content, idx)}
                        className="hover:text-[#2D241E] flex items-center space-x-1 transition-colors"
                        title="Copy answer"
                      >
                        {copiedIdx === idx ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span className="text-emerald-700">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => handlePlayVoice(msg.content, idx)}
                        disabled={isPlayingAudio !== null}
                        className={`hover:text-[#2D241E] flex items-center space-x-1 transition-colors ${
                          isPlayingAudio === idx ? 'text-amber-600 font-bold animate-pulse' : ''
                        }`}
                        title="Listen to advice"
                      >
                        <Volume2 className="w-3 h-3" />
                        <span>{isPlayingAudio === idx ? 'Speaking...' : 'Listen'}</span>
                      </button>
                    </div>
                  )}
                </div>

                {!isModel && (
                  <div className="w-8 h-8 rounded-full bg-[#A84B2C] text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center space-x-2 text-xs text-[#7A6A5D] bg-white/70 p-3 rounded-2xl border border-[#E8DFC8] w-fit animate-pulse">
              <span className="text-base">{ROLES[selectedRole].avatar}</span>
              <span>{ROLES[selectedRole].name} is thinking with {selectedModel}...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Pills */}
        <div className="px-4 py-2 bg-[#F3ECE2] border-t border-[#E2D5C3] flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <span className="text-[10px] uppercase font-bold text-[#8A796C] whitespace-nowrap mr-1">
            Quick Ask:
          </span>
          {SUGGESTIONS.map((sug, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(sug)}
              disabled={isLoading}
              className="text-[11px] bg-white hover:bg-amber-50 text-[#5A4B3E] px-2.5 py-1 rounded-full border border-[#DCD2C4] whitespace-nowrap transition-colors flex-shrink-0 cursor-pointer shadow-2xs"
            >
              {sug}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-white border-t border-[#E8DFC8] flex items-center gap-2">
          <button
            onClick={handleResetChat}
            title="Reset conversation"
            className="p-2.5 rounded-xl border border-[#E8DFC8] text-[#8A796C] hover:bg-[#FAF7F2] hover:text-[#2D241E] transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <input
            type="text"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder={`Ask ${ROLES[selectedRole].name} anything (e.g. "How to season cast iron tawa?")...`}
            className="flex-1 bg-[#FAF7F2] border border-[#E8DFC8] rounded-xl px-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#A84B2C]/30 text-[#2D241E]"
            disabled={isLoading}
          />

          <button
            onClick={() => handleSendMessage()}
            disabled={!inputPrompt.trim() || isLoading}
            className="p-2.5 sm:px-4 sm:py-2.5 rounded-xl bg-[#A84B2C] hover:bg-[#8F3C20] disabled:opacity-40 text-white font-bold text-xs sm:text-sm transition-all flex items-center space-x-1.5 shadow-md shadow-[#A84B2C]/20 cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </div>
      </div>
    </div>
  );
};
