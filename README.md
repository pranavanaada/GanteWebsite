# Pooja Bells

## Contact form email setup (EmailJS)
This app uses EmailJS to send contact form submissions without a backend.

You can choose either:
- Serverless email (recommended): send via a tiny API route using Resend.
- EmailJS (client-only): send directly from the browser without a backend.

If neither is configured, the form shows an error on submit.

### 1) Create an EmailJS account
- https://www.emailjs.com/

### 2) Create a Service and a Template
- Note the Service ID and Template ID.
- In your template, include variables: `from_name`, `from_email`, `phone`, `message`, `to_email`.
- Set the recipient email in the template to `{{to_email}}` or directly `pranavanaadaa@gmail.com`.

### 3) Get your Public Key

### 4) Add env variables
Create a `.env` file in the project root with:

```
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
RESEND_API_KEY=your_resend_key
RESEND_FROM=onboarding@resend.dev
CONTACT_TO_EMAIL=pranavanaadaa@gmail.com
ALLOWED_ORIGIN=*
```

> Tip: See `.env.example` for a template.

### 5) Restart the dev server
Vite must reload to read the new env vars.

### 6) Test the form
- Open the Contact page, fill in the fields, and submit.
- You should see a success message. For serverless mode, deploy to Vercel (vercel.json included) or run a compatible server.
- For client-only mode (EmailJS), check the EmailJS dashboard on errors.

### Troubleshooting
- Ensure your template variable names match exactly: `from_name`, `from_email`, `phone`, `message`, `to_email`.
- Verify your EmailJS Service and Template are active and IDs are correct.
- If you set the recipient directly in the template, you can remove `to_email` from the template variables.
- Client-side email is suitable for small sites; for additional control, consider a small serverless function.
 - For serverless email: set `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, and ensure your hosting routes `/api/contact` to `api/contact.js` (Vercel works out of the box).

## Serverless email (multi-cloud)

This repo includes serverless handlers for multiple platforms. Pick one and set `VITE_API_BASE` for local dev when needed.

API contract:
- POST {API_BASE}/api/contact
- Body JSON: `{ name, email, phone?, message }`
- Response: `{ ok: true }` on success

Vercel
- Uses `api/contact.js` (already included) and `vercel.json` routes
- No extra setup beyond env vars mentioned above

AWS Lambda (API Gateway)
- Function code: `server/aws/contact-lambda.js`
- Create an API Gateway HTTP API with a Lambda integration at `/api/contact`
- Enable CORS; set env vars: `RESEND_API_KEY`, `RESEND_FROM`, `CONTACT_TO_EMAIL`, `ALLOWED_ORIGIN`
- Set `VITE_API_BASE` to your API Gateway base URL for local dev

Azure Functions
- Function code: `server/azure/Contact` (HTTP trigger)
- Deploy as an Azure Function App; route to `/api/contact`
- Set env vars: `RESEND_API_KEY`, `RESEND_FROM`, `CONTACT_TO_EMAIL`, `ALLOWED_ORIGIN`
- Set `VITE_API_BASE` to your Function App base URL for local dev

Local development
- If you run the serverless handler locally (e.g., `vercel dev`, Azure Functions Core Tools, or AWS SAM), set:
	- `VITE_API_BASE` to the local URL (for example: `http://localhost:7071` for Azure, the Vercel dev URL, or your API Gateway local emulator)
- Otherwise, deploy the function and point `VITE_API_BASE` to the deployed domain.
