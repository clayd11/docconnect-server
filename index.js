import express from "express";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 8080;
const PUBLIC_BASE_URL = process.env.PUBLIC_BASE_URL || `http://localhost:${PORT}`;

// Health check
app.get("/health", (req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

// Create message → return fake universal link
app.post("/messages", (req, res) => {
  const { senderName, recipientPhone, recipientEmail, messageBody } = req.body || {};
  if (!senderName || !messageBody) {
    return res.status(400).json({ error: "senderName and messageBody are required" });
  }

  const messageId = uuidv4();
  // For now this just points to a placeholder path on THIS server:
  const ulink = `${PUBLIC_BASE_URL}/view/${messageId}`;

  // TODO: In real life you’d store to a database here

  res.status(201).json({
    message_id: messageId,
    ulink
  });
});

// Simple view route (placeholder)
app.get("/view/:id", (req, res) => {
  res.type("html").send(`
    <html>
      <head><meta name="viewport" content="width=device-width, initial-scale=1" /></head>
      <body style="font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,sans-serif;padding:24px;">
        <h2>🔒 DocConnect – Demo Viewer</h2>
        <p>Message ID: <code>${req.params.id}</code></p>
        <p>(This is a demo page. In production, you'd do your verification flow here.)</p>
      </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
  console.log(`Health: ${PUBLIC_BASE_URL}/health`);
});
