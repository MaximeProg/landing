"use client";

import { useState, FormEvent } from "react";
import ThemeToggle from "./ThemeToggle";

type Status = "idle" | "loading" | "success" | "error";

export default function Home() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Erreur lors de l'envoi");
      }

      setStatus("success");
      setName("");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Erreur inconnue");
    }
  }

  return (
    <main>
      <ThemeToggle />
      <div className="card">
        <h1>Sois le premier informé</h1>
        <p className="subtitle">
          Rejoins la liste d&apos;attente et reçois un accès prioritaire dès le
          lancement. Pas de spam, juste l&apos;essentiel.
        </p>

        <form onSubmit={handleSubmit} noValidate={false}>
          <label>
            Nom
            <input
              type="text"
              name="name"
              placeholder="Ton nom"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              minLength={2}
              disabled={status === "loading"}
            />
          </label>

          <label>
            Email
            <input
              type="email"
              name="email"
              placeholder="ton@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={status === "loading"}
            />
          </label>

          <button type="submit" disabled={status === "loading"}>
            {status === "loading" ? "Envoi..." : "Rejoindre la liste"}
          </button>

          <p className="legal">
            En soumettant, tu acceptes que tes informations soient utilisées
            uniquement pour te recontacter.
          </p>
        </form>

        {status === "success" && (
          <div className="message success">
            Merci ! Tes informations ont bien été enregistrées.
          </div>
        )}
        {status === "error" && (
          <div className="message error">
            {errorMsg || "Une erreur est survenue. Réessaie."}
          </div>
        )}
      </div>
    </main>
  );
}
