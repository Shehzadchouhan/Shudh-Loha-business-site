/**
 * SHUDH LOHA — DYNAMIC WHATSAPP B2B QUOTE & RETAIL ORDER MODULE
 * Direct Factory Supply from Malerkotla, Punjab
 *
 * Provides two dynamic conversion actions for product cards:
 * 1. "Order on WhatsApp"
 * 2. "Wholesale on WhatsApp"
 *
 * Generates structured, pre-filled WhatsApp messages with customized fields:
 * - Wholesale: Business Name, City/Transport destination, Quantity (10+ pcs), GST invoice
 * - Retail: Delivery City/Pincode, Customer Name, Quantity (1 pc)
 */

(function (root, factory) {
  if (typeof define === "function" && define.amd) {
    define([], factory);
  } else if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.WhatsAppOrderModule = factory();
    // Convenience alias for existing naming conventions
    root.ShudhWhatsAppOrders = root.WhatsAppOrderModule;
  }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  const CONFIG = {
    whatsappNumber: "917973247767",
    factoryLocation: "Malerkotla, Punjab",
    defaultRetailQty: "1 pc",
    defaultWholesaleQty: "10+ pcs",
  };

  /**
   * Helper to format WhatsApp message strings
   */
  function sanitize(str) {
    return str ? String(str).trim() : "";
  }

  /**
   * Build Retail WhatsApp message
   */
  function buildRetailMessage(params) {
    const productName = sanitize(params.productName) || "Pure Sarbloh Cookware";
    const city = sanitize(params.city);
    const customerName = sanitize(params.customerName);

    const lines = [
      "🛍️ *RETAIL ORDER INQUIRY (1 PC)*",
      "*Shudh Loha — Malerkotla, Punjab*",
      "──────────────────────────────",
      `• *Product:* ${productName}`,
      "• *Order Type:* Retail Household Order",
      "• *Quantity:* 1 piece",
      "• *Price range:* Please share the current range.",
      `• *Delivery Destination (City / Pincode):* ${city || "[Please provide your City & Pincode]"}`,
      `• *Customer Name:* ${customerName || "[Your Name]"}`,
      "──────────────────────────────",
      `Hi Shudh Loha team, I would like to order 1 pc of ${productName} for my home kitchen. Please confirm final price with courier delivery charges and payment options.`,
    ];

    return lines.join("\n");
  }

  /**
   * Build Wholesale B2B WhatsApp message
   */
  function buildWholesaleMessage(params) {
    const productName = sanitize(params.productName) || "Pure Sarbloh Cookware";
    const quantity = sanitize(params.quantity) || "10+ pcs";
    const businessName = sanitize(params.businessName);
    const destination = sanitize(params.destination) || sanitize(params.city);
    const contactPerson = sanitize(params.contactPerson) || sanitize(params.customerName);

    const lines = [
      "🏭 *COMMERCIAL B2B BULK QUOTE (10+ PCS)*",
      "*Shudh Loha Foundry — Malerkotla, Punjab*",
      "──────────────────────────────",
      `• *Product Required:* ${productName}`,
      "• *Order Type:* Commercial Wholesale / Bulk Supply",
      `• *Quantity Required:* ${quantity}`,
      `• *Business / Kitchen Name:* ${businessName || "[e.g. Dhaba / Restaurant / Caterer / Wholesaler]"}`,
      `• *City / Transport Mandi Destination:* ${destination || "[Your Delivery City / Transport Hub]"}`,
      `• *Contact Person:* ${contactPerson || "[Your Name]"}`,
      "• *Tax Invoicing:* GST Invoice Required",
      "──────────────────────────────",
      `Hi Shudh Loha Factory, please share your lowest commercial wholesale rate per unit, freight transport options from Malerkotla to my destination, and estimated dispatch schedule for ${productName}.`,
    ];

    return lines.join("\n");
  }

  /**
   * Generate wa.me URL
   */
  function createWhatsAppUrl(message) {
    return `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
  }

  function getRetailWhatsAppUrl(productName, details = {}) {
    return createWhatsAppUrl(buildRetailMessage({ productName, ...details }));
  }

  function getWholesaleWhatsAppUrl(productName, details = {}) {
    return createWhatsAppUrl(buildWholesaleMessage({ productName, ...details }));
  }

  /**
   * Safe Lead Tracker
   */
  function trackOrderLead(kind, productName, leadData = {}) {
    if (typeof window.shudhTrackLead === "function") {
      try {
        window.shudhTrackLead(kind, productName);
      } catch (e) {
        console.warn("Track lead error:", e);
      }
    }
    if (window.shudhSupabase && leadData && Object.keys(leadData).length) {
      try {
        window.shudhSupabase.from("leads").insert({
          kind: "whatsapp",
          product_name: productName,
          name: leadData.customerName || leadData.contactPerson || null,
          phone: leadData.phone || null,
          message: `[${kind === "wholesale" ? "B2B Wholesale" : "Retail"}] Product: ${productName}, City: ${leadData.city || leadData.destination || "N/A"}, Business: ${leadData.businessName || "Individual"}`,
          page_url: window.location.href,
        }).then(() => {}).catch(() => {});
      } catch (e) {
        // silent fallback
      }
    }
  }

  /**
   * Injected Modal for Prompting City & Business Name
   */
  let modalInitialized = false;

  function ensureModal() {
    if (modalInitialized || document.getElementById("shudhWaOrderModal")) {
      modalInitialized = true;
      return;
    }

    const modalHtml = `
      <div class="shudh-wa-modal-backdrop" id="shudhWaOrderModal" hidden aria-modal="true" role="dialog" aria-labelledby="shudhWaModalTitle">
        <div class="shudh-wa-modal-card">
          <button type="button" class="shudh-wa-modal-close" id="shudhWaModalClose" aria-label="Close dialog">&times;</button>
          
          <div class="shudh-wa-modal-badge" id="shudhWaModalBadge">B2B WHOLESALE QUOTE</div>
          <h3 class="shudh-wa-modal-title" id="shudhWaModalTitle">Order on WhatsApp</h3>
          <p class="shudh-wa-modal-subtitle" id="shudhWaModalSubtitle">Add your details to generate a pre-filled quote message directly on WhatsApp.</p>
          
          <form id="shudhWaModalForm" class="shudh-wa-modal-form">
            <input type="hidden" id="shudhWaType" value="wholesale" />
            <input type="hidden" id="shudhWaProductName" value="" />

            <div class="shudh-wa-field-row" id="shudhWaBusinessRow">
              <label for="shudhWaBusiness">
                <span>Business / Kitchen Name</span>
                <input type="text" id="shudhWaBusiness" placeholder="e.g. Highway Dhaba, Royal Caterers, Store Name" />
              </label>
            </div>

            <div class="shudh-wa-fields-grid">
              <label for="shudhWaCity" id="shudhWaCityLabel">
                <span id="shudhWaCityTitle">City / Transport Destination *</span>
                <input type="text" id="shudhWaCity" placeholder="e.g. Ludhiana, Delhi, Jaipur" required />
              </label>
              
              <label for="shudhWaQuantity" id="shudhWaQuantityLabel">
                <span>Quantity</span>
                <select id="shudhWaQuantity">
                  <option value="10 pcs (MOQ)">10 pcs (Standard MOQ)</option>
                  <option value="15-25 pcs">15 – 25 pcs (Bulk Tier 1)</option>
                  <option value="25-50 pcs">25 – 50 pcs (Bulk Tier 2)</option>
                  <option value="50+ pcs">50+ pcs (Commercial Lot)</option>
                  <option value="100+ pcs">100+ pcs (Wholesale Mandi)</option>
                </select>
              </label>
            </div>

            <div class="shudh-wa-field-row">
              <label for="shudhWaCustomerName">
                <span>Your Name / Contact Person (Optional)</span>
                <input type="text" id="shudhWaCustomerName" placeholder="e.g. Gurpreet Singh" />
              </label>
            </div>

            <div class="shudh-wa-modal-actions">
              <button type="submit" class="shudh-wa-btn-submit" id="shudhWaSubmitBtn">
                <svg viewBox="0 0 24 24" class="shudh-wa-icon" fill="currentColor"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2z"/></svg>
                Continue to WhatsApp
              </button>
              <button type="button" class="shudh-wa-btn-skip" id="shudhWaSkipBtn">
                Skip &amp; Open WhatsApp Direct ↗
              </button>
            </div>
          </form>
        </div>
      </div>
    `;

    const wrapper = document.createElement("div");
    wrapper.innerHTML = modalHtml;
    document.body.appendChild(wrapper.firstElementChild);

    injectStyles();
    bindModalEvents();
    modalInitialized = true;
  }

  /**
   * Dynamic Stylesheet Injection
   */
  function injectStyles() {
    if (document.getElementById("shudhWaOrderStyles")) return;

    const css = `
      /* --- WhatsApp Product Card Buttons --- */
      .shudh-order-actions {
        display: flex;
        flex-direction: column;
        gap: 6px;
        margin-top: 14px;
        width: 100%;
        box-sizing: border-box;
      }
      .btn-wa-action {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        width: 100%;
        padding: 9px 12px;
        font-family: inherit;
        font-size: 11px;
        font-weight: 700;
        letter-spacing: 0.8px;
        text-transform: uppercase;
        border-radius: 2px;
        cursor: pointer;
        transition: background 0.2s ease, border-color 0.2s ease, transform 0.15s ease, box-shadow 0.2s ease;
        text-decoration: none;
        box-sizing: border-box;
        line-height: 1.2;
      }
      .btn-wa-action:active {
        transform: scale(0.98);
      }
      .btn-wa-icon {
        font-size: 13px;
        line-height: 1;
        display: inline-block;
      }
      .btn-wa-retail {
        background: #fbfaf6;
        color: #171717;
        border: 1px solid rgba(184, 138, 36, 0.45);
      }
      .btn-wa-retail:hover {
        background: #f1ebdd;
        border-color: #b88a24;
        color: #171717;
      }
      .btn-wa-wholesale {
        background: #171717;
        color: #fbfaf6;
        border: 1px solid #b88a24;
        font-weight: 800;
      }
      .btn-wa-wholesale:hover {
        background: #25d366;
        border-color: #25d366;
        color: #ffffff;
        box-shadow: 0 4px 14px rgba(37, 211, 102, 0.35);
      }

      /* Compact mode for tight grids */
      .card .shudh-order-actions {
        margin-top: 12px;
      }
      @media (max-width: 560px) {
        .btn-wa-action {
          padding: 8px 8px;
          font-size: 10px;
          letter-spacing: 0.4px;
        }
      }

      /* --- Modal Styles --- */
      .shudh-wa-modal-backdrop {
        position: fixed;
        inset: 0;
        z-index: 9999;
        background: rgba(18, 16, 14, 0.78);
        backdrop-filter: blur(5px);
        display: grid;
        place-items: center;
        padding: 16px;
        overflow-y: auto;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.22s ease;
        box-sizing: border-box;
      }
      .shudh-wa-modal-backdrop.is-open {
        opacity: 1;
        pointer-events: auto;
      }
      .shudh-wa-modal-card {
        background: #ffffff;
        color: #171717;
        width: min(480px, 100%);
        padding: 30px 26px;
        border-radius: 2px;
        border: 1px solid #b88a24;
        box-shadow: 0 20px 50px rgba(0, 0, 0, 0.35);
        position: relative;
        transform: translateY(15px);
        transition: transform 0.22s ease;
        box-sizing: border-box;
      }
      .shudh-wa-modal-backdrop.is-open .shudh-wa-modal-card {
        transform: translateY(0);
      }
      .shudh-wa-modal-close {
        position: absolute;
        top: 14px;
        right: 14px;
        background: transparent;
        border: none;
        font-size: 26px;
        line-height: 1;
        color: #666;
        cursor: pointer;
        padding: 4px 8px;
      }
      .shudh-wa-modal-close:hover {
        color: #000;
      }
      .shudh-wa-modal-badge {
        display: inline-block;
        background: #b88a24;
        color: #171717;
        font-size: 10px;
        font-weight: 800;
        letter-spacing: 1.5px;
        text-transform: uppercase;
        padding: 3px 8px;
        border-radius: 2px;
        margin-bottom: 8px;
      }
      .shudh-wa-modal-title {
        font-family: Didot, "Bodoni MT", "Times New Roman", serif;
        font-size: 24px;
        margin: 0 0 6px;
        line-height: 1.15;
      }
      .shudh-wa-modal-subtitle {
        color: #555;
        font-size: 13.5px;
        margin: 0 0 20px;
        line-height: 1.5;
      }
      .shudh-wa-modal-form {
        display: grid;
        gap: 12px;
      }
      .shudh-wa-field-row label,
      .shudh-wa-fields-grid label {
        display: grid;
        gap: 5px;
        font-size: 11.5px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.6px;
        color: #444;
      }
      .shudh-wa-fields-grid {
        display: grid;
        grid-template-columns: 1.2fr 0.8fr;
        gap: 10px;
      }
      .shudh-wa-modal-form input,
      .shudh-wa-modal-form select {
        width: 100%;
        padding: 10px 12px;
        border: 1px solid rgba(20, 18, 16, 0.2);
        border-radius: 2px;
        font-family: inherit;
        font-size: 14px;
        background: #fbfaf6;
        box-sizing: border-box;
      }
      .shudh-wa-modal-form input:focus,
      .shudh-wa-modal-form select:focus {
        outline: 2px solid #b88a24;
        background: #ffffff;
      }
      .shudh-wa-modal-actions {
        display: flex;
        flex-direction: column;
        gap: 8px;
        margin-top: 10px;
      }
      .shudh-wa-btn-submit {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        background: #25d366;
        color: #ffffff;
        border: 1px solid #20bd5a;
        padding: 12px;
        font-size: 13px;
        font-weight: 800;
        letter-spacing: 0.8px;
        text-transform: uppercase;
        border-radius: 2px;
        cursor: pointer;
        transition: background 0.2s ease;
      }
      .shudh-wa-btn-submit:hover {
        background: #20bd5a;
      }
      .shudh-wa-btn-skip {
        background: transparent;
        color: #666;
        border: none;
        padding: 6px;
        font-size: 12px;
        font-weight: 600;
        cursor: pointer;
        text-decoration: underline;
      }
      .shudh-wa-btn-skip:hover {
        color: #171717;
      }
      .shudh-wa-icon {
        width: 16px;
        height: 16px;
      }
      @media (max-width: 480px) {
        .shudh-wa-fields-grid {
          grid-template-columns: 1fr;
        }
        .shudh-wa-modal-card {
          padding: 24px 18px;
        }
      }
    `;

    const style = document.createElement("style");
    style.id = "shudhWaOrderStyles";
    style.textContent = css;
    document.head.appendChild(style);
  }

  /**
   * Bind Modal Form Events
   */
  function bindModalEvents() {
    const modal = document.getElementById("shudhWaOrderModal");
    const closeBtn = document.getElementById("shudhWaModalClose");
    const form = document.getElementById("shudhWaModalForm");
    const skipBtn = document.getElementById("shudhWaSkipBtn");

    const closeModal = () => {
      if (!modal) return;
      modal.classList.remove("is-open");
      document.body.style.overflow = "";
      setTimeout(() => {
        modal.hidden = true;
      }, 220);
    };

    if (closeBtn) closeBtn.onclick = closeModal;

    if (modal) {
      modal.onclick = (e) => {
        if (e.target === modal) closeModal();
      };
    }

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal && !modal.hidden) {
        closeModal();
      }
    });

    if (skipBtn) {
      skipBtn.onclick = () => {
        const type = document.getElementById("shudhWaType").value;
        const productName = document.getElementById("shudhWaProductName").value;
        const url = type === "wholesale"
          ? getWholesaleWhatsAppUrl(productName)
          : getRetailWhatsAppUrl(productName);

        trackOrderLead(type, productName);
        window.open(url, "_blank", "noopener,noreferrer");
        closeModal();
      };
    }

    if (form) {
      form.onsubmit = (e) => {
        e.preventDefault();
        const type = document.getElementById("shudhWaType").value;
        const productName = document.getElementById("shudhWaProductName").value;
        const businessName = document.getElementById("shudhWaBusiness")?.value || "";
        const city = document.getElementById("shudhWaCity")?.value || "";
        const quantity = document.getElementById("shudhWaQuantity")?.value || "";
        const customerName = document.getElementById("shudhWaCustomerName")?.value || "";

        let url = "";
        if (type === "wholesale") {
          url = getWholesaleWhatsAppUrl(productName, {
            quantity,
            businessName,
            destination: city,
            contactPerson: customerName,
          });
          trackOrderLead("wholesale", productName, { businessName, destination: city, customerName });
        } else {
          url = getRetailWhatsAppUrl(productName, {
            city,
            customerName,
          });
          trackOrderLead("retail", productName, { city, customerName });
        }

        window.open(url, "_blank", "noopener,noreferrer");
        closeModal();
        form.reset();
      };
    }
  }

  /**
   * Open Modal in Wholesale mode
   */
  function openWholesaleModal(productName) {
    ensureModal();
    const modal = document.getElementById("shudhWaOrderModal");
    if (!modal) return;

    document.getElementById("shudhWaType").value = "wholesale";
    document.getElementById("shudhWaProductName").value = productName;

    document.getElementById("shudhWaModalBadge").textContent = "FACTORY B2B BULK QUOTE";
    document.getElementById("shudhWaModalTitle").textContent = `${productName}`;
    document.getElementById("shudhWaModalSubtitle").textContent =
      "Request commercial wholesale pricing from our Malerkotla factory with freight dispatch and GST invoice.";

    const businessRow = document.getElementById("shudhWaBusinessRow");
    if (businessRow) businessRow.style.display = "block";

    const cityTitle = document.getElementById("shudhWaCityTitle");
    if (cityTitle) cityTitle.textContent = "City / Transport Destination *";

    const qtyRow = document.getElementById("shudhWaQuantityLabel");
    if (qtyRow) qtyRow.style.display = "grid";

    document.getElementById("shudhWaCity").placeholder = "e.g. Ludhiana, Delhi, Jaipur Mandi";
    document.getElementById("shudhWaSubmitBtn").innerHTML = `
      <svg viewBox="0 0 24 24" class="shudh-wa-icon" fill="currentColor"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2z"/></svg>
      Send on WhatsApp
    `;

    modal.hidden = false;
    requestAnimationFrame(() => modal.classList.add("is-open"));
    document.body.style.overflow = "hidden";
    setTimeout(() => document.getElementById("shudhWaBusiness")?.focus(), 150);
  }

  /**
   * Open Modal in Retail mode
   */
  function openRetailModal(productName) {
    ensureModal();
    const modal = document.getElementById("shudhWaOrderModal");
    if (!modal) return;

    document.getElementById("shudhWaType").value = "retail";
    document.getElementById("shudhWaProductName").value = productName;

    document.getElementById("shudhWaModalBadge").textContent = "RETAIL HOUSEHOLD ORDER (1 PC)";
    document.getElementById("shudhWaModalTitle").textContent = `${productName}`;
    document.getElementById("shudhWaModalSubtitle").textContent =
      "Order 100% pure food-safe Sarbloh cookware directly to your doorstep. Non-stick chemical free.";

    const businessRow = document.getElementById("shudhWaBusinessRow");
    if (businessRow) businessRow.style.display = "none";

    const cityTitle = document.getElementById("shudhWaCityTitle");
    if (cityTitle) cityTitle.textContent = "Delivery City / Pincode *";

    const qtyRow = document.getElementById("shudhWaQuantityLabel");
    if (qtyRow) qtyRow.style.display = "none";

    document.getElementById("shudhWaCity").placeholder = "e.g. Chandigarh, Pincode 160017";
    document.getElementById("shudhWaSubmitBtn").innerHTML = `
      <svg viewBox="0 0 24 24" class="shudh-wa-icon" fill="currentColor"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2z"/></svg>
      Order on WhatsApp
    `;

    modal.hidden = false;
    requestAnimationFrame(() => modal.classList.add("is-open"));
    document.body.style.overflow = "hidden";
    setTimeout(() => document.getElementById("shudhWaCity")?.focus(), 150);
  }

  /**
   * Generate HTML string for product card actions
   */
  function renderButtonsHtml(productName, options = {}) {
    const name = sanitize(productName);

    return `
      <div class="shudh-order-actions" data-product-name="${name}">
        <button type="button" class="btn-wa-action btn-wa-retail" data-shudh-action="retail" aria-label="Order 1 pc of ${name} via WhatsApp">
          Order on WhatsApp
        </button>
        <button type="button" class="btn-wa-action btn-wa-wholesale" data-shudh-action="wholesale" aria-label="Get Wholesale bulk quote for ${name} via WhatsApp">
          Wholesale on WhatsApp
        </button>
      </div>
    `;
  }

  /**
   * Global Click Delegator
   */
  function handleActionClick(event) {
    const btn = event.target.closest("[data-shudh-action]");
    if (!btn) return;

    event.preventDefault();
    event.stopPropagation();

    const action = btn.getAttribute("data-shudh-action");
    const container = btn.closest(".shudh-order-actions") || btn.closest(".card");
    const card = btn.closest(".card") || btn.closest("article") || btn.closest(".product");

    let productName =
      container?.getAttribute("data-product-name") ||
      btn.getAttribute("data-product-name") ||
      card?.querySelector("h3, h1")?.textContent?.trim() ||
      "Pure Sarbloh Cookware";

    if (action === "wholesale") {
      openWholesaleModal(productName);
    } else if (action === "retail") {
      openRetailModal(productName);
    }
  }

  /**
   * Attach actions to DOM element
   */
  function attachToCard(cardEl, productName, options = {}) {
    if (!cardEl || cardEl.querySelector(".shudh-order-actions")) return;
    const name = productName || cardEl.querySelector("h3, h1")?.textContent?.trim() || "Cookware";
    const wrapper = document.createElement("div");
    wrapper.innerHTML = renderButtonsHtml(name, options);
    cardEl.appendChild(wrapper.firstElementChild);
  }

  /**
   * Initialize module
   */
  function init(options = {}) {
    injectStyles();
    ensureModal();

    // Attach delegated click listener once
    if (!window.__shudhWaClickListenerBound) {
      document.addEventListener("click", handleActionClick);
      window.__shudhWaClickListenerBound = true;
    }

    // Auto-attach to existing cards if requested
    if (options.autoAttach) {
      const cards = document.querySelectorAll(options.selector || ".card");
      cards.forEach((card) => {
        const name = card.querySelector("h3, h1")?.textContent?.trim();
        if (name) attachToCard(card, name);
      });
    }
  }

  // Auto-init on script load when document is ready
  if (typeof document !== "undefined") {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => init());
    } else {
      init();
    }
  }

  return {
    CONFIG,
    init,
    renderButtonsHtml,
    attachToCard,
    openWholesaleModal,
    openRetailModal,
    buildRetailMessage,
    buildWholesaleMessage,
    getRetailWhatsAppUrl,
    getWholesaleWhatsAppUrl,
  };
});
