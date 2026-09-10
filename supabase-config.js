const SHUDH_SUPABASE_URL = "https://zvsqhqhutnlzcizpbyrn.supabase.co";
const SHUDH_SUPABASE_ANON_KEY = "sb_publishable_lJKknaTqG2ycGL-qQJtWwg_PScMbgKS";
const SHUDH_SUPABASE_READY = !SHUDH_SUPABASE_URL.startsWith("YOUR_") && !SHUDH_SUPABASE_ANON_KEY.startsWith("YOUR_");
const shudhSupabase = SHUDH_SUPABASE_READY ? supabase.createClient(SHUDH_SUPABASE_URL, SHUDH_SUPABASE_ANON_KEY) : null;

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