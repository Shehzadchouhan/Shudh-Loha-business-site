/**
 * SHUDH LOHA — B2B WHOLESALE CATALOG & RATE CARD MODAL MODULE
 * Direct Foundry Supply from Malerkotla, Punjab
 *
 * Gated B2B lead capture modal collecting:
 * 1. Business Name (Dhaba, Restaurant, Caterer, Wholesaler)
 * 2. City / Transport Mandi destination
 * 3. WhatsApp Number
 * 4. Contact Person / Name (Optional)
 * 5. Primary Cookware Category Needed
 *
 * Securely submits the lead to Supabase (`leads` table with kind: 'form')
 * and immediately unlocks and opens the Wholesale Catalog & Rate Card (PDF)
 * or WhatsApp chat with pre-filled buyer details.
 */

(function (root, factory) {
  if (typeof define === "function" && define.amd) {
    define([], factory);
  } else if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.B2BCatalogModal = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  const CONFIG = {
    whatsappNumber: "917973247767",
    catalogUrl: "wholesale-catalog.html",
    modalId: "catalogModal",
    formId: "b2bCatalogForm",
    statusId: "b2bStatus",
  };

  const STYLES_ID = "shudhCatalogModalStyles";

  /**
   * Phone number validator
   */
  function isValidPhone(phone) {
    if (!phone) return false;
    const cleaned = String(phone).replace(/\s+/g, "");
    return /^[+\d][\d\s()-]{7,15}$/.test(cleaned);
  }

  /**
   * Build WhatsApp message for B2B catalog request
   */
  function buildWholesaleCatalogMessage(data) {
    const business = (data.business || "").trim() || "Commercial Buyer";
    const city = (data.city || "").trim() || "India";
    const phone = (data.phone || "").trim();
    const name = (data.name || "").trim();
    const requirement = (data.requirement || "").trim();

    const lines = [
      "📋 *COMMERCIAL B2B WHOLESALE CATALOG & RATE CARD REQUEST*",
      "*Shudh Loha Foundry — Malerkotla, Punjab*",
      "──────────────────────────────",
      `• *Business / Kitchen:* ${business}`,
      `• *City / Transport Mandi:* ${city}`,
      phone ? `• *WhatsApp Number:* ${phone}` : "",
      name ? `• *Contact Person:* ${name}` : "",
      requirement ? `• *Primary Requirement:* ${requirement}` : "",
      "• *Supply Type:* Direct Foundry Bulk Supply",
      "• *Billing:* GST Invoicing Required",
      "──────────────────────────────",
      `Hi Shudh Loha factory team, I just requested your Wholesale Catalog & Rate Card for ${business} in ${city}. Please share distributor pricing, bulk rate slab, and transport mandi freight options.`,
    ].filter(Boolean);

    return lines.join("\n");
  }

  function getWhatsAppUrl(data) {
    const message = buildWholesaleCatalogMessage(data);
    return `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
  }

  /**
   * Inject styles if not present
   */
  function injectStyles() {
    if (typeof document === "undefined" || document.getElementById(STYLES_ID)) return;
    const style = document.createElement("style");
    style.id = STYLES_ID;
    style.textContent = `
      .catalog-modal-backdrop {
        position: fixed;
        inset: 0;
        z-index: 9999;
        background: rgba(18, 16, 14, 0.82);
        backdrop-filter: blur(6px);
        display: grid;
        place-items: center;
        padding: 16px;
        overflow-y: auto;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.25s ease;
        box-sizing: border-box;
      }
      .catalog-modal-backdrop.is-open {
        opacity: 1;
        pointer-events: auto;
      }
      .catalog-modal-dialog {
        background: #ffffff;
        color: #171717;
        width: min(620px, 100%);
        max-height: 92vh;
        overflow-y: auto;
        padding: 32px 28px;
        border-radius: 4px;
        border: 1px solid #b88a24;
        box-shadow: 0 24px 64px rgba(0, 0, 0, 0.45);
        position: relative;
        transform: translateY(18px) scale(0.98);
        transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        box-sizing: border-box;
      }
      .catalog-modal-backdrop.is-open .catalog-modal-dialog {
        transform: translateY(0) scale(1);
      }
      .catalog-modal-close {
        position: absolute;
        top: 14px;
        right: 14px;
        width: 34px;
        height: 34px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(0, 0, 0, 0.05);
        border: 1px solid rgba(0, 0, 0, 0.08);
        border-radius: 50%;
        font-size: 20px;
        line-height: 1;
        color: #555;
        cursor: pointer;
        padding: 0;
        transition: all 0.2s ease;
        z-index: 10;
      }
      .catalog-modal-close:hover {
        background: #171717;
        color: #ffffff;
        border-color: #171717;
      }
      .catalog-modal-badge {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        background: #b88a24;
        color: #171717;
        font-size: 10px;
        font-weight: 800;
        letter-spacing: 1.5px;
        text-transform: uppercase;
        padding: 4px 10px;
        border-radius: 2px;
        margin-bottom: 10px;
      }
      .catalog-badge-dot {
        width: 6px;
        height: 6px;
        background: #171717;
        border-radius: 50%;
      }
      .catalog-modal-title {
        font-family: Didot, "Bodoni MT", "Times New Roman", serif;
        font-size: 26px;
        font-weight: 700;
        margin: 0 0 8px;
        line-height: 1.15;
        color: #171717;
      }
      .catalog-modal-desc {
        color: #555047;
        font-size: 13.5px;
        margin: 0 0 14px;
        line-height: 1.5;
      }
      .catalog-trust-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-bottom: 18px;
        padding-bottom: 16px;
        border-bottom: 1px solid rgba(20, 18, 16, 0.12);
      }
      .catalog-tag {
        font-size: 11px;
        font-weight: 700;
        color: #2c2925;
        background: #f5f2eb;
        padding: 3px 8px;
        border-radius: 2px;
        border: 1px solid rgba(184, 138, 36, 0.25);
      }
      .catalog-form-grid {
        display: grid;
        gap: 13px;
      }
      .catalog-field-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
      }
      .catalog-field-group {
        display: grid;
        gap: 5px;
      }
      .catalog-field-group label {
        font-size: 11.5px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        color: #433e38;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .required-star {
        color: #c7653e;
        margin-left: 2px;
      }
      .optional-label {
        font-size: 10px;
        color: #888;
        font-weight: 400;
        text-transform: none;
      }
      .catalog-form-grid input,
      .catalog-form-grid select {
        width: 100%;
        padding: 10px 12px;
        border: 1px solid rgba(20, 18, 16, 0.18);
        border-radius: 2px;
        font: inherit;
        font-size: 13.5px;
        background: #fdfcf9;
        color: #171717;
        box-sizing: border-box;
        transition: border-color 0.2s, box-shadow 0.2s;
      }
      .catalog-form-grid input:focus,
      .catalog-form-grid select:focus {
        outline: none;
        border-color: #b88a24;
        box-shadow: 0 0 0 3px rgba(184, 138, 36, 0.18);
        background: #ffffff;
      }
      .catalog-input-with-prefix {
        display: flex;
        align-items: stretch;
        border: 1px solid rgba(20, 18, 16, 0.18);
        border-radius: 2px;
        background: #fdfcf9;
        overflow: hidden;
        box-sizing: border-box;
      }
      .catalog-input-prefix {
        display: flex;
        align-items: center;
        padding: 0 10px;
        background: #f1ebd9;
        font-size: 12.5px;
        font-weight: 700;
        color: #4a453e;
        border-right: 1px solid rgba(20, 18, 16, 0.15);
        user-select: none;
      }
      .catalog-input-with-prefix input {
        border: none !important;
        border-radius: 0 !important;
        background: transparent !important;
        box-shadow: none !important;
        flex: 1;
        padding: 10px 12px;
      }
      .catalog-input-with-prefix:focus-within {
        border-color: #b88a24;
        box-shadow: 0 0 0 3px rgba(184, 138, 36, 0.18);
        background: #ffffff;
      }
      .catalog-action-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
        margin-top: 6px;
      }
      .catalog-btn {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 12px 14px;
        border-radius: 2px;
        font: inherit;
        cursor: pointer;
        text-align: left;
        text-decoration: none;
        border: 1px solid transparent;
        transition: transform 0.15s ease, background 0.2s ease, box-shadow 0.2s ease;
        box-sizing: border-box;
      }
      .catalog-btn:hover {
        transform: translateY(-1px);
      }
      .catalog-btn-primary {
        background: #b88a24;
        color: #171717;
        border-color: #a47816;
        box-shadow: 0 4px 14px rgba(184, 138, 36, 0.28);
      }
      .catalog-btn-primary:hover {
        background: #caa038;
        box-shadow: 0 6px 18px rgba(184, 138, 36, 0.38);
      }
      .catalog-btn-whatsapp {
        background: #25d366;
        color: #ffffff;
        border-color: #1fa752;
        box-shadow: 0 4px 14px rgba(37, 211, 102, 0.25);
      }
      .catalog-btn-whatsapp:hover {
        background: #20bd5a;
        box-shadow: 0 6px 18px rgba(37, 211, 102, 0.35);
      }
      .catalog-btn-icon {
        font-size: 20px;
        flex-shrink: 0;
        line-height: 1;
      }
      .catalog-btn-text {
        display: flex;
        flex-direction: column;
        gap: 2px;
      }
      .catalog-btn-text strong {
        font-size: 13px;
        font-weight: 800;
        line-height: 1.2;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      .catalog-btn-text small {
        font-size: 10.5px;
        opacity: 0.9;
        font-weight: 500;
      }
      .catalog-privacy-note {
        font-size: 11px;
        color: #767067;
        text-align: center;
        margin-top: 4px;
      }
      .catalog-status {
        min-height: 22px;
        font-size: 12.5px;
        font-weight: 600;
        margin-top: 4px;
        text-align: center;
      }
      .catalog-status.is-error {
        color: #b02a37;
        background: #fff5f5;
        padding: 6px 10px;
        border: 1px solid #f5c2c7;
        border-radius: 2px;
      }
      .catalog-status.is-loading {
        color: #5b554d;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
      }
      .catalog-spinner {
        width: 14px;
        height: 14px;
        border: 2px solid rgba(184, 138, 36, 0.25);
        border-top-color: #b88a24;
        border-radius: 50%;
        animation: catalogSpin 0.7s linear infinite;
      }
      @keyframes catalogSpin {
        to { transform: rotate(360deg); }
      }
      .catalog-modal-success-view {
        text-align: center;
        padding: 10px 0;
      }
      .catalog-success-badge {
        width: 58px;
        height: 58px;
        margin: 0 auto 16px;
        border-radius: 50%;
        background: #e8f5e9;
        border: 2px solid #2e7d32;
        display: grid;
        place-items: center;
        color: #2e7d32;
        font-size: 28px;
        font-weight: 800;
        animation: catalogPop 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      }
      @keyframes catalogPop {
        0% { transform: scale(0.4); opacity: 0; }
        100% { transform: scale(1); opacity: 1; }
      }
      .catalog-success-title {
        font-family: Didot, "Bodoni MT", "Times New Roman", serif;
        font-size: 26px;
        margin: 0 0 8px;
        color: #171717;
      }
      .catalog-success-desc {
        color: #555047;
        font-size: 14px;
        line-height: 1.5;
        max-width: 500px;
        margin: 0 auto 24px;
      }
      .catalog-unlocked-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 14px;
        margin-bottom: 24px;
        text-align: left;
      }
      .catalog-unlocked-card {
        display: flex;
        gap: 14px;
        padding: 18px 16px;
        border: 1px solid rgba(20, 18, 16, 0.15);
        border-radius: 3px;
        background: #ffffff;
        text-decoration: none;
        color: inherit;
        transition: all 0.2s ease;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
        box-sizing: border-box;
      }
      .catalog-unlocked-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
        border-color: #b88a24;
      }
      .catalog-unlocked-card--catalog:hover {
        border-color: #b88a24;
        background: #fffdf9;
      }
      .catalog-unlocked-card--wa:hover {
        border-color: #25d366;
        background: #f6fff8;
      }
      .unlocked-card-icon {
        font-size: 28px;
        line-height: 1;
        flex-shrink: 0;
      }
      .unlocked-card-body h3 {
        font-size: 15px;
        font-weight: 700;
        margin: 0 0 4px;
        color: #171717;
      }
      .unlocked-card-body p {
        font-size: 12px;
        color: #5b554d;
        margin: 0 0 10px;
        line-height: 1.4;
      }
      .unlocked-card-action {
        font-size: 12px;
        font-weight: 800;
        color: #b88a24;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      .catalog-unlocked-card--wa .unlocked-card-action {
        color: #1e7d32;
      }
      .catalog-btn-secondary {
        background: #f1ebd9;
        border: 1px solid rgba(20, 18, 16, 0.15);
        color: #171717;
        font-weight: 700;
        padding: 10px 22px;
        font-size: 13px;
        border-radius: 2px;
        cursor: pointer;
        transition: background 0.2s ease;
      }
      .catalog-btn-secondary:hover {
        background: #e5ddc7;
      }
      @media (max-width: 640px) {
        .catalog-field-row {
          grid-template-columns: 1fr;
        }
        .catalog-action-row {
          grid-template-columns: 1fr;
        }
        .catalog-unlocked-grid {
          grid-template-columns: 1fr;
        }
        .catalog-modal-dialog {
          padding: 24px 18px;
        }
      }
    `;
    document.head.appendChild(style);
  }

  /**
   * Ensure modal exists in DOM. If missing (e.g. on products.html), dynamically inject it.
   */
  function ensureModalHtml() {
    injectStyles();
    let modal = document.getElementById(CONFIG.modalId);
    if (modal) return modal;

    const modalMarkup = `
      <div
        class="catalog-modal-backdrop"
        id="catalogModal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="catalogModalTitle"
        hidden
      >
        <div class="catalog-modal-dialog">
          <button
            class="catalog-modal-close"
            id="catalogModalClose"
            type="button"
            aria-label="Close wholesale catalog modal"
          >
            &times;
          </button>

          <!-- Initial Form View -->
          <div class="catalog-modal-form-view" id="catalogModalFormView">
            <div class="catalog-modal-header">
              <div class="catalog-modal-badge">
                <span class="catalog-badge-dot"></span> DIRECT FOUNDRY SPECIFICATION &amp; RATE CARD
              </div>
              <h2 class="catalog-modal-title" id="catalogModalTitle">
                Request Wholesale Catalog &amp; Rate Card
              </h2>
              <p class="catalog-modal-desc">
                Direct Malerkotla foundry rates for Dhabas, Restaurants, Caterers, Gurdwaras &amp; Wholesalers.
                Enter your business details below for instant access to our factory spec sheet, gauges (4.0mm–6.0mm), MOQs, and transport delivery terms.
              </p>
              <div class="catalog-trust-tags">
                <span class="catalog-tag">✓ Direct Malerkotla Foundry</span>
                <span class="catalog-tag">✓ Pan-India Transport Mandi Delivery</span>
                <span class="catalog-tag">✓ Verified GST Invoicing</span>
              </div>
            </div>

            <form id="b2bCatalogForm" class="catalog-form-grid" novalidate>
              <div class="catalog-field-row">
                <div class="catalog-field-group">
                  <label for="b2bBusiness">
                    Business / Kitchen Name <span class="required-star">*</span>
                  </label>
                  <input
                    type="text"
                    id="b2bBusiness"
                    name="business"
                    placeholder="e.g. Highway Dhaba / Royal Caterers / Singla Steel"
                    required
                    autocomplete="organization"
                  />
                </div>
                <div class="catalog-field-group">
                  <label for="b2bCity">
                    City / Transport Mandi <span class="required-star">*</span>
                  </label>
                  <input
                    type="text"
                    id="b2bCity"
                    name="city"
                    placeholder="e.g. Ludhiana, Delhi Mandi, Jaipur"
                    required
                    autocomplete="address-level2"
                  />
                </div>
              </div>

              <div class="catalog-field-row">
                <div class="catalog-field-group">
                  <label for="b2bPhone">
                    WhatsApp Number <span class="required-star">*</span>
                  </label>
                  <div class="catalog-input-with-prefix">
                    <span class="catalog-input-prefix">+91</span>
                    <input
                      type="tel"
                      id="b2bPhone"
                      name="phone"
                      inputmode="tel"
                      placeholder="10-digit mobile number"
                      required
                      autocomplete="tel"
                    />
                  </div>
                </div>
                <div class="catalog-field-group">
                  <label for="b2bName">
                    Buyer / Contact Name <span class="optional-label">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    id="b2bName"
                    name="name"
                    placeholder="e.g. Gurpreet Singh / Owner"
                    autocomplete="name"
                  />
                </div>
              </div>

              <div class="catalog-field-group">
                <label for="b2bRequirement">
                  Cookware Requirement / Estimated Volume
                </label>
                <select id="b2bRequirement" name="requirement">
                  <option value="Commercial Tikki Tavis (16-24 inch, 5mm-6mm)">Commercial Tikki Tavis (16"–24", 5mm–6mm Heavy Gauge)</option>
                  <option value="Commercial Deep Kadhais (14-36+ inch)">Commercial Deep Kadhais (14"–36"+ Pure Sarbloh)</option>
                  <option value="Heavy Commercial Degs & Patilas (5kg-50kg)">Heavy Commercial Degs &amp; Patilas (5kg–50kg Capacity)</option>
                  <option value="Commercial Karchis, Spoons & Skimmers">Commercial Karchis, Spoons &amp; Skimmers (Jharna / Palta)</option>
                  <option value="Complete Dhaba / Commercial Kitchen Setup">Complete Dhaba / Restaurant Kitchen Setup</option>
                  <option value="Wholesale Reseller / Hardware Distributor Lot (100+ pcs)">Wholesale Reseller / Hardware Distributor Lot (100+ pcs)</option>
                  <option value="Full Product Range / General Rate Sheet">Full Product Range / General Rate Sheet</option>
                </select>
              </div>

              <!-- Action buttons -->
              <div class="catalog-action-row">
                <button
                  type="submit"
                  class="catalog-btn catalog-btn-primary"
                  id="b2bSubmitCatalogBtn"
                  data-action="catalog"
                >
                  <span class="catalog-btn-icon">📥</span>
                  <span class="catalog-btn-text">
                    <strong>Unlock &amp; View Catalog (PDF)</strong>
                    <small>Instant access to specifications &amp; rate card</small>
                  </span>
                </button>

                <button
                  type="submit"
                  class="catalog-btn catalog-btn-whatsapp"
                  id="b2bSubmitWhatsappBtn"
                  data-action="whatsapp"
                >
                  <span class="catalog-btn-icon">💬</span>
                  <span class="catalog-btn-text">
                    <strong>Get Rate Card on WhatsApp</strong>
                    <small>Direct factory chat with Malerkotla dispatch</small>
                  </span>
                </button>
              </div>

              <div class="catalog-privacy-note">
                🔒 Direct factory supply · No spam · Your details are used strictly for quotation &amp; transport freight calculation.
              </div>

              <div class="catalog-status" id="b2bStatus" role="status" aria-live="polite"></div>
            </form>
          </div>

          <!-- Success / Unlocked View (Shown after submission) -->
          <div class="catalog-modal-success-view" id="catalogModalSuccessView" hidden>
            <div class="catalog-success-badge">
              <span class="catalog-success-check">✓</span>
            </div>
            <h2 class="catalog-success-title">Wholesale Catalog &amp; Rate Card Unlocked!</h2>
            <p class="catalog-success-desc" id="catalogSuccessDesc">
              Thank you! Your direct factory inquiry has been registered. You can now download our specification sheet or connect directly with our dispatch team.
            </p>

            <div class="catalog-unlocked-grid">
              <a
                class="catalog-unlocked-card catalog-unlocked-card--catalog"
                id="unlockedCatalogLink"
                href="wholesale-catalog.html"
                target="_blank"
                rel="noopener"
              >
                <div class="unlocked-card-icon">📄</div>
                <div class="unlocked-card-body">
                  <h3>View / Download B2B Rate Sheet</h3>
                  <p>Complete sizes, weights, gauge thickness (4mm–6mm), MOQs &amp; GST billing terms.</p>
                  <span class="unlocked-card-action">Open Printable Catalog →</span>
                </div>
              </a>

              <a
                class="catalog-unlocked-card catalog-unlocked-card--wa"
                id="unlockedWhatsappLink"
                href="#"
                target="_blank"
                rel="noopener"
              >
                <div class="unlocked-card-icon">💬</div>
                <div class="unlocked-card-body">
                  <h3>Chat with Factory Dispatch</h3>
                  <p>Direct WhatsApp negotiation for custom orders, bulk discounts &amp; transport mandi freight.</p>
                  <span class="unlocked-card-action">Open WhatsApp (+91 79732 47767) →</span>
                </div>
              </a>
            </div>

            <div class="catalog-success-footer">
              <button type="button" class="catalog-btn-secondary" id="catalogDoneBtn">
                Done / Return to Website
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    const wrapper = document.createElement("div");
    wrapper.innerHTML = modalMarkup.trim();
    modal = wrapper.firstElementChild;
    document.body.appendChild(modal);
    return modal;
  }

  /**
   * Open the catalog modal
   */
  function open(prefill = {}) {
    const modal = ensureModalHtml();
    if (!modal) return;

    // Reset view to form if was in success state
    const formView = document.getElementById("catalogModalFormView");
    const successView = document.getElementById("catalogModalSuccessView");
    if (formView) formView.hidden = false;
    if (successView) successView.hidden = true;

    // Clear any previous error/status
    const status = document.getElementById(CONFIG.statusId);
    if (status) {
      status.textContent = "";
      status.className = "catalog-status";
    }

    // Prefill fields if provided
    if (prefill.business) {
      const bField = document.getElementById("b2bBusiness");
      if (bField) bField.value = prefill.business;
    }
    if (prefill.city) {
      const cField = document.getElementById("b2bCity");
      if (cField) cField.value = prefill.city;
    }
    if (prefill.requirement) {
      const rField = document.getElementById("b2bRequirement");
      if (rField) rField.value = prefill.requirement;
    }

    modal.hidden = false;
    requestAnimationFrame(() => {
      modal.classList.add("is-open");
    });
    document.body.style.overflow = "hidden";

    // Track lead view
    if (typeof window.shudhTrackLead === "function") {
      try {
        window.shudhTrackLead("form", "Opened Wholesale Catalog Modal");
      } catch (e) {
        console.warn("Track lead view error:", e);
      }
    }

    // Auto-focus first empty required input
    setTimeout(() => {
      const businessInput = document.getElementById("b2bBusiness");
      if (businessInput && !businessInput.value) {
        businessInput.focus();
      } else {
        const phoneInput = document.getElementById("b2bPhone");
        if (phoneInput) phoneInput.focus();
      }
    }, 150);
  }

  /**
   * Close the catalog modal
   */
  function close() {
    const modal = document.getElementById(CONFIG.modalId);
    if (!modal) return;

    modal.classList.remove("is-open");
    document.body.style.overflow = "";

    setTimeout(() => {
      modal.hidden = true;
      const status = document.getElementById(CONFIG.statusId);
      if (status) {
        status.textContent = "";
        status.className = "catalog-status";
      }
    }, 240);
  }

  /**
   * Handle form submission
   */
  async function handleSubmit(event) {
    event.preventDefault();

    const form = event.target;
    const status = document.getElementById(CONFIG.statusId);
    const submitBtnCatalog = document.getElementById("b2bSubmitCatalogBtn");
    const submitBtnWhatsapp = document.getElementById("b2bSubmitWhatsappBtn");

    // Detect which button was clicked
    const submitter = event.submitter || document.activeElement;
    const requestedAction = submitter?.getAttribute("data-action") || "catalog";

    const business = (document.getElementById("b2bBusiness")?.value || "").trim();
    const city = (document.getElementById("b2bCity")?.value || "").trim();
    const phone = (document.getElementById("b2bPhone")?.value || "").trim();
    const name = (document.getElementById("b2bName")?.value || "").trim();
    const requirement = document.getElementById("b2bRequirement")?.value || "";

    // Validation
    if (!business) {
      if (status) {
        status.className = "catalog-status is-error";
        status.textContent = "Please enter your Business or Kitchen name.";
      }
      document.getElementById("b2bBusiness")?.focus();
      return;
    }

    if (!city) {
      if (status) {
        status.className = "catalog-status is-error";
        status.textContent = "Please enter your City or Delivery Transport Destination.";
      }
      document.getElementById("b2bCity")?.focus();
      return;
    }

    if (!isValidPhone(phone)) {
      if (status) {
        status.className = "catalog-status is-error";
        status.textContent = "Please enter a valid 10-digit WhatsApp or mobile number.";
      }
      document.getElementById("b2bPhone")?.focus();
      return;
    }

    // Disable buttons and show loading state
    if (submitBtnCatalog) submitBtnCatalog.disabled = true;
    if (submitBtnWhatsapp) submitBtnWhatsapp.disabled = true;

    if (status) {
      status.className = "catalog-status is-loading";
      status.innerHTML = `
        <span class="catalog-spinner"></span>
        Submitting inquiry &amp; unlocking factory direct rate card...
      `;
    }

    const leadPayload = {
      business,
      city,
      phone,
      name,
      requirement,
      action: requestedAction,
    };

    const leadMessage = `[Wholesale Catalog & Rate Card Request] Business: ${business}, City: ${city}${requirement ? ', Requirement: ' + requirement : ''}, Preferred Action: ${requestedAction}`;

    // 1. Submit lead to Supabase
    try {
      if (window.shudhSupabase) {
        const { error } = await window.shudhSupabase.from("leads").insert({
          kind: "form",
          name: name ? `${name} (${business})` : business,
          phone: phone,
          message: leadMessage,
          page_url: window.location.href,
        });
        if (error) {
          console.warn("Supabase lead submission warning:", error);
        }
      }
    } catch (err) {
      console.warn("Supabase lead submission exception:", err);
    }

    // 2. Track lead via global helper
    if (typeof window.shudhTrackLead === "function") {
      try {
        window.shudhTrackLead("form", "Wholesale Catalog Request");
      } catch (e) {
        console.warn("Track lead error:", e);
      }
    }

    // 3. Save to localStorage as backup record & unlock flag
    try {
      localStorage.setItem("shudh_b2b_catalog_unlocked", "1");
      const existing = JSON.parse(localStorage.getItem("shudh_b2b_leads") || "[]");
      existing.push({ ...leadPayload, timestamp: new Date().toISOString() });
      localStorage.setItem("shudh_b2b_leads", JSON.stringify(existing.slice(-10)));
    } catch (e) {
      // quota or private mode fallback
    }

    // 4. Prepare Destination URLs
    const waUrl = getWhatsAppUrl(leadPayload);
    const catalogUrl = CONFIG.catalogUrl;

    // 5. Update Success View in Modal
    const formView = document.getElementById("catalogModalFormView");
    const successView = document.getElementById("catalogModalSuccessView");
    const successDesc = document.getElementById("catalogSuccessDesc");
    const unlockedCatalogLink = document.getElementById("unlockedCatalogLink");
    const unlockedWhatsappLink = document.getElementById("unlockedWhatsappLink");

    if (successDesc) {
      successDesc.textContent = `Thank you, ${name || business}! Your factory inquiry for ${city} has been received. Your wholesale rate sheet is now unlocked.`;
    }

    if (unlockedCatalogLink) {
      unlockedCatalogLink.href = catalogUrl;
    }
    if (unlockedWhatsappLink) {
      unlockedWhatsappLink.href = waUrl;
    }

    if (formView) formView.hidden = true;
    if (successView) successView.hidden = false;

    // Re-enable buttons for next time
    if (submitBtnCatalog) submitBtnCatalog.disabled = false;
    if (submitBtnWhatsapp) submitBtnWhatsapp.disabled = false;

    // 6. Immediately open requested destination in a new window/tab
    const targetUrl = requestedAction === "whatsapp" ? waUrl : catalogUrl;
    try {
      const opened = window.open(targetUrl, "_blank", "noopener,noreferrer");
      if (!opened || opened.closed || typeof opened.closed === "undefined") {
        console.log("Popup blocked by browser; direct links are presented on screen.");
      }
    } catch (e) {
      console.log("window.open exception:", e);
    }
  }

  /**
   * Global event delegator for trigger clicks
   */
  function handleTriggerClick(e) {
    const trigger = e.target.closest(".open-catalog-trigger, [data-open-catalog], [href='#catalogModal'], #downloadSpecSheetBtn");
    if (!trigger) return;

    // Avoid hijacking if it's the unlocked catalog link itself
    if (trigger.id === "unlockedCatalogLink") return;

    e.preventDefault();
    open();
  }

  /**
   * Bind events
   */
  function bindEvents() {
    // Click delegation for opening triggers
    document.addEventListener("click", handleTriggerClick);

    // Modal close button
    document.addEventListener("click", (e) => {
      if (e.target.closest("#catalogModalClose") || e.target.closest("#catalogDoneBtn")) {
        e.preventDefault();
        close();
      }
    });

    // Backdrop click
    document.addEventListener("click", (e) => {
      const modal = document.getElementById(CONFIG.modalId);
      if (modal && e.target === modal) {
        close();
      }
    });

    // Escape key
    document.addEventListener("keydown", (e) => {
      const modal = document.getElementById(CONFIG.modalId);
      if (e.key === "Escape" && modal && !modal.hidden) {
        close();
      }
    });

    // Form submit
    document.addEventListener("submit", (e) => {
      if (e.target.id === CONFIG.formId) {
        handleSubmit(e);
      }
    });
  }

  /**
   * Initialize module
   */
  function init() {
    injectStyles();
    ensureModalHtml();
    bindEvents();
  }

  // Auto-initialize when DOM is ready
  if (typeof document !== "undefined") {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", init);
    } else {
      init();
    }
  }

  return {
    CONFIG,
    init,
    open,
    close,
    handleSubmit,
    buildWholesaleCatalogMessage,
    getWhatsAppUrl,
  };
});
