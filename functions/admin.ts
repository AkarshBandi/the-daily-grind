export async function onRequest(context) {
  const { request, env, next } = context;
  const url = new URL(request.url);
  const cookie = request.headers.get('Cookie') || '';

  // Allow static assets for admin config and CMS JS to load without auth for the initial page? No, we need to protect the HTML but allow config.yml and JS.
  // If request is for /admin/config.yml or static assets, allow without OTP? The CMS needs config.yml to load without auth, but the HTML should be protected.
  // For simplicity, protect only the HTML document (Accept: text/html), not the config.yml or JS.
  const accept = request.headers.get('Accept') || '';
  const isHtmlRequest = accept.includes('text/html') || url.pathname === '/admin' || url.pathname === '/admin/';

  // Check if already verified via cookie
  const isVerified = cookie.includes('hearth_otp_verified=1');

  if (isHtmlRequest && !isVerified) {
    // Show OTP form
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Hearth & Honey — Admin Login</title><style>body{font-family:DM Sans,system-ui,sans-serif;background:#FFECCC;margin:0;padding:40px 20px;display:flex;justify-content:center;align-items:center;min-height:100vh} .card{background:#fff;border:2px solid #000;border-radius:32px;padding:32px;max-width:440px;width:100%;box-shadow:0 12px 32px rgba(0,0,0,.12)} h1{font-family:Fraunces,serif;font-size:32px;margin:0 0 8px} p{color:#555;font-size:14px;margin:0 0 20px} label{display:block;font-size:14px;font-weight:600;margin:12px 0 6px} input{width:100%;padding:12px 14px;border:2px solid #000;border-radius:12px;font-size:16px;box-sizing:border-box} button{width:100%;margin-top:16px;padding:12px;background:#005B4A;color:#fff;border:2px solid #000;border-radius:12px;font-size:16px;font-weight:600;cursor:pointer} button:hover{background:#1A472C} .hint{font-size:12px;color:#666;margin-top:12px} .error{color:#b00;background:#fee;padding:10px;border-radius:8px;margin-bottom:12px;font-size:14px;display:none}</style></head><body>
      <div class="card">
        <h1>Hearth & Honey</h1>
        <p>Admin — enter your Gmail to get a 6-digit code. No GitHub needed.</p>
        <div id="error" class="error"></div>
        <div id="step1">
          <label for="email">Your Gmail</label>
          <input id="email" type="email" placeholder="you@gmail.com" autocomplete="email" />
          <button onclick="sendCode()">Send code to Gmail</button>
          <div class="hint">We’ll email a 6-digit code valid for 5 minutes. Check spam if needed.</div>
        </div>
        <div id="step2" style="display:none">
          <label for="code">6-digit code from Gmail</label>
          <input id="code" type="text" placeholder="123456" maxlength="6" inputmode="numeric" />
          <button onclick="verifyCode()">Verify & Enter Admin</button>
          <div class="hint"><a href="#" onclick="document.getElementById('step2').style.display='none';document.getElementById('step1').style.display='block';return false">Back / resend</a></div>
        </div>
      </div>
      <script>
        async function sendCode(){
          const email=document.getElementById('email').value.trim();
          const err=document.getElementById('error');
          if(!email || !email.includes('@')){ err.textContent='Please enter a valid Gmail.'; err.style.display='block'; return; }
          err.style.display='none';
          const btn=event.target; btn.disabled=true; btn.textContent='Sending...';
          try{
            const r=await fetch('/admin/api/send-otp',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email})});
            const j=await r.json();
            if(!r.ok) throw new Error(j.error||'Failed to send');
            // For manual testing as requested, show the code directly if returned (so you don't need to wait for Gmail)
            if(j._testCode){
              err.textContent='Demo code: '+j._testCode+' (also sent to Gmail if SPF/DKIM is verified; for production remove _testCode)';
              err.style.display='block';
              err.style.background='#efe';
              err.style.color='#050';
              console.log('OTP code for manual test:', j._testCode);
            }
            // Also show in step2 hint for easy testing
            const hint2 = document.querySelector('#step2 .hint');
            if(j._testCode && hint2){
              hint2.innerHTML = 'Demo code: <strong style="letter-spacing:4px; font-size:16px;">'+j._testCode+'</strong> — valid for 5 minutes. (In production, check Gmail spam)';
            }
            document.getElementById('step1').style.display='none';
            document.getElementById('step2').style.display='block';
            if(j._testCode){
              document.getElementById('code').value = j._testCode;
            }
          }catch(e){ err.textContent=e.message; err.style.display='block'; }
          finally{ btn.disabled=false; btn.textContent='Send code to Gmail'; }
        }
        async function verifyCode(){
          const email=document.getElementById('email').value.trim();
          const code=document.getElementById('code').value.trim();
          const err=document.getElementById('error');
          if(!code || code.length!==6){ err.textContent='Enter the 6-digit code.'; err.style.display='block'; return; }
          err.style.display='none';
          const btn=event.target; btn.disabled=true; btn.textContent='Verifying...';
          try{
            const r=await fetch('/admin/api/verify-otp',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,code})});
            const j=await r.json();
            if(!r.ok) throw new Error(j.error||'Invalid code');
            // Set the GitHub token for Sveltia/Decap in localStorage so client never sees GitHub
            // The server will have set a HttpOnly cookie hearth_otp_verified=1, and also return a token to store
            if(j.token){
              try{
                // Sveltia CMS stores token under 'sveltia-cms-user' or 'decap-cms-user'
                localStorage.setItem('decap-cms-user', JSON.stringify({token:j.token, login:'hearth-client', name:'Hearth Client'}));
                localStorage.setItem('sveltia-cms-user', JSON.stringify({token:j.token, login:'hearth-client'}));
              }catch{}
            }
            location.reload();
          }catch(e){ err.textContent=e.message; err.style.display='block'; }
          finally{ btn.disabled=false; btn.textContent='Verify & Enter Admin'; }
        }
      </script>
    </body></html>`;
    return new Response(html, { status: 200, headers: { 'Content-Type': 'text/html;charset=UTF-8' } });
  }

  // If verified, allow the static admin to load
  return next();
}
