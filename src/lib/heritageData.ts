import { fullHeritageData } from '../data/heritage_full';

export interface HeritageItem {
  id: string;
  name: string;
  category: string;
  region: string;
  desc: string;
  fullDesc: string;
  imageUrl: string;
  modelUrl?: string;
  tags: string[];
}

// 导出完整数据
export const heritageData: HeritageItem[] = fullHeritageData;

// 辅助函数：获取大区
export const REGION_GROUPS: Record<string, string[]> = {
  '华北': ['北京', '天津', '河北', '山西', '内蒙古'],
  '东北': ['辽宁', '吉林', '黑龙江'],
  '华东': ['上海', '江苏', '浙江', '安徽', '福建', '江西', '山东'],
  '华中': ['河南', '湖北', '湖南'],
  '华南': ['广东', '广西', '海南'],
  '西南': ['重庆', '四川', '贵州', '云南', '西藏'],
  '西北': ['陕西', '甘肃', '青海', '宁夏', '新疆'],
  '港澳台': ['香港', '澳门', '台湾']
};

export function getRegionGroup(province: string): string {
  for (const [group, provinces] of Object.entries(REGION_GROUPS)) {
    if (provinces.some(p => province.includes(p))) return group;
  }
  return '其他';
}
