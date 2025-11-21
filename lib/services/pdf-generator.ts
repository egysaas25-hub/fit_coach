/**
 * PDF Generation Service
 * Generates PDFs for training plans, nutrition plans, progress reports, and invoices
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

// Progress Report Interfaces
interface ProgressReportParams {
  clientId: string
  clientName: string
  clientCode: string
  dateRange: {
    startDate: string
    endDate: string
  }
  metrics: {
    weight?: MetricData[]
    bodyFat?: MetricData[]
    muscleMass?: MetricData[]
    measurements?: MeasurementData
  }
  photos?: {
    before?: string
    after?: string
    side?: string
  }
  achievements?: string[]
  notes?: string
  trainerName: string
  tenantBranding?: TenantBranding
}

interface MetricData {
  date: string
  value: number
}

interface MeasurementData {
  chest?: { before: number; after: number }
  waist?: { before: number; after: number }
  hips?: { before: number; after: number }
  arms?: { before: number; after: number }
  thighs?: { before: number; after: number }
}

// Invoice Interfaces
interface InvoiceParams {
  invoiceId: string
  invoiceNumber: string
  invoiceDate: string
  dueDate: string
  clientName: string
  clientEmail?: string
  clientPhone?: string
  lineItems: InvoiceLineItem[]
  subtotal: number
  tax?: number
  discount?: number
  total: number
  currency: string
  paymentStatus: 'pending' | 'paid' | 'overdue'
  paymentMethod?: string
  notes?: string
  tenantBranding?: TenantBranding
}

interface InvoiceLineItem {
  description: string
  quantity: number
  unitPrice: number
  total: number
}

interface TenantBranding {
  logo?: string
  primaryColor?: string
  companyName?: string
  companyAddress?: string
  companyPhone?: string
  companyEmail?: string
  companyWebsite?: string
}

// Workout/Nutrition Plan Interfaces (extended)
interface WorkoutPlanParams {
  planId: string
  planName: string
  description?: string
  durationWeeks?: number
  workoutsPerWeek?: number
  schedule?: WorkoutSchedule[]
  exercises: WorkoutExercise[]
  clientName: string
  clientCode: string
  trainerName: string
  notes?: string
  tenantBranding?: TenantBranding
}

interface WorkoutSchedule {
  day: string
  workoutName: string
  duration?: number
}

interface WorkoutExercise {
  name: string
  category?: string
  sets: number
  reps: string
  weight?: string
  tempo?: string
  restSeconds?: number
  instructions?: string
  notes?: string
}

interface NutritionPlanParams {
  planId: string
  planName: string
  description?: string
  durationWeeks?: number
  targetCalories: number
  macros: {
    protein: number
    carbs: number
    fat: number
  }
  meals: NutritionMeal[]
  guidelines?: string[]
  clientName: string
  clientCode: string
  trainerName: string
  notes?: string
  tenantBranding?: TenantBranding
}

interface NutritionMeal {
  name: string
  time: string
  foods: NutritionFood[]
  totalCalories: number
  totalProtein: number
  totalCarbs: number
  totalFat: number
  instructions?: string
}

interface NutritionFood {
  name: string
  quantity: string
  calories: number
  protein: number
  carbs: number
  fat: number
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
   * Generate Progress Report PDF
   * Returns URL to the generated PDF
   */
  async generateProgressReportPDF(params: ProgressReportParams): Promise<string> {
    try {
      const html = this.generateProgressReportHTML(params)
      const pdfBuffer = await this.convertHTMLToPDF(html)
      const filename = `progress_report_${params.clientCode}_${Date.now()}.pdf`
      const pdfUrl = await this.uploadPDF(pdfBuffer, params.clientId, params.clientCode)
      return pdfUrl
    } catch (error) {
      console.error("Progress report PDF generation error:", error)
      throw new Error("Failed to generate progress report PDF")
    }
  }

  /**
   * Generate Invoice PDF
   * Returns URL to the generated PDF
   */
  async generateInvoicePDF(params: InvoiceParams): Promise<string> {
    try {
      const html = this.generateInvoiceHTML(params)
      const pdfBuffer = await this.convertHTMLToPDF(html)
      const filename = `invoice_${params.invoiceNumber}_${Date.now()}.pdf`
      const pdfUrl = await this.uploadPDF(pdfBuffer, params.invoiceId, params.invoiceNumber)
      return pdfUrl
    } catch (error) {
      console.error("Invoice PDF generation error:", error)
      throw new Error("Failed to generate invoice PDF")
    }
  }

  /**
   * Generate Workout Plan PDF
   * Returns URL to the generated PDF
   */
  async generateWorkoutPlanPDF(params: WorkoutPlanParams): Promise<string> {
    try {
      const html = this.generateWorkoutPlanHTML(params)
      const pdfBuffer = await this.convertHTMLToPDF(html)
      const pdfUrl = await this.uploadPDF(pdfBuffer, params.planId, params.clientCode)
      return pdfUrl
    } catch (error) {
      console.error("Workout plan PDF generation error:", error)
      throw new Error("Failed to generate workout plan PDF")
    }
  }

  /**
   * Generate Nutrition Plan PDF
   * Returns URL to the generated PDF
   */
  async generateNutritionPlanPDF(params: NutritionPlanParams): Promise<string> {
    try {
      const html = this.generateNutritionPlanHTML(params)
      const pdfBuffer = await this.convertHTMLToPDF(html)
      const pdfUrl = await this.uploadPDF(pdfBuffer, params.planId, params.clientCode)
      return pdfUrl
    } catch (error) {
      console.error("Nutrition plan PDF generation error:", error)
      throw new Error("Failed to generate nutrition plan PDF")
    }
  }

  /**
   * Generate Progress Report HTML
   */
  private generateProgressReportHTML(params: ProgressReportParams): string {
    const { clientName, clientCode, dateRange, metrics, photos, achievements, notes, trainerName, tenantBranding } = params
    const primaryColor = tenantBranding?.primaryColor || "#00C26A"
    const companyName = tenantBranding?.companyName || "FitCoach Pro"
    const logo = tenantBranding?.logo || ""

    // Generate chart data visualizations as SVG
    const weightChartSVG = metrics.weight ? this.generateLineChartSVG(metrics.weight, 'Weight (kg)', primaryColor) : ''
    const bodyFatChartSVG = metrics.bodyFat ? this.generateLineChartSVG(metrics.bodyFat, 'Body Fat (%)', primaryColor) : ''

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    ${this.getCommonStyles(primaryColor)}
    .progress-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 30px;
      margin-bottom: 30px;
    }
    .metric-card {
      background: #f8f9fa;
      padding: 20px;
      border-radius: 8px;
      border-left: 4px solid ${primaryColor};
    }
    .metric-title {
      font-size: 14px;
      color: #666;
      text-transform: uppercase;
      margin-bottom: 10px;
    }
    .metric-value {
      font-size: 32px;
      font-weight: 700;
      color: #1a1a1a;
    }
    .metric-change {
      font-size: 14px;
      margin-top: 5px;
    }
    .metric-change.positive { color: #00C26A; }
    .metric-change.negative { color: #ff4444; }
    .photo-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
      margin: 30px 0;
    }
    .photo-container {
      text-align: center;
    }
    .photo-container img {
      width: 100%;
      height: 300px;
      object-fit: cover;
      border-radius: 8px;
      border: 2px solid #e0e0e0;
    }
    .photo-label {
      margin-top: 10px;
      font-size: 14px;
      color: #666;
      font-weight: 600;
    }
    .chart-container {
      margin: 30px 0;
      padding: 20px;
      background: #f8f9fa;
      border-radius: 8px;
    }
    .achievement-list {
      list-style: none;
      padding: 0;
    }
    .achievement-item {
      padding: 15px;
      margin-bottom: 10px;
      background: #f8f9fa;
      border-left: 4px solid ${primaryColor};
      border-radius: 4px;
    }
    .achievement-item:before {
      content: "✓";
      color: ${primaryColor};
      font-weight: bold;
      margin-right: 10px;
    }
    .measurements-table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
    }
    .measurements-table th,
    .measurements-table td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #e0e0e0;
    }
    .measurements-table th {
      background: ${primaryColor};
      color: white;
      font-weight: 600;
    }
  </style>
