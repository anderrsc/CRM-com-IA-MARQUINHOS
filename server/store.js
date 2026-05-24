import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, 'data');
const inboxPath = path.join(dataDir, 'whatsapp-inbox.json');

export async function readInbox() {
  try {
    const content = await fs.readFile(inboxPath, 'utf8');
    return JSON.parse(content);
  } catch {
    return [];
  }
}

export async function writeInbox(messages) {
  await fs.mkdir(dataDir, { recursive: true });
  await fs.writeFile(inboxPath, JSON.stringify(messages, null, 2), 'utf8');
}

export async function addInboxMessage(message) {
  const messages = await readInbox();
  const exists = messages.some((item) => item.id === message.id);

  if (!exists) {
    messages.unshift(message);
    await writeInbox(messages.slice(0, 500));
  }

  return message;
}

export async function updateInboxMessage(id, updates) {
  const messages = await readInbox();
  const updated = messages.map((message) =>
    message.id === id ? { ...message, ...updates, updatedAt: new Date().toISOString() } : message
  );

  await writeInbox(updated);
  return updated.find((message) => message.id === id);
}
