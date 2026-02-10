import type { Request, Response } from 'express'

// Mapping regions to cultural elements
const REGIONAL_ELEMENTS: Record<string, any> = {
  '陕西': { food: ['饺子', '甑糕'], art: ['剪纸', '皮影'], color: '秦风红' },
  '广东': { food: ['年糕', '盆菜'], art: ['醒狮', '花市'], color: '岭南金' },
  '北京': { food: ['烤鸭', '炸酱面'], art: ['京剧', '兔儿爷'], color: '京韵蓝' },
  'default': { food: ['汤圆', '春卷'], art: ['春联', '灯笼'], color: '中国红' }
}

export const generateProfile = async (req: Request, res: Response) => {
  try {
    const { hometown, age, interests = [], familyTraditions = [] } = req.body

    // Simple deterministic logic for demo purposes
    // In a real app, this would use Neo4j graph traversal
    
    // 1. Determine regional base
    const regionKey = Object.keys(REGIONAL_ELEMENTS).find(k => hometown.includes(k)) || 'default'
    const regionalData = REGIONAL_ELEMENTS[regionKey]

    // 2. Calculate scores based on inputs
    const culturalScore = Math.min(0.95, 0.5 + (interests.length * 0.1) + (familyTraditions.length * 0.1))
    const generationGap = age > 50 ? 0.1 : (age > 30 ? 0.3 : 0.6) // Younger people might have higher gap initially

    // 3. Generate "Gene Map"
    const geneMap = {
      culturalElements: [
        {
          type: 'food',
          strength: 0.85,
          heritages: regionalData.food
        },
        {
          type: 'art',
          strength: 0.75 + (interests.includes('美术') ? 0.15 : 0),
          heritages: regionalData.art
        }
      ],
      regionalScore: culturalScore,
      generationGap: generationGap,
      primaryColor: regionalData.color,
      dominantTrait: age > 40 ? '守望者' : '传承者'
    }

    // 4. Recommendations
    const recommendations = [
      'heritage_001', // Always recommend Paper Cutting
      regionKey === '陕西' ? 'heritage_002' : 'heritage_003' // Dynamic recommendation
    ]

    res.status(200).json({
      success: true,
      profileId: `gene_${Date.now()}`,
      geneMap,
      recommendations
    })
  } catch (error) {
    console.error('Gene generation error:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to generate gene profile'
    })
  }
}
