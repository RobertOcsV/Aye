// Proxy serverless para a API do Instagram
// O token fica na variável de ambiente INSTAGRAM_TOKEN (configurada no dashboard Cloudflare)
// Assim o token NUNCA é exposto no código-fonte do site

export async function onRequest(context) {
    const TOKEN = context.env.INSTAGRAM_TOKEN;

    // Headers CORS para permitir chamadas do próprio site
    const corsHeaders = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=3600' // cache 1h — evita bater na API a cada visita
    };

    if (!TOKEN) {
        return new Response(
            JSON.stringify({ error: 'Token não configurado' }),
            { status: 500, headers: corsHeaders }
        );
    }

    try {
        const url = `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp&limit=9&access_token=${TOKEN}`;
        const res = await fetch(url);

        if (!res.ok) {
            throw new Error(`Instagram API retornou ${res.status}`);
        }

        const data = await res.json();

        return new Response(JSON.stringify(data), {
            status: 200,
            headers: corsHeaders
        });
    } catch (err) {
        return new Response(
            JSON.stringify({ error: 'Falha ao buscar posts do Instagram' }),
            { status: 502, headers: corsHeaders }
        );
    }
}
