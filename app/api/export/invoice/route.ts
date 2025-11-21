import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth/session"
import { prisma } from "@/lib/prisma"
import { pdfGenerator } from "@/lib/services/pdf-generator"

/**
 * POST /api/export/invoice
 * Generate an invoice PDF
 */
export async function POST(req: NextRequest) {
  try {
    const session = await getSession(req)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { invoiceId } = body

    if (!invoiceId) {
      return NextResponse.json(
        { error: "invoiceId is required" },
        { status: 400 }
      )
    }

    // Fetch payment/invoice data
    const payment = await prisma.payments.findUnique({
      where: { id: BigInt(invoiceId) },
      include: {
        customer: {
          select: {
            first_name: true,
            last_name: true,
            phone_e164: true,
          },
        },
        subscription: {
          select: {
            plan_code: true,
          },
        },
        currency: {
          select: {
            code: true,
          },
        },
        tenant: {
          include: {
            tenant_branding: true,
          },
        },
      },
    })

    if (!payment) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 })
    }

    const clientName = `${payment.customer.first_name || ""} ${payment.customer.last_name || ""}`.trim() || "Client"
    const clientEmail = payment.customer.phone_e164 // Using phone as fallback
    const clientPhone = payment.customer.phone_e164

    // Prepare line items
    const lineItems = [
      {
        description: payment.subscription?.plan_code || "Subscription Plan",
        quantity: 1,
        unitPrice: payment.amount_cents / 100,
        total: payment.amount_cents / 100,
      },
    ]

    const subtotal = payment.amount_cents / 100
    const total = payment.amount_cents / 100

    // Get tenant branding
    const branding = payment.tenant.tenant_branding?.[0]
    const tenantBranding = branding
      ? {
          logo: branding.logo_url || undefined,
          primaryColor: branding.primary_color || undefined,
          companyName: payment.tenant.name,
          companyPhone: branding.whatsapp_number || undefined,
        }
      : undefined

    // Generate PDF
    const pdfUrl = await pdfGenerator.generateInvoicePDF({
      invoiceId: String(invoiceId),
      invoiceNumber: `INV-${String(payment.id).padStart(6, "0")}`,
      invoiceDate: new Date().toLocaleDateString(),
      dueDate: payment.paid_at
        ? new Date(payment.paid_at).toLocaleDateString()
        : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      clientName,
      clientEmail,
      clientPhone,
      lineItems,
      subtotal,
      total,
      currency: payment.currency.code,
      paymentStatus: payment.status as "pending" | "paid" | "overdue",
      paymentMethod: payment.gateway,
      notes: payment.receipt_url
        ? `Receipt available at: ${payment.receipt_url}`
        : undefined,
      tenantBranding,
    })

    return NextResponse.json({
      success: true,
      pdfUrl,
      message: "Invoice generated successfully",
    })
  } catch (error) {
    console.error("Error generating invoice:", error)
    return NextResponse.json(
      { error: "Failed to generate invoice" },
      { status: 500 }
    )
  }
}
