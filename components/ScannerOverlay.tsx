
import React from 'react';

const ScannerOverlay: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
      {/* 传统装饰边框 */}
      <div className="absolute top-4 left-4 w-16 h-16 border-t border-l border-bronze/30 opacity-40"></div>
      <div className="absolute top-4 right-4 w-16 h-16 border-t border-r border-bronze/30 opacity-40"></div>
      <div className="absolute bottom-4 left-4 w-16 h-16 border-b border-l border-bronze/30 opacity-40"></div>
      <div className="absolute bottom-4 right-4 w-16 h-16 border-b border-r border-bronze/30 opacity-40"></div>

      {/* 中心扫描环 */}
      <div className="relative w-80 h-80 md:w-96 md:h-96">
        {/* 旋转罗盘环 */}
        <div className="absolute inset-0 border border-bronze/10 rounded-full animate-[spin_20s_linear_infinite]"></div>
        <div className="absolute inset-4 border border-bronze/5 rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>
        
        {/* 圆相环 */}
        <div className="absolute inset-[-20px] opacity-20">
          <svg viewBox="0 0 100 100" className="w-full h-full scan-line-enso stroke-bronze fill-none" strokeWidth="0.5">
            <circle cx="50" cy="50" r="48" strokeDasharray="5 15" />
            <circle cx="50" cy="50" r="40" strokeDasharray="20 10" />
          </svg>
        </div>

        {/* 方位标注 */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-8 text-[10px] text-bronze/60 serif-font">乾 · 正北</div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-8 text-[10px] text-bronze/60 serif-font">坤 · 正南</div>
        <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-8 text-[10px] text-bronze/60 serif-font">离 · 正东</div>
        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-8 text-[10px] text-bronze/60 serif-font">坎 · 正西</div>
      </div>
      
      {/* 网格背景 */}
      <div className="absolute inset-0 opacity-[0.03]" style={{backgroundImage: 'radial-gradient(#C5A059 0.5px, transparent 0.5px)', backgroundSize: '24px 24px'}}></div>
    </div>
  );
};

export default ScannerOverlay;
