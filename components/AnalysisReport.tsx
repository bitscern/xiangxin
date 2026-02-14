
import React, { useState } from 'react';
import { AnalysisResult, FaceRegion } from '../types';

interface AnalysisReportProps {
  data: AnalysisResult;
  image: string;
  onReset: () => void;
}

const REGION_MAP: Record<FaceRegion, { top: string; left: string; width: string; height: string }> = {
  FOREHEAD: { top: '10%', left: '25%', width: '50%', height: '22%' },
  EYES: { top: '32%', left: '15%', width: '70%', height: '14%' },
  NOSE: { top: '42%', left: '32%', width: '36%', height: '26%' },
  MOUTH: { top: '68%', left: '28%', width: '44%', height: '12%' },
  CHIN: { top: '80%', left: '30%', width: '40%', height: '16%' },
  CHEEK_L: { top: '45%', left: '10%', width: '25%', height: '25%' },
  CHEEK_R: { top: '45%', left: '65%', width: '25%', height: '25%' },
  FULL: { top: '5%', left: '5%', width: '90%', height: '90%' },
};

const REGION_CN: Record<FaceRegion, string> = {
  FOREHEAD: '天庭/额',
  EYES: '双目/眼',
  NOSE: '鼻/准头',
  MOUTH: '口/唇',
  CHIN: '地阁/颌',
  CHEEK_L: '左颧/脸',
  CHEEK_R: '右颧/脸',
  FULL: '法相全貌',
};

