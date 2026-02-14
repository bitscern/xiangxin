
import React from 'react';
import { AnalysisResult } from '../types';

interface AnalysisReportProps {
  data: AnalysisResult;
  image: string;
  onReset: () => void;
}

const AnalysisReport: React.FC<AnalysisReportProps> = ({ data, image, onReset }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 pb-20">
      
      {/* 宗师判词：第一眼震慑力 */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-ink-900 border border-bronze/30 p-10 shadow-2xl">
        <div className="absolute top-0 right-0 p-4 opacity-10">
           <div className="w-24 h-24 border-8 border-bronze rounded-full"></div>
        </div>
        <div className="relative z-10 flex flex-col items-center text-center space-y-6">
           <div className="px-4 py-1 bg-cinnabar/20 border border-cinnabar/30 rounded-full text-[10px] text-cinnabar font-bold tracking-[0.4em] uppercase">
             宗师灵鉴判词
           </div>
           <p className="text-3xl md:text-5xl font-bold text-white serif-font leading-tight tracking-wider">
             {data.masterInsight.poem}
           </p>
           <div className="w-12 h-[1px] bg-bronze/40"></div>
           <p className="text-bronze text-lg italic serif-font">
             「{data.masterInsight.summary}」
           </p>
        </div>
      </div>

      {/* 核心摘要：法相与五行 */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch">
        <div className="md:col-span-5 relative group">
          <div className="sticky top-24 w-full aspect-[3/4] rounded-2xl overflow-hidden border border-bronze/20 shadow-2xl">
            <img src={image} alt="法相" className="w-full h-full object-cover grayscale-[0.1] group-hover:grayscale-0 transition-all duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
            <div className="absolute bottom-6 left-6 right-6">
               <div className="text-[10px] text-bronze font-bold mb-2 tracking-widest uppercase">五行格局</div>
               <div className="text-4xl font-bold text-white serif-font">{data.fiveElement}形格 <span className="text-sm font-normal text-slate-400 ml-2">灵鉴分：{data.score}</span></div>
            </div>
          </div>
        </div>

        <div className="md:col-span-7 space-y-6">
          <div className="glass-panel p-8 rounded-3xl border-white/5">
             <h3 className="text-sm font-bold text-bronze tracking-[0.2em] mb-4 flex items-center gap-2">
               <span className="w-4 h-[1px] bg-bronze"></span> 观测实录
             </h3>
             <div className="space-y-6">
                {data.observations.map((obs, i) => (
                  <div key={i} className="group border-b border-white/5 pb-4 last:border-0">
                    <div className="flex justify-between items-center mb-1">
                       <span className="text-white font-bold serif-font">{obs.feature}</span>
                       <span className="text-[10px] text-slate-500 italic">实测描述</span>
                    </div>
                    <p className="text-xs text-slate-400 mb-2 leading-relaxed">{obs.description}</p>
                    <div className="text-[11px] text-bronze/80 font-medium italic">
                       解析：{obs.significance}
                    </div>
                  </div>
                ))}
             </div>
          </div>

          <div className="glass-panel p-8 rounded-3xl border-white/5 bg-bronze/5">
             <h3 className="text-sm font-bold text-bronze tracking-[0.2em] mb-4">五行解析</h3>
             <p className="text-sm text-slate-300 leading-relaxed serif-font italic">
               {data.elementAnalysis}
             </p>
          </div>
        </div>
      </div>

      {/* 十二宫位解析 */}
      <div className="glass-panel p-10 rounded-[3rem] border-white/5">
         <h3 className="text-2xl font-bold text-white serif-font mb-8 text-center">宫位流年详批</h3>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {data.palaces.map((p, i) => (
              <div key={i} className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/[0.05] transition-all">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-bronze font-bold serif-font">{p.name}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded border ${p.status === '优' ? 'text-green-400 border-green-400/30' : 'text-bronze border-bronze/30'}`}>{p.status}</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{p.analysis}</p>
              </div>
            ))}
         </div>
      </div>

      {/* 职场与修养 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <div className="glass-panel p-8 rounded-3xl border-white/5 bg-gradient-to-br from-ink-900 to-black">
            <h3 className="text-lg font-bold text-bronze serif-font mb-6">事业乾坤</h3>
            <div className="space-y-4">
               <div className="flex items-center justify-between border-b border-white/5 pb-2">
                 <span className="text-xs text-slate-500">职位契合</span>
                 <span className="text-sm text-white font-bold">{data.workplace.role}</span>
               </div>
               <p className="text-xs text-slate-400 italic">"{data.workplace.advice}"</p>
               <div className="flex flex-wrap gap-2 pt-2">
                 {data.workplace.strengths.map((s, i) => (
                   <span key={i} className="px-2 py-1 bg-bronze/10 text-bronze text-[10px] rounded">{s}</span>
                 ))}
               </div>
            </div>
         </div>
         
         <div className="glass-panel p-8 rounded-3xl border-white/5">
            <h3 className="text-lg font-bold text-cinnabar serif-font mb-6">社交锦囊</h3>
            <p className="text-sm text-slate-300 leading-relaxed italic mb-6">
              {data.socialGuide}
            </p>
            <div className="flex items-center gap-3">
              <span className="text-[10px] text-slate-500 uppercase tracking-widest">建议爱好:</span>
              <div className="flex gap-2">
                {data.hobbies.map((h, i) => (
                  <span key={i} className="text-[11px] text-white/80 border-b border-white/20">{h}</span>
                ))}
              </div>
            </div>
         </div>
      </div>

      {/* 底部寄语 */}
      <div className="pt-10 text-center space-y-8">
         <div className="inline-block p-10 glass-panel rounded-full border-bronze/20 bg-black shadow-inner">
            <div className="text-cinnabar text-xs font-bold tracking-[0.5em] mb-2 uppercase">今日气色</div>
            <div className="text-4xl font-bold text-white serif-font mb-4">{data.auraStatus}</div>
            <p className="text-slate-500 text-sm italic max-w-sm mx-auto">“{data.auraMessage}”</p>
         </div>

         <div className="flex justify-center pt-8">
           <button 
             onClick={onReset}
             className="px-20 py-5 bg-white text-black font-black text-xs tracking-[0.5em] uppercase hover:bg-bronze hover:text-white transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)]"
           >
             重起灵鉴
           </button>
         </div>
      </div>
    </div>
  );
};

export default AnalysisReport;
