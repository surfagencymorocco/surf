export default function handler(req, res) {
  var start = Date.now();
  var timestamp = new Date().toISOString();

  function extractProjectRef() {
    var m = (process.env.SUPABASE_URL || '').match(/https?:\/\/([^.]+)\.supabase\.co/);
    return m ? m[1] : '';
  }

  function buildBody(ok, status, httpStatus, latency, error) {
    var body = {
      ok: ok,
      service: 'supabase',
      status: status,
      httpStatus: httpStatus,
      latency: latency,
      timestamp: timestamp,
      project: extractProjectRef()
    };
    if (error) body.error = error;
    return body;
  }

  function setHeaders(r, allowHeader) {
    r.setHeader('Cache-Control', 'no-store');
    r.setHeader('Pragma', 'no-cache');
    if (allowHeader) r.setHeader('Allow', 'GET');
  }

  if (req.method !== 'GET') {
    console.warn('[api/ping] Rejected ' + req.method + ' — method not allowed');
    setHeaders(res, true);
    return res.status(405).json(buildBody(false, 'unreachable', 405, 0, 'Method ' + req.method + ' not allowed'));
  }

  var SUPABASE_URL = process.env.SUPABASE_URL;
  var SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error('[api/ping] Missing SUPABASE_URL or SUPABASE_ANON_KEY');
    setHeaders(res, false);
    return res.status(500).json(buildBody(false, 'unreachable', 500, 0, 'Missing SUPABASE_URL or SUPABASE_ANON_KEY environment variables'));
  }

  var TIMEOUT_MS = 10000;
  var controller = new AbortController();
  var timeoutId = setTimeout(function () { controller.abort(); }, TIMEOUT_MS);

  console.log('[api/ping] Starting — GET /auth/v1/health');

  return fetch(SUPABASE_URL + '/auth/v1/health', {
    headers: {
      'Content-Type': 'application/json',
      apikey: SUPABASE_ANON_KEY
    },
    signal: controller.signal
  }).then(function (response) {
    clearTimeout(timeoutId);
    var latency = Date.now() - start;

    if (response.ok) {
      console.log('[api/ping] Completed — ' + response.status + ' in ' + latency + 'ms');
      setHeaders(res, false);
      return res.status(200).json(buildBody(true, 'reachable', response.status, latency));
    }

    console.warn('[api/ping] Failed — HTTP ' + response.status + ' in ' + latency + 'ms');
    setHeaders(res, false);
    return res.status(503).json(buildBody(false, 'unreachable', 503, latency, 'Supabase returned HTTP ' + response.status));
  }).catch(function (error) {
    clearTimeout(timeoutId);
    var latency = Date.now() - start;

    if (error.name === 'AbortError') {
      console.warn('[api/ping] Timeout — ' + TIMEOUT_MS + 'ms exceeded');
      setHeaders(res, false);
      return res.status(503).json(buildBody(false, 'timeout', 503, TIMEOUT_MS, 'Request timed out after ' + TIMEOUT_MS + 'ms'));
    }

    console.error('[api/ping] Error — ' + error.message + ' in ' + latency + 'ms');
    setHeaders(res, false);
    return res.status(503).json(buildBody(false, 'unreachable', 503, latency, error.message));
  });
}
