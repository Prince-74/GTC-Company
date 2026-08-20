import { NextResponse } from "next/server";

const ALLOWED_FILE_EXTENSIONS = new Set(["pdf", "ai", "eps", "svg", "png", "jpg", "jpeg"]);
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;
const FORMSPREE_TIMEOUT_MS = 15_000;

function getText(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

function isAttachment(value: FormDataEntryValue | null): value is File {
  return typeof value !== "string" && value !== null && typeof value.name === "string" && typeof value.size === "number";
}

export async function POST(request: Request) {
  try {
    const incomingFormData = await request.formData();
    const body = Object.fromEntries(
      ["company", "name", "phone", "email", "industry", "boxType", "ply", "length", "width", "height", "unit", "quantity", "printing", "requirements", "source"]
        .map((name) => [name, getText(incomingFormData, name)])
    ) as Record<string, string>;
    const potentialAttachment = incomingFormData.get("attachment");
    const attachment = isAttachment(potentialAttachment) && potentialAttachment.size > 0 ? potentialAttachment : undefined;
    const quantity = Number(body.quantity);
    const dimensions = [body.length, body.width, body.height].map(Number);

    if (
      !body.name || !body.company ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email) ||
      !/^[6-9]\d{9}$/.test(body.phone) ||
      !Number.isInteger(quantity) || quantity <= 0 ||
      dimensions.some((value) => !Number.isFinite(value) || value <= 0)
    ) {
      return NextResponse.json(
        { message: "Please provide a valid company, name, email, 10-digit mobile number, positive dimensions, and quantity." },
        { status: 400 }
      );
    }

    if (attachment) {
      const extension = attachment.name.split(".").pop()?.toLowerCase();
      if (!extension || !ALLOWED_FILE_EXTENSIONS.has(extension) || attachment.size > MAX_FILE_SIZE_BYTES) {
        return NextResponse.json(
          { message: "Attachments must be PDF, AI, EPS, SVG, PNG, or JPG files no larger than 10 MB." },
          { status: 400 }
        );
      }
    }

    const formId = process.env.FORMSPREE_FORM_ID || "xaqrgjay";
    const formspreePayload = new FormData();
    Object.entries(body).forEach(([key, value]) => formspreePayload.append(key, value));

    let formspreeResponse: Response;
    try {
      formspreeResponse = await fetch(`https://formspree.io/f/${formId}`, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: formspreePayload,
        signal: AbortSignal.timeout(FORMSPREE_TIMEOUT_MS)
      });
    } catch (error) {
      console.error("[Inquiry] Formspree request failed", error);
      return NextResponse.json(
        { message: "Our inquiry service is temporarily unavailable. Please try again shortly." },
        { status: 502 }
      );
    }

    if (!formspreeResponse.ok) {
      let responseBody = await formspreeResponse.text();

      console.error("[Inquiry] Formspree rejected submission", {
        status: formspreeResponse.status,
        responseBody: responseBody.slice(0, 500)
      });
      return NextResponse.json(
        { message: "Your inquiry could not be delivered. Please try again shortly." },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      attachmentAccepted: !attachment,
      message: attachment
        ? "Your quotation request has been sent. Please share the image or design file through WhatsApp. our team will contact you shortly."
        : "Thanks! Your inquiry was sent successfully."
    });
  } catch (error) {
    console.error("[Inquiry] Unable to process submission", error);
    return NextResponse.json({ message: "Unable to process your inquiry right now." }, { status: 500 });
  }
}
