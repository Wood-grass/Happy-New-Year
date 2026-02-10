import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Camera, BookOpen, Dna, Share2, User, ArrowRight } from 'lucide-react'
import ModelViewer from '../components/3d/ModelViewer'
import { heritageData } from '../lib/heritageData'
import { supabase } from '../components/AuthProvider'
import ContributionCard, { Contribution } from '../components/ContributionCard'

const Home: React.FC = () => {
  // Select top 6 featured items
  const featuredItems = heritageData.slice(0, 6)
  const [hotContributions, setHotContributions] = useState<Contribution[]>([])

  useEffect(() => {
    fetchHotContributions()
  }, [])

  const fetchHotContributions = async () => {
    const { data, error } = await supabase
      .from('user_contributions')
      .select(`
        *,
        users (
          name,
          avatar_url,
          hometown
        )
      `)
      .eq('status', 'approved')
      .order('likes', { ascending: false })
      .limit(4)
    
    if (!error && data) {
      setHotContributions(data)
    }
  }

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-red-800 to-red-700 text-yellow-50 py-24 px-4 text-center relative overflow-hidden">
        {/* Decorative Horse Elements Background */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
           <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M10,50 Q30,20 50,50 T90,50" fill="none" stroke="currentColor" strokeWidth="0.5" />
              <path d="M10,60 Q30,30 50,60 T90,60" fill="none" stroke="currentColor" strokeWidth="0.5" />
           </svg>
        </div>
        
        <div className="relative z-10">
          <div className="mb-4 inline-block p-3 border-2 border-yellow-500 rounded-full bg-red-900/50 backdrop-blur-sm">
             <span className="text-3xl">🐎</span>
          </div>
          <h1 className="text-6xl font-bold mb-4 font-serif tracking-wide text-yellow-400 drop-shadow-md">
            金马贺岁 · 年味基因
          </h1>
          <p className="text-xl mb-10 max-w-2xl mx-auto text-red-100 font-light tracking-wider">
            跃马迎春，探索国家级非遗年俗，解锁您的专属文化血脉
          </p>
          <Link
            to="/ar-scan"
            className="inline-flex items-center px-10 py-4 bg-yellow-500 text-red-900 rounded-full font-bold text-xl hover:bg-yellow-400 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 transform border-2 border-yellow-300"
          >
            <Camera className="mr-3 w-6 h-6" />
            AR 寻马扫年俗
          </Link>
        </div>
        
        {/* Paper Cut Style Horse Decoration at Bottom */}
        <div className="absolute bottom-0 left-0 w-full h-12 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMjAwIDEyMCIgcHJlc2VydmVBc3BlY3RSYXRpbz0ibm9uZSI+PHBhdGggZD0iTTAgMGw2MDAgMTAwTDEyMDAgMHYxMjBIMHoiIGZpbGw9IiNmZmYiLz48L3N2Zz4=')] bg-cover opacity-20"></div>
      </div>

      {/* Feature Navigation */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link to="/heritage/list" className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow border-t-4 border-red-600 group">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-red-200 transition-colors">
              <BookOpen className="text-red-700" />
            </div>
            <h3 className="text-xl font-bold mb-2">非遗百科</h3>
            <p className="text-gray-600">探索200+项春节非遗技艺，了解背后的故事。</p>
          </Link>

          <Link to="/gene-profile" className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow border-t-4 border-yellow-500 group">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-yellow-200 transition-colors">
              <Dna className="text-yellow-700" />
            </div>
            <h3 className="text-xl font-bold mb-2">年味基因</h3>
            <p className="text-gray-600">生成您的专属年味基因报告，发现文化血脉。</p>
          </Link>

          <Link to="/co-creation" className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow border-t-4 border-blue-500 group">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
              <Share2 className="text-blue-700" />
            </div>
            <h3 className="text-xl font-bold mb-2">非遗共创</h3>
            <p className="text-gray-600">分享您身边的独特年俗，共同传承文化记忆。</p>
          </Link>

          <Link to="/profile" className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow border-t-4 border-purple-500 group">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
              <User className="text-purple-700" />
            </div>
            <h3 className="text-xl font-bold mb-2">个人中心</h3>
            <p className="text-gray-600">管理您的收藏、上传和基因报告历史。</p>
          </Link>
        </div>
      </div>

      {/* Featured Heritage Section (Mock) */}
      <div className="bg-stone-50 py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center mb-10">
            <span className="text-red-800 text-2xl mr-4 opacity-80">❖</span>
            <h2 className="text-3xl font-bold text-center font-serif text-red-900 tracking-widest">
              马年限定 · 非遗精选
            </h2>
            <span className="text-red-800 text-2xl ml-4 opacity-80">❖</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredItems.map((item) => (
              <div key={item.id} className="rounded-xl overflow-hidden shadow-lg border border-red-100 bg-white group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 flex flex-col h-full">
                <div className="h-56 bg-gray-50 relative flex-shrink-0">
                  {/* Pass imageUrl for 2D preview since we don't have real 3D models yet */}
                  <ModelViewer imageUrl={item.imageUrl} autoRotate={false} />
                  <div className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded">马年特供</div>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-xl font-bold mb-2 text-gray-800 group-hover:text-red-700 transition-colors">{item.name}</h3>
                  <p className="text-gray-600 text-sm mb-6 leading-relaxed line-clamp-2 flex-1">{item.desc}</p>
                  <Link to={`/heritage/${item.id}`} className="inline-block w-full text-center py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-colors font-medium">
                    查看详情
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Hot Co-creations Section */}
      {hotContributions.length > 0 && (
        <div className="bg-white py-16 border-t border-stone-100">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center">
                <span className="text-blue-800 text-2xl mr-4 opacity-80">❖</span>
                <h2 className="text-3xl font-bold font-serif text-blue-900 tracking-widest">
                  非遗共创 · 热门分享
                </h2>
              </div>
              <Link to="/co-creation" className="flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors">
                查看全部 <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {hotContributions.map((item) => (
                <ContributionCard key={item.id} contribution={item} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-red-50 text-red-800 py-8 text-center border-t border-red-100">
        <div className="container mx-auto px-4">
          <p className="text-sm tracking-widest uppercase font-serif font-medium">
            开发者：Wood grass
          </p>
        </div>
      </footer>
    </div>
  )
}

export default Home
