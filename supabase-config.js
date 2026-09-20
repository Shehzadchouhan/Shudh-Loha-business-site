const SHUDH_SUPABASE_URL = "https://zvsqhqhutnlzcizpbyrn.supabase.co";
const SHUDH_SUPABASE_ANON_KEY = "sb_publishable_lJKknaTqG2ycGL-qQJtWwg_PScMbgKS";
const SHUDH_SUPABASE_READY = !SHUDH_SUPABASE_URL.startsWith("YOUR_") && !SHUDH_SUPABASE_ANON_KEY.startsWith("YOUR_");
const shudhSupabase = SHUDH_SUPABASE_READY ? supabase.createClient(SHUDH_SUPABASE_URL, SHUDH_SUPABASE_ANON_KEY) : null;

const contactCaptureStyles = `
  .contact-capture { position:fixed; inset:0; z-index:200; display:grid; place-items:center; padding:18px; background:rgba(23,23,23,.62); }
  .contact-capture[hidden] { display:none; }
  .contact-capture-card { width:min(420px,100%); padding:26px; background:#fbfaf6; color:#171717; box-shadow:0 18px 60px rgba(0,0,0,.24); }
  .contact-capture-card h2 { margin:0 0 8px; font:700 30px/1.05 Didot,"Times New Roman",serif; }
  .contact-capture-card p { margin:0 0 18px; color:#686158; font:14px/1.5 "Trebuchet MS","Segoe UI",sans-serif; }
  .contact-capture-card label { display:grid; gap:6px; margin-top:10px; color:#686158; font:700 12px/1.4 "Trebuchet MS","Segoe UI",sans-serif; }
  .contact-capture-card input { width:100%; border:1px solid rgba(20,18,16,.18); padding:11px 12px; background:#fff; color:#171717; font:inherit; }
  .contact-capture-actions { display:flex; gap:10px; margin-top:16px; }
  .contact-capture-card button { flex:1; border:1px solid #b88a24; background:#b88a24; color:#171717; padding:11px 14px; font-weight:700; cursor:pointer; }
  .contact-capture-card .contact-capture-secondary { border-color:#686158; background:transparent; }
  .contact-capture-status { min-height:20px; margin:12px 0 0; color:#a23b2d; font-size:13px; }
`;

function shudhAddContactCapture() {
  if (document.getElementById("contactCapture") || !shudhSupabase || localStorage.getItem("shudhContactCaptureDone") === "1") return;
  const style = document.createElement("style");
  style.textContent = contactCaptureStyles;
  document.head.appendChild(style);
  const modal = document.createElement("div");
  modal.className = "contact-capture";
  modal.id = "contactCapture";
  modal.innerHTML = `<form class="contact-capture-card" id="contactCaptureForm"><h2>Stay connected</h2><p>Leave your number and we will help with product availability, prices, and delivery.</p><label>Name <input id="contactCaptureName" autocomplete="name" placeholder="Your name"></label><label>Phone number <input id="contactCapturePhone" type="tel" inputmode="tel" autocomplete="tel" placeholder="10-digit phone number" required></label><div class="contact-capture-actions"><button type="submit">Send my number</button><button class="contact-capture-secondary" id="contactCaptureDismiss" type="button">Maybe later</button></div><div class="contact-capture-status" id="contactCaptureStatus" role="status"></div></form>`;
  document.body.appendChild(modal);
  const close = () => { localStorage.setItem("shudhContactCaptureDone", "1"); modal.hidden = true; };
  document.getElementById("contactCaptureDismiss").addEventListener("click", close);
  document.getElementById("contactCaptureForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const status = document.getElementById("contactCaptureStatus");
    const phone = document.getElementById("contactCapturePhone").value.trim();
    if (!/^[+\d][\d\s()-]{7,}$/.test(phone)) { status.textContent = "Enter a valid phone number."; return; }
    status.textContent = "Sending...";
    const { error } = await shudhSupabase.from("leads").insert({ kind: "form", name: document.getElementById("contactCaptureName").value.trim() || null, phone, message: "First-visit contact request", page_url: location.href });
    if (error) { status.textContent = "Could not send. Please use WhatsApp or call us."; return; }
    close();
  });
}

if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", shudhAddContactCapture);
else shudhAddContactCapture();

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