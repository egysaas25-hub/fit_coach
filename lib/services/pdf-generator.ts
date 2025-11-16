/**
 * PDF Generation Service
 * Generates PDFs for training and nutrition plans
 */

interface PlanContent {
  type: "training" | "nutrition" | "bundle"
  name: string
  description?: string
  duration_weeks?: number
  workouts_per_week?: number
  exercises?: Exercise[]
  meals?: Meal[]
  macros?: MacroSplit
  notes?: string
}

interface Exercise {
  name: string
  sets: number
  reps: string
  tempo?: string
  rest_seconds?: number
  notes?: string
}

interface Meal {
  name: string
  time: string
  foods: Food[]
  total_calories: number
  total_protein: number
  total_carbs: number
  total_fat: number
}

interface Food {
  name: string
  quantity: string
  calories: number
  protein: number
  carbs: number
  fat: number
}

interface MacroSplit {
  protein_percent: number
  carbs_percent: number
  fat_percent: number
  total_calories: number
}

interface GeneratePDFParams {
  planId: string
  planName: string
  planType: "training" | "nutrition" | "bundle"
  content: PlanContent
  clientName: string
  clientCode: string
  trainerName: string
  tenantBranding?: {
    logo?: string
    primaryColor?: string
    companyName?: string
  }
}

export class PDFGeneratorService {
  /**
   * Generate PDF for a plan
   * Returns URL to the generated PDF
   */
  async generatePlanPDF(params: GeneratePDFParams): Promise<string> {
    const {
      planId,
      planName,
      planType,
      content,
      clientName,
      clientCode,
      trainerName,
      tenantBranding,
    } = params

    try {
      // Generate HTML content
      const html = this.generateHTML(params)

      // Convert HTML to PDF using external service or library
      // Options:
      // 1. Puppeteer (self-hosted)
      // 2. PDFKit (Node.js library)
      // 3. External API (like PDF.co, DocRaptor)
      
      // For now, we'll use a placeholder that calls an external service
      const pdfBuffer = await this.convertHTMLToPDF(html)

      // Upload to storage (Hetzner S3 or local storage)
      const pdfUrl = await this.uploadPDF(pdfBuffer, planId, clientCode)

      return pdfUrl
    } catch (error) {
      console.error("PDF generation error:", error)
      throw new Error("Failed to generate PDF")
    }
  }

