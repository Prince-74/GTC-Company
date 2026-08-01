import { NextResponse } from "next/server";

function buildInquiryMessage(body: Record<string, unknown>) {
  return [
    `New inquiry from ${body.company}`,
    `Name: ${body.name}`,
    `Company: ${body.company}`,
    `Phone: ${body.phone}`,
    `Email: ${body.email}`,
    `Industry: ${body.industry || "Not specified"}`,
    `Box Type: ${body.boxType || "Not specified"}`,
    `Dimensions: ${body.length || "-"} x ${body.width || "-"} x ${body.height || "-"}`,
    `Quantity: ${body.quantity || "Not specified"}`,
    `Printing: ${body.printing || "Not specified"}`,
    `Requirements: ${body.requirements || "No additional notes"}`
  ].join("\n");
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body?.name || !body?.email || !body?.phone || !body?.company) {
      return NextResponse.json(
        { message: "Please fill in your company, name, email, and phone number." },
        { status: 400 }
      );
    }

    const ownerEmail = process.env.NEXT_PUBLIC_OWNER_EMAIL || "sales@gtcpackaging.in";
    const formId = process.env.FORMSPREE_FORM_ID || "xaqrgjay";
    const message = buildInquiryMessage(body);

    const formPayload = new URLSearchParams();
    Object.entries(body as Record<string, unknown>).forEach(([key, value]) => {
      if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
        formPayload.set(key, String(value));
      }
    });

    const formspreeResponse = await fetch(`https://formspree.io/f/${formId}`, {
      method: "POST",
      headers: { Accept: "application/json" },
      body: formPayload
    });

    if (!formspreeResponse.ok) {
      throw new Error("Formspree rejected the submission.");
    }

    console.log(`[Inquiry] ${message}`);

    const mailtoLink = `mailto:${ownerEmail}?subject=${encodeURIComponent("New GTC inquiry")}&body=${encodeURIComponent(message)}`;

    return NextResponse.json({
      success: true,
      message: "Thanks! Your inquiry was sent successfully.",
      mailtoLink
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Unable to process your inquiry right now." },
      { status: 500 }
    );
  }
}
