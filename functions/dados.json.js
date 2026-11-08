// Cloudflare Pages Function: responde em /dados.json
// Precisa de um KV Namespace ligado ao projeto com o nome de variável DADOS.
const H = { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' };

export async function onRequestGet({ env }) {
  const v = await env.DADOS.get('dados');
  if (v === null) return new Response('', { status: 404, headers: { 'Cache-Control': 'no-store' } });
  return new Response(v, { headers: H });
}

export async function onRequestPut({ request, env }) {
  const t = await request.text();
  if (t.length > 5000000) return new Response('', { status: 413 });
  try { JSON.parse(t); } catch { return new Response('', { status: 400 }); }
  await env.DADOS.put('dados', t);
  return new Response(null, { status: 204, headers: { 'Cache-Control': 'no-store' } });
}