  /**
   * Generate HTML content for the plan
   */
  private generateHTML(params: GeneratePDFParams): string {
    const { planName, planType, content, clientName, clientCode, trainerName, tenantBranding } = params

    const primaryColor = tenantBranding?.primaryColor || "#00C26A"
    const companyName = tenantBranding?.companyName || "FitCoach Pro"
    const logo = tenantBranding?.logo || ""

    let contentHTML = ""

    if (planType === "training" || planType === "bundle") {
      contentHTML += this.generateTrainingHTML(content)
    }

    if (planType === "nutrition" || planType === "bundle") {
      contentHTML += this.generateNutritionHTML(content)
    }

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      color: #1a1a1a;
      line-height: 1.6;
      padding: 40px;
      background: #ffffff;
    }
    
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 40px;
      padding-bottom: 20px;
      border-bottom: 3px solid ${primaryColor};
    }
    
    .logo {
      max-width: 150px;
      height: auto;
    }
    
    .company-name {
      font-size: 24px;
      font-weight: 700;
      color: ${primaryColor};
    }
    
    .client-info {
      text-align: right;
    }
    
    .client-name {
      font-size: 18px;
      font-weight: 600;
      color: #1a1a1a;
    }
    
    .client-code {
      font-size: 14px;
      color: #666;
      font-family: 'Courier New', monospace;
    }
    
    .plan-title {
      font-size: 32px;
      font-weight: 700;
      color: #1a1a1a;
      margin-bottom: 10px;
    }
    
    .plan-subtitle {
      font-size: 16px;
      color: #666;
      margin-bottom: 30px;
    }
    
    .section {
      margin-bottom: 40px;
      page-break-inside: avoid;
    }
    
    .section-title {
      font-size: 24px;
      font-weight: 700;
      color: ${primaryColor};
      margin-bottom: 20px;
      padding-bottom: 10px;
      border-bottom: 2px solid #e0e0e0;
    }
    
    .exercise-card, .meal-card {
      background: #f8f9fa;
      border-left: 4px solid ${primaryColor};
      padding: 20px;
      margin-bottom: 20px;
      border-radius: 8px;
    }
    
    .exercise-name, .meal-name {
      font-size: 18px;
      font-weight: 600;
      color: #1a1a1a;
      margin-bottom: 10px;
    }
    
    .exercise-details, .meal-details {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 10px;
      margin-bottom: 10px;
    }
    
    .detail-item {
      display: flex;
      flex-direction: column;
    }
    
    .detail-label {
      font-size: 12px;
      color: #666;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .detail-value {
      font-size: 16px;
      font-weight: 600;
      color: #1a1a1a;
    }
    
    .notes {
      font-size: 14px;
      color: #666;
      font-style: italic;
      margin-top: 10px;
      padding: 10px;
      background: #fff;
      border-radius: 4px;
    }
    
    .macro-summary {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
      margin-bottom: 30px;
    }
    
    .macro-card {
      background: ${primaryColor};
      color: white;
      padding: 20px;
      border-radius: 8px;
      text-align: center;
    }
    
    .macro-label {
      font-size: 12px;
      text-transform: uppercase;
      opacity: 0.9;
      margin-bottom: 5px;
    }
    
    .macro-value {
      font-size: 28px;
      font-weight: 700;
    }
    
    .macro-unit {
      font-size: 14px;
      opacity: 0.9;
    }
    
    .food-list {
      margin-top: 15px;
    }
    
    .food-item {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid #e0e0e0;
    }
    
    .food-name {
      font-weight: 500;
    }
    
    .food-quantity {
      color: #666;
      font-size: 14px;
    }
    
    .footer {
      margin-top: 60px;
      padding-top: 20px;
      border-top: 2px solid #e0e0e0;
      text-align: center;
      color: #666;
      font-size: 14px;
    }
    
    .trainer-signature {
      margin-top: 20px;
      font-weight: 600;
      color: #1a1a1a;
    }
    
    @media print {
      body {
        padding: 20px;
      }
      
      .section {
        page-break-inside: avoid;
      }
    }
  </style>
</head>
<body>
  <div class="header">
    <div>
      ${logo ? `<img src="${logo}" alt="Logo" class="logo">` : `<div class="company-name">${companyName}</div>`}
    </div>
    <div class="client-info">
      <div class="client-name">${clientName}</div>
      <div class="client-code">${clientCode}</div>
    </div>
  </div>
  
  <h1 class="plan-title">${planName}</h1>
  <p class="plan-subtitle">
    ${content.description || "Your personalized fitness plan"}
    ${content.duration_weeks ? ` • ${content.duration_weeks} weeks` : ""}
  </p>
  
  ${contentHTML}
  
  <div class="footer">
    <p>This plan was created specifically for you by your coach.</p>
    <p>For questions or adjustments, please contact your trainer.</p>
    <div class="trainer-signature">
      Prepared by: ${trainerName}
    </div>
  </div>
