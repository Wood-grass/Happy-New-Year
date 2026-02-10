import React, { useState, useEffect } from 'react'
import { ArrowLeft, Share2, Download, Scissors, BookOpen, Star, RefreshCw } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../components/AuthProvider'

// 7 Distinct Gene Cards Data
const GENE_CARDS = [
  {
    id: 'gold',
    title: "金马纳福",
    keyword: "财运",
    traits: ["富贵", "辉煌", "大气"],
    description: "您的年味基因如同熠熠生辉的金马，象征着富贵与繁荣。新的一年，您将如金马般闪耀，财运亨通，福气满满。",
    blessing: "金马贺岁，财源广进，福气东来！",
    color: "from-yellow-500 to-amber-700",
    bgColor: "bg-amber-50",
    iconColor: "text-amber-600",
    pattern: "🪙",
    steps: [
      { title: "掐丝轮廓", desc: "用金银细丝在胎体上勾勒出马的矫健轮廓。", icon: "🧵" },
      { title: "点蓝填色", desc: "在金丝框内仔细填入各色矿物釉料。", icon: "🎨" },
      { title: "烧蓝固色", desc: "入窑高温烧制，使釉料熔化固定，流光溢彩。", icon: "🔥" },
      { title: "镀金修饰", desc: "最后打磨镀金，让金马更加璀璨夺目。", icon: "✨" }
    ]
  },
  {
    id: 'gallop',
    title: "万马奔腾",
    keyword: "事业",
    traits: ["进取", "速度", "力量"],
    description: "您的基因中流淌着奔腾不息的血液。您像一匹千里马，永远充满激情与动力。新的一年，事业将突飞猛进，势不可挡。",
    blessing: "马到成功，前程似锦，步步高升！",
    color: "from-red-600 to-red-800",
    bgColor: "bg-red-50",
    iconColor: "text-red-600",
    pattern: "🔥",
    steps: [
      { title: "研墨备纸", desc: "研磨好浓淡适宜的墨汁，铺开上好的宣纸。", icon: "🖌️" },
      { title: "骨法用笔", desc: "提笔挥毫，用刚劲的线条勾勒马的骨骼与肌肉。", icon: "🐎" },
      { title: "泼墨写意", desc: "运用泼墨技法，渲染出马鬃飞扬的速度感。", icon: "🌊" },
      { title: "画龙点睛", desc: "最后点出马眼，赋予其奔腾的灵魂与神采。", icon: "👀" }
    ]
  },
  {
    id: 'papercut',
    title: "剪纸传情",
    keyword: "匠心",
    traits: ["细腻", "传统", "巧思"],
    description: "您的年味基因中蕴含着剪纸艺术的细腻与巧思。您善于发现生活中的美好，并能用双手创造奇迹。生活将如剪纸般精致多彩。",
    blessing: "岁岁平安，心灵手巧，吉祥如意！",
    color: "from-red-500 to-rose-600",
    bgColor: "bg-rose-50",
    iconColor: "text-rose-600",
    pattern: "✂️",
    steps: [
      { title: "折叠红纸", desc: "取红纸一张，巧妙折叠，为对称纹样做准备。", icon: "📄" },
      { title: "描绘纹样", desc: "在纸上细致描绘出马与吉祥花卉的图案。", icon: "✏️" },
      { title: "千刻万剪", desc: "运刀如飞，先剪细部再剪轮廓，去繁留简。", icon: "✂️" },
      { title: "揭裱成画", desc: "小心展开，一幅栩栩如生的剪纸马跃然纸上。", icon: "🖼️" }
    ]
  },
  {
    id: 'lantern',
    title: "灯彩映辉",
    keyword: "团圆",
    traits: ["温暖", "明亮", "温馨"],
    description: "您的基因像温暖的灯彩，照亮了归家的路。您重视家庭与团圆，是家人心中最温暖的依靠。新的一年，生活将温暖明亮。",
    blessing: "阖家团圆，灯火可亲，幸福安康！",
    color: "from-orange-500 to-orange-700",
    bgColor: "bg-orange-50",
    iconColor: "text-orange-600",
    pattern: "🏮",
    steps: [
      { title: "扎制骨架", desc: "用竹篾扎出马灯的立体骨架，定型稳固。", icon: "🎋" },
      { title: "糊纸裱绢", desc: "将彩纸或丝绢细心裱糊在骨架之上。", icon: "🧴" },
      { title: "彩绘装饰", desc: "在灯面上绘制吉祥图案，并装饰流苏。", icon: "🎨" },
      { title: "燃灯祈福", desc: "放入光源，点亮花灯，传递温暖与祝福。", icon: "💡" }
    ]
  },
  {
    id: 'clay',
    title: "泥塑童趣",
    keyword: "纯真",
    traits: ["朴实", "快乐", "童心"],
    description: "您的年味基因保留了最纯真的快乐。像泥塑一样朴实无华却充满生机。保持这份童心，新的一年将充满简单的快乐与惊喜。",
    blessing: "童心未泯，快乐无忧，岁岁欢喜！",
    color: "from-stone-500 to-stone-700",
    bgColor: "bg-stone-50",
    iconColor: "text-stone-600",
    pattern: "🧸",
    steps: [
      { title: "捶打熟泥", desc: "反复捶打泥土，使其质地细腻且富有韧性。", icon: "🔨" },
      { title: "捏塑成型", desc: "运用搓、揉、捏等手法，塑造出马的憨态。", icon: "👐" },
      { title: "细致刻画", desc: "用竹刀刻画出马鬃、马鞍等细节纹理。", icon: "🔪" },
      { title: "彩绘开相", desc: "三分塑七分彩，上色后泥马瞬间活灵活现。", icon: "🖌️" }
    ]
  },
  {
    id: 'embroidery',
    title: "锦绣前程",
    keyword: "精致",
    traits: ["华丽", "耐心", "优雅"],
    description: "您的基因如苏绣般精致优雅。您对生活有高品质的追求，耐心耕耘必将收获华丽的成果。前程将如锦绣般绚丽多彩。",
    blessing: "锦上添花，生活美满，优雅一生！",
    color: "from-purple-500 to-purple-700",
    bgColor: "bg-purple-50",
    iconColor: "text-purple-600",
    pattern: "🧵",
    steps: [
      { title: "选稿描样", desc: "选定骏马图稿，将其线条精准描绘在绣布上。", icon: "📐" },
      { title: "擘丝配色", desc: "将丝线劈成极细的丝缕，配好丰富的色阶。", icon: "🧵" },
      { title: "运针施绣", desc: "运用平绣、乱针绣等技法，一针一线绣出神韵。", icon: "🪡" },
      { title: "装裱珍藏", desc: "整理绣面，装裱成框，成为传世的锦绣艺术。", icon: "🖼️" }
    ]
  },
  {
    id: 'shadow',
    title: "皮影戏梦",
    keyword: "传承",
    traits: ["故事", "光影", "历史"],
    description: "您的基因中刻写着古老的故事。您是文化的传承者，在光影变幻中看透世事。新的一年，您将书写属于自己的精彩传奇。",
    blessing: "好戏连台，精彩不断，传奇人生！",
    color: "from-indigo-800 to-slate-900",
    bgColor: "bg-slate-50",
    iconColor: "text-indigo-800",
    pattern: "🎭",
    steps: [
      { title: "选皮制皮", desc: "选用上等牛皮，经刮、磨、洗，制成半透明皮板。", icon: "🐂" },
      { title: "画稿雕刻", desc: "描绘马的分解图样，用刻刀精雕细琢出纹饰。", icon: "🔪" },
      { title: "敷彩发汗", desc: "给皮影上色，并高温发汗使颜色渗入皮内。", icon: "🎨" },
      { title: "缀结操纵", desc: "将各部位用线缀连，装上操纵杆，影马便能起舞。", icon: "🎎" }
    ]
  }
]

