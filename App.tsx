
import React, { useState } from 'react';
import { Search, Flame, Shield, Wind, Sparkles, Ghost, Swords, BrainCircuit, History, Zap, ArrowRight, Anchor, User, Volume2, Bell, Scroll, BookOpen, Map, Copy, Check, ExternalLink, Code, Trophy, Import, MousePointer2, Heart, Brain, Star, Music } from 'lucide-react';
import { DeepwokenBuild } from './types';
import { generateBuildDetails, generateBuildImage } from './services/geminiService';
import StatBlock from './components/StatBlock';
import LoadingOverlay from './components/LoadingOverlay';

const App: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentBuild, setCurrentBuild] = useState<DeepwokenBuild | null>(null);
  const [history, setHistory] = useState<DeepwokenBuild[]>([]);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const build = await generateBuildDetails(prompt);
      const imageUrl = await generateBuildImage(build);
      const finalBuild = { ...build, imageUrl };
      
      setCurrentBuild(finalBuild);
      setHistory(prev => [finalBuild, ...prev].slice(0, 5));
    } catch (err) {
      console.error(err);
      setError("Failed to manifest build. The Depths are turbulent. Ensure your prompt is detailed.");
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    if (!currentBuild) return;
    navigator.clipboard.writeText(currentBuild.exportSummary).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const selectPreset = (p: string) => setPrompt(p);

  const getBadgeColor = (name: string) => {
    if (name.toUpperCase().includes('[PVE]')) return 'bg-emerald-500/30 text-emerald-200 border-emerald-400/20';
    if (name.toUpperCase().includes('[PVP]')) return 'bg-red-500/30 text-red-200 border-red-400/20';
    return 'bg-blue-500/30 text-blue-200 border-blue-400/20';
  };

  return (
    <div className="min-h-screen pb-20 deepwoken-gradient selection:bg-blue-500/30">
      {loading && <LoadingOverlay />}

      <header className="pt-16 pb-8 px-4 text-center">
        <div className="inline-flex items-center gap-3 bg-blue-600/10 border border-blue-500/20 px-4 py-2 rounded-full mb-6 animate-pulse">
          <Trophy className="w-4 h-4 text-blue-400" />
          <span className="text-[10px] font-cinzel font-bold text-blue-200 tracking-[0.2em] uppercase">
            Architected by <span className="text-white">Nate Epps</span>
          </span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-cinzel font-bold text-white mb-2 tracking-tighter drop-shadow-[0_0_20px_rgba(59,130,246,0.3)]">
          DEEPWOKEN <span className="text-blue-500 italic">ARCHITECT</span>
        </h1>
        
        <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed mb-4 font-light">
          Professional theorycrafting for Power 20 manifestations.
        </p>
      </header>

      <main className="max-w-7xl mx-auto px-4">
        <section className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-12 backdrop-blur-sm shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
          <form onSubmit={handleGenerate} className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ex: [PVP] Heavy Frostdraw Starkindred Build..."
                className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-gray-600"
              />
            </div>
            <button
              disabled={loading}
              type="submit"
              className="bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white px-8 py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 group shadow-lg shadow-blue-900/40"
            >
              <BrainCircuit className="group-hover:rotate-12 transition-transform" />
              Manifest Path
            </button>
          </form>

          <div className="mt-6 flex flex-wrap gap-2 justify-center">
            {[
              "PVE Hellmode Shadowcast Heavy",
              "PVP Gran Sudaruska Frostdraw",
              "PVP Curved Blade Silentheart",
              "PVE Diluvian Mechanism",
              "PVP Railblade Flamecharmer"
            ].map((preset) => (
              <button
                key={preset}
                onClick={() => selectPreset(preset)}
                className="text-[9px] font-black tracking-widest uppercase px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-blue-500/30 transition-all text-gray-400 hover:text-white"
              >
                {preset}
              </button>
            ))}
          </div>
        </section>

        {error && (
          <div className="bg-red-900/20 border border-red-500/50 text-red-200 p-4 rounded-xl mb-8 text-center animate-shake">
            {error}
          </div>
        )}

        {currentBuild && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            {/* LEFT COLUMN */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              <div className="relative aspect-square rounded-2xl overflow-hidden border border-white/10 bg-black/40 shadow-2xl">
                {currentBuild.imageUrl && (
                  <img src={currentBuild.imageUrl} alt={currentBuild.name} className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-1000" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90"></div>
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="flex flex-wrap gap-2 mb-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase border tracking-widest ${getBadgeColor(currentBuild.name)}`}>
                      {currentBuild.name.split(' ')[0]}
                    </span>
                  </div>
                  <h3 className="text-2xl font-cinzel font-bold text-white mb-1 uppercase tracking-tighter leading-tight">
                    {currentBuild.name.includes(']') ? currentBuild.name.split(']').slice(1).join(']').trim() : currentBuild.name}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-white/10 text-gray-300 px-2 py-0.5 rounded text-[9px] font-bold uppercase border border-white/5 backdrop-blur-md">{currentBuild.oath}</span>
                    <span className="bg-white/10 text-gray-300 px-2 py-0.5 rounded text-[9px] font-bold uppercase border border-white/5 backdrop-blur-md">{currentBuild.attunement}</span>
                  </div>
                </div>
              </div>

              {/* Identity Details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col items-center hover:bg-white/10 transition-all">
                  <User className="w-4 h-4 text-blue-400 mb-1" />
                  <span className="text-[8px] uppercase font-bold text-gray-500 tracking-widest">Race</span>
                  <span className="text-white font-cinzel text-xs font-bold text-center tracking-tight">{currentBuild.race}</span>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col items-center hover:bg-white/10 transition-all">
                  <Volume2 className="w-4 h-4 text-purple-400 mb-1" />
                  <span className="text-[8px] uppercase font-bold text-gray-500 tracking-widest">Murmur</span>
                  <span className="text-white font-cinzel text-xs font-bold text-center tracking-tight">{currentBuild.murmur}</span>
                </div>
              </div>

              {/* Boons & Flaws */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                <h4 className="text-xs font-cinzel text-white mb-4 flex items-center gap-2 tracking-widest uppercase border-b border-white/5 pb-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  Soul Origin
                </h4>
                <div className="space-y-4">
                  <div>
                    <h5 className="text-[8px] font-bold text-emerald-400 uppercase tracking-widest mb-2">Boons</h5>
                    <div className="flex flex-wrap gap-1">
                      {currentBuild.preferableBoons.map(boon => (
                        <span key={boon} className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-[8px] text-emerald-200">
                          {boon}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h5 className="text-[8px] font-bold text-red-400 uppercase tracking-widest mb-2">Flaws</h5>
                    <div className="flex flex-wrap gap-1">
                      {currentBuild.preferableFlaws.map(flaw => (
                        <span key={flaw} className="px-2 py-0.5 rounded bg-red-500/10 border border-red-500/20 text-[8px] text-red-200">
                          {flaw}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Investment Points */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                <h4 className="text-xs font-cinzel text-white mb-4 flex items-center gap-2 tracking-widest uppercase border-b border-white/5 pb-2">
                  <Shield className="w-4 h-4 text-blue-400" />
                  Point Distribution
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-black/20 p-3 rounded-xl border border-white/5 flex flex-col items-center">
                    <Heart className="w-3 h-3 text-red-500 mb-1" />
                    <span className="text-[8px] text-gray-500 font-bold uppercase">Vitality</span>
                    <span className="text-sm font-cinzel text-white font-bold">{currentBuild.investmentPoints.vitality}</span>
                  </div>
                  <div className="bg-black/20 p-3 rounded-xl border border-white/5 flex flex-col items-center">
                    <Brain className="w-3 h-3 text-blue-400 mb-1" />
                    <span className="text-[8px] text-gray-500 font-bold uppercase">Erudition</span>
                    <span className="text-sm font-cinzel text-white font-bold">{currentBuild.investmentPoints.erudition}</span>
                  </div>
                  <div className="bg-black/20 p-3 rounded-xl border border-white/5 flex flex-col items-center">
                    <Swords className="w-3 h-3 text-orange-400 mb-1" />
                    <span className="text-[8px] text-gray-500 font-bold uppercase">Proficiency</span>
                    <span className="text-sm font-cinzel text-white font-bold">{currentBuild.investmentPoints.proficiency}</span>
                  </div>
                  <div className="bg-black/20 p-3 rounded-xl border border-white/5 flex flex-col items-center">
                    <Music className="w-3 h-3 text-purple-400 mb-1" />
                    <span className="text-[8px] text-gray-500 font-bold uppercase">Songchant</span>
                    <span className="text-sm font-cinzel text-white font-bold">{currentBuild.investmentPoints.songchant}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              {/* COMPACT EXPORT SECTION */}
              <div className="bg-blue-600/10 border border-blue-500/30 rounded-2xl p-4 backdrop-blur-md shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-500/20 p-2 rounded-lg">
                    <Import className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-cinzel text-white uppercase tracking-widest leading-none">Power 20 Export</h4>
                    <p className="text-[10px] text-gray-400 mt-1">Ready for <a href="https://deepwoken.co/" target="_blank" className="text-blue-400 hover:underline">Deepwoken.co</a></p>
                  </div>
                </div>
                
                <button 
                  onClick={handleExport}
                  className={`px-6 py-2 rounded-xl font-bold uppercase tracking-wider text-xs transition-all flex items-center gap-2 border shadow-sm ${
                    copied 
                    ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-100' 
                    : 'bg-blue-600 hover:bg-blue-500 border-blue-400/40 text-white active:scale-95'
                  }`}
                >
                  {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  {copied ? 'Copied' : 'Copy Code'}
                </button>
              </div>

              {/* SHRINE OF ORDER STATS */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm shadow-xl relative overflow-hidden">
                <h4 className="text-sm font-cinzel text-white mb-6 flex items-center gap-2 uppercase tracking-[0.2em]">
                  <Zap className="w-4 h-4 text-yellow-500" />
                  Shrine of Order
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                  <div className="space-y-4">
                    <StatBlock label="Pre-Shrine" stats={currentBuild.preShrineStats} variant="pre" />
                    <div className="space-y-1.5">
                      {currentBuild.preShrineAttunementStats.map((stat, idx) => (
                        <div key={idx} className="bg-blue-500/5 border border-blue-500/20 px-3 py-1.5 rounded-lg flex items-center justify-between">
                          <span className="text-[8px] uppercase font-bold text-blue-300 tracking-[0.1em]">{stat.name}</span>
                          <span className="text-sm font-cinzel font-bold text-white">{stat.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <StatBlock label="Post-Shrine" stats={currentBuild.postShrineStats} variant="post" />
                    <div className="space-y-1.5">
                      {currentBuild.postShrineAttunementStats.map((stat, idx) => (
                        <div key={idx} className="bg-emerald-500/5 border border-emerald-500/20 px-3 py-1.5 rounded-lg flex items-center justify-between">
                          <span className="text-[8px] uppercase font-bold text-emerald-300 tracking-[0.1em]">{stat.name}</span>
                          <span className="text-sm font-cinzel font-bold text-white">{stat.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* PROGRESSION TIMELINE */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm shadow-md">
                <h4 className="text-sm font-cinzel text-white mb-6 flex items-center gap-2 uppercase tracking-widest">
                  <History className="w-4 h-4 text-emerald-400" />
                  Progression Roadmap
                </h4>
                <div className="space-y-6">
                  {currentBuild.progressionOrder.map((step, idx) => (
                    <div 
                      key={idx} 
                      className={`relative pl-8 border-l pb-6 last:pb-0 ${step.isShrinePoint ? 'border-yellow-500/30' : 'border-white/10'}`}
                    >
                      <div className={`absolute left-[-4.5px] top-1 w-2 h-2 rounded-full ${step.isShrinePoint ? 'bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.5)]' : 'bg-blue-500 shadow-[0_0_6px_rgba(59,130,246,0.3)]'}`}></div>
                      <div className="flex flex-col">
                        <span className={`text-[8px] font-black uppercase tracking-[0.2em] mb-1 ${step.isShrinePoint ? 'text-yellow-400' : 'text-blue-400'}`}>
                          {step.level} {step.isShrinePoint && "— SHRINE"}
                        </span>
                        <p className="font-bold text-white text-xs leading-tight">{step.action}</p>
                        <p className="text-[10px] text-gray-500 mt-2 leading-relaxed bg-white/5 px-3 py-2 rounded-lg italic">
                          "{step.reason}"
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* MANTRA LIST */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                <h4 className="text-xs font-cinzel text-white mb-4 flex items-center gap-2 tracking-widest uppercase border-b border-white/5 pb-2">
                  <Flame className="w-4 h-4 text-blue-400" />
                  Manifested Mantras
                </h4>
                <div className="flex flex-wrap gap-2">
                  {currentBuild.mantras.map((mantra, idx) => (
                    <span key={idx} className="bg-blue-500/5 border border-blue-500/20 px-3 py-1.5 rounded-lg text-xs text-blue-200">
                      {mantra}
                    </span>
                  ))}
                </div>
              </div>

              {/* REQUIREMENTS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <h4 className="text-[8px] font-cinzel text-blue-400 mb-3 uppercase tracking-[0.2em] flex items-center gap-2">
                    <Swords className="w-3 h-3 text-blue-500" />
                    Requirements
                  </h4>
                  <div className="space-y-2">
                    {currentBuild.weaponRequirements.map((req, idx) => (
                      <div key={idx} className="flex justify-between items-center bg-black/20 px-2 py-1.5 rounded-lg border border-white/5">
                        <span className="text-[10px] text-gray-300 font-bold uppercase">{req.item}</span>
                        <span className="text-[9px] text-blue-300 font-black">{req.statRequirement}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <h4 className="text-[8px] font-cinzel text-purple-400 mb-3 uppercase tracking-[0.2em] flex items-center gap-2">
                    <Scroll className="w-3 h-3 text-purple-500" />
                    Oath Initiation
                  </h4>
                  <div className="space-y-2">
                    {currentBuild.oathRequirements.map((req, idx) => (
                      <div key={idx} className="flex justify-between items-center bg-black/20 px-2 py-1.5 rounded-lg border border-white/5">
                        <span className="text-[10px] text-gray-300 font-bold uppercase">{req.item}</span>
                        <span className="text-[9px] text-purple-300 font-black">{req.statRequirement}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="mt-20 border-t border-white/10 py-10 px-4 text-center">
        <div className="max-w-xl mx-auto space-y-3 opacity-60">
          <div className="flex items-center justify-center gap-2">
             <Code className="w-3 h-3 text-gray-500" />
             <span className="text-[9px] uppercase font-bold text-gray-300 tracking-[0.3em]">Architected by <span className="text-white">Nate Epps</span></span>
             <Code className="w-3 h-3 text-gray-500" />
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
