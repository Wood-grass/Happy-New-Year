import type { Request, Response } from 'express'

export const recognizeImage = async (req: Request, res: Response) => {
  try {
    const { image, type } = req.body

    if (!image) {
      return res.status(400).json({
        success: false,
        error: 'Image data is required'
      })
    }

    // Mock recognition result
    res.status(200).json({
      success: true,
      recognized: true,
      heritageId: 'heritage_001',
      confidence: 0.95,
      tutorialSteps: [
        {
          step: 1,
          description: '准备红纸和剪刀',
          duration: 3000
        },
        {
          step: 2,
          description: '折叠红纸',
          duration: 5000
        }
      ]
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'AR recognition failed'
    })
  }
}