const GeneProfile: React.FC = () => {
  const navigate = useNavigate()
  const { user, updateUserGene } = useAuth()
  const [selectedCard, setSelectedCard] = useState<typeof GENE_CARDS[0] | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initGene = async () => {
      // 1. Check if user already has a gene profile
      if (user?.gene_profile) {
        // If stored gene is valid ID, use it
        const savedCard = GENE_CARDS.find(c => c.id === user.gene_profile.id)
        if (savedCard) {
          setSelectedCard(savedCard)
          setLoading(false)
          return
        }
      }

      // 2. If no gene (or invalid), generate new one
      // Simulate smart analysis delay
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const randomIndex = Math.floor(Math.random() * GENE_CARDS.length)
      const newCard = GENE_CARDS[randomIndex]
      
      setSelectedCard(newCard)
      
      // Save to user profile if logged in
      if (user) {
        updateUserGene({ id: newCard.id, generated_at: new Date().toISOString() })
      }
      
      setLoading(false)
    }

    initGene()
  }, [user])
  
  // Mock steps - could be dynamic based on card type in future
  const steps = selectedCard?.steps || []

  const handleShare = () => {
    navigate('/co-creation')
  }

  const handleSaveCard = async () => {
    try {
      // Use a sample image for demonstration. 
      // In a real app, this might be a generated canvas or a specific asset.
      const imageUrl = 'https://images.unsplash.com/photo-1638896068224-b05423f7390c?q=80&w=1000&auto=format&fit=crop';
      
      const response = await fetch(imageUrl);
      const blob = await response.blob();

      // Try File System Access API for "Save As" dialog on PC
      if ('showSaveFilePicker' in window) {
        try {
          const handle = await (window as any).showSaveFilePicker({
            suggestedName: `年味基因-${selectedCard.title}.jpg`,
            types: [{
              description: 'JPEG Image',
              accept: { 'image/jpeg': ['.jpg'] },
            }],
          });
          const writable = await handle.createWritable();
          await writable.write(blob);
          await writable.close();
          return;
        } catch (err: any) {
           if (err.name === 'AbortError') return; // User cancelled
           // Fallback to default download if other error
           console.log('File picker cancelled or failed, falling back to download link');
        }
      }

      // Fallback: Create Object URL and trigger download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `年味基因-${selectedCard.title}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      // Also try to open share sheet on mobile if supported
      if (navigator.share && /Mobi|Android/i.test(navigator.userAgent)) {
        navigator.share({
          title: '我的年味基因',
          text: `我是第 ${Math.floor(Math.random() * 10000) + 8888} 位非遗传承人，解锁了【${selectedCard.title}】基因！`,
          url: window.location.href,
        }).catch(console.error)
      }

    } catch (error) {
      console.error('Download failed:', error);
      alert('保存失败，请重试');
    }
  }

  if (loading || !selectedCard) {
    return (
      <div className="min-h-screen bg-neutral-900 flex flex-col items-center justify-center text-white">
        <div className="w-20 h-20 border-4 border-red-600 border-t-transparent rounded-full animate-spin mb-8"></div>
        <h2 className="text-2xl font-bold animate-pulse">正在解析您的年味基因...</h2>
        <p className="text-gray-400 mt-2">AI 正在比对 200+ 项非遗数据</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-stone-100 pb-20">
      {/* Header */}
      <div className={`bg-gradient-to-br ${selectedCard.color} text-white p-6 pt-12 rounded-b-[3rem] shadow-2xl relative overflow-hidden transition-all duration-1000`}>
        <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
            <div className="absolute top-[-20%] right-[-10%] w-64 h-64 rounded-full bg-white blur-3xl mix-blend-overlay"></div>
            <div className="absolute bottom-[-20%] left-[-10%] w-64 h-64 rounded-full bg-black blur-3xl mix-blend-overlay"></div>
        </div>
        
        <div className="relative z-10 text-center">
            <div className="inline-block p-2 px-4 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold mb-4 border border-white/30">
              NO. {Math.floor(Math.random() * 10000) + 8888} 位传承人
            </div>
            <h1 className="text-3xl font-bold mb-2 tracking-widest">我的年味基因</h1>
            <p className="text-white/90 text-sm opacity-90 flex items-center justify-center gap-2">
               <Star className="w-4 h-4 fill-current" /> 专属定制 · 独一无二
            </p>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-12 relative z-20">
        {/* Gene Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden mb-8 animate-in slide-in-from-bottom-8 duration-700">
          {/* Card Visual Header */}
          <div className={`h-32 bg-gradient-to-r ${selectedCard.color} relative flex items-center justify-center overflow-hidden`}>
             <div className="absolute inset-0 opacity-10 text-[10rem] flex items-center justify-center select-none pointer-events-none">
               {selectedCard.pattern}
             </div>
             <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg z-10 text-4xl border-4 border-white/50 backdrop-blur-sm">
                {selectedCard.pattern}
             </div>
          </div>

          <div className="p-8 pt-4 text-center">
            <h2 className={`text-3xl font-bold ${selectedCard.iconColor} mb-2`}>{selectedCard.title}</h2>
            <div className="flex justify-center gap-3 mb-6">
                {selectedCard.traits.map(trait => (
                    <span key={trait} className={`px-3 py-1 ${selectedCard.bgColor} ${selectedCard.iconColor} text-xs rounded-full font-bold uppercase tracking-wider`}>
                        {trait}
                    </span>
                ))}
            </div>
            
            <p className="text-gray-600 leading-relaxed mb-8 font-serif">
                {selectedCard.description}
            </p>
            
            <div className={`p-4 rounded-xl ${selectedCard.bgColor} border border-dashed border-gray-200`}>
                <p className={`font-bold text-lg ${selectedCard.iconColor}`}>
                   “ {selectedCard.blessing} ”
                </p>
            </div>
          </div>
        </div>

        {/* Craft Steps */}
        <div className="bg-white rounded-2xl shadow-lg p-6 animate-in slide-in-from-bottom-8 duration-1000 delay-200">
            <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
                <BookOpen className={`w-5 h-5 ${selectedCard.iconColor}`} />
                <h3 className="text-lg font-bold text-gray-800">专属技艺体验</h3>
            </div>
            
            <div className="space-y-6">
                {steps.map((step, index) => (
                    <div key={index} className="flex gap-4 group">
                        <div className={`flex-shrink-0 w-10 h-10 ${selectedCard.bgColor} rounded-full flex items-center justify-center text-xl shadow-sm border border-white group-hover:scale-110 transition-transform`}>
                            {step.icon}
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-800 mb-1">Step {index + 1}: {step.title}</h4>
                            <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
        
        {/* Actions */}
        <div className="mt-8 flex gap-4 mb-8">
            <button 
              onClick={handleShare}
              className="flex-1 py-4 bg-white border border-gray-200 rounded-xl text-gray-700 font-bold flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors shadow-sm"
            >
                <Share2 className="w-5 h-5" /> 分享好运
            </button>
            <button 
              onClick={handleSaveCard}
              className={`flex-1 py-4 bg-gradient-to-r ${selectedCard.color} text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-red-600/30 transition-all transform hover:-translate-y-1`}
            >
                <Download className="w-5 h-5" /> 保存卡片
            </button>
        </div>
      </div>
    </div>
  )
}

export default GeneProfile