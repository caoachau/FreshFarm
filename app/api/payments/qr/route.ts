import { type NextRequest, NextResponse } from "next/server"

const VIETQR_API_URL = "https://api.vietqr.io/v2/generate"

export async function POST(request: NextRequest) {
  try {
    const { amount, addInfo } = await request.json()

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 })
    }

    const clientId = process.env.VIETQR_CLIENT_ID
    const apiKey = process.env.VIETQR_API_KEY
    const accountNo = process.env.VIETQR_ACCOUNT_NO
    const accountName = process.env.VIETQR_ACCOUNT_NAME
    const acqId = process.env.VIETQR_ACQ_ID

    if (!clientId || !apiKey || !accountNo || !accountName || !acqId) {
      console.error("VietQR env is not configured")
      return NextResponse.json(
        { error: "VietQR is not configured on server" },
        { status: 500 },
      )
    }

    const payload = {
      accountNo,
      accountName,
      acqId: Number(acqId),
      amount: Math.round(amount),
      addInfo: addInfo || "THANH TOAN DON HANG FRESHFARM",
      format: "text",
      template: "compact",
    }

    const vietqrRes = await fetch(VIETQR_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-client-id": clientId,
        "x-api-key": apiKey,
      },
      body: JSON.stringify(payload),
    })

    if (!vietqrRes.ok) {
      const err = await vietqrRes.json().catch(() => ({}))
      console.error("VietQR error:", err)
      return NextResponse.json(
        { error: "Failed to generate VietQR", detail: err },
        { status: 500 },
      )
    }

    const data = await vietqrRes.json()

    // Chuẩn hoá lại response cho frontend
    return NextResponse.json({
      raw: data,
      qrData: data?.data?.qrData || data?.data?.qrCode || null,
      qrImage: data?.data?.qrDataURL || null,
    })
  } catch (error) {
    console.error("Error generating VietQR:", error)
    return NextResponse.json({ error: "Failed to generate VietQR" }, { status: 500 })
  }
}

