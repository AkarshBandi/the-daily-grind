export async function onRequestPost(context) {
  const { request, env } = context;
  try {
    const { email, code } = await request.json();
    if (!email || !code) {
      return new Response(JSON.stringify({ error: 'Email and code required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }
    const key = `otp:${email.toLowerCase()}`;
    const kv = (env as any).hearth_otp;
    let stored: string | null = null;
    if (kv) {
      stored = await kv.get(key);
    } else {
      const store = (globalThis as any)._otpStore as Map<string, any>;
      const entry = store?.get(key);
      if (entry && entry.exp > Date.now()) stored = entry.code;
    }
    if (!stored || stored !== code) {
      return new Response(JSON.stringify({ error: 'Invalid or expired code. Please resend.' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }
    // Code valid - delete it
    if (kv) await kv.delete(key);
    else (globalThis as any)._otpStore?.delete(key);

    // On success, set HttpOnly cookie and return a GitHub PAT for the CMS to use
    // The PAT is the bot token that has repo write access - we store it in env.GITHUB_TOKEN
    // For Sveltia/Decap, the frontend will store this token in localStorage as decap-cms-user
    const token = (env as any).GITHUB_TOKEN || '';
    if (!token) {
      return new Response(JSON.stringify({ error: 'Server not configured with GITHUB_TOKEN' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }

    const headers = new Headers({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    });
    // Set HttpOnly cookie for the Pages Function to allow /admin HTML to load
    headers.append('Set-Cookie', `hearth_otp_verified=1; Path=/admin; HttpOnly; SameSite=Lax; Max-Age=3600; Secure`);
    headers.append('Set-Cookie', `hearth_otp_email=${encodeURIComponent(email)}; Path=/; SameSite=Lax; Max-Age=3600`);

    return new Response(JSON.stringify({ ok: true, token }), {
      status: 200,
      headers,
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