</body>
</html>
    `
  }

  /**
   * Generate HTML for training plan
   */
  private generateTrainingHTML(content: PlanContent): string {
    if (!content.exercises || content.exercises.length === 0) {
      return ""
    }

    const exercisesHTML = content.exercises
      .map(
        (exercise) => `
      <div class="exercise-card">
        <div class="exercise-name">${exercise.name}</div>
        <div class="exercise-details">
          <div class="detail-item">
            <span class="detail-label">Sets</span>
            <span class="detail-value">${exercise.sets}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Reps</span>
            <span class="detail-value">${exercise.reps}</span>
          </div>
          ${
            exercise.tempo
              ? `
          <div class="detail-item">
            <span class="detail-label">Tempo</span>
            <span class="detail-value">${exercise.tempo}</span>
          </div>
          `
              : ""
          }
          ${
            exercise.rest_seconds
              ? `
          <div class="detail-item">
            <span class="detail-label">Rest</span>
            <span class="detail-value">${exercise.rest_seconds}s</span>
          </div>
          `
              : ""
          }
        </div>
        ${exercise.notes ? `<div class="notes">${exercise.notes}</div>` : ""}
      </div>
    `
      )
      .join("")

    return `
      <div class="section">
        <h2 class="section-title">Training Program</h2>
        ${content.workouts_per_week ? `<p style="margin-bottom: 20px; color: #666;">Workouts per week: <strong>${content.workouts_per_week}</strong></p>` : ""}
        ${exercisesHTML}
      </div>
    `
  }

  /**
   * Generate HTML for nutrition plan
   */
  private generateNutritionHTML(content: PlanContent): string {
    if (!content.meals || content.meals.length === 0) {
      return ""
    }

    // Macro summary
    let macroHTML = ""
    if (content.macros) {
      macroHTML = `
        <div class="macro-summary">
          <div class="macro-card">
            <div class="macro-label">Calories</div>
            <div class="macro-value">${content.macros.total_calories}</div>
            <div class="macro-unit">kcal</div>
          </div>
          <div class="macro-card">
            <div class="macro-label">Protein</div>
            <div class="macro-value">${content.macros.protein_percent}%</div>
          </div>
          <div class="macro-card">
            <div class="macro-label">Carbs</div>
            <div class="macro-value">${content.macros.carbs_percent}%</div>
          </div>
          <div class="macro-card">
            <div class="macro-label">Fat</div>
            <div class="macro-value">${content.macros.fat_percent}%</div>
          </div>
        </div>
      `
    }

    const mealsHTML = content.meals
      .map(
        (meal) => `
      <div class="meal-card">
        <div class="meal-name">${meal.name} <span style="color: #666; font-size: 14px; font-weight: normal;">${meal.time}</span></div>
        <div class="meal-details">
          <div class="detail-item">
            <span class="detail-label">Calories</span>
            <span class="detail-value">${meal.total_calories} kcal</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Protein</span>
            <span class="detail-value">${meal.total_protein}g</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Carbs</span>
            <span class="detail-value">${meal.total_carbs}g</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Fat</span>
            <span class="detail-value">${meal.total_fat}g</span>
          </div>
        </div>
        ${
          meal.foods && meal.foods.length > 0
            ? `
        <div class="food-list">
          ${meal.foods
            .map(
              (food) => `
            <div class="food-item">
              <span class="food-name">${food.name}</span>
              <span class="food-quantity">${food.quantity}</span>
            </div>
          `
            )
            .join("")}
        </div>
        `
            : ""
        }
      </div>
    `
      )
      .join("")

    return `
      <div class="section">
        <h2 class="section-title">Nutrition Plan</h2>
        ${macroHTML}
        ${mealsHTML}
      </div>
    `
  }

  /**
   * Convert HTML to PDF
   * This is a placeholder - implement with your preferred method
   */
  private async convertHTMLToPDF(html: string): Promise<Buffer> {
    // Option 1: Use Puppeteer (self-hosted)
    // const browser = await puppeteer.launch()
    // const page = await browser.newPage()
    // await page.setContent(html)
    // const pdf = await page.pdf({ format: 'A4' })
    // await browser.close()
    // return pdf

    // Option 2: Use external API
    // const response = await fetch('https://api.pdf.co/v1/pdf/convert/from/html', {
    //   method: 'POST',
    //   headers: { 'x-api-key': process.env.PDFCO_API_KEY },
    //   body: JSON.stringify({ html })
    // })

    // For now, return a placeholder
    // TODO: Implement actual PDF generation
    console.log("PDF generation called with HTML length:", html.length)
    return Buffer.from("PDF_PLACEHOLDER")
  }

  /**
   * Upload PDF to storage
   */
  private async uploadPDF(pdfBuffer: Buffer, planId: string, clientCode: string): Promise<string> {
    // TODO: Implement actual upload to Hetzner S3 or local storage
    // For now, return a placeholder URL
    const filename = `${clientCode}_${planId}_${Date.now()}.pdf`
    const url = `https://cdn.example.com/plans/${filename}`
    
    console.log("PDF upload called:", filename)
    
    // In production, upload to S3:
    // const s3 = new S3Client({ ... })
    // await s3.send(new PutObjectCommand({
    //   Bucket: process.env.S3_BUCKET,
    //   Key: `plans/${filename}`,
    //   Body: pdfBuffer,
    //   ContentType: 'application/pdf'
    // }))
    
    return url
  }
}

// Singleton instance
export const pdfGenerator = new PDFGeneratorService()
