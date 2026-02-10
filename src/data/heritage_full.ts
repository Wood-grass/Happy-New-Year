import { HeritageItem } from '../lib/heritageData';
import { seedData } from './seedData';

// 基础数据池
const REGIONS = [
  '北京', '天津', '河北', '山西', '内蒙古', 
  '辽宁', '吉林', '黑龙江', 
  '上海', '江苏', '浙江', '安徽', '福建', '江西', '山东', 
  '河南', '湖北', '湖南', 
  '广东', '广西', '海南', 
  '重庆', '四川', '贵州', '云南', '西藏', 
  '陕西', '甘肃', '青海', '宁夏', '新疆'
];

const CATEGORIES = [
  '民间文学', '传统音乐', '传统舞蹈', '传统戏剧', '曲艺', 
  '传统体育、游艺与杂技', '传统美术', '传统技艺', '传统医药', '民俗'
];

const ADJECTIVES = ['宫廷', '民间', '皇家', '古法', '手工', '金丝', '彩绘', '镂空', '写意', '祈福', '盛世', '祥瑞'];
const NOUNS = ['剪纸', '刺绣', '陶艺', '面塑', '灯彩', '年画', '皮影', '木雕', '砖雕', '蜡染', '银饰', '漆器', '竹编', '风筝'];

const TAGS_POOL = ['非遗', '手工', '传统', '文化', '艺术', '春节', '匠心', '国潮', '历史', '民俗'];

// Mappings for English prompts
const NOUN_MAP: Record<string, string> = {
  '剪纸': 'Chinese paper cutting, intricate patterns, red paper',
  '刺绣': 'Chinese embroidery, silk, needlework, detailed',
  '陶艺': 'Chinese pottery, ceramic art, clay vessel',
  '面塑': 'Chinese dough figurine, colorful sculpture',
  '灯彩': 'Chinese festive lantern, glowing, colorful',
  '年画': 'Chinese New Year painting, woodblock print, traditional',
  '皮影': 'Chinese shadow puppetry, leather silhouette, backlight',
  '木雕': 'Chinese wood carving, intricate relief, wooden',
  '砖雕': 'Chinese brick carving, architectural detail',
  '蜡染': 'Chinese batik, indigo fabric, wax resist pattern',
  '银饰': 'Miao silver ornaments, intricate jewelry, silver headdress',
  '漆器': 'Chinese lacquerware, glossy finish, red and black',
  '竹编': 'Chinese bamboo weaving, basketry, craft',
  '风筝': 'Chinese kite, traditional dragon kite, colorful'
};

const ADJ_MAP: Record<string, string> = {
  '宫廷': 'imperial style, elegant, grand',
  '民间': 'folk art style, rustic, lively',
  '皇家': 'royal court style, golden, majestic',
  '古法': 'ancient technique, traditional, historical',
  '手工': 'handcrafted, artisan, detailed',
  '金丝': 'gold thread, filigree, shiny',
  '彩绘': 'colorful painting, vibrant colors',
  '镂空': 'openwork, pierced design, delicate',
  '写意': 'freehand brushwork style, artistic',
  '祈福': 'blessing ceremony, festive atmosphere',
  '盛世': 'prosperous era style, magnificent',
  '祥瑞': 'auspicious symbols, lucky patterns'
};

// 生成随机整数
const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomPick = <T>(arr: T[]): T => arr[randomInt(0, arr.length - 1)];

