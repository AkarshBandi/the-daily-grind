export async function onRequestPost(context) {
  const { request, env } = context;
  try {
    const { email } = await request.json();
    if (!email || !email.includes('@')) {
      return new Response(JSON.stringify({ error: 'Valid email required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }
    // Allow any email for now, but ideally only allowlisted Gmail
    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const key = `otp:${email.toLowerCase()}`;
    // Store in KV with 5 min TTL
    // env.hearth_otp is the KV binding (need to configure in wrangler.toml)
    const kv = (env as any).hearth_otp;
    if (kv) {
      await kv.put(key, code, { expirationTtl: 300 });
    } else {
      // Fallback: use in-memory (not persistent, but for demo)
      (globalThis as any)._otpStore = (globalThis as any)._otpStore || new Map();
      (globalThis as any)._otpStore.set(key, { code, exp: Date.now() + 300000 });
    }

    // For manual testing as user requested, always return code in response (so you can test without waiting for Gmail)
    // In production, you would remove _testCode and rely on email, but for now we return it for easy manual testing
    console.log(`OTP for ${email}: ${code}`);

    // Attempt to send via MailChannels API (free, no API key if SPF set) - use a more deliverable from
    // Using noreply@workers.cloudflare.com or a verified domain would be better, but for demo we use hearthandhoney
    // To fix SPF/DKIM, ensure the from domain has SPF: v=spf1 include:_spf.mx.cloudflare.net ~all
    // For now, we still attempt to send, but we don't fail if it fails
    const fromEmail = 'noreply@hearthandhoney.example';
    try {
      const mailRes = await fetch('https://api.mailchannels.net/tx/v1/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          personalizations: [{ to: [{ email, name: email.split('@')[0] }] }],
          from: { email: fromEmail, name: 'Hearth & Honey' },
          subject: `Your Hearth & Honey code is ${code}`,
          content: [
            { type: 'text/plain', value: `Your Hearth & Honey admin code is ${code} — valid for 5 minutes. If you didn't request this, ignore it.\n\nEnter it at ${new URL(request.url).origin}/admin` },
            { type: 'text/html', value: `<p>Your <strong>Hearth & Honey</strong> admin code is <strong style="font-size:24px; letter-spacing:4px;">${code}</strong> — valid for 5 minutes.</p><p>Enter it at <a href="${new URL(request.url).origin}/admin">${new URL(request.url).origin}/admin</a></p>` }
          ]
        })
      });
      if (!mailRes.ok) {
        const errText = await mailRes.text();
        console.log('MailChannels send failed - this is expected for unverified from domain hearthandhoney.example. For production, verify domain SPF/DKIM or use a verified from like noreply@yourdomain.com via Cloudflare Email Routing. Error:', errText.slice(0,300));
      } else {
        console.log('MailChannels send succeeded for', email);
      }
    } catch (e) {
      console.log('MailChannels error', (e as Error).message);
    }

    // Always return _testCode for manual testing as per user request "manually test the code you gave me"
    // Remove this in production and rely on email only
    return new Response(JSON.stringify({ ok: true, message: 'Code sent if email is valid. Check inbox/spam (for demo, code is also returned).', _testCode: code, _note: 'For manual testing as requested, _testCode is included. In production, remove this and check Gmail.' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
