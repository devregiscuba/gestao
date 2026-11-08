const H = { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' };

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/dados.json') {
      if (request.method === 'GET') {
        const v = await env.DADOS.get('dados');
        if (v === null) return new Response('', { status: 404, headers: { 'Cache-Control': 'no-store' } });
        return new Response(v, { headers: H });
      }
      if (request.method === 'PUT') {
        const t = await request.text();
        if (t.length > 5000000) return new Response('', { status: 413 });
        try { JSON.parse(t); } catch { return new Response('', { status: 400 }); }
        await env.DADOS.put('dados', t);
        return new Response(null, { status: 204, headers: { 'Cache-Control': 'no-store' } });
      }
      return new Response('', { status: 405 });
    }
    return env.ASSETS.fetch(request);
  }
};