</head>
<body>
  ${this.generateHeader(companyName, logo, clientName, clientCode)}
  
  <h1 class="plan-title">Progress Report</h1>
  <p class="plan-subtitle">${dateRange.startDate} to ${dateRange.endDate}</p>
  
  <div class="section">
    <h2 class="section-title">Key Metrics</h2>
    <div class="progress-grid">
      ${metrics.weight && metrics.weight.length > 0 ? `
        <div class="metric-card">
          <div class="metric-title">Weight</div>
          <div class="metric-value">${metrics.weight[metrics.weight.length - 1].value} kg</div>
          <div class="metric-change ${this.getChangeClass(metrics.weight)}">
            ${this.calculateChange(metrics.weight)} kg
          </div>
        </div>
      ` : ''}
      ${metrics.bodyFat && metrics.bodyFat.length > 0 ? `
        <div class="metric-card">
          <div class="metric-title">Body Fat</div>
          <div class="metric-value">${metrics.bodyFat[metrics.bodyFat.length - 1].value}%</div>
          <div class="metric-change ${this.getChangeClass(metrics.bodyFat)}">
            ${this.calculateChange(metrics.bodyFat)}%
          </div>
        </div>
      ` : ''}
      ${metrics.muscleMass && metrics.muscleMass.length > 0 ? `
        <div class="metric-card">
          <div class="metric-title">Muscle Mass</div>
          <div class="metric-value">${metrics.muscleMass[metrics.muscleMass.length - 1].value} kg</div>
          <div class="metric-change ${this.getChangeClass(metrics.muscleMass)}">
            ${this.calculateChange(metrics.muscleMass)} kg
          </div>
        </div>
      ` : ''}
    </div>
  </div>

  ${weightChartSVG ? `
    <div class="section">
      <h2 class="section-title">Weight Progress</h2>
      <div class="chart-container">
        ${weightChartSVG}
      </div>
    </div>
  ` : ''}

  ${bodyFatChartSVG ? `
    <div class="section">
      <h2 class="section-title">Body Fat Progress</h2>
      <div class="chart-container">
        ${bodyFatChartSVG}
      </div>
    </div>
  ` : ''}

  ${metrics.measurements ? `
    <div class="section">
      <h2 class="section-title">Body Measurements</h2>
      <table class="measurements-table">
        <thead>
          <tr>
            <th>Measurement</th>
            <th>Before</th>
            <th>After</th>
            <th>Change</th>
          </tr>
        </thead>
        <tbody>
          ${Object.entries(metrics.measurements).map(([key, value]) => `
            <tr>
              <td style="text-transform: capitalize;">${key}</td>
              <td>${value.before} cm</td>
              <td>${value.after} cm</td>
              <td>${(value.after - value.before).toFixed(1)} cm</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  ` : ''}

  ${photos && (photos.before || photos.after || photos.side) ? `
    <div class="section">
      <h2 class="section-title">Progress Photos</h2>
      <div class="photo-grid">
        ${photos.before ? `
          <div class="photo-container">
            <img src="${photos.before}" alt="Before">
            <div class="photo-label">Before</div>
          </div>
        ` : ''}
        ${photos.after ? `
          <div class="photo-container">
            <img src="${photos.after}" alt="After">
            <div class="photo-label">After</div>
          </div>
        ` : ''}
        ${photos.side ? `
          <div class="photo-container">
            <img src="${photos.side}" alt="Side View">
            <div class="photo-label">Side View</div>
          </div>
        ` : ''}
      </div>
    </div>
  ` : ''}

  ${achievements && achievements.length > 0 ? `
    <div class="section">
      <h2 class="section-title">Achievements</h2>
      <ul class="achievement-list">
        ${achievements.map(achievement => `
          <li class="achievement-item">${achievement}</li>
        `).join('')}
      </ul>
    </div>
  ` : ''}

  ${notes ? `
    <div class="section">
      <h2 class="section-title">Trainer Notes</h2>
      <div class="notes">${notes}</div>
    </div>
  ` : ''}

  ${this.generateFooter(trainerName)}
</body>
</html>
    `
  }

  /**
   * Generate Invoice HTML
   */
  private generateInvoiceHTML(params: InvoiceParams): string {
    const {
      invoiceNumber,
      invoiceDate,
      dueDate,
      clientName,
      clientEmail,
      clientPhone,
      lineItems,
      subtotal,
      tax,
      discount,
      total,
      currency,
      paymentStatus,
      paymentMethod,
      notes,
      tenantBranding
    } = params

    const primaryColor = tenantBranding?.primaryColor || "#00C26A"
    const companyName = tenantBranding?.companyName || "FitCoach Pro"
    const logo = tenantBranding?.logo || ""

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    ${this.getCommonStyles(primaryColor)}
    .invoice-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 40px;
    }
    .invoice-info {
      text-align: right;
    }
    .invoice-number {
      font-size: 24px;
      font-weight: 700;
      color: ${primaryColor};
      margin-bottom: 10px;
    }
    .invoice-date {
      font-size: 14px;
      color: #666;
    }
    .status-badge {
      display: inline-block;
      padding: 6px 12px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      margin-top: 10px;
    }
    .status-paid { background: #d4edda; color: #155724; }
    .status-pending { background: #fff3cd; color: #856404; }
    .status-overdue { background: #f8d7da; color: #721c24; }
    .billing-info {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 30px;
      margin-bottom: 40px;
    }
    .billing-section {
      padding: 20px;
      background: #f8f9fa;
      border-radius: 8px;
    }
    .billing-title {
      font-size: 14px;
      color: #666;
      text-transform: uppercase;
      margin-bottom: 15px;
      font-weight: 600;
    }
    .billing-details {
      font-size: 14px;
      line-height: 1.8;
    }
    .invoice-table {
      width: 100%;
      border-collapse: collapse;
      margin: 30px 0;
    }
    .invoice-table th {
      background: ${primaryColor};
      color: white;
      padding: 15px;
      text-align: left;
      font-weight: 600;
    }
    .invoice-table td {
      padding: 15px;
      border-bottom: 1px solid #e0e0e0;
    }
    .invoice-table tr:last-child td {
      border-bottom: none;
    }
    .text-right {
      text-align: right;
    }
    .totals-section {
      margin-left: auto;
      width: 300px;
      margin-top: 20px;
    }
    .total-row {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      border-bottom: 1px solid #e0e0e0;
    }
    .total-row.grand-total {
      border-top: 3px solid ${primaryColor};
      border-bottom: 3px solid ${primaryColor};
      font-size: 20px;
      font-weight: 700;
      padding: 15px 0;
      margin-top: 10px;
    }
    .payment-info {
      margin-top: 40px;
      padding: 20px;
      background: #f8f9fa;
      border-radius: 8px;
      border-left: 4px solid ${primaryColor};
    }
  </style>
</head>
<body>
  <div class="invoice-header">
    <div>
      ${logo ? `<img src="${logo}" alt="Logo" class="logo">` : `<div class="company-name">${companyName}</div>`}
      ${tenantBranding?.companyAddress ? `<p style="margin-top: 10px; color: #666; font-size: 14px;">${tenantBranding.companyAddress}</p>` : ''}
      ${tenantBranding?.companyPhone ? `<p style="color: #666; font-size: 14px;">${tenantBranding.companyPhone}</p>` : ''}
      ${tenantBranding?.companyEmail ? `<p style="color: #666; font-size: 14px;">${tenantBranding.companyEmail}</p>` : ''}
    </div>
    <div class="invoice-info">
      <div class="invoice-number">Invoice #${invoiceNumber}</div>
      <div class="invoice-date">Date: ${invoiceDate}</div>
      <div class="invoice-date">Due: ${dueDate}</div>
      <div class="status-badge status-${paymentStatus}">${paymentStatus}</div>
    </div>
  </div>

  <div class="billing-info">
    <div class="billing-section">
      <div class="billing-title">Bill To</div>
      <div class="billing-details">
        <strong>${clientName}</strong><br>
        ${clientEmail ? `${clientEmail}<br>` : ''}
        ${clientPhone ? `${clientPhone}` : ''}
      </div>
    </div>
    <div class="billing-section">
      <div class="billing-title">From</div>
      <div class="billing-details">
        <strong>${companyName}</strong><br>
        ${tenantBranding?.companyAddress ? `${tenantBranding.companyAddress}<br>` : ''}
        ${tenantBranding?.companyEmail ? `${tenantBranding.companyEmail}` : ''}
      </div>
    </div>
  </div>

  <table class="invoice-table">
    <thead>
      <tr>
        <th>Description</th>
        <th class="text-right">Quantity</th>
        <th class="text-right">Unit Price</th>
        <th class="text-right">Total</th>
      </tr>
    </thead>
    <tbody>
      ${lineItems.map(item => `
        <tr>
          <td>${item.description}</td>
          <td class="text-right">${item.quantity}</td>
          <td class="text-right">${currency} ${item.unitPrice.toFixed(2)}</td>
          <td class="text-right">${currency} ${item.total.toFixed(2)}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <div class="totals-section">
    <div class="total-row">
      <span>Subtotal</span>
      <span>${currency} ${subtotal.toFixed(2)}</span>
    </div>
    ${discount ? `
      <div class="total-row">
        <span>Discount</span>
        <span>-${currency} ${discount.toFixed(2)}</span>
      </div>
    ` : ''}
    ${tax ? `
      <div class="total-row">
        <span>Tax</span>
        <span>${currency} ${tax.toFixed(2)}</span>
      </div>
    ` : ''}
    <div class="total-row grand-total">
      <span>Total</span>
      <span>${currency} ${total.toFixed(2)}</span>
    </div>
  </div>

  ${paymentMethod ? `
    <div class="payment-info">
      <strong>Payment Method:</strong> ${paymentMethod}
    </div>
  ` : ''}

  ${notes ? `
    <div class="section">
      <h2 class="section-title">Notes</h2>
      <div class="notes">${notes}</div>
    </div>
  ` : ''}

  <div class="footer">
    <p>Thank you for your business!</p>
    ${tenantBranding?.companyWebsite ? `<p>${tenantBranding.companyWebsite}</p>` : ''}
  </div>
</body>
</html>
    `
  }

  /**
   * Generate Workout Plan HTML
   */
  private generateWorkoutPlanHTML(params: WorkoutPlanParams): string {
    const {
      planName,
      description,
      durationWeeks,
      workoutsPerWeek,
      schedule,
      exercises,
      clientName,
      clientCode,
      trainerName,
      notes,
      tenantBranding
    } = params

    const primaryColor = tenantBranding?.primaryColor || "#00C26A"
    const companyName = tenantBranding?.companyName || "FitCoach Pro"
    const logo = tenantBranding?.logo || ""

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    ${this.getCommonStyles(primaryColor)}
    .plan-overview {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
      margin-bottom: 30px;
    }
    .overview-card {
      background: ${primaryColor};
      color: white;
      padding: 20px;
      border-radius: 8px;
      text-align: center;
    }
    .overview-label {
      font-size: 12px;
      text-transform: uppercase;
      opacity: 0.9;
      margin-bottom: 5px;
    }
    .overview-value {
      font-size: 28px;
      font-weight: 700;
    }
    .schedule-grid {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 10px;
      margin: 20px 0;
    }
    .schedule-day {
      padding: 15px 10px;
      background: #f8f9fa;
      border-radius: 8px;
      text-align: center;
      font-size: 12px;
    }
    .schedule-day.active {
      background: ${primaryColor};
      color: white;
      font-weight: 600;
    }
    .exercise-category {
      background: ${primaryColor};
      color: white;
      padding: 8px 16px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 600;
      display: inline-block;
      margin-bottom: 10px;
    }
    .instructions {
      background: #fff;
      padding: 15px;
      border-radius: 4px;
      margin-top: 10px;
      font-size: 14px;
      line-height: 1.6;
    }
  </style>
</head>
<body>
  ${this.generateHeader(companyName, logo, clientName, clientCode)}
  
  <h1 class="plan-title">${planName}</h1>
  ${description ? `<p class="plan-subtitle">${description}</p>` : ''}

  <div class="plan-overview">
    ${durationWeeks ? `
      <div class="overview-card">
        <div class="overview-label">Duration</div>
        <div class="overview-value">${durationWeeks}</div>
        <div class="overview-label">Weeks</div>
      </div>
    ` : ''}
    ${workoutsPerWeek ? `
      <div class="overview-card">
        <div class="overview-label">Frequency</div>
        <div class="overview-value">${workoutsPerWeek}</div>
        <div class="overview-label">Per Week</div>
      </div>
    ` : ''}
    <div class="overview-card">
      <div class="overview-label">Exercises</div>
      <div class="overview-value">${exercises.length}</div>
      <div class="overview-label">Total</div>
    </div>
  </div>

  ${schedule && schedule.length > 0 ? `
    <div class="section">
      <h2 class="section-title">Weekly Schedule</h2>
      <div class="schedule-grid">
        ${['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => {
          const workout = schedule.find(s => s.day === day)
          return `
            <div class="schedule-day ${workout ? 'active' : ''}">
              <div style="font-weight: 600; margin-bottom: 5px;">${day}</div>
              ${workout ? `<div style="font-size: 10px;">${workout.workoutName}</div>` : '<div style="font-size: 10px;">Rest</div>'}
            </div>
          `
        }).join('')}
      </div>
    </div>
  ` : ''}

  <div class="section">
    <h2 class="section-title">Exercises</h2>
    ${exercises.map((exercise, index) => `
      <div class="exercise-card">
        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 10px;">
          <div>
            ${exercise.category ? `<div class="exercise-category">${exercise.category}</div>` : ''}
            <div class="exercise-name">${index + 1}. ${exercise.name}</div>
          </div>
        </div>
        <div class="exercise-details">
          <div class="detail-item">
            <span class="detail-label">Sets</span>
            <span class="detail-value">${exercise.sets}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Reps</span>
            <span class="detail-value">${exercise.reps}</span>
          </div>
          ${exercise.weight ? `
            <div class="detail-item">
              <span class="detail-label">Weight</span>
              <span class="detail-value">${exercise.weight}</span>
            </div>
          ` : ''}
          ${exercise.tempo ? `
            <div class="detail-item">
              <span class="detail-label">Tempo</span>
              <span class="detail-value">${exercise.tempo}</span>
            </div>
          ` : ''}
          ${exercise.restSeconds ? `
            <div class="detail-item">
              <span class="detail-label">Rest</span>
              <span class="detail-value">${exercise.restSeconds}s</span>
            </div>
          ` : ''}
        </div>
        ${exercise.instructions ? `
          <div class="instructions">
            <strong>Instructions:</strong> ${exercise.instructions}
          </div>
        ` : ''}
        ${exercise.notes ? `<div class="notes">${exercise.notes}</div>` : ''}
      </div>
    `).join('')}
  </div>

  ${notes ? `
    <div class="section">
      <h2 class="section-title">Additional Notes</h2>
      <div class="notes">${notes}</div>
    </div>
  ` : ''}

  ${this.generateFooter(trainerName)}
</body>
</html>
    `
  }

  /**
   * Generate Nutrition Plan HTML
   */
  private generateNutritionPlanHTML(params: NutritionPlanParams): string {
    const {
      planName,
      description,
      durationWeeks,
      targetCalories,
      macros,
      meals,
      guidelines,
      clientName,
      clientCode,
      trainerName,
      notes,
      tenantBranding
    } = params

    const primaryColor = tenantBranding?.primaryColor || "#00C26A"
    const companyName = tenantBranding?.companyName || "FitCoach Pro"
    const logo = tenantBranding?.logo || ""

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    ${this.getCommonStyles(primaryColor)}
    .guidelines-list {
      list-style: none;
      padding: 0;
    }
    .guideline-item {
      padding: 12px 15px;
      margin-bottom: 8px;
      background: #f8f9fa;
      border-left: 4px solid ${primaryColor};
      border-radius: 4px;
      font-size: 14px;
    }
    .guideline-item:before {
      content: "→";
      color: ${primaryColor};
      font-weight: bold;
      margin-right: 10px;
    }
  </style>
</head>
<body>
  ${this.generateHeader(companyName, logo, clientName, clientCode)}
  
  <h1 class="plan-title">${planName}</h1>
  ${description ? `<p class="plan-subtitle">${description}</p>` : ''}

  <div class="macro-summary">
    <div class="macro-card">
      <div class="macro-label">Daily Calories</div>
      <div class="macro-value">${targetCalories}</div>
      <div class="macro-unit">kcal</div>
    </div>
    <div class="macro-card">
      <div class="macro-label">Protein</div>
      <div class="macro-value">${macros.protein}</div>
      <div class="macro-unit">g</div>
    </div>
    <div class="macro-card">
      <div class="macro-label">Carbs</div>
      <div class="macro-value">${macros.carbs}</div>
      <div class="macro-unit">g</div>
    </div>
    <div class="macro-card">
      <div class="macro-label">Fat</div>
      <div class="macro-value">${macros.fat}</div>
      <div class="macro-unit">g</div>
    </div>
  </div>

  ${guidelines && guidelines.length > 0 ? `
    <div class="section">
      <h2 class="section-title">Nutrition Guidelines</h2>
      <ul class="guidelines-list">
        ${guidelines.map(guideline => `
          <li class="guideline-item">${guideline}</li>
        `).join('')}
      </ul>
    </div>
  ` : ''}

  <div class="section">
    <h2 class="section-title">Daily Meal Plan</h2>
    ${meals.map((meal, index) => `
      <div class="meal-card">
        <div class="meal-name">
          ${index + 1}. ${meal.name}
          <span style="color: #666; font-size: 14px; font-weight: normal; margin-left: 10px;">${meal.time}</span>
        </div>
        <div class="meal-details">
          <div class="detail-item">
            <span class="detail-label">Calories</span>
            <span class="detail-value">${meal.totalCalories} kcal</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Protein</span>
            <span class="detail-value">${meal.totalProtein}g</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Carbs</span>
            <span class="detail-value">${meal.totalCarbs}g</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Fat</span>
            <span class="detail-value">${meal.totalFat}g</span>
          </div>
        </div>
        ${meal.foods && meal.foods.length > 0 ? `
          <div class="food-list">
            ${meal.foods.map(food => `
              <div class="food-item">
                <span class="food-name">${food.name}</span>
                <span class="food-quantity">${food.quantity}</span>
              </div>
            `).join('')}
          </div>
        ` : ''}
        ${meal.instructions ? `
          <div class="instructions">
            <strong>Preparation:</strong> ${meal.instructions}
          </div>
        ` : ''}
      </div>
    `).join('')}
  </div>

  ${notes ? `
    <div class="section">
      <h2 class="section-title">Additional Notes</h2>
      <div class="notes">${notes}</div>
    </div>
  ` : ''}

  ${this.generateFooter(trainerName)}
</body>
</html>
    `
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

  /**
   * Generate common CSS styles
   */
  private getCommonStyles(primaryColor: string): string {
    return `
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
    `
  }

  /**
   * Generate header HTML
   */
  private generateHeader(companyName: string, logo: string, clientName: string, clientCode: string): string {
    return `
      <div class="header">
        <div>
          ${logo ? `<img src="${logo}" alt="Logo" class="logo">` : `<div class="company-name">${companyName}</div>`}
        </div>
        <div class="client-info">
          <div class="client-name">${clientName}</div>
          <div class="client-code">${clientCode}</div>
        </div>
      </div>
    `
  }

  /**
   * Generate footer HTML
   */
  private generateFooter(trainerName: string): string {
    return `
      <div class="footer">
        <p>This document was created specifically for you by your coach.</p>
        <p>For questions or adjustments, please contact your trainer.</p>
        <div class="trainer-signature">
          Prepared by: ${trainerName}
        </div>
      </div>
    `
  }

  /**
   * Generate line chart as SVG
   */
  private generateLineChartSVG(data: MetricData[], label: string, color: string): string {
    if (!data || data.length === 0) return ''

    const width = 800
    const height = 300
    const padding = 40

    // Calculate min and max values
    const values = data.map(d => d.value)
    const minValue = Math.min(...values)
    const maxValue = Math.max(...values)
    const valueRange = maxValue - minValue || 1

    // Generate points for the line
    const points = data.map((d, i) => {
      const x = padding + (i / (data.length - 1)) * (width - 2 * padding)
      const y = height - padding - ((d.value - minValue) / valueRange) * (height - 2 * padding)
      return `${x},${y}`
    }).join(' ')

    // Generate path for area fill
    const areaPoints = data.map((d, i) => {
      const x = padding + (i / (data.length - 1)) * (width - 2 * padding)
      const y = height - padding - ((d.value - minValue) / valueRange) * (height - 2 * padding)
      return `${x},${y}`
    })
    const areaPath = `M ${areaPoints[0]} L ${areaPoints.join(' L ')} L ${width - padding},${height - padding} L ${padding},${height - padding} Z`

    return `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <!-- Grid lines -->
        ${[0, 1, 2, 3, 4].map(i => {
          const y = padding + (i / 4) * (height - 2 * padding)
          return `<line x1="${padding}" y1="${y}" x2="${width - padding}" y2="${y}" stroke="#e0e0e0" stroke-width="1"/>`
        }).join('')}
        
        <!-- Area fill -->
        <path d="${areaPath}" fill="${color}" opacity="0.1"/>
        
        <!-- Line -->
        <polyline points="${points}" fill="none" stroke="${color}" stroke-width="3"/>
        
        <!-- Data points -->
        ${data.map((d, i) => {
          const x = padding + (i / (data.length - 1)) * (width - 2 * padding)
          const y = height - padding - ((d.value - minValue) / valueRange) * (height - 2 * padding)
          return `
            <circle cx="${x}" cy="${y}" r="5" fill="${color}"/>
            <text x="${x}" y="${y - 15}" text-anchor="middle" font-size="12" fill="#666">${d.value}</text>
          `
        }).join('')}
        
        <!-- Axis labels -->
        <text x="${width / 2}" y="${height - 5}" text-anchor="middle" font-size="14" fill="#666">${label}</text>
        
        <!-- Date labels -->
        ${data.map((d, i) => {
          const x = padding + (i / (data.length - 1)) * (width - 2 * padding)
          const date = new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
          return `<text x="${x}" y="${height - padding + 20}" text-anchor="middle" font-size="11" fill="#999">${date}</text>`
        }).join('')}
      </svg>
    `
  }

  /**
   * Calculate change between first and last metric value
   */
  private calculateChange(data: MetricData[]): string {
    if (!data || data.length < 2) return '0'
    const change = data[data.length - 1].value - data[0].value
    return change > 0 ? `+${change.toFixed(1)}` : change.toFixed(1)
  }

  /**
   * Get CSS class for metric change (positive/negative)
   */
  private getChangeClass(data: MetricData[]): string {
    if (!data || data.length < 2) return ''
    const change = data[data.length - 1].value - data[0].value
    return change < 0 ? 'positive' : change > 0 ? 'negative' : ''
  }
}

// Singleton instance
export const pdfGenerator = new PDFGeneratorService()
