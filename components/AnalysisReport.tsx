
import React from 'react';
import { AnalysisResult, FiveElement } from '../types';

interface AnalysisReportProps {
  data: AnalysisResult;
  image: string;
  onReset: () => void;
}

const AnalysisReport: React.FC<AnalysisReportProps> = ({ data, image, onReset }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 pb-20">
      {/* 头部信息卡片 */}
      <div className="relative glass-panel p-8 rounded-[2rem] overflow-hidden border-bronze/20 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        <div className="absolute top-0 right-0 w-32 h-32 bg-cinnabar/5 rounded-full -translate-y-12 translate-x-12 blur-3xl"></div>
        
        <div className="flex flex-col md:flex-row gap-10 items-center relative z-10">
          <div className="relative">
            <div className="w-48 h-64 rounded-2xl overflow-hidden border border-bronze/30 shadow-2xl transform -rotate-1 hover:rotate-0 transition-transform duration-500">
              <img src={image} alt="分析照片" className="w-full h-full object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-500" />
            </div>
            <div className="absolute -bottom-4 -right-4 bg-cinnabar text-white w-12 h-32 flex items-center justify-center rounded-sm shadow-xl border border-white/10">
              <span className="vertical-text serif-font text-xl font-bold tracking-[0.2em]">{data.fiveElement}形格局</span>
            </div>
          </div>
          
          <div className="flex-1 text-center md:text-left space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-bronze/10 border border-bronze/20">
              <span className="w-1.5 h-1.5 bg-bronze rounded-full animate-pulse"></span>
              <span className="text-[10px] text-bronze font-bold tracking-widest">古智算法推理</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white serif-font tracking-tight">
              面相品级：<span className="text-bronze">{data.score >= 80 ? '上乘' : data.score >= 60 ? '中平' : '有待修持'}</span>
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed font-light italic serif-font">
              “{data.personalityProfile}”
            </p>
          </div>
        </div>
      </div>

      {/* 三世因果 */}
      <div className="relative p-10 glass-panel rounded-[2.5rem] overflow-hidden border-bronze/10">
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none" style={{backgroundImage: 'url("https://www.transparenttextures.com/patterns/pinstriped-suit.png")'}}></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-2xl font-bold text-bronze serif-font flex items-center gap-4">
              <span className="w-8 h-1 bg-bronze/30"></span>
              三世因果画卷
              <span className="w-8 h-1 bg-bronze/30"></span>
            </h3>
            <span className="text-[10px] text-slate-500 tracking-[0.3em]">因果循环 · 命理推演</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4 p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
              <span className="text-xs text-bronze/60 font-bold serif-font border-b border-bronze/20 pb-1">前世因 (积淀)</span>
              <p className="text-sm text-slate-300 leading-relaxed italic">{data.karma.past}</p>
            </div>
            <div className="space-y-4 p-6 bg-cinnabar/[0.02] border border-cinnabar/10 rounded-2xl relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 bg-ink-900 border border-cinnabar/20 text-[10px] text-cinnabar font-bold rounded-full">当前</div>
              <span className="text-xs text-cinnabar/60 font-bold serif-font border-b border-cinnabar/20 pb-1">今生果 (现状)</span>
              <p className="text-sm text-slate-300 leading-relaxed font-medium">{data.karma.present}</p>
            </div>
            <div className="space-y-4 p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
              <span className="text-xs text-bronze/60 font-bold serif-font border-b border-bronze/20 pb-1">未来愿 (愿景)</span>
              <p className="text-sm text-slate-300 leading-relaxed italic">{data.karma.future}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 职场匹配 */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-12 glass-panel p-8 rounded-[2rem] border-bronze/10 bg-gradient-to-br from-ink-900 to-ink-800">
           <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-bronze/10 rounded-full flex items-center justify-center text-bronze border border-bronze/20">
                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                   </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white serif-font">职场匹配罗盘</h3>
                  <p className="text-[10px] text-bronze tracking-widest font-bold">事业规划与团队协作</p>
                </div>
              </div>
              <div className="px-6 py-2 bg-bronze/10 border border-bronze/20 rounded-lg text-bronze font-bold serif-font text-lg">
                {data.workplace.role}
              </div>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-6">
                <div>
                  <h4 className="text-xs font-bold text-slate-500 tracking-widest mb-4">核心优势 / 性格强项</h4>
                  <div className="flex flex-wrap gap-2">
                    {data.workplace.strengths.map((s, i) => (
                      <span key={i} className="px-3 py-1.5 bg-ink-950 border border-white/5 rounded-md text-xs text-slate-300">{s}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-500 tracking-widest mb-4">理想搭档 / 契合特质</h4>
                  <p className="text-sm text-slate-300 leading-relaxed font-light border-l-2 border-bronze/30 pl-4">
                    {data.workplace.compatibility}
                  </p>
                </div>
              </div>
              
              <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
                 <h4 className="text-xs font-bold text-slate-500 tracking-widest mb-4">进阶之道 / 发展建议</h4>
                 <p className="text-sm text-slate-300 leading-relaxed font-light italic">
                    {data.workplace.advice}
                 </p>
              </div>
           </div>
        </div>
      </div>

      {/* 分析网格 */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-5 glass-panel p-8 rounded-[2rem] border-bronze/10">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-bronze serif-font">五行定基</h3>
            <span className="text-[10px] text-slate-500">形态学分析</span>
          </div>
          <div className="space-y-6">
            <div className="flex gap-6">
              <div className="text-5xl font-bold text-bronze/20 serif-font select-none">{data.fiveElement}</div>
              <p className="text-slate-300 text-sm leading-relaxed font-light border-l border-bronze/20 pl-6">
                {data.elementAnalysis}
              </p>
            </div>
          </div>
        </div>

        <div className="md:col-span-7 glass-panel p-8 rounded-[2rem] border-cinnabar/20 bg-cinnabar/5">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-cinnabar-light serif-font">心相风险预警</h3>
            <span className="text-[10px] text-cinnabar/40">性格风险评估</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {data.riskMetrics.map((metric, idx) => (
              <div key={idx} className="group">
                <div className="flex justify-between items-end border-b border-white/5 pb-2 mb-2 group-hover:border-cinnabar/30 transition-colors">
                  <span className="text-xs text-slate-400">{metric.label}</span>
                  <span className="text-[10px] text-cinnabar serif-font font-bold">{metric.traditionalTerm}</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-snug group-hover:text-slate-200 transition-colors">
                  {metric.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 十二宫位 */}
      <div className="glass-panel p-8 rounded-[2rem] border-white/5">
        <h3 className="text-xl font-bold text-bronze serif-font mb-8 text-center">面部十二宫位扫描</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-8 gap-y-10">
          {data.palaces.map((palace, idx) => (
            <div key={idx} className="relative group text-center md:text-left">
              <div className="absolute -left-2 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-bronze/20 to-transparent hidden md:block"></div>
              <p className="text-[10px] text-slate-500 font-bold tracking-widest mb-1">{palace.name}</p>
              <p className="text-white font-bold text-sm mb-2 group-hover:text-bronze transition-colors">{palace.status}</p>
              <p className="text-[10px] text-slate-400 leading-normal line-clamp-3">{palace.analysis}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 气色日签 */}
      <div className="relative glass-panel p-12 rounded-[3rem] text-center border-bronze/40 bg-gradient-to-b from-ink-900 to-black">
        <div className="absolute top-4 left-4 w-20 h-20 opacity-10">
            <svg viewBox="0 0 100 100" className="fill-bronze">
                <path d="M10,10 L90,10 L90,90 L10,90 Z M20,20 L20,80 L80,80 L80,20 Z" />
            </svg>
        </div>
        <div className="mb-6">
          <span className="text-cinnabar text-xs font-bold tracking-[0.4em] serif-font">今日气色 · 灵感日签</span>
        </div>
        <h2 className="text-5xl font-bold text-white serif-font mb-4">{data.auraStatus}</h2>
        <p className="text-slate-300 max-w-lg mx-auto leading-relaxed font-light">{data.auraMessage}</p>
        
        <div className="mt-12 flex justify-center">
            <button 
                onClick={onReset}
                className="group relative px-10 py-4 bg-cinnabar text-white font-bold rounded-sm shadow-2xl hover:bg-cinnabar-dark transition-all duration-300"
            >
                <div className="absolute inset-0 border border-white/20 scale-90 group-hover:scale-100 transition-transform"></div>
                <span className="relative z-10 serif-font tracking-widest text-lg">重拾初衷</span>
            </button>
        </div>
      </div>
    </div>
  );
};

export default AnalysisReport;
