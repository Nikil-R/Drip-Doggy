import type { Order } from "../types/account";
import { INVOICE_CONFIG } from "./invoice-config";

const cfg = INVOICE_CONFIG.company;
const { currency: curr, taxRate } = INVOICE_CONFIG.defaults;

function formatPrice(n: number) {
  return `${curr}${n.toLocaleString("en-IN")}`;
}

export function generateInvoiceHTML(order: Order, user: { firstName: string; lastName: string; email: string; phone: string }) {
  const subtotal = order.total;
  const gstAmount = subtotal * taxRate;
  const grandTotal = subtotal + gstAmount;

  const itemRows = order.items
    .map(
      (item) => `
      <tr>
        <td class="td-item">
          <span class="product-name">${item.name}</span>
          <span class="product-sku">${item.brand}</span>
        </td>
        <td class="td-meta">${item.size} / ${item.color}</td>
        <td class="td-qty">${item.quantity}</td>
        <td class="td-price">${formatPrice(item.price)}</td>
        <td class="td-amount">${formatPrice(item.price * item.quantity)}</td>
      </tr>`
    )
    .join("");

  return `<!DOCTYPE html>
<html>
<head>
  <title>Invoice — ${order.id}</title>
  <style>
    @page { size: A4; margin: 12mm; }
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: Inter, "Segoe UI", Arial, sans-serif;
      background: #f5f2ed;
      display: flex;
      justify-content: center;
      align-items: flex-start;
      min-height: 100vh;
      padding: 24px 16px;
      color: #1a1410;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .invoice-shell { width: 100%; display: flex; justify-content: center; }
    .invoice-sheet {
      width: min(100%, 820px);
      background: #ffffff;
      padding: 32px 36px;
      box-shadow: 0 2px 24px rgba(0,0,0,0.08);
      border: 1px solid #e8e3dc;
    }

    /* Header */
    .header { display: flex; justify-content: space-between; align-items: flex-start; padding-bottom: 20px; border-bottom: 2px solid #1a1410; margin-bottom: 24px; }
    .brand-name { font-size: 28px; font-weight: 900; letter-spacing: 4px; text-transform: uppercase; line-height: 1; color: #1a1410; }
    .brand-tagline { font-size: 8px; color: #8a7f77; letter-spacing: 2.5px; text-transform: uppercase; margin-top: 4px; font-weight: 600; }
    .brand-gstin { font-size: 8px; color: #224870; letter-spacing: 1.5px; margin-top: 6px; font-weight: 700; }
    .invoice-label { font-size: 10px; font-weight: 700; letter-spacing: 2.5px; text-transform: uppercase; color: #8a7f77; }
    .invoice-id { font-size: 16px; font-weight: 900; margin-top: 2px; color: #224870; }
    .header-meta { font-size: 8.5px; color: #615e56; margin-top: 3px; font-weight: 600; }

    /* Info row */
    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 28px; }
    .info-card { border: 1px solid #e8e3dc; padding: 16px; background: #faf8f5; }
    .info-title { font-size: 8px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #8a7f77; margin-bottom: 8px; }
    .info-value { font-size: 10px; line-height: 1.7; font-weight: 600; color: #1a1410; }
    .info-label { font-size: 7.5px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: #8a7f77; display: block; margin-top: 6px; margin-bottom: 1px; }
    .info-section { padding-bottom: 10px; margin-bottom: 10px; border-bottom: 1px solid #eeeae5; }
    .info-section-title { font-size: 7px; font-weight: 700; letter-spacing: 1.8px; text-transform: uppercase; color: #a89f97; margin-bottom: 3px; }
    .text-muted { color: #615e56; font-weight: 500; }

    /* Table */
    table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
    thead { display: table-header-group; }
    tr { page-break-inside: avoid; }
    th { font-size: 7.5px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #8a7f77; text-align: left; padding: 10px 6px 12px 6px; border-bottom: 2px solid #d4cdc4; }
    td { padding: 10px 6px; border-bottom: 1px solid #eeeae5; font-size: 10px; vertical-align: top; }
    tbody tr:last-child td { border-bottom: 2px solid #d4cdc4; }
    tbody tr:nth-child(even) { background: #faf8f5; }
    .td-item { width: 38%; }
    .td-meta { width: 12%; text-align: center; color: #615e56; font-weight: 600; }
    .td-qty { width: 12%; text-align: center; font-weight: 700; }
    .td-price { width: 19%; text-align: right; font-weight: 600; }
    .td-amount { width: 19%; text-align: right; font-weight: 700; }
    .product-name { display: block; font-weight: 700; font-size: 10px; }
    .product-sku { display: block; font-size: 8px; color: #8a7f77; font-weight: 500; margin-top: 1px; letter-spacing: 0.5px; }
    th.th-right { text-align: right; }
    th.th-center { text-align: center; }
    .tfoot-summary { display: flex; justify-content: flex-end; align-items: center; gap: 24px; padding: 8px 6px 0; font-size: 8px; color: #8a7f77; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase; border-top: none; margin-top: 2px; }
    .tfoot-summary span { display: inline-flex; align-items: center; gap: 4px; }

    /* Totals */
    .totals-box { margin-left: auto; width: 280px; border: 1px solid #e8e3dc; background: #faf8f5; padding: 16px 20px; }
    .total-row { display: flex; justify-content: space-between; align-items: center; padding: 6px 0; font-size: 10px; }
    .total-label { color: #8a7f77; font-weight: 600; letter-spacing: 0.5px; }
    .total-value { font-weight: 700; color: #1a1410; }
    .total-value.txt-free { color: #059669; }
    .total-sep { border: none; border-top: 1px dashed #d4cdc4; margin: 2px 0; }
    .gst-breakdown { font-size: 7.5px; color: #615e56; text-align: right; letter-spacing: 0.3px; padding: 2px 0 6px; }
    .gst-breakdown .gst-badge { display: inline-block; background: #f0ede8; padding: 2px 8px; border-radius: 2px; font-weight: 600; }
    .total-row.grand { border-top: 2px solid #1a1410; padding-top: 10px; margin-top: 2px; }
    .total-row.grand .total-label { font-size: 10px; font-weight: 900; letter-spacing: 1px; text-transform: uppercase; color: #1a1410; }
    .total-row.grand .total-value { font-size: 15px; font-weight: 900; color: #224870; }
    .total-note { font-size: 7px; color: #a89f97; text-align: right; margin-top: 6px; letter-spacing: 0.3px; font-weight: 500; }

    /* Footer */
    .footer { margin-top: 28px; padding-top: 20px; border-top: 1px solid #d4cdc4; text-align: center; }
    .footer-divider { width: 44px; height: 2px; background: #1a1410; margin: 0 auto 14px; }
    .footer-thanks { font-size: 11px; font-weight: 900; letter-spacing: 2.5px; text-transform: uppercase; color: #1a1410; line-height: 1.2; }
    .footer-thanks-sub { font-size: 7.5px; color: #8a7f77; letter-spacing: 2px; text-transform: uppercase; font-weight: 600; margin-top: 3px; }
    .footer-support { font-size: 8px; color: #615e56; margin-top: 14px; font-weight: 600; letter-spacing: 0.3px; }
    .footer-support .sep { color: #d4cdc4; margin: 0 8px; }
    .footer-legal { font-size: 7px; color: #8a7f77; margin-top: 6px; letter-spacing: 0.3px; font-weight: 500; }
    .footer-legal .sep { color: #d4cdc4; margin: 0 6px; }
    .footer-note { font-size: 7px; color: #a89f97; margin-top: 12px; letter-spacing: 0.3px; font-weight: 500; border-top: 1px solid #eeeae5; padding-top: 10px; }

    /* Print */
    @media print {
      body { background: #fff; padding: 0; }
      .invoice-sheet { box-shadow: none; border: none; width: auto; padding: 0; margin: 0; }
      .info-card { background: #faf8f5; }
    }

    /* Screen-only */
    @media screen {
      .invoice-sheet { border: 1px solid #e8e3dc; }
    }
  </style>
</head>
<body>
  <div class="invoice-shell">
    <div class="invoice-sheet">

      <!-- HEADER -->
      <div class="header">
        <div>
          <div class="brand-name">${cfg.name}</div>
          <div class="brand-tagline">${cfg.tagline}</div>
          <div class="brand-gstin">GSTIN: ${cfg.gstin}</div>
        </div>
        <div style="text-align: right;">
          <div class="invoice-label">Tax Invoice</div>
          <div class="invoice-id">${order.id}</div>
          <div class="header-meta">Date: ${order.date}</div>
          <div class="header-meta">Status: ${order.status}</div>
        </div>
      </div>

      <!-- INFO ROW -->
      <div class="info-grid">
        <div class="info-card">
          <div class="info-title">Bill To</div>
          <div class="info-section">
            <div class="info-section-title">Customer</div>
            <div class="info-value">
              <strong>${user.firstName} ${user.lastName}</strong><br />
              <span class="text-muted">${user.email}</span><br />
              <span class="text-muted">${user.phone || '+91 _________'}</span>
            </div>
          </div>
        </div>
        <div class="info-card">
          <div class="info-title">Order Details</div>
          <div class="info-section">
            <div class="info-section-title">Payment Method</div>
            <div class="info-value">Cash on Delivery</div>
          </div>
          <div class="info-section">
            <div class="info-section-title">Order Date</div>
            <div class="info-value">${order.date}</div>
          </div>
          <div class="info-section">
            <div class="info-section-title">Order Status</div>
            <div class="info-value">${order.status}</div>
          </div>
          <div class="info-section" style="border-bottom: none; padding-bottom: 0; margin-bottom: 0;">
            <div class="info-section-title">Invoice No.</div>
            <div class="info-value" style="font-family: 'Courier New', monospace; letter-spacing: 0.5px; color: #224870;">${order.id}</div>
          </div>
        </div>
      </div>

      <!-- ITEMS TABLE -->
      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th class="th-center">Variant</th>
            <th class="th-center">Qty</th>
            <th class="th-right">Price</th>
            <th class="th-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${itemRows}
        </tbody>
        ${order.items.length > 1 ? `<tfoot>
          <tr>
            <td colspan="5" style="padding: 6px 6px 0 6px; border: none;">
              <div class="tfoot-summary">
                <span>\u26C5 ${order.items.length} items</span>
                <span>\u2022</span>
                <span>${order.items.reduce((s, i) => s + i.quantity, 0)} total units</span>
              </div>
            </td>
          </tr>
        </tfoot>` : ""}
      </table>

      <!-- TOTALS -->
      <div class="totals-box">
        <div class="total-row">
          <span class="total-label">Subtotal</span>
          <span class="total-value">${formatPrice(subtotal)}</span>
        </div>
        <hr class="total-sep" />
        <div class="total-row">
          <span class="total-label">Delivery</span>
          <span class="total-value txt-free">FREE</span>
        </div>
        <hr class="total-sep" />
        <div class="total-row">
          <span class="total-label">GST @ 18%</span>
          <span class="total-value">${formatPrice(gstAmount)}</span>
        </div>
        <div class="gst-breakdown">
          <span class="gst-badge">CGST 9%: ${formatPrice(gstAmount / 2)} · SGST 9%: ${formatPrice(gstAmount / 2)}</span>
        </div>
        <div class="total-row grand">
          <span class="total-label">Grand Total</span>
          <span class="total-value">${formatPrice(grandTotal)}</span>
        </div>
        <div class="total-note">Total amount payable (inclusive of all taxes)</div>
      </div>

      <!-- FOOTER -->
      <div class="footer">
        <div class="footer-divider"></div>
        <div class="footer-thanks">Thank You</div>
        <div class="footer-thanks-sub">for shopping with Drip Doggy</div>
        <div class="footer-support">
          ${cfg.email}<span class="sep">|</span>${cfg.phone}<span class="sep">|</span>${cfg.website}
        </div>
        <div class="footer-legal">
          ${cfg.address}<span class="sep">|</span>GSTIN: ${cfg.gstin}
        </div>
        <div class="footer-note">${INVOICE_CONFIG.terms.returnPolicy} — ${INVOICE_CONFIG.terms.paymentNote}</div>
      </div>

    </div>
  </div>
</body>
</html>`;
}

