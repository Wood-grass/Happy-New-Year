import type { Request, Response } from 'express'

export const getHeritageList = async (req: Request, res: Response) => {
  try {
    const { category, region, page = 1, limit = 10 } = req.query
    
    // Mock data for now as Neo4j is not connected
    const mockData = [
      {
        id: 'heritage_001',
        name: '剪纸技艺',
        category: '传统美术',
        region: '陕西',
        difficulty: 3,
        modelUrl: '/models/paper_cutting.glb',
        arMarker: '/markers/marker_001.patt'
      },
      {
        id: 'heritage_002',
        name: '皮影戏',
        category: '传统戏剧',
        region: '陕西',
        difficulty: 4,
        modelUrl: '/models/shadow_puppet.glb',
        arMarker: '/markers/marker_002.patt'
      }
    ]

    res.status(200).json({
      success: true,
      data: mockData,
      total: 200,
      page: Number(page)
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch heritage list'
    })
  }
}
