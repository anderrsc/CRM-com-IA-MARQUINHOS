import { methodNotAllowed, send } from '../_lib/http.js';
import { sendWhatsAppText } from '../_lib/whatsapp.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    methodNotAllowed(res);
    return;
  }

  try {
    const { to, body } = req.body || {};
    send(res, 200, await sendWhatsAppText(to, body));
  } catch (error) {
    send(res, 400, { error: error.message });
  }
}
