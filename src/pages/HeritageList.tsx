import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Search, MapPin, Filter, ChevronLeft, ChevronRight } from 'lucide-react'
import { heritageData, getRegionGroup, REGION_GROUPS } from '../lib/heritageData'

const ITEMS_PER_PAGE = 12;

const HeritageList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('全部')
  const [selectedRegionGroup, setSelectedRegionGroup] = useState('全部')
  const [currentPage, setCurrentPage] = useState(1)

  // 提取所有类别
  const categories = useMemo(() => 
    ['全部', ...Array.from(new Set(heritageData.map(item => item.category)))], 
  []);

  // 提取所有大区
  const regionGroups = ['全部', ...Object.keys(REGION_GROUPS)];

  // 过滤逻辑
  const filteredItems = useMemo(() => {
    return heritageData.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            item.desc.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === '全部' || item.category === selectedCategory
      
      let matchesRegion = true;
      if (selectedRegionGroup !== '全部') {
        matchesRegion = getRegionGroup(item.region) === selectedRegionGroup;
      }

      return matchesSearch && matchesCategory && matchesRegion
    })
  }, [searchTerm, selectedCategory, selectedRegionGroup]);

  // 分页逻辑
  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
  const currentItems = filteredItems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // 当筛选条件变化时，重置页码
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, selectedRegionGroup]);

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans">
      {/* Header */}
      <div className="bg-red-900 text-white py-16 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523726491678-bf852e717f63?auto=format&fit=crop&q=80')] opacity-10 bg-cover bg-center mix-blend-overlay"></div>
        <div className="relative z-10">
          <h1 className="text-5xl font-bold font-serif mb-6 tracking-wide">非遗百科</h1>
          <p className="text-red-100 max-w-2xl mx-auto text-lg">
            探索 {heritageData.length}+ 项国家级非物质文化遗产，传承中华文明之美
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Search & Filters Section */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 mb-8 sticky top-4 z-20 backdrop-blur-md bg-white/90">
          {/* Search Bar */}
          <div className="relative mb-6">
            <input 
              type="text" 
              placeholder="搜索非遗项目（如：剪纸、苏绣...）" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-xl border border-stone-200 bg-stone-50 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all text-lg"
            />
            <Search className="absolute left-4 top-4.5 text-stone-400 w-6 h-6" />
          </div>

          {/* Filters Row */}
          <div className="flex flex-col md:flex-row gap-6">
            {/* Category Filter */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3 text-sm font-medium text-stone-500">
                <Filter className="w-4 h-4" /> 按类别筛选
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3 py-1.5 rounded-lg text-sm transition-colors mb-2 mr-2 ${
                      selectedCategory === category 
                        ? 'bg-red-600 text-white shadow-md' 
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Region Filter */}
            <div className="flex-1 md:border-l md:pl-6 border-stone-200">
              <div className="flex items-center gap-2 mb-3 text-sm font-medium text-stone-500">
                <MapPin className="w-4 h-4" /> 按地区筛选
              </div>
              <div className="flex flex-wrap gap-2">
                {regionGroups.map(group => (
                  <button
                    key={group}
                    onClick={() => setSelectedRegionGroup(group)}
                    className={`px-3 py-1.5 rounded-lg text-sm transition-colors mb-2 mr-2 ${
                      selectedRegionGroup === group 
                        ? 'bg-red-600 text-white shadow-md' 
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    {group}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Results Info */}
        <div className="mb-6 flex justify-between items-center text-stone-500">
          <span>共找到 {filteredItems.length} 个项目</span>
          {filteredItems.length > 0 && (
            <span>第 {currentPage} / {totalPages} 页</span>
          )}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {currentItems.map(item => (
            <Link to={`/heritage/${item.id}`} key={item.id} className="group block bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-stone-100">
              <div className="aspect-[4/3] bg-stone-100 relative overflow-hidden">
                {/* 使用图片展示，ModelViewer 如有性能问题可按需加载 */}
                <img 
                  src={item.imageUrl} 
                  alt={item.name}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
                  {item.category}
                </div>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg text-stone-900 group-hover:text-red-700 transition-colors line-clamp-1">{item.name}</h3>
                  <span className="text-xs text-stone-500 bg-stone-100 px-2 py-1 rounded border border-stone-200">{item.region}</span>
                </div>
                <p className="text-sm text-stone-500 line-clamp-2 mb-3">{item.desc}</p>
                <div className="flex flex-wrap gap-1">
                  {item.tags.slice(0, 3).map((tag, idx) => (
                    <span key={idx} className="text-xs text-red-600 bg-red-50 px-2 py-0.5 rounded">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 py-8">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-full border border-stone-200 hover:bg-stone-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            
            <div className="flex gap-2">
              {/* 简化的页码显示：第一页，当前页附近，最后一页 */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
                 // 只显示当前页附近的页码，以及首尾页
                 if (
                   page === 1 || 
                   page === totalPages || 
                   (page >= currentPage - 1 && page <= currentPage + 1)
                 ) {
                   return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-medium transition-colors ${
                        currentPage === page
                          ? 'bg-red-600 text-white shadow-lg transform scale-110'
                          : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
                      }`}
                    >
                      {page}
                    </button>
                   );
                 } else if (
                   page === currentPage - 2 || 
                   page === currentPage + 2
                 ) {
                   return <span key={page} className="w-10 h-10 flex items-center justify-center text-stone-400">...</span>
                 }
                 return null;
              })}
            </div>

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-full border border-stone-200 hover:bg-stone-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        )}

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <div className="text-center py-20 text-stone-500 bg-stone-50 rounded-xl border border-dashed border-stone-300">
            <p className="text-xl mb-2">未找到相关非遗项目</p>
            <p className="text-sm">尝试更换搜索词或筛选条件</p>
            <button 
              onClick={() => {
                setSearchTerm(''); 
                setSelectedCategory('全部');
                setSelectedRegionGroup('全部');
              }}
              className="mt-6 px-6 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
            >
              清除所有筛选
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default HeritageList
