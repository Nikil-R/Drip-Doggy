import type { Order } from "../types/account";
import { INVOICE_CONFIG } from "./invoice-config";
import logoIcon from "../../assets/new_logo_icon.png";
import logoImg from "../../assets/logo.png";

const cfg = INVOICE_CONFIG.company;
const { currency: curr } = INVOICE_CONFIG.defaults;

function formatPrice(n: number) {
  return `${curr}${n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function generateInvoiceHTML(order: Order, user: { firstName: string; lastName: string; email: string; phone: string }) {
  const shippingFee = order.shippingFee !== undefined ? order.shippingFee : 0;
  const discount = order.discount !== undefined ? order.discount : 0;
  const subtotal = order.items.reduce((s, i) => s + (i.price * i.quantity), 0);
  const grandTotal = order.total;

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

  const addressParts = order.destinationAddress
    ? [order.destinationAddress.replace(/_/g, " ").replace(/,/g, " ").trim()]
    : ["Bangalore Karnataka"];

  return `<!DOCTYPE html>
<html>
<head>
  <title>Invoice \u2014 ${order.id}</title>
  <style>
    @page {
      size: A4;
      margin: 12mm 15mm;
    }
    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #030213;
      background: #ffffff;
      line-height: 1.5;
      font-size: 11px;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .invoice-shell {
      width: 100%;
      display: flex;
      justify-content: center;
    }
    .invoice-sheet {
      width: 100%;
      max-width: 800px;
      background: #ffffff;
    }

    /* Header */
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      padding-bottom: 25px;
      border-bottom: 2px solid #030213;
      margin-bottom: 30px;
    }
    .logo-container {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 2px;
    }
    .brand-tagline {
      font-size: 8.5px;
      font-weight: 800;
      letter-spacing: 2px;
      text-transform: uppercase;
      color: #52525b;
      margin-top: 4px;
    }
    .invoice-meta-container {
      text-align: right;
    }
    .invoice-label {
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 3px;
      text-transform: uppercase;
      color: #71717a;
    }
    .meta-details {
      margin-top: 8px;
      display: flex;
      flex-direction: column;
      gap: 3px;
    }
    .meta-row {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
    }
    .meta-lbl {
      color: #71717a;
      font-weight: 500;
    }
    .meta-val {
      font-weight: 700;
    }

    /* Info card */
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 25px;
    }
    .info-card {
      border: 1px solid #e4e4e7;
      padding: 16px 20px;
      background: #fafafa;
    }
    .info-title {
      font-size: 9px;
      font-weight: 800;
      letter-spacing: 2.5px;
      text-transform: uppercase;
      color: #71717a;
      margin-bottom: 12px;
      border-bottom: 1px solid #e4e4e7;
      padding-bottom: 6px;
    }
    .info-value {
      font-size: 10.5px;
      line-height: 1.6;
      color: #18181b;
    }
    .text-muted {
      color: #71717a;
    }

    /* Table */
    .table-container {
      margin-bottom: 30px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
    }
    th {
      font-size: 8.5px;
      font-weight: 800;
      letter-spacing: 2px;
      text-transform: uppercase;
      color: #71717a;
      text-align: left;
      padding: 12px 14px;
      border-bottom: 2px solid #030213;
      background: #fafafa;
    }
    td {
      padding: 12px 14px;
      border-bottom: 1px solid #e4e4e7;
      font-size: 10.5px;
      vertical-align: middle;
    }
    tbody tr:hover {
      background: #fafafa;
    }
    .td-item {
      width: 45%;
    }
    .product-name {
      display: block;
      font-weight: 700;
    }
    .product-sku {
      display: block;
      font-size: 8.5px;
      color: #71717a;
      margin-top: 2px;
      font-family: monospace;
    }
    .td-meta {
      width: 20%;
      text-align: center;
      font-weight: 600;
    }
    .td-qty {
      width: 10%;
      text-align: center;
      font-weight: 700;
    }
    .td-price {
      width: 12.5%;
      text-align: right;
      font-weight: 600;
    }
    .td-amount {
      width: 12.5%;
      text-align: right;
      font-weight: 700;
    }
    th.th-right {
      text-align: right;
    }
    th.th-center {
      text-align: center;
    }

    .tfoot-summary {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      gap: 16px;
      font-size: 9px;
      color: #52525b;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    /* Totals Box */
    .totals-wrapper {
      display: flex;
      justify-content: flex-end;
      margin-top: 10px;
    }
    .totals-box {
      width: 320px;
      border: 1px solid #e4e4e7;
      background: #fafafa;
      padding: 20px 24px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .total-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 10.5px;
    }
    .total-label {
      color: #71717a;
      font-weight: 500;
    }
    .total-value {
      font-weight: 700;
      color: #030213;
    }
    .total-value.txt-free {
      color: #16a34a;
      font-weight: 800;
    }
    .total-sep {
      border: none;
      border-top: 1px dashed #e4e4e7;
    }
    .total-row.grand {
      border-top: 2px solid #030213;
      padding-top: 12px;
      margin-top: 4px;
    }
    .total-row.grand .total-label {
      font-size: 11px;
      font-weight: 900;
      text-transform: uppercase;
      color: #030213;
      letter-spacing: 1px;
    }
    .total-row.grand .total-value {
      font-size: 16px;
      font-weight: 900;
      color: #224870;
    }
    .total-note {
      font-size: 8px;
      color: #a1a1aa;
      text-align: right;
      letter-spacing: 0.5px;
      font-weight: 600;
      text-transform: uppercase;
    }

    /* Payment dot indicator */
    .payment-dot {
      display: inline-block;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      margin-right: 6px;
      vertical-align: middle;
    }
    .dot-paid {
      background-color: #16a34a;
    }

    /* Footer */
    .footer {
      margin-top: 45px;
      padding-top: 25px;
      border-top: 1px solid #e4e4e7;
      text-align: center;
    }
    .footer-divider {
      width: 50px;
      height: 2px;
      background: #030213;
      margin: 0 auto 16px;
    }
    .footer-thanks {
      font-size: 13px;
      font-weight: 900;
      letter-spacing: 4px;
      text-transform: uppercase;
      color: #030213;
      line-height: 1.2;
    }
    .footer-thanks-sub {
      font-size: 8px;
      color: #71717a;
      letter-spacing: 2px;
      text-transform: uppercase;
      font-weight: 800;
      margin-top: 5px;
    }
    .footer-support {
      font-size: 9px;
      color: #030213;
      margin-top: 16px;
      font-weight: 700;
      letter-spacing: 0.5px;
    }
    .footer-support .sep {
      color: #e4e4e7;
      margin: 0 10px;
    }
    .footer-legal {
      font-size: 8px;
      color: #71717a;
      margin-top: 6px;
      font-weight: 600;
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }
    .footer-note {
      font-size: 8px;
      color: #71717a;
      margin-top: 12px;
      font-style: italic;
      border-top: 1px solid #e4e4e7;
      padding-top: 10px;
    }

    @media print {
      body {
        background: #ffffff;
      }
      .invoice-sheet {
        max-width: 100%;
        padding: 0;
        margin: 0;
      }
    }
  </style>
</head>
<body>
  <div class="invoice-shell">
    <div class="invoice-sheet">

      <!-- HEADER -->
      <div class="header">
        <div class="logo-container">
          <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 6px;">
            <img src="${logoIcon}" style="height: 70px; width: auto; object-fit: contain;" alt="DripDoggy Icon" />
            <img src="${logoImg}" style="height: 120px; width: auto; object-fit: contain;" alt="DripDoggy Logo" />
          </div>
          <div class="brand-tagline">${cfg.tagline}</div>
        </div>
        <div class="invoice-meta-container">
          <div class="invoice-label">Invoice</div>
          <div class="meta-details">
            <div class="meta-row">
              <span class="meta-lbl">Invoice No:</span>
              <span class="meta-val">${order.id.replace("#", "")}</span>
            </div>
            <div class="meta-row">
              <span class="meta-lbl">Date:</span>
              <span class="meta-val">${order.date}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- INFO ROW -->
      <div class="info-grid">
        <div class="info-card">
          <div class="info-title">Bill To</div>
          <div class="info-value">
            <strong>${user.firstName} ${user.lastName}</strong><br />
            <span class="text-muted">${user.email}</span><br />
            <span class="text-muted">+91 ${order.phoneNumber || user.phone || "_________"}</span>
          </div>
        </div>
        <div class="info-card">
          <div class="info-title">Ship To / Delivery</div>
          <div class="info-value">
            <strong>${order.customerName || `${user.firstName} ${user.lastName}`}</strong><br />
            ${addressParts.join("<br />")}<br />
            <span class="text-muted">Contact: +91 ${order.phoneNumber || user.phone || "_________"}</span>
          </div>
        </div>
      </div>

      <!-- DETAILS GRID -->
      <div class="info-grid" style="margin-bottom: 25px; grid-template-columns: 1fr;">
        <div class="info-card">
          <div class="info-title">Payment Info</div>
          <div class="info-value">
            <span class="meta-lbl">Method:</span> <span class="meta-val">Cash on Delivery (COD)</span><br />
            <span class="meta-lbl">Status:</span> <span class="meta-val"><span class="payment-dot dot-paid"></span>PAID</span>
          </div>
        </div>
      </div>

      <!-- ITEMS TABLE -->
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th class="td-item">Item Description</th>
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
              <td colspan="5" style="padding: 10px 12px; border: none; background: #fafafa;">
                <div class="tfoot-summary">
                  <span>${order.items.length} items</span>
                  <span>&bull;</span>
                  <span>${order.items.reduce((s, i) => s + Number(i.quantity), 0)} total units</span>
                </div>
              </td>
            </tr>
          </tfoot>` : ""}
        </table>
      </div>

      <!-- SUMMARY & TOTALS -->
      <div class="totals-wrapper">
        <div class="totals-box">
          <div class="total-row">
            <span class="total-label">Subtotal (MRP)</span>
            <span class="total-value">${formatPrice(subtotal)}</span>
          </div>
          ${discount > 0 ? `
          <hr class="total-sep" />
          <div class="total-row" style="color: #16a34a; font-weight: 750;">
            <span class="total-label">Discount</span>
            <span class="total-value">-${formatPrice(discount)}</span>
          </div>
          ` : ""}
          <hr class="total-sep" />
          <div class="total-row">
            <span class="total-label">Delivery Fee</span>
            <span class="total-value ${shippingFee === 0 ? "txt-free" : ""}">${shippingFee > 0 ? formatPrice(shippingFee) : "FREE"}</span>
          </div>
          <hr class="total-sep" />
          <div class="total-row grand">
            <span class="total-label">Grand Total</span>
            <span class="total-value">${formatPrice(grandTotal)}</span>
          </div>
          <div class="total-note">Total amount payable</div>
        </div>
      </div>

      <!-- FOOTER -->
      <div class="footer">
        <div class="footer-divider"></div>
        <div class="footer-thanks">Thank You</div>
        <div class="footer-thanks-sub">drip your way every day</div>
        <div class="footer-support">
          support@dripdoggy.com<span class="sep">|</span>dripdoggy.com
        </div>
        <div class="footer-legal">
          Bangalore, Karnataka
        </div>
        <div class="footer-note">Returns accepted within 24 hours of delivery. — ${INVOICE_CONFIG.terms.paymentNote}</div>
      </div>

    </div>
  </div>
</body>
</html>`;
}

