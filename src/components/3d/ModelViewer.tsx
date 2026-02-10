import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stage, useGLTF } from '@react-three/drei'

interface ModelViewerProps {
  modelUrl?: string
  imageUrl?: string
  autoRotate?: boolean
  scale?: number
}

const Model: React.FC<{ url: string; scale: number }> = ({ url, scale }) => {
  const { scene } = useGLTF(url)
  return <primitive object={scene} scale={scale} />
}

const Placeholder = () => {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#DC2626" wireframe />
    </mesh>
  )
}

const ModelViewer: React.FC<ModelViewerProps> = ({ 
  modelUrl, 
  imageUrl,
  autoRotate = true,
  scale = 1 
}) => {
  // If no model URL is provided, show the image (2D fallback)
  if (!modelUrl) {
    return (
      <div className="w-full h-full min-h-[250px] bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center relative group">
        {imageUrl ? (
          <img src={imageUrl} alt="Heritage Preview" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <div className="text-gray-400 text-sm">暂无 3D 模型</div>
        )}
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors pointer-events-none" />
        {imageUrl && (
           <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
             2D 预览
           </div>
        )}
      </div>
    )
  }

  return (
    <div className="w-full h-full min-h-[300px] bg-gray-100 rounded-lg overflow-hidden relative">
      <Canvas shadows dpr={[1, 2]} camera={{ fov: 50 }}>
        <Suspense fallback={<Placeholder />}>
          <Stage environment="city" intensity={0.6}>
             <Model url={modelUrl} scale={scale} />
          </Stage>
        </Suspense>
        <OrbitControls autoRotate={autoRotate} />
      </Canvas>
       <div className="absolute bottom-2 right-2 bg-red-600/80 text-white text-xs px-2 py-1 rounded backdrop-blur-sm pointer-events-none">
         3D 交互中
       </div>
    </div>
  )
}

export default ModelViewer
