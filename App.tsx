
import React, { useState, useRef, useEffect } from 'react';
import { AppView, AnalysisResult } from './types';
import { analyzeFace } from './services/geminiService';
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
        video: { 
          facingMode: 'user', 
          width: { ideal: 1280 }, 
          height: { ideal: 720 } 
        },
        audio: false 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch (err: any) {
      setError('无法访问摄像头，请检查权限。');
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
    
    if (!video) {
        setError("未发现摄像头视频流");
        return;
    }
    if (!canvas) {
        setError("系统错误：画布初始化失败");
        return;
    }

    if (video.readyState < 2) {
      setError('摄像头数据加载中，请稍候再试。');
      return;
    }
    
    setIsScanning(true);
    setError(null);

    try {
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('无法创建绘图上下文');
      
      ctx.drawImage(video, 0, 0);
      const base64ImageWithHeader = canvas.toDataURL('image/jpeg', 0.8);
      const base64Data = base64ImageWithHeader.split(',')[1];
      
      if (!base64Data) throw new Error("图像获取失败");

      setCapturedImage(base64ImageWithHeader);
      video.pause();
      
      const result = await analyzeFace(base64Data);
      setAnalysisResult(result);
      setView('report');
      stopCamera();
    } catch (err: any) {
      console.error("解析错误:", err);
      setError(`解析失败: ${err.message || '网络繁忙，请重试'}`);
      setCapturedImage(null);
      if (video) video.play().catch(() => {});
    } finally {
      setIsScanning(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('图片体积过大，请上传 5MB 以内的照片。');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64WithHeader = reader.result as string;
        setCapturedImage(base64WithHeader);
        setIsScanning(true);
        setView('scanner');
        setError(null);
        try {
          const result = await analyzeFace(base64WithHeader.split(',')[1]);
          setAnalysisResult(result);
          setView('report');
        } catch (err: any) {
          setError('上传解析失败，请检查网络并重试。');
          setCapturedImage(null);
          setView('home');
        } finally {
          setIsScanning(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen flex flex-col selection:bg-cinnabar/30 selection:text-cinnabar">
      {/* 顶部导航 */}
      <nav className="h-24 flex items-center justify-between px-8 md:px-16 fixed w-full z-50 transition-all duration-500">
        <div 
          className="flex items-center gap-4 cursor-pointer group"
          onClick={() => { setView('home'); stopCamera(); setError(null); setCapturedImage(null); }}
        >
          <div className="relative w-12 h-12 flex items-center justify-center">
            <div className="absolute inset-0 bg-cinnabar rotate-45 group-hover:rotate-90 transition-transform duration-500 shadow-lg"></div>
            <span className="relative z-10 text-white font-bold text-xl serif-font">相</span>
          </div>
          <div className="hidden sm:block">
            <h1 className="text-lg font-bold text-white serif-font tracking-widest">相心智能</h1>
            <p className="text-[9px] text-bronue tracking-[0.3em] font-medium opacity-70">面部洞察之艺</p>
          </div>
        </div>
        
        <div className="flex items-center gap-10">
          <div className="hidden md:flex gap-10 text-[11px] font-bold tracking-[0.2em] text-slate-500">
            <button onClick={() => { setView('home'); stopCamera(); setError(null); }} className={`hover:text-bronze transition-colors ${view === 'home' ? 'text-bronze border-b border-bronze/40 pb-1' : ''}`}>卷首</button>
            <button onClick={() => { setView('library'); stopCamera(); setError(null); }} className={`hover:text-bronze transition-colors ${view === 'library' ? 'text-bronze border-b border-bronze/40 pb-1' : ''}`}>博古</button>
            <button onClick={() => { setView('about'); stopCamera(); setError(null); }} className={`hover:text-bronze transition-colors ${view === 'about' ? 'text-bronze border-b border-bronze/40 pb-1' : ''}`}>识墨</button>
          </div>
          <button 
            onClick={startCamera}
            className="group relative px-6 py-2 bg-transparent border border-bronze/40 text-bronze text-xs font-bold tracking-widest uppercase hover:text-white transition-colors overflow-hidden"
          >
            <div className="absolute inset-0 bg-bronze scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
            <span className="relative z-10">即刻探索</span>
          </button>
        </div>
      </nav>

      {/* 主体内容 */}
      <main className="flex-1 pt-32 pb-20 px-6">
        
        {error && (
          <div className="max-w-xl mx-auto mb-10 p-4 border border-cinnabar/30 bg-cinnabar/5 text-cinnabar text-xs text-center serif-font animate-in slide-in-from-top-4 flex items-center justify-between">
             <span className="flex-1">{error}</span>
             <button onClick={() => setError(null)} className="ml-4 opacity-50 hover:opacity-100">✕</button>
          </div>
        )}

        {view === 'home' && (
          <div className="max-w-6xl mx-auto flex flex-col items-center text-center space-y-16 animate-in fade-in duration-1000 mt-10 md:mt-20">
            <div className="space-y-6 max-w-4xl relative">
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-10">
                <svg viewBox="0 0 100 100" className="w-32 h-32 fill-bronze">
                  <path d="M50,10 L90,50 L50,90 L10,50 Z" />
                </svg>
              </div>
              <h1 className="text-6xl md:text-8xl font-extrabold text-white leading-none serif-font tracking-tight">
                观其<span className="text-bronze">面</span><br/>
                知其<span className="text-cinnabar">心</span>
              </h1>
              <p className="text-lg md:text-xl text-slate-500 font-light max-w-2xl mx-auto leading-relaxed serif-font">
                “相由心生，气随心转”<br/>
                以人工智能之力，解码潜藏于眉宇间的五行密码与生命图景。
              </p>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-8 pt-6">
              <button 
                onClick={startCamera}
                className="group relative px-12 py-5 bg-cinnabar text-white text-lg font-bold rounded-sm shadow-2xl transition-all duration-300"
              >
                <div className="absolute inset-0 border border-white/20 scale-95 group-hover:scale-100 transition-transform"></div>
                <span className="relative z-10 serif-font tracking-[0.2em]">开启神相扫描</span>
              </button>
              
              <label className="px-12 py-5 bg-white/5 hover:bg-white/10 text-slate-300 text-lg font-bold rounded-sm transition-all border border-white/10 cursor-pointer serif-font tracking-[0.2em]">
                上传照片分析
                <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 w-full mt-32 max-w-5xl">
              <div className="space-y-4 text-center">
                <div className="text-bronze font-bold text-lg serif-font">壹 · 骨相五行</div>
                <p className="text-slate-500 text-sm leading-relaxed font-light">
                  探究金、木、水、火、土之格局，洞察性格底色与处世基准。
                </p>
              </div>
              <div className="space-y-4 text-center">
                <div className="text-bronze font-bold text-lg serif-font">贰 · 十二宫深度</div>
                <p className="text-slate-500 text-sm leading-relaxed font-light">
                  从命宫到财帛，解析面部细微宫位中的运势起伏与近期心境。
                </p>
              </div>
              <div className="space-y-4 text-center">
                <div className="text-bronze font-bold text-lg serif-font">叁 · 风险预演</div>
                <p className="text-slate-500 text-sm leading-relaxed font-light">
                  融合现代心理学与传统相法，量化情绪稳定性与行为风险。
                </p>
              </div>
            </div>
          </div>
        )}

        {view === 'scanner' && (
          <div className="max-w-2xl mx-auto flex flex-col items-center space-y-12 animate-in zoom-in duration-700">
            <div className="relative w-full aspect-[4/5] md:aspect-[3/4] rounded-sm overflow-hidden bg-ink-950 shadow-2xl border border-bronze/20">
              {capturedImage ? (
                <img src={capturedImage} className="absolute inset-0 w-full h-full object-cover grayscale-[0.3]" alt="捕获画面" />
              ) : (
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  muted
                  className="absolute inset-0 w-full h-full object-cover scale-x-[-1]"
                />
              )}
              
              <ScannerOverlay />

              {isScanning && (
                <div className="absolute inset-0 bg-ink-950/80 flex flex-col items-center justify-center space-y-8">
                  <div className="relative w-24 h-24">
                    <div className="absolute inset-0 border-2 border-bronze/30 rounded-full animate-ping"></div>
                    <div className="absolute inset-4 border-2 border-cinnabar/40 rounded-full animate-pulse"></div>
                  </div>
                  <div className="text-center px-4">
                    <h3 className="text-xl font-bold text-white mb-2 serif-font tracking-[0.4em]">正在谛听 · 解析中</h3>
                    <p className="text-slate-500 text-[9px] tracking-widest uppercase">协调面部频率数据</p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-6">
              <button 
                onClick={() => { setView('home'); stopCamera(); setCapturedImage(null); setError(null); }}
                className="px-10 py-3 text-slate-500 text-xs font-bold tracking-widest uppercase hover:text-white transition-colors border-b border-white/5"
              >
                放弃
              </button>
              {!capturedImage && (
                <button 
                  onClick={captureAndAnalyze}
                  disabled={isScanning}
                  className="group relative px-12 py-3 bg-bronze text-white font-bold tracking-widest uppercase text-xs transition-all disabled:opacity-50 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-bronze-dark scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
                  <span className="relative z-10">{isScanning ? '解析中...' : '捕获相格'}</span>
                </button>
              )}
            </div>
            <canvas ref={canvasRef} className="hidden" />
          </div>
        )}

        {view === 'library' && (
          <div className="max-w-5xl mx-auto space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="text-center space-y-4 max-w-2xl mx-auto">
              <span className="text-[10px] text-bronze tracking-[0.4em] font-bold serif-font">史实文献</span>
              <h2 className="text-4xl md:text-5xl font-bold text-white serif-font tracking-tight">博古：古今面相图鉴</h2>
              <p className="text-slate-500 leading-relaxed font-light">
                “以人为镜，可以明得失。” 探寻历史上不同特质人物的面部特征共性，作为现代心理与相学研究的参考基石。
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {/* 高风险板块 */}
              <div className="glass-panel p-10 rounded-[2.5rem] border-cinnabar/20 bg-cinnabar/5 group transition-all hover:bg-cinnabar/[0.07]">
                <div className="flex items-center gap-6 mb-10">
                  <div className="w-16 h-16 bg-cinnabar/10 rounded-full flex items-center justify-center text-cinnabar shadow-inner border border-cinnabar/20">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white serif-font mb-1">极端特质与风险</h3>
                    <p className="text-[10px] text-cinnabar tracking-[0.2em] font-bold">史实风险侧写</p>
                  </div>
                </div>
                <div className="space-y-8">
                  <div className="relative pl-6 border-l border-cinnabar/30">
                    <h4 className="font-bold text-cinnabar-light text-sm mb-2 serif-font">面部宽高比 (fWHR)</h4>
                    <p className="text-xs text-slate-400 leading-relaxed font-light">
                      历史上多位极具侵略性的统治者展现出显著的面部横径扩张。研究表明，这通常与高睾酮水平及强烈的控制欲相关。
                    </p>
                  </div>
                  <div className="relative pl-6 border-l border-cinnabar/30">
                    <h4 className="font-bold text-cinnabar-light text-sm mb-2 serif-font">三白/四白眼</h4>
                    <p className="text-xs text-slate-400 leading-relaxed font-light">
                      多见于极端压力下的人格。巩膜暴露比例失衡在相学中被视为“神不守舍”，反映出情绪调节机制的潜在脆弱。
                    </p>
                  </div>
                </div>
              </div>

              {/* 智谋板块 */}
              <div className="glass-panel p-10 rounded-[2.5rem] border-bronze/20 bg-bronze/5 group transition-all hover:bg-bronze/[0.07]">
                <div className="flex items-center gap-6 mb-10">
                  <div className="w-16 h-16 bg-bronze/10 rounded-full flex items-center justify-center text-bronze shadow-inner border border-bronze/20">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white serif-font mb-1">权柄与智慧图鉴</h3>
                    <p className="text-[10px] text-bronze tracking-[0.2em] font-bold">统御力与逻辑</p>
                  </div>
                </div>
                <div className="space-y-8">
                  <div className="relative pl-6 border-l border-bronze/30">
                    <h4 className="font-bold text-bronze text-sm mb-2 serif-font">“伏犀”贯顶</h4>
                    <p className="text-xs text-slate-400 leading-relaxed font-light">
                      鼻梁丰隆直抵印堂，常见于卓越的战略家与思想家。代表了极强的逻辑连贯性与不屈的意志力。
                    </p>
                  </div>
                  <div className="relative pl-6 border-l border-bronze/30">
                    <h4 className="font-bold text-bronze text-sm mb-2 serif-font">目秀神藏</h4>
                    <p className="text-xs text-slate-400 leading-relaxed font-light">
                      眼神深邃而不露，瞳孔黑白分明。反映了高度的心理成熟度与决策时的定力。
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-center p-10 glass-panel rounded-[2rem] border-white/5 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-bronze/20 to-transparent"></div>
              <p className="text-xs text-slate-500 max-w-2xl mx-auto italic font-light serif-font">
                * 本图鉴仅作形态学特征研究参考。相心智能始终认为，面相仅为先天天赋之映射，
                真正的人格魅力与社会贡献取决于后天的修养与选择。
              </p>
            </div>
          </div>
        )}

        {view === 'about' && (
          <div className="max-w-4xl mx-auto space-y-16 animate-in fade-in duration-1000">
            <div className="text-center space-y-6">
              <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
                <div className="absolute inset-0 bg-cinnabar rotate-45 shadow-2xl"></div>
                <span className="relative z-10 text-white font-bold text-4xl serif-font">相</span>
              </div>
              <h2 className="text-4xl font-bold text-white serif-font">识墨：技术与哲学</h2>
              <p className="text-slate-400 text-lg font-light max-w-2xl mx-auto italic serif-font">
                “我们不预测命运，我们解读性格的脉络。”
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              <div className="md:col-span-8 glass-panel p-12 rounded-[3rem] border-white/5 space-y-10">
                <section>
                  <h3 className="text-xl font-bold text-bronze serif-font mb-4 flex items-center gap-3">
                    <span className="w-1 h-6 bg-bronze"></span>
                    技术源起
                  </h3>
                  <p className="text-slate-400 leading-relaxed font-light text-sm">
                    相心智能融合了计算机视觉与跨学科研究。我们的算法不仅学习了《麻衣神相》、《柳庄相法》等中国传统经典著作，还整合了现代面部形态学与演化心理学中关于面部宽高比与侵略性、领导力相关的最新实证研究结论。
                  </p>
                </section>
                <section>
                  <h3 className="text-xl font-bold text-bronze serif-font mb-4 flex items-center gap-3">
                    <span className="w-1 h-6 bg-bronze"></span>
                    隐私与道德
                  </h3>
                  <p className="text-slate-400 leading-relaxed font-light text-sm">
                    我们严格遵守生物识别数据的保护准则。所有分析均在安全的云端推理后即刻销毁原始图像。我们强烈反对任何形式的“有罪推定”或基于面相的职场/社交歧视。本系统旨在作为自我认知与压力管理的辅助工具，而非决定他人的标签。
                  </p>
                </section>
                <section>
                  <h3 className="text-xl font-bold text-bronze serif-font mb-4 flex items-center gap-3">
                    <span className="w-1 h-6 bg-bronze"></span>
                    相由心生，亦由心改
                  </h3>
                  <p className="text-slate-400 leading-relaxed font-light text-sm">
                    中国古代相法强调“心好相亦好”，这与现代心理学中的“面部表情反馈假说”不谋而合。长期的心态调适会改变面部肌肉纹理与气色。相心鼓励每一位用户关注内心修行，从而获得更佳的生命状态。
                  </p>
                </section>
              </div>
              
              <div className="md:col-span-4 flex flex-col gap-8">
                <div className="glass-panel p-8 rounded-[2rem] border-bronze/10 text-center">
                  <div className="text-bronze text-4xl font-bold serif-font mb-2">98%</div>
                  <div className="text-[10px] text-slate-500 tracking-widest font-bold">拓扑建模精度</div>
                </div>
                <div className="glass-panel p-8 rounded-[2rem] border-bronze/10 text-center">
                  <div className="text-bronze text-4xl font-bold serif-font mb-2">12+</div>
                  <div className="text-[10px] text-slate-500 tracking-widest font-bold">核心分析维度</div>
                </div>
                <div className="glass-panel p-8 rounded-[2rem] border-bronze/10 flex-1 flex flex-col items-center justify-center text-center px-6">
                  <div className="w-12 h-12 bg-cinnabar/10 rounded-full flex items-center justify-center text-cinnabar mb-4">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04M12 21a18.966 18.966 0 01-5.905-1.27c.331-3.906 1.305-7.618 2.871-10.884l2.871 10.884z" />
                    </svg>
                  </div>
                  <div className="text-xs text-slate-400 font-light leading-relaxed">
                    所有数据传输均经过端到端加密，您的隐私受法律严密保护。
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {view === 'report' && analysisResult && capturedImage && (
          <AnalysisReport 
            data={analysisResult} 
            image={capturedImage} 
            onReset={() => { setView('home'); setAnalysisResult(null); setCapturedImage(null); }} 
          />
        )}
      </main>

      <footer className="py-16 border-t border-white/5 bg-ink-950/40 text-center">
        <div className="max-w-6xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-10 opacity-40 hover:opacity-100 transition-opacity duration-500">
          <div className="text-left">
            <h4 className="text-white serif-font font-bold tracking-widest mb-2">相心智能分析系统</h4>
            <p className="text-slate-500 text-xs font-light">相由心生，亦由心改。数据仅供探索，心性存乎一心。</p>
          </div>
          <div className="flex gap-10 text-[10px] tracking-[0.2em] font-bold text-slate-500">
             <a href="#" className="hover:text-bronze transition-colors">隐私契约</a>
             <a href="#" className="hover:text-bronze transition-colors">技术缘起</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
