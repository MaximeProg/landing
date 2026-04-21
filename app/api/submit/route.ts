import { NextResponse } from "next/server";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  let body: { name?: unknown; email?: unknown };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON invalide" }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";

  if (!name || name.length < 2) {
    return NextResponse.json({ error: "Nom requis" }, { status: 400 });
  }
  if (!email || !EMAIL_REGEX.test(email)) {
    return NextResponse.json({ error: "Email invalide" }, { status: 400 });
  }

  const webhookUrl = process.env.MAKE_WEBHOOK_URL;
  if (!webhookUrl) {
    return NextResponse.json(
      { error: "Webhook non configuré (MAKE_WEBHOOK_URL manquant)" },
      { status: 500 }
    );
  }

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        submittedAt: new Date().toISOString(),
      }),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error("Webhook a renvoyé une erreur:", res.status, text);
      return NextResponse.json(
        { error: "Le webhook a renvoyé une erreur" },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Erreur lors de l'appel au webhook:", err);
    return NextResponse.json(
      { error: "Impossible de joindre le webhook" },
      { status: 502 }
    );
  }
}
