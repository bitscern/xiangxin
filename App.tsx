
import React, { useState, useRef, useEffect } from 'react';
import { AppView, AnalysisResult } from './types';
import { analyzeFace } from './services/arkService';
import ScannerOverlay from './components/ScannerOverlay';
import AnalysisReport from './components/AnalysisReport';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('home');
  const [isScanning, setIsScanning] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startCamera = async () => {
    setView('scanner');
    setError(null);
    setCapturedImage(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch (err: any) {
      setError('镜鉴开启受阻。请确保授权摄像头访问，并在安全协议(HTTPS)环境下运行。');
      setView('home');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  useEffect(() => {
    return () => stopCamera();
  }, []);

  const captureAndAnalyze = async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    
    setIsScanning(true);
    setError(null);

    try {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('画卷受损');
      
      ctx.drawImage(video, 0, 0);
      const base64Data = canvas.toDataURL('image/jpeg', 0.8);
      setCapturedImage(base64Data);
      
      // 仅发送 Base64 数据部分
      const result = await analyzeFace(base64Data.split(',')[1]);
      setAnalysisResult(result);
      setView('report');
      stopCamera();
    } catch (err: any) {
      setError(`参详受阻: ${err.message}`);
      video.play().catch(() => {});
    } finally {
      setIsScanning(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        setCapturedImage(base64);
        setIsScanning(true);
        setView('scanner');
        try {
          const result = await analyzeFace(base64.split(',')[1]);
          setAnalysisResult(result);
          setView('report');
        } catch (err: any) {
          setError(err.message || '相片难辨，请确保面部清晰。');
          setView('home');
        } finally {
          setIsScanning(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen hero-gradient flex flex-col">
      <header className="fixed top-0 w-full z-50 glass-panel border-b border-white/5 h-20 flex items-center justify-between px-6 md:px-12">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => { setView('home'); stopCamera(); }}>
          <div className="w-10 h-10 bg-cinnabar flex items-center justify-center rotate-45 shadow-lg">
            <span className="text-white font-bold -rotate-45 serif-font">相</span>
          </div>
          <div>
            <h1 className="text-base font-bold text-white serif-font tracking-widest uppercase">相心</h1>
            <p className="text-[8px] text-bronze tracking-[0.2em] uppercase opacity-60">PhysioLogic AI · 灵鉴中心</p>
          </div>
        </div>

        <div className="flex items-center gap-4 md:gap-8">
           <button 
            onClick={() => { setView('home'); stopCamera(); }}
            className="text-[11px] text-slate-400 font-bold hover:text-white transition-colors tracking-widest hidden sm:block"
           >
             归宗
           </button>
           <button 
            onClick={startCamera}
            className="px-6 py-2 border border-bronze/40 text-bronze text-[11px] font-bold tracking-widest hover:bg-bronze hover:text-white transition-all rounded-sm"
           >
             即刻灵鉴
           </button>
        </div>
      </header>

      <main className="flex-1 pt-20">
        {error && (
          <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[60] w-[90%] max-w-md p-4 bg-cinnabar/10 border border-cinnabar/20 text-cinnabar text-[10px] text-center serif-font animate-pulse rounded-md">
            {error}
          </div>
        )}

        {view === 'home' && (
          <div className="animate-in fade-in duration-1000">
            <section className="min-h-[90vh] flex flex-col items-center justify-center text-center px-6 py-20">
               <div className="space-y-8 max-w-4xl">
                  <div className="inline-block px-4 py-1 border border-bronze/20 bg-bronze/5 rounded-full text-[10px] text-bronze font-bold tracking-[0.3em] mb-4">
                    火山方舟大模型驱动 · 传统相法与演化心性之结合
                  </div>
                  <h2 className="text-5xl md:text-8xl font-black text-white leading-[1.1] serif-font tracking-tight">
                    观其<span className="text-bronze">面</span>，<br className="md:hidden" />
                    知其<span className="text-cinnabar">心</span>。
                  </h2>
                  <p className="text-lg md:text-2xl text-slate-400 font-light max-w-2xl mx-auto leading-relaxed serif-font px-4">
                    探寻面部纹路下的性格，参详眉宇间的五行玄机。
                  </p>
                  
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-10">
                    <button 
                      onClick={startCamera}
                      className="w-full sm:w-auto px-16 py-5 bg-cinnabar text-white text-lg font-bold rounded-sm shadow-2xl hover:scale-105 transition-transform serif-font tracking-[0.2em]"
                    >
                      镜鉴起卦
                    </button>
                    <label className="w-full sm:w-auto px-16 py-5 bg-white/5 border border-white/10 text-slate-300 text-lg font-bold rounded-sm hover:bg-white/10 transition-colors cursor-pointer serif-font tracking-[0.2em]">
                      传其法相
                      <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                    </label>
                  </div>
               </div>
            </section>
          </div>
        )}

        {view === 'scanner' && (
          <div className="max-w-xl mx-auto flex flex-col items-center justify-center p-6 space-y-12 animate-in slide-in-from-bottom-10">
            <div className="relative w-full aspect-[3/4] rounded-sm overflow-hidden bg-black shadow-2xl border border-bronze/20">
              {capturedImage ? (
                <img src={capturedImage} className="w-full h-full object-cover grayscale-[0.3]" alt="法相" />
              ) : (
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover scale-x-[-1]" />
              )}
              <ScannerOverlay />
              {isScanning && (
                <div className="absolute inset-0 bg-ink-950/80 flex flex-col items-center justify-center space-y-6">
                   <div className="w-16 h-16 border-2 border-bronze/30 border-t-bronze rounded-full animate-spin"></div>
                   <div className="text-center">
                      <p className="text-white font-bold serif-font tracking-[0.3em] mb-1">正在谛听</p>
                      <p className="text-[9px] text-slate-500 uppercase tracking-widest">灵鉴进行中</p>
                   </div>
                </div>
              )}
            </div>
            
            <div className="flex gap-4 w-full">
               <button 
                onClick={() => { setView('home'); stopCamera(); setCapturedImage(null); }}
                className="flex-1 py-4 text-slate-400 text-xs font-bold tracking-widest border border-white/5 hover:bg-white/5 transition-colors"
               >
                 罢手
               </button>
               {!capturedImage && (
                 <button 
                  onClick={captureAndAnalyze}
                  className="flex-[2] py-4 bg-bronze text-white font-bold tracking-widest uppercase text-xs hover:bg-bronze-dark transition-colors shadow-lg"
                 >
                   参详神算
                 </button>
               )}
            </div>
            <canvas ref={canvasRef} className="hidden" />
          </div>
        )}

        {view === 'report' && analysisResult && capturedImage && (
          <div className="px-6 py-10">
            <AnalysisReport 
              data={analysisResult} 
              image={capturedImage} 
              onReset={() => { setView('home'); setAnalysisResult(null); setCapturedImage(null); }} 
            />
          </div>
        )}
      </main>

      <footer className="py-20 border-t border-white/5 bg-ink-950/20 text-center px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="text-left space-y-2">
            <div className="text-white font-bold serif-font tracking-widest">相心 (PhysioLogic AI)</div>
            <p className="text-slate-500 text-[10px] leading-relaxed max-w-xs">
              基于火山方舟大模型的传统文化探索应用。非医疗诊断，仅供娱乐与心性参考。
            </p>
          </div>
          <p className="text-slate-600 text-[10px]">© 2024 相心 · 火山方舟引擎驱动</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
