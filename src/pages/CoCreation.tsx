
import React, { useState, useEffect } from 'react'
import { useAuth, supabase } from '../components/AuthProvider'
import { Upload, Image as ImageIcon, Loader2, CheckCircle, AlertCircle, TrendingUp } from 'lucide-react'
import { Link } from 'react-router-dom'
import ContributionCard, { Contribution } from '../components/ContributionCard'

const REGIONS = ["华北", "东北", "华东", "中南", "西南", "西北"]
const CATEGORIES = ["剪纸", "灯彩", "年画", "面塑", "表演", "民俗", "其他"]

const CoCreation: React.FC = () => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [contributions, setContributions] = useState<Contribution[]>([])
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    region: '',
  })
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  useEffect(() => {
    fetchContributions()
  }, [])

  const fetchContributions = async () => {
    const { data } = await supabase
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
      .limit(20)
    
    if (data) {
      setContributions(data)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError('文件大小不能超过 5MB')
        return
      }
      setFile(selectedFile)
      setPreviewUrl(URL.createObjectURL(selectedFile))
      setError(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    if (!formData.title || !formData.category || !formData.region) {
      setError('请填写完整信息')
      return
    }

    setLoading(true)
    setError(null)

    try {
      let imageUrls: string[] = []
      
      // Upload image if exists
      if (file) {
        const fileExt = file.name.split('.').pop()
        const fileName = `${user.id}/${Date.now()}.${fileExt}`
        
        const { error: uploadError } = await supabase.storage
          .from('contributions')
          .upload(fileName, file)

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
          .from('contributions')
          .getPublicUrl(fileName)
          
        imageUrls.push(publicUrl)
      }

      // Insert record
      const { error: insertError } = await supabase
        .from('user_contributions')
        .insert({
          user_id: user.id,
          title: formData.title,
          description: formData.description,
          category: formData.category,
          region: formData.region,
          images: imageUrls,
          status: 'pending'
        })

      if (insertError) throw insertError

      setSuccess(true)
      setFormData({ title: '', description: '', category: '', region: '' })
      setFile(null)
      setPreviewUrl(null)
    } catch (err: any) {
      console.error('Submission error:', err)
      setError(err.message || '提交失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  const renderUploadSection = () => {
    if (!user) {
      return (
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 text-center mb-12">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Upload className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold mb-4">登录分享您的年俗记忆</h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            登录账号后，您可以上传身边的非遗故事，与全国用户共同构建年俗基因库。
          </p>
          <Link to="/login" className="inline-block px-10 py-3 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition-colors">
            去登录
          </Link>
        </div>
      )
    }

    if (success) {
      return (
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 text-center mb-12">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold mb-4">提交成功！</h2>
          <p className="text-gray-600 mb-8">您的内容已提交审核，审核通过后将展示在下方列表中。</p>
          <button 
            onClick={() => setSuccess(false)}
            className="inline-block px-10 py-3 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition-colors"
          >
            继续上传
          </button>
        </div>
      )
    }

    return (
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-gray-100 mb-12">
        <h2 className="text-xl font-semibold mb-6 flex items-center border-l-4 border-red-600 pl-4">
          上传您的年俗记忆
        </h2>
        
        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 flex items-center">
            <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                项目标题 <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                required
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all" 
                placeholder="例如：我家乡的舞龙灯" 
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                所属类别 <span className="text-red-500">*</span>
              </label>
              <select 
                required
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none bg-white"
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value})}
              >
                <option value="">请选择类别</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              所属地区 <span className="text-red-500">*</span>
            </label>
            <select 
              required
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none bg-white"
              value={formData.region}
              onChange={e => setFormData({...formData, region: e.target.value})}
            >
              <option value="">请选择地区</option>
              {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              详细描述
            </label>
            <textarea 
              className="w-full border border-gray-300 rounded-lg p-3 h-32 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all resize-none" 
              placeholder="讲述这个年俗背后的故事、历史渊源或您的亲身经历..."
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              上传图片 (支持 JPG, PNG)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-red-400 transition-colors bg-gray-50 group cursor-pointer relative">
              <input 
                type="file" 
                accept="image/*"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                onChange={handleFileChange}
              />
              {previewUrl ? (
                <div className="relative z-0">
                   <img src={previewUrl} alt="Preview" className="max-h-48 mx-auto rounded-lg shadow-sm" />
                   <p className="mt-2 text-sm text-gray-500">点击更换图片</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                    <ImageIcon className="w-6 h-6 text-gray-400 group-hover:text-red-500" />
                  </div>
                  <p className="text-gray-600 font-medium">点击或拖拽上传</p>
                  <p className="text-xs text-gray-400">最大支持 5MB</p>
                </div>
              )}
            </div>
          </div>

          <div className="pt-4">
            <button 
              type="submit" 
              disabled={loading}
              className={`w-full bg-red-600 text-white py-3 rounded-lg font-bold hover:bg-red-700 transition-colors shadow-md hover:shadow-lg flex items-center justify-center ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin mr-2 w-5 h-5" />
                  提交中...
                </>
              ) : (
                '提交审核'
              )}
            </button>
          </div>
        </form>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">非遗共创平台</h1>
          <p className="text-gray-500 mt-2">分享您身边的年味，共同构建非遗基因库</p>
        </div>
      </div>

      {renderUploadSection()}

      {/* Gallery Section */}
      <div className="mt-16 border-t border-gray-200 pt-10">
        <div className="flex items-center mb-8">
           <div className="p-2 bg-red-100 rounded-full mr-3">
              <TrendingUp className="w-6 h-6 text-red-600" />
           </div>
          <h2 className="text-2xl font-bold text-gray-900">共创热门排行</h2>
        </div>
        
        {contributions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contributions.map((item) => (
              <ContributionCard key={item.id} contribution={item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-gray-50 rounded-xl border border-dashed border-gray-300">
             <p className="text-gray-400 mb-2">暂无热门内容</p>
             <p className="text-gray-500">快来抢占沙发，分享您的年俗故事吧！</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default CoCreation