const AnalysisReport: React.FC<AnalysisReportProps> = ({ data, image, onReset }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [activeRegion, setActiveRegion] = useState<FaceRegion | null>(null);
  const [showPoster, setShowPoster] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyPoem = () => {
    const text = `【相心灵鉴】\n${data.masterInsight.poem}\n「${data.masterInsight.summary}」\n灵鉴评分：${data.score}\n格局：${data.fiveElement}形格`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-1000 pb-32 relative px-4">
      
      {/* 1. 宗师判词 - 强化气场 */}
      <div className="relative overflow-hidden rounded-[3rem] bg-ink-900 border border-bronze/30 p-12 shadow-2xl group text-center">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-bronze/50 to-transparent"></div>
        <div className="flex flex-col items-center space-y-8">
           <div className="px-6 py-1.5 bg-cinnabar/10 border border-cinnabar/20 rounded-full text-[10px] text-cinnabar font-bold tracking-[0.5em] uppercase">
             火山方舟 · 核心灵鉴判词
           </div>
           
           <h2 className="text-4xl md:text-6xl font-bold text-white serif-font leading-tight tracking-[0.15em]">
             {data.masterInsight.poem}
           </h2>
           
           <div className="w-24 h-[1px] bg-bronze/30"></div>
           
           <p className="text-bronze text-xl md:text-2xl italic serif-font opacity-90">
             「{data.masterInsight.summary}」
           </p>

           <button onClick={copyPoem} className="text-[10px] text-slate-500 hover:text-bronze transition-colors flex items-center gap-2">
             {copied ? '已录入剪贴板' : '复制此判词'}
           </button>
        </div>
      </div>

      {/* 2. 核心分析矩阵 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* 左侧：视觉观测 HUD */}
        <div className="lg:col-span-5 space-y-8">
          <div className="relative w-full aspect-[3/4] rounded-[2.5rem] overflow-hidden border border-bronze/20 bg-black shadow-2xl group">
            <img src={image} alt="法相" className="w-full h-full object-cover grayscale-[0.2] opacity-80 transition-transform duration-1000 group-hover:scale-105" />
            
            {/* 动态 HUD 标记 */}
            {activeRegion && (
              <div 
                className="absolute border border-white/60 shadow-[0_0_40px_rgba(255,255,255,0.2)] transition-all duration-500 z-20"
                style={{ ...REGION_MAP[activeRegion], borderRadius: '4px' }}
              >
                <div className="absolute top-0 right-0 -translate-y-full flex flex-col items-end p-2">
                   <span className="bg-bronze text-black text-[10px] px-2 py-0.5 font-bold tracking-widest shadow-lg">
                    {REGION_CN[activeRegion]}
                   </span>
                </div>
              </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
            <div className="absolute bottom-10 left-10 right-10">
               <div className="text-bronze text-[10px] font-bold tracking-[0.3em] mb-2">格局判位</div>
               <div className="text-white text-3xl font-black serif-font tracking-widest">{data.fiveElement}形格局</div>
            </div>
          </div>

          <div className="glass-panel p-8 rounded-[2rem] space-y-4">
             <div className="flex items-center gap-3 text-bronze mb-4">
                <div className="w-1.5 h-1.5 bg-bronze rounded-full"></div>
                <h4 className="text-[11px] font-black tracking-[0.4em] uppercase">气色演化</h4>
             </div>
             <p className="text-2xl text-white serif-font italic">{data.auraStatus}</p>
             <p className="text-sm text-slate-400 leading-relaxed">{data.auraMessage}</p>
          </div>
        </div>

        {/* 右侧：十二宫位与实录 */}
        <div className="lg:col-span-7 space-y-12">
          
          {/* 十二宫位阵列 - 新增 */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {data.palaces?.map((palace, idx) => (
              <div key={idx} className="bg-white/[0.02] border border-white/5 p-5 rounded-2xl hover:border-bronze/30 transition-all group">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-bronze text-[10px] font-bold tracking-widest">{palace.name}</span>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded border ${palace.status === '优' ? 'border-cinnabar/40 text-cinnabar' : 'border-slate-700 text-slate-500'}`}>
                    {palace.status}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-snug group-hover:text-slate-200 transition-colors">{palace.analysis}</p>
              </div>
            ))}
          </div>

          {/* 灵鉴观测详情 */}
          <div className="glass-panel p-8 rounded-[2.5rem] border-white/5">
             <h3 className="text-xs font-black text-bronze tracking-[0.4em] mb-8 flex items-center gap-3">
               观测实录 <span className="flex-1 h-[1px] bg-bronze/10"></span>
             </h3>
             <div className="space-y-6">
                {data.observations.map((obs, i) => (
                  <div 
                    key={i} 
                    className="group flex flex-col space-y-2 cursor-crosshair"
                    onMouseEnter={() => setActiveRegion(obs.region)}
                    onMouseLeave={() => setActiveRegion(null)}
                  >
                    <div className="flex justify-between items-end">
                      <span className="text-white font-bold serif-font text-lg">{obs.feature}</span>
                      <span className="text-[9px] text-slate-600 tracking-widest">{REGION_CN[obs.region]}</span>
                    </div>
                    <p className="text-[12px] text-slate-400 leading-relaxed pl-4 border-l-2 border-bronze/20 group-hover:border-bronze transition-colors">
                      {obs.evidence} — <span className="text-slate-300 italic">{obs.significance}</span>
                    </p>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>

      {/* 3. 深度推演卡片区 - 大幅扩充信息 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* 心性与交际 */}
        <div className="md:col-span-2 bg-ink-900 border border-white/5 rounded-[2.5rem] p-10 space-y-6">
           <h4 className="text-bronze text-[11px] font-black tracking-[0.4em] mb-4">心性根基与交际锦囊</h4>
           <p className="text-slate-300 text-lg serif-font leading-relaxed tracking-wide">
             {data.personalityProfile}
           </p>
           <div className="pt-6 border-t border-white/5">
             <p className="text-[11px] text-cinnabar font-bold tracking-widest mb-3">【交际锦囊】</p>
             <p className="text-sm text-slate-400 leading-relaxed italic">{data.socialGuide}</p>
           </div>
        </div>

        {/* 职场建议 */}
        <div className="bg-bronze/[0.03] border border-bronze/10 rounded-[2.5rem] p-10 space-y-6">
           <h4 className="text-bronze text-[11px] font-black tracking-[0.4em]">职场前程</h4>
           <div className="space-y-4">
              <div>
                <p className="text-[9px] text-slate-500 uppercase tracking-widest mb-1">推荐角色</p>
                <p className="text-xl text-white font-bold serif-font">{data.workplace.role}</p>
              </div>
              <div>
                <p className="text-[9px] text-slate-500 uppercase tracking-widest mb-2">核心优势</p>
                <div className="flex flex-wrap gap-2">
                  {data.workplace.strengths.map((s, i) => (
                    <span key={i} className="px-2 py-1 bg-white/5 text-bronze text-[10px] rounded-md">{s}</span>
                  ))}
                </div>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed pt-4 border-t border-white/10">
                {data.workplace.advice}
              </p>
           </div>
        </div>
      </div>

      {/* 4. 底层灵鉴日志 */}
      <div className="space-y-8">
         <button 
           onClick={() => setShowAdvanced(!showAdvanced)}
           className="w-full py-6 border border-white/5 rounded-2xl text-[10px] text-slate-600 hover:text-bronze transition-all tracking-[0.8em]"
         >
           {showAdvanced ? '封存宗师日志' : '展开宗师级底层灵鉴日志'}
         </button>
         
         {showAdvanced && (
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-in zoom-in-95 duration-700">
              {[
                { title: '骨相解构', content: data.advancedLog.boneStructure },
                { title: '精气神监控', content: data.advancedLog.spiritAnalysis },
                { title: '风险预警', content: data.advancedLog.potentialRisks }
              ].map((item, i) => (
                <div key={i} className="bg-black/40 p-8 rounded-3xl border border-white/5">
                  <h5 className="text-[10px] text-bronze font-black mb-4 tracking-widest">{item.title}</h5>
                  <p className="text-[12px] text-slate-500 leading-relaxed">{item.content}</p>
                </div>
              ))}
           </div>
         )}
      </div>

      {/* 5. 底部固定按钮 */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 flex items-center gap-6">
         <button onClick={onReset} className="px-10 py-4 glass-panel rounded-full text-[11px] text-slate-400 font-bold tracking-[0.4em] hover:text-white transition-all shadow-2xl">
           重置
         </button>
         <button onClick={() => setShowPoster(true)} className="px-14 py-4 bg-bronze text-white rounded-full text-[11px] font-black tracking-[0.5em] hover:scale-105 active:scale-95 transition-all shadow-[0_15px_40px_rgba(197,160,89,0.3)]">
           生成灵鉴分享卡
         </button>
      </div>

      {/* 6. 分享海报 (简易实现) */}
      {showPoster && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
           <div className="absolute inset-0 bg-black/98 backdrop-blur-xl" onClick={() => setShowPoster(false)}></div>
           <div className="relative w-full max-w-sm bg-ink-950 border border-bronze/30 p-12 rounded-[3rem] space-y-10 text-center shadow-[0_0_100px_rgba(197,160,89,0.15)] animate-in zoom-in-95 duration-500">
              <div className="text-bronze text-[10px] font-bold tracking-[0.5em]">相心 · 灵鉴卡</div>
              <div className="aspect-[4/5] rounded-3xl overflow-hidden border border-bronze/10">
                <img src={image} className="w-full h-full object-cover grayscale-[0.2]" />
              </div>
              <div className="space-y-4">
                 <h2 className="text-2xl font-bold text-white serif-font tracking-widest">{data.masterInsight.poem}</h2>
                 <p className="text-bronze text-sm italic serif-font">「{data.masterInsight.summary}」</p>
              </div>
              <div className="flex justify-between items-center pt-8 border-t border-white/5">
                <div className="text-left">
                  <p className="text-white text-xs font-bold">扫码灵鉴</p>
                  <p className="text-[8px] text-slate-500 uppercase tracking-widest">PhysioLogic AI</p>
                </div>
                <div className="w-12 h-12 bg-bronze/20 rounded-lg border border-bronze/30 flex items-center justify-center text-[7px] text-bronze font-bold">QR CODE</div>
              </div>
              <button onClick={() => setShowPoster(false)} className="w-full py-4 text-[10px] text-slate-600 font-bold tracking-widest uppercase hover:text-white transition-colors">
                返回
              </button>
           </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes scan {
          0% { transform: translateY(0); opacity: 0; }
          10% { opacity: 0.8; }
          90% { opacity: 0.8; }
          100% { transform: translateY(133px); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default AnalysisReport;