export function generateBillHTML(order: Order, user: { firstName: string; lastName: string; email: string; phone: string }) {
  const subtotal = order.total;
  const cfg = INVOICE_CONFIG.company;

  const itemRows = order.items
    .map(
      (item) => `
      <tr>
        <td class="td-item">
          <span class="item-name">${item.name}</span>
          <span class="item-variant">${item.size ? `Size: ${item.size}` : ""}${item.color ? ` / ${item.color}` : ""}</span>
        </td>
        <td class="td-qty">${item.quantity}</td>
        <td class="td-amount">${formatPrice(item.price * item.quantity)}</td>
      </tr>`
    )
    .join("");

  return `<!DOCTYPE html>
<html>
<head>
  <title>Bill \u2014 ${order.id}</title>
  <style>
    @page { size: A4; margin: 10mm; }
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: "Courier New", "Lucida Console", monospace;
      background: #fff;
      display: flex;
      justify-content: center;
      padding: 20px 16px;
      color: #000;
    }
    .bill-shell { width: 100%; display: flex; justify-content: center; }
    .bill-sheet { width: min(100%, 580px); background: #fff; padding: 24px 28px; }

    .bill-header { text-align: center; margin-bottom: 12px; }
    .bill-store { font-size: 18px; font-weight: 900; letter-spacing: 3px; text-transform: uppercase; }
    .bill-tagline { font-size: 7px; letter-spacing: 2px; text-transform: uppercase; margin-top: 2px; color: #555; }
    .bill-gstin { font-size: 7px; color: #555; margin-top: 4px; }
    .bill-hr { border: none; border-top: 1px dashed #999; margin: 8px 0; }
    .bill-hr-solid { border: none; border-top: 1px solid #999; margin: 8px 0; }

    .bill-info { font-size: 9px; line-height: 1.7; }
    .bill-info-row { display: flex; justify-content: space-between; padding: 1px 0; }
    .bill-info-label { color: #666; }
    .bill-info-value { font-weight: 700; }
    .bill-section-title { font-size: 7px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; margin: 6px 0 3px; border-bottom: 1px solid #ccc; padding-bottom: 2px; }

    .bill-table { width: 100%; border-collapse: collapse; margin: 4px 0; }
    .bill-table th { font-size: 7px; font-weight: 700; text-align: left; padding: 3px 2px; border-bottom: 1px solid #999; text-transform: uppercase; letter-spacing: 0.5px; }
    .bill-table th.th-right { text-align: right; }
    .bill-table td { padding: 4px 2px; font-size: 8.5px; border-bottom: 1px dotted #ddd; vertical-align: top; }
    .bill-table .td-item { width: 60%; }
    .bill-table .td-qty { width: 15%; text-align: center; font-weight: 700; }
    .bill-table .td-amount { width: 25%; text-align: right; font-weight: 700; }
    .bill-table .item-name { font-weight: 700; font-size: 8.5px; }
    .bill-table .item-variant { display: block; font-size: 7px; color: #666; margin-top: 1px; }

    .bill-totals { margin-top: 2px; }
    .bill-total-row { display: flex; justify-content: space-between; padding: 2px 0; font-size: 9px; }
    .bill-total-row.bill-grand { border-top: 2px solid #000; padding-top: 5px; margin-top: 2px; font-weight: 900; font-size: 11px; }

    .bill-footer { text-align: center; margin-top: 12px; padding-top: 8px; border-top: 1px dashed #999; }
    .bill-footer-thanks { font-size: 8px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; }
    .bill-footer-contact { font-size: 7px; color: #666; margin-top: 3px; }

    @media print {
      body { padding: 0; }
      .bill-sheet { width: auto; padding: 0; margin: 0; box-shadow: none; border: none; }
    }
  </style>
</head>
<body>
  <div class="bill-shell">
    <div class="bill-sheet">

      <div class="bill-header">
        <div class="bill-store">${cfg.name}</div>
        <div class="bill-tagline">${cfg.tagline}</div>
        <div class="bill-gstin">GSTIN: ${cfg.gstin}</div>
      </div>

      <hr class="bill-hr-solid" />

      <div class="bill-info">
        <div class="bill-info-row">
          <span class="bill-info-label">Order</span>
          <span class="bill-info-value">${order.id}</span>
        </div>
        <div class="bill-info-row">
          <span class="bill-info-label">Date</span>
          <span class="bill-info-value">${order.date}</span>
        </div>
        <div class="bill-info-row">
          <span class="bill-info-label">Status</span>
          <span>${order.status}</span>
        </div>
      </div>

      <div class="bill-section-title">Bill To</div>
      <div class="bill-info">
        <div class="bill-info-row">
          <span class="bill-info-label">Customer</span>
          <span class="bill-info-value">${user.firstName} ${user.lastName}</span>
        </div>
        <div class="bill-info-row">
          <span class="bill-info-label">Contact</span>
          <span>${user.email}${user.phone ? ` | ${user.phone}` : ""}</span>
        </div>
      </div>

      <div class="bill-section-title">Items</div>
      <table class="bill-table">
        <thead>
          <tr>
            <th>Item</th>
            <th class="th-right">Qty</th>
            <th class="th-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${itemRows}
        </tbody>
      </table>

      <div class="bill-totals">
        <div class="bill-total-row">
          <span>Subtotal</span>
          <span>${formatPrice(subtotal)}</span>
        </div>
        <div class="bill-total-row">
          <span>Delivery</span>
          <span>FREE</span>
        </div>
        <div class="bill-total-row bill-grand">
          <span>TOTAL</span>
          <span>${formatPrice(subtotal)}</span>
        </div>
      </div>

      <div class="bill-footer">
        <div class="bill-footer-thanks">Thank you for your order!</div>
        <div class="bill-footer-contact">${cfg.email} | ${cfg.phone} | ${cfg.website}</div>
        <div class="bill-footer-contact" style="margin-top: 2px;">${cfg.address}</div>
      </div>

    </div>
  </div>
</body>
</html>`;
}