// 生成 Mock 数据
export function generateMockHeritages(targetCount: number): HeritageItem[] {
  const data = [...seedData]; // 从种子数据开始
  let currentId = Math.max(...seedData.map(i => parseInt(i.id))) + 1;

  while (data.length < targetCount) {
    const region = randomPick(REGIONS);
    const category = randomPick(CATEGORIES);
    const adj = randomPick(ADJECTIVES);
    const noun = randomPick(NOUNS);
    
    // Construct Prompt
    const nounPrompt = NOUN_MAP[noun] || 'Chinese traditional art';
    const adjPrompt = ADJ_MAP[adj] || 'traditional style';
    // const prompt = `close up shot of ${nounPrompt}, ${adjPrompt}, high quality, cultural heritage, ${noun === '皮影' || noun === '灯彩' ? 'lighting effect' : 'studio lighting'}`;
    
    // Encode prompt
    // const encodedPrompt = encodeURIComponent(prompt);
    // const imageUrl = `https://coreva-normal.trae.ai/api/ide/v1/text_to_image?prompt=${encodedPrompt}&image_size=square_hd`;
    
    const newItemId = String(currentId++);
    
    // Map nouns to curated Unsplash Image IDs for high relevance and quality
    // These IDs are stable and point to high-quality cultural photos
    const UNSPLASH_IDS: Record<string, string[]> = {
      '剪纸': ['1548690324-4299e19d4431', '1613426720309-c704f5e7143e', '1580126569429-1954848d5113'], // Paper cutting / red paper
      '刺绣': ['1610052737568-7c8524317136', '1585848464687-0d32c448f804', '1589203832113-731557022a57'], // Embroidery / Fabric
      '陶艺': ['1565193566173-7a0ee3227432', '1610701596707-62d022c42b5c', '1581337220022-794014d59f2a'], // Pottery / Ceramics
      '面塑': ['1515264359404-58a36c61f224', '1582234033100-8438676d05f3', '1515585093558-4547211105c3'], // Sculpture / Figurines
      '灯彩': ['1518018788975-f0941295d9c6', '1486745585817-49d63c52a061', '1548818503-455648873091'], // Lanterns
      '年画': ['1515286226169-2f22c668b92d', '1517506648782-b3531b79f874', '1549556133-875c742c3005'], // Paintings / Red
      '皮影': ['1535083252457-6080fe29be45', '1628004518706-e0e64f89d97a', '1618237626243-22839d37dc62'], // Shadow / Silhouette
      '木雕': ['1603986872659-3226a2754c0e', '1615715757401-19ca296f8c85', '1587393855524-087f83d95bc9'], // Wood carving
      '砖雕': ['1597818817366-0708502f61a0', '1610086918664-984487693952', '1624446460695-181514757134'], // Brick / Architecture
      '蜡染': ['1583307525381-8b024476906a', '1628178652391-7f28743a6d97', '1526849479383-207d72c8429f'], // Batik / Blue fabric
      '银饰': ['1612450030588-4660d5b62b14', '1576487238647-38e24483b8b6', '1605218427360-4050764d708e'], // Silver / Jewelry
      '漆器': ['1606822368297-f50772275215', '1583095117917-205cb291665c', '1582126233261-754641e78044'], // Red / Lacquer
      '竹编': ['1596135811053-d2d1445d430a', '1588614486844-486182c4f826', '1589365561081-3444458f385c'], // Bamboo
      '风筝': ['1578357078588-d46059d481bc', '1533488765986-dfa2a9939acd', '1595166708605-728b78809c95']  // Kite
    };
    
    // Select a random ID from the list or fallback to a general cultural image
    const ids = UNSPLASH_IDS[noun] || ['1515093112284-52264950bbfd', '1528164344705-4754268709dd', '1515264359404-58a36c61f224'];
    const photoId = ids[randomInt(0, ids.length - 1)];
    const imageUrl = `https://images.unsplash.com/photo-${photoId}?auto=format&fit=crop&w=400&h=400&q=80`;

    const newItem: HeritageItem = {
      id: newItemId,
      name: `${region}${adj}${noun}`,
      category: category,
      region: region,
      desc: `源自${region}的${adj}${noun}，传承千年的${category}瑰宝。`,
      fullDesc: `${region}${adj}${noun}是${region}地区独特的${category}形式。它融合了${adj}风格与${noun}技艺，体现了当地人民的智慧与审美。作为非物质文化遗产，它在现代社会依然焕发着勃勃生机，是${region}文化的重要名片。`,
      imageUrl: imageUrl,
      tags: [category, region, randomPick(TAGS_POOL), randomPick(TAGS_POOL)]
    };

    data.push(newItem);
  }

  return data;
}

// 导出生成后的完整数据（单例模式，避免重复生成）
export const fullHeritageData = generateMockHeritages(208); // 生成 208 条，方便 4列布局整除
