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
    
    // Map nouns to specific LoremFlickr keywords for relevant images
    const keywordMap: Record<string, string> = {
      '剪纸': 'chinese,papercutting',
      '刺绣': 'chinese,embroidery',
      '陶艺': 'chinese,pottery',
      '面塑': 'chinese,sculpture',
      '灯彩': 'chinese,lantern',
      '年画': 'chinese,painting',
      '皮影': 'shadow,puppet',
      '木雕': 'wood,carving',
      '砖雕': 'brick,carving',
      '蜡染': 'batik',
      '银饰': 'silver,jewelry',
      '漆器': 'lacquerware',
      '竹编': 'bamboo,weaving',
      '风筝': 'chinese,kite'
    };
    
    const keywords = keywordMap[noun] || 'chinese,culture';
    // Use LoremFlickr with keywords for relevant content
    // Add lock query param based on ID to ensure stable image for each item but different across items
    const imageUrl = `https://loremflickr.com/400/400/${keywords}?lock=${newItemId}`;

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