export function printBill(order: Order, user: { firstName: string; lastName: string; email: string; phone: string }) {
  const html = generateBillHTML(order, user);
  const iframe = document.createElement("iframe");
  iframe.style.position = "absolute";
  iframe.style.width = "0px";
  iframe.style.height = "0px";
  iframe.style.border = "none";
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document || iframe.contentDocument;
  if (doc) {
    doc.open();
    doc.write(html);
    doc.close();
  }

  setTimeout(() => {
    iframe.contentWindow?.focus();
    iframe.contentWindow?.print();
    document.body.removeChild(iframe);
  }, 500);
}

export function printInvoice(order: Order, user: { firstName: string; lastName: string; email: string; phone: string }) {
  const html = generateInvoiceHTML(order, user);
  
  // Create hidden iframe
  const iframe = document.createElement("iframe");
  iframe.style.position = "absolute";
  iframe.style.width = "0px";
  iframe.style.height = "0px";
  iframe.style.border = "none";
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document || iframe.contentDocument;
  if (doc) {
    doc.open();
    doc.write(html);
    doc.close();
  }

  // Trigger print after iframe renders
  setTimeout(() => {
    iframe.contentWindow?.focus();
    iframe.contentWindow?.print();
    // Clean up iframe from DOM
    document.body.removeChild(iframe);
  }, 500);
}