export function generateBillHTML(order: Order, user: { firstName: string; lastName: string; email: string; phone: string }) {
  const shippingFee = order.shippingFee !== undefined ? order.shippingFee : 0;
  const discount = order.discount !== undefined ? order.discount : 0;
  const subtotal = order.items.reduce((s, i) => s + (i.price * i.quantity), 0);
  const grandTotal = order.total;
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

  const addressParts = order.destinationAddress
    ? [order.destinationAddress.replace(/_/g, " ").replace(/,/g, " ").trim()]
    : ["Bangalore Karnataka"];

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
      </div>

      <div class="bill-section-title">Bill To</div>
      <div class="bill-info">
        <div class="bill-info-row">
          <span class="bill-info-label">Customer</span>
          <span class="bill-info-value">${user.firstName} ${user.lastName}</span>
        </div>
        <div class="bill-info-row">
          <span class="bill-info-label">Phone</span>
          <span class="bill-info-value">${order.phoneNumber || user.phone || "_________"}</span>
        </div>
        <div class="bill-info-row">
          <span class="bill-info-label">Address</span>
          <span class="bill-info-value" style="text-align: right; max-width: 70%;">${addressParts.join(", ")}</span>
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
        ${discount > 0 ? `
        <div class="bill-total-row" style="color: #059669;">
          <span>Discount</span>
          <span>-${formatPrice(discount)}</span>
        </div>` : ""}
        <div class="bill-total-row">
          <span>Delivery</span>
          <span class="${shippingFee === 0 ? "txt-free" : ""}">${shippingFee > 0 ? formatPrice(shippingFee) : "FREE"}</span>
        </div>
        <div class="bill-total-row bill-grand">
          <span>TOTAL</span>
          <span>${formatPrice(grandTotal)}</span>
        </div>
      </div>

      <div class="bill-footer">
        <div class="bill-footer-thanks">Thank you for your order!</div>
        <div class="bill-footer-contact">support@support.gmail.com | dripdoggy.com</div>
        <div class="bill-footer-contact" style="margin-top: 2px;">Bangalore, Karnataka</div>
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
