// Proxy serverless para a API do Instagram
// O token fica na variável de ambiente INSTAGRAM_TOKEN (configurada no dashboard Cloudflare)
// Assim o token NUNCA é exposto no código-fonte do site

export async function onRequest(context) {
    const TOKEN = context.env.INSTAGRAM_TOKEN;

    // Headers CORS para permitir chamadas do próprio site
    const corsHeaders = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    };

    // Sucesso: cache 1h — evita bater na API a cada visita
    const okHeaders = { ...corsHeaders, 'Cache-Control': 'public, max-age=3600' };

    // Erro: sem cache — trocado o token, o feed volta na hora
    const errorHeaders = { ...corsHeaders, 'Cache-Control': 'no-store' };

    // Erro com 503, não 502: a Cloudflare troca 502/504 da origem pela página
    // genérica dela ("error code: 502") e o JSON some no domínio próprio
    const erro = (status, body) =>
        new Response(JSON.stringify(body), { status, headers: errorHeaders });

    // Tira o token de qualquer texto que vá para o log
    const ocultarToken = (texto) =>
        TOKEN ? String(texto).replaceAll(TOKEN, '[token]') : String(texto);

    if (!TOKEN) {
        console.error('[instagram] INSTAGRAM_TOKEN não configurado');
        return erro(500, { error: 'Token não configurado' });
    }

    try {
        const url = `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp&limit=9&access_token=${TOKEN}`;
        const res = await fetch(url);

        if (!res.ok) {
            // Erro da Meta. Ex.: token vencido = HTTP 400, OAuthException, code 190
            const corpo = await res.text();
            let igErro = {};
            try {
                igErro = JSON.parse(corpo).error || {};
            } catch {
                // corpo não é JSON
            }

            // Aparece nos Real-time logs do deploy (painel Pages → deploy → Functions)
            console.error('[instagram] API recusou', JSON.stringify({
                status: res.status,
                code: igErro.code,
                subcode: igErro.error_subcode,
                type: igErro.type,
                message: ocultarToken(igErro.message || corpo.slice(0, 500))
            }));

            return erro(503, {
                error: 'Falha ao buscar posts do Instagram',
                igStatus: res.status,
                igCode: igErro.code ?? null
            });
        }

        // Devolve só os posts. A Meta manda paging.next com o token dentro da URL:
        // repassar o JSON inteiro entregava o token a qualquer visitante
        const { data } = await res.json();

        return new Response(JSON.stringify({ data: data ?? [] }), {
            status: 200,
            headers: okHeaders
        });
    } catch (err) {
        // Falha de rede ou resposta inválida
        console.error('[instagram] falha na chamada', ocultarToken(err?.stack || err));
        return erro(503, { error: 'Falha ao buscar posts do Instagram' });
    }
}
