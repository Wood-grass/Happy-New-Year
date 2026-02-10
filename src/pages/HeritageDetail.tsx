import React, { useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, MapPin, Tag } from 'lucide-react'
import ModelViewer from '../components/3d/ModelViewer'
import { heritageData } from '../lib/heritageData'

const HeritageDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  
  const heritage = useMemo(() => {
    return heritageData.find(item => item.id === id)
  }, [id])

  if (!heritage) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-stone-50">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">未找到该非遗项目</h1>
        <Link to="/" className="text-red-600 hover:underline flex items-center">
          <ArrowLeft className="mr-2 w-4 h-4" /> 返回首页
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-stone-50 pb-12">
      {/* Header / Breadcrumb */}
      <div className="bg-white shadow-sm sticky top-0 z-20">
        <div className="container mx-auto px-4 py-4">
          <Link to="/" className="text-gray-500 hover:text-red-600 inline-flex items-center transition-colors">
            <ArrowLeft className="mr-2 w-4 h-4" /> 返回首页
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column: Visuals */}
          <div className="space-y-6">
             <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 aspect-square relative">
                <ModelViewer 
                  modelUrl={heritage.modelUrl} 
                  imageUrl={heritage.imageUrl} 
                  autoRotate={true} 
                />
             </div>
             <div className="bg-yellow-50 p-6 rounded-xl border border-yellow-100">
               <h3 className="font-bold text-yellow-800 mb-2 flex items-center">
                 💡 互动提示
               </h3>
               <p className="text-yellow-700 text-sm">
                 {heritage.modelUrl 
                   ? "您可以拖动旋转模型，双指缩放查看细节。点击 AR 按钮可将模型投射到现实中。" 
                   : "当前展示为 2D 预览图。我们正在加紧制作高精度 3D 模型，敬请期待！"}
               </p>
             </div>
          </div>

          {/* Right Column: Info */}
          <div>
            <div className="mb-2">
              <span className="inline-block px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-semibold mb-4">
                {heritage.category}
              </span>
            </div>
            <h1 className="text-4xl font-bold mb-4 font-serif text-gray-900">{heritage.name}</h1>
            
            <div className="flex flex-wrap gap-4 mb-8 text-gray-600">
              <div className="flex items-center bg-white px-3 py-1 rounded-md shadow-sm">
                <MapPin className="w-4 h-4 mr-2 text-red-500" />
                {heritage.region}
              </div>
              {heritage.tags.map(tag => (
                <div key={tag} className="flex items-center bg-white px-3 py-1 rounded-md shadow-sm">
                  <Tag className="w-4 h-4 mr-2 text-blue-500" />
                  {tag}
                </div>
              ))}
            </div>

            <div className="prose prose-lg max-w-none text-gray-700">
              <h3 className="text-2xl font-bold mb-4 font-serif border-l-4 border-red-600 pl-4">技艺介绍</h3>
              <p className="leading-relaxed mb-8">
                {heritage.fullDesc}
              </p>

              <h3 className="text-2xl font-bold mb-4 font-serif border-l-4 border-red-600 pl-4">传承价值</h3>
              <p className="leading-relaxed mb-8">
                {heritage.name}不仅是{heritage.region}地区人民智慧的结晶，更是中华民族宝贵的文化财富。
                通过数字化的方式记录与传播，我们希望让更多年轻人了解并喜爱上这项古老的技艺，
                让传统在现代生活中焕发新的生机。
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mt-8 pt-8 border-t border-gray-200">
              <button className="flex-1 bg-red-600 text-white py-3 rounded-lg font-bold hover:bg-red-700 transition-colors shadow-md hover:shadow-lg">
                收藏项目
              </button>
              <button className="flex-1 bg-white text-gray-800 border border-gray-300 py-3 rounded-lg font-bold hover:bg-gray-50 transition-colors">
                分享给好友
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeritageDetail
