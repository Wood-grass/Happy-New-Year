import React, { useState, useRef, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Camera, X, RefreshCw, Smartphone, ArrowRight, MessageSquare, MapPin, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

// Simple 3D Model for AR overlay
const ARModel = () => {
  return (
    <mesh position={[0, 0, -2]} rotation={[0, 0.5, 0]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#ef4444" wireframe />
      <mesh position={[0, 0, 0]}>
         <sphereGeometry args={[0.3, 32, 32]} />
         <meshStandardMaterial color="#fbbf24" />
      </mesh>
    </mesh>
  )
}

const ARScan: React.FC = () => {
  const navigate = useNavigate()
  const [scanning, setScanning] = useState(false)
  const [recognized, setRecognized] = useState(false)
  const [isSimulation, setIsSimulation] = useState(false)
  const [showInputForm, setShowInputForm] = useState(false)
  const [inputData, setInputData] = useState({ city: '', item: '' })
  const videoRef = useRef<HTMLVideoElement>(null)
  const [error, setError] = useState<string>('')

  const startCamera = async () => {
    setScanning(true)
    setIsSimulation(false)
    setError('')
    try {
      // Check if browser supports getUserMedia
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('BrowserNotSupported');
      }

      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment', // Prefer rear camera
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false // Explicitly disable audio
      })
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      
      // Simulate recognition delay
      setTimeout(() => {
        setRecognized(true)
      }, 3000)
    } catch (err: any) {
      console.error("Camera access error:", err)
      
      let errorMsg = '无法访问摄像头，请检查权限设置。';
      
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        errorMsg = '访问被拒绝：请在浏览器设置中允许访问摄像头。';
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        errorMsg = '未检测到摄像头设备，请检查硬件连接。';
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        errorMsg = '摄像头被占用或发生硬件错误。';
      } else if (err.message === 'BrowserNotSupported') {
        errorMsg = '您的浏览器不支持摄像头访问，请尝试使用Chrome或Safari。';
      }

      setError(errorMsg)
    }
  }

  const handleSimulationClick = () => {
    setShowInputForm(true)
  }

  const startSimulation = () => {
    if (!inputData.city || !inputData.item) return
    
    setShowInputForm(false)
    setScanning(true)
    setIsSimulation(true)
    setError('')
    
    // Simulate recognition delay based on input
    setTimeout(() => {
        setRecognized(true)
    }, 2500)
  }

  const stopCamera = () => {
    setScanning(false)
    setRecognized(false)
    setIsSimulation(false)
    setShowInputForm(false)
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      stream.getTracks().forEach(track => track.stop())
      videoRef.current.srcObject = null
    }
  }

  useEffect(() => {
    return () => {
      stopCamera()
    }
  }, [])

  const handleGenerateReport = () => {
      navigate('/gene-profile')
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[100dvh] bg-black text-white relative overflow-hidden">
      {/* Header / Close Button */}
      {(scanning || showInputForm) && (
        <div className="absolute top-4 left-4 z-20">
           <button onClick={stopCamera} className="p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors">
             <X />
           </button>
        </div>
      )}

      {/* Input Form Overlay */}
      {showInputForm && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/90 backdrop-blur-sm p-6 animate-in fade-in zoom-in duration-300">
           <div className="w-full max-w-sm bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center justify-center w-12 h-12 bg-indigo-600 rounded-full mx-auto mb-4 shadow-lg shadow-indigo-600/30">
                 <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-center mb-2">定制您的年味</h2>
              <p className="text-gray-400 text-center text-sm mb-6">输入信息，AI 将为您生成专属年味基因</p>
              
              <div className="space-y-4">
                 <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">所在城市 / 家乡</label>
                    <div className="relative">
                       <MapPin className="absolute left-3 top-3.5 w-5 h-5 text-gray-500" />
                       <input 
                         type="text"
                         value={inputData.city}
                         onChange={(e) => setInputData({...inputData, city: e.target.value})}
                         className="w-full bg-gray-800 border border-gray-700 rounded-xl py-3 pl-10 pr-4 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder-gray-600"
                         placeholder="例如：西安、苏州..."
                       />
                    </div>
                 </div>
                 
                 <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2 ml-1">身边的年俗物件</label>
                    <div className="relative">
                       <Sparkles className="absolute left-3 top-3.5 w-5 h-5 text-gray-500" />
                       <input 
                         type="text"
                         value={inputData.item}
                         onChange={(e) => setInputData({...inputData, item: e.target.value})}
                         className="w-full bg-gray-800 border border-gray-700 rounded-xl py-3 pl-10 pr-4 text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder-gray-600"
                         placeholder="例如：剪纸、灯笼、中国结..."
                       />
                    </div>
                 </div>
                 
                 <button 
                   onClick={startSimulation}
                   disabled={!inputData.city || !inputData.item}
                   className={`w-full py-3.5 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center transition-all mt-4 ${
                     inputData.city && inputData.item 
                       ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-indigo-600/40 transform active:scale-95' 
                       : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                   }`}
                 >
                    开始智能生成
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* Camera View / Simulation */}
      <div className="relative w-full h-[100dvh] flex items-center justify-center bg-gray-900">
        {scanning ? (
          <>
            {!isSimulation && (
                <video 
                ref={videoRef} 
                autoPlay 
                playsInline
                muted 
                className="absolute inset-0 w-full h-full object-cover z-0"
                />
            )}
            
            {/* Simulation Background */}
            {isSimulation && (
                <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-gray-800 to-black z-0 flex items-center justify-center flex-col">
                    <p className="text-gray-500 animate-pulse mb-2">正在分析：{inputData.city} · {inputData.item}</p>
                    <div className="w-48 h-1 bg-gray-700 rounded-full overflow-hidden">
                       <div className="h-full bg-indigo-500 animate-[loading_2s_ease-in-out_infinite] w-1/2"></div>
                    </div>
                </div>
            )}
            
            {/* 3D Overlay Layer - Result */}
            {recognized && (
               <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-500">
                 <div className="h-64 w-full">
                    <Canvas camera={{ position: [0, 0, 4], fov: 50 }}>
                        <ambientLight intensity={0.8} />
                        <pointLight position={[10, 10, 10]} intensity={1.5} />
                        <ARModel />
                        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={5} />
                    </Canvas>
                 </div>
                 
                 <div className="text-center p-6 bg-white/10 backdrop-blur-md rounded-xl border border-yellow-500/30 mx-4 max-w-sm shadow-2xl">
                    <div className="inline-block p-3 bg-red-600 rounded-full mb-4 shadow-lg shadow-red-600/30">
                        <Smartphone className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-yellow-400 mb-2">识别成功！</h2>
                    <p className="text-gray-200 mb-6">
                       已在 <span className="text-yellow-400 font-bold">{inputData.city || '本地'}</span> 发现
                       <br/>
                       “{inputData.item || '年俗'}” 基因
                    </p>
                    
                    <button 
                        onClick={handleGenerateReport}
                        className="w-full py-3 bg-gradient-to-r from-red-600 to-orange-600 rounded-lg text-white font-bold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-red-600/40 transition-all active:scale-95"
                    >
                        生成年味报告 & 技艺步骤 <ArrowRight className="w-5 h-5" />
                    </button>
                 </div>
               </div>
            )}

            {/* Scanning UI */}
      {!recognized && !error && (
        <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
          <div className="w-72 h-72 border-2 border-yellow-400/50 rounded-lg relative">
             {/* Scanning Laser Effect */}
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent animate-[scan_2s_ease-in-out_infinite] opacity-70"></div>
             
             {/* Corners */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-yellow-500 -mt-1 -ml-1 rounded-tl-lg"></div>
            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-yellow-500 -mt-1 -mr-1 rounded-tr-lg"></div>
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-yellow-500 -mb-1 -ml-1 rounded-bl-lg"></div>
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-yellow-500 -mb-1 -mr-1 rounded-br-lg"></div>
            
            <div className="absolute -bottom-16 w-full text-center">
              <p className="text-yellow-100 text-sm bg-black/40 px-4 py-2 rounded-full inline-block backdrop-blur-md border border-white/10">
                {isSimulation ? "🤖 正在基于提供的信息分析中..." : "🔍 寻找身边的马年元素（春联/窗花）"}
              </p>
            </div>
          </div>
        </div>
      )}

            {/* Error Message */}
            {error && (
               <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/80">
                 <div className="text-center p-6 max-w-xs">
                   <p className="text-red-500 mb-6">{error}</p>
                   <div className="space-y-3">
                        <button onClick={startCamera} className="w-full flex items-center justify-center px-4 py-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
                            <RefreshCw className="mr-2 h-4 w-4" /> 重试摄像头
                        </button>
                        <button onClick={handleSimulationClick} className="w-full flex items-center justify-center px-4 py-3 bg-red-900/50 text-red-200 rounded-lg hover:bg-red-900/70 transition-colors border border-red-800">
                            <MessageSquare className="mr-2 h-4 w-4" /> 切换到信息模拟
                        </button>
                   </div>
                 </div>
               </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center p-8 text-center max-w-md z-10 animate-in fade-in duration-700">
            <div className="w-24 h-24 bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(220,38,38,0.6)] border-4 border-red-500/30">
               <Camera size={48} className="text-white" />
            </div>
            <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-200">AR 扫年俗</h1>
            <p className="text-gray-300 mb-10 text-lg leading-relaxed">
              开启摄像头，对准家中的<span className="text-yellow-400">春联</span>、<span className="text-yellow-400">窗花</span>或<span className="text-yellow-400">灯笼</span>，
              AI将自动识别并解锁 3D 制作教程。
            </p>
            
            <div className="w-full space-y-4">
                <button
                onClick={startCamera}
                className="w-full py-4 bg-gradient-to-r from-red-600 to-orange-600 rounded-xl text-white font-bold text-lg hover:shadow-lg hover:shadow-red-600/40 transform transition-all active:scale-95 flex items-center justify-center"
                >
                <Camera className="mr-2 w-5 h-5" /> 开启摄像头扫描
                </button>
                
                <button
                onClick={handleSimulationClick}
                className="w-full py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white font-semibold text-lg hover:bg-white/20 transition-all active:scale-95 flex items-center justify-center"
                >
                <MessageSquare className="mr-2 w-5 h-5" /> 信息模拟体验
                </button>
            </div>
            <p className="mt-6 text-xs text-gray-500">提示：如无法使用摄像头，请使用信息模拟体验功能</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ARScan