import { methodNotAllowed, requireSupabase, send } from '../../_lib/http.js';
import { supabaseConfigured, supabaseRequest } from '../../_lib/supabase.js';

export default async function handler(req, res) {
  const { collection, id } = req.query;

  if (!['PUT', 'DELETE'].includes(req.method)) {
    methodNotAllowed(res);
    return;
  }

  if (!requireSupabase(res, supabaseConfigured)) return;

  try {
    if (req.method === 'PUT') {
      const [saved] = await supabaseRequest('app_records?on_conflict=collection,id', {
        method: 'POST',
        headers: { Prefer: 'resolution=merge-duplicates,return=representation' },
        body: JSON.stringify({
          collection,
          id,
          payload: req.body,
          updated_at: new Date().toISOString(),
        }),
      });
      send(res, 200, saved.payload);
      return;
    }

    await supabaseRequest(
      `app_records?collection=eq.${encodeURIComponent(collection)}&id=eq.${encodeURIComponent(id)}`,
      { method: 'DELETE', headers: { Prefer: 'return=minimal' } }
    );
    send(res, 200, { ok: true });
  } catch (error) {
    send(res, 500, { error: error.message });
  }
}
