const SHUDH_SUPABASE_URL = "https://zvsqhqhutnlzcizpbyrn.supabase.co";
const SHUDH_SUPABASE_ANON_KEY = "sb_publishable_lJKknaTqG2ycGL-qQJtWwg_PScMbgKS";
const SHUDH_SUPABASE_READY = !SHUDH_SUPABASE_URL.startsWith("YOUR_") && !SHUDH_SUPABASE_ANON_KEY.startsWith("YOUR_");
const shudhSupabase = SHUDH_SUPABASE_READY ? supabase.createClient(SHUDH_SUPABASE_URL, SHUDH_SUPABASE_ANON_KEY) : null;

const visitorStyles = `
  .visitor-capture { position:fixed; inset:0; z-index:200; display:grid; place-items:center; padding:18px; background:rgba(23,23,23,.62); }
  .visitor-capture[hidden] { display:none; }
  .visitor-card { width:min(420px,100%); padding:26px; background:#fbfaf6; color:#171717; box-shadow:0 18px 60px rgba(0,0,0,.24); }
  .visitor-card h2 { margin:0 0 8px; font:700 30px/1.05 Didot,"Times New Roman",serif; }
  .visitor-card p { margin:0 0 18px; color:#686158; font:14px/1.5 "Trebuchet MS","Segoe UI",sans-serif; }
  .visitor-card input { width:100%; border:1px solid rgba(20,18,16,.18); padding:11px 12px; background:#fff; color:#171717; font:inherit; }
  .visitor-card button { border:1px solid #b88a24; background:#b88a24; color:#171717; padding:11px 14px; font-weight:700; cursor:pointer; }
  .visitor-card .visitor-actions { display:flex; gap:10px; margin-top:12px; }
  .visitor-card .visitor-secondary { border-color:#686158; background:transparent; color:#171717; }
  .visitor-card .visitor-status { min-height:20px; margin:12px 0 0; color:#a23b2d; font-size:13px; }
`;

function shudhAddVisitorCapture() {
  if (document.getElementById("visitorCapture") || !shudhSupabase) return;
  const style = document.createElement("style");
  style.textContent = visitorStyles;
  document.head.appendChild(style);
  const modal = document.createElement("div");
  modal.className = "visitor-capture";
  modal.id = "visitorCapture";
  modal.hidden = localStorage.getItem("shudhLohaVisitorVerified") === "1" || localStorage.getItem("shudhLohaVisitorDismissed") === "1";
  modal.innerHTML = `<form class="visitor-card" id="visitorPhoneForm"><h2>Stay connected</h2><p>Share your number to receive product updates. We use OTP verification to keep your details safe.</p><input id="visitorPhone" type="tel" inputmode="tel" placeholder="Phone number" autocomplete="tel" required><div class="visitor-actions"><button type="submit">Send OTP</button><button class="visitor-secondary" id="visitorDismiss" type="button">Maybe later</button></div><div class="visitor-status" id="visitorStatus" role="status"></div></form>`;
  document.body.appendChild(modal);
  document.getElementById("visitorDismiss").addEventListener("click", () => { localStorage.setItem("shudhLohaVisitorDismissed", "1"); modal.hidden = true; });
  document.getElementById("visitorPhoneForm").addEventListener("submit", shudhSendVisitorOtp);
  shudhRestoreVisitor();
}

function shudhNormalizePhone(value) {
  const phone = value.replace(/[\s()-]/g, "");
  return /^\d{10}$/.test(phone) ? `+91${phone}` : phone;
}

async function shudhSendVisitorOtp(event) {
  event.preventDefault();
  const status = document.getElementById("visitorStatus");
  const phone = shudhNormalizePhone(document.getElementById("visitorPhone").value);
  if (!/^\+[1-9]\d{7,14}$/.test(phone)) { status.textContent = "Enter a valid phone number with country code."; return; }
  status.textContent = "Sending OTP...";
  const { error } = await shudhSupabase.auth.signInWithOtp({ phone });
  if (error) { status.textContent = error.message; return; }
  const form = document.getElementById("visitorPhoneForm");
  form.innerHTML = `<h2>Enter OTP</h2><p>We sent a verification code to ${phone}.</p><input id="visitorOtp" inputmode="numeric" autocomplete="one-time-code" placeholder="6-digit OTP" required><div class="visitor-actions"><button type="submit">Verify number</button><button class="visitor-secondary" id="visitorCancel" type="button">Cancel</button></div><div class="visitor-status" id="visitorStatus" role="status"></div>`;
  form.onsubmit = async (verifyEvent) => {
    verifyEvent.preventDefault();
    const verifyStatus = document.getElementById("visitorStatus");
    verifyStatus.textContent = "Checking...";
    const result = await shudhSupabase.auth.verifyOtp({ phone, token: document.getElementById("visitorOtp").value.trim(), type: "sms" });
    if (result.error) { verifyStatus.textContent = result.error.message; return; }
    await shudhSaveVisitor(phone);
    const pendingItem = sessionStorage.getItem("shudhPendingItem");
    if (pendingItem) { await shudhTrackItemView(pendingItem); sessionStorage.removeItem("shudhPendingItem"); }
    localStorage.setItem("shudhLohaVisitorVerified", "1");
    document.getElementById("visitorCapture").hidden = true;
  };
  document.getElementById("visitorCancel").addEventListener("click", () => { localStorage.setItem("shudhLohaVisitorDismissed", "1"); document.getElementById("visitorCapture").hidden = true; });
}

async function shudhSaveVisitor(phone) {
  const user = (await shudhSupabase.auth.getUser()).data.user;
  if (!user) return;
  await shudhSupabase.from("visitor_profiles").upsert({ id: user.id, phone: phone || user.phone, last_seen: new Date().toISOString() });
}

async function shudhRestoreVisitor() {
  const session = (await shudhSupabase.auth.getSession()).data.session;
  if (!session) return;
  localStorage.setItem("shudhLohaVisitorVerified", "1");
  const modal = document.getElementById("visitorCapture");
  if (modal) modal.hidden = true;
  await shudhSaveVisitor(session.user.phone || "");
  const pendingItem = sessionStorage.getItem("shudhPendingItem");
  if (pendingItem) { await shudhTrackItemView(pendingItem); sessionStorage.removeItem("shudhPendingItem"); }
}

async function shudhTrackItemView(productName) {
  if (!shudhSupabase || !productName) return;
  const user = (await shudhSupabase.auth.getUser()).data.user;
  if (!user) return;
  await shudhSaveVisitor(user.phone || "");
  await shudhSupabase.from("visitor_item_views").insert({ visitor_id: user.id, product_name: productName, page_url: location.href });
  if (sessionStorage.getItem("shudhPendingItem") === productName) sessionStorage.removeItem("shudhPendingItem");
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", shudhAddVisitorCapture);
else shudhAddVisitorCapture();

async function shudhTrackView() {
  if (!shudhSupabase) return;
  await shudhSupabase.from("page_views").insert({
    page_url: location.pathname,
    referrer: document.referrer || null,
    device: /Mobi|Android/i.test(navigator.userAgent) ? "mobile" : "desktop",
  });
}

async function shudhTrackLead(kind, productName) {
  if (!shudhSupabase) return;
  await shudhSupabase.from("leads").insert({
    kind,
    product_name: productName || null,
    page_url: location.href,
  });
}