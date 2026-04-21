# Landing Page → Google Sheets (via Make)

Landing page Next.js (App Router) avec un formulaire (nom + email) qui poste vers une API interne `/api/submit`, laquelle relaie les données vers un webhook Make connecté à Google Sheets.

## Stack

- Next.js 14 (App Router) + TypeScript
- API Route : `app/api/submit/route.ts`
- Webhook Make → Google Sheets

## Démarrage local

```bash
npm install
cp .env.local.example .env.local
# éditer .env.local et y coller l'URL du webhook Make
npm run dev
```

Ouvre http://localhost:3000.

## Variables d'environnement

| Nom | Description |
|---|---|
| `MAKE_WEBHOOK_URL` | URL du webhook personnalisé Make (Custom webhook) |

## Configurer Make + Google Sheets

1. Va sur https://www.make.com → nouveau scénario.
2. Module **Webhooks → Custom webhook** : crée un webhook, copie l'URL.
3. Teste avec un envoi depuis le formulaire (ou `curl`) pour que Make détecte la structure des données :
   ```bash
   curl -X POST https://hook.eu2.make.com/xxxxx \
     -H "Content-Type: application/json" \
     -d '{"name":"Test","email":"test@test.com","submittedAt":"2025-01-01T00:00:00Z"}'
   ```
4. Ajoute un module **Google Sheets → Add a row**, connecte ton compte Google, choisis la feuille cible et mappe :
   - Colonne A ← `name`
   - Colonne B ← `email`
   - Colonne C ← `submittedAt`
5. Active le scénario (toggle **ON**).

## Déploiement Vercel

1. Pousse le repo sur GitHub :
   ```bash
   git init
   git add .
   git commit -m "init landing"
   git branch -M main
   git remote add origin https://github.com/<toi>/<repo>.git
   git push -u origin main
   ```
2. Sur https://vercel.com → **Add New → Project** → importe le repo.
3. Dans **Environment Variables**, ajoute `MAKE_WEBHOOK_URL` avec l'URL du webhook.
4. **Deploy**. Vercel te donne une URL publique (`https://<projet>.vercel.app`).

## Validation

- Champs requis (HTML5 + validation serveur dans la route API).
- Email vérifié via regex côté serveur.
- Message de succès / d'erreur affiché dans l'UI.
