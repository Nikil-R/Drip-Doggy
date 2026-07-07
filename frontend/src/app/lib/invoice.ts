import type { Order } from "../types/account";

export function generateInvoiceHTML(order: Order, user: { firstName: string; lastName: string; email: string; phone: string }) {
  return `<!DOCTYPE html>
<html>
<head><title>Invoice — ${order.id}</title>
<style>
  @page { margin: 20mm 15mm; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Courier New', monospace; color: #111; background: #fff; padding: 40px; }
  .header { display: flex; justify-content: space-between; align-items: start; border-bottom: 2px solid #111; padding-bottom: 20px; margin-bottom: 24px; }
  .brand { font-size: 24px; font-weight: 900; letter-spacing: 3px; text-transform: uppercase; }
  .brand-sub { font-size: 9px; color: #888; letter-spacing: 2px; text-transform: uppercase; margin-top: 4px; }
  .invoice-title { font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #666; }
  .invoice-number { font-size: 18px; font-weight: 900; margin-top: 4px; }
  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 24px; }
  .section-title { font-size: 9px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #888; margin-bottom: 6px; }
  .section-value { font-size: 10px; line-height: 1.6; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
  th { font-size: 8px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #888; text-align: left; padding: 8px 4px; border-bottom: 1px solid #ddd; }
  td { font-size: 10px; padding: 10px 4px; border-bottom: 1px solid #eee; }
  .amount { text-align: right; font-weight: 700; }
  .total-row td { font-size: 12px; font-weight: 900; border-top: 2px solid #111; padding-top: 10px; }
  .footer { margin-top: 32px; padding-top: 16px; border-top: 1px solid #ddd; font-size: 8px; color: #aaa; letter-spacing: 1px; text-transform: uppercase; text-align: center; }
  .status-badge { display: inline-block; font-size: 8px; font-weight: 700; letter-spacing: 2px; padding: 3px 8px; border: 1px solid #111; text-transform: uppercase; }
  .payment-row { display: flex; justify-content: space-between; font-size: 10px; padding: 4px 0; }
  .payment-label { color: #888; letter-spacing: 1px; text-transform: uppercase; font-size: 9px; }
  .payment-value { font-weight: 700; }
  .grand-total { font-size: 12px; font-weight: 900; border-top: 2px solid #111; padding-top: 8px; margin-top: 4px; display: flex; justify-content: space-between; }
</style>
</head>
<body>
  <div class="header">
    <div>
      <div class="brand">DRIP DOGGY</div>
      <div class="brand-sub">Luxury Streetwear — Est. 2026</div>
    </div>
    <div style="text-align: right;">
      <div class="invoice-title">Invoice / Tax Receipt</div>
      <div class="invoice-number">${order.id}</div>
      <div style="font-size:9px;color:#888;margin-top:4px;">Date: ${order.date}</div>
    </div>
  </div>

  <div class="grid-2">
    <div>
      <div class="section-title">Bill To</div>
      <div class="section-value">
        ${user.firstName} ${user.lastName}<br>
        ${user.email}<br>
        ${user.phone || '+91 _________'}
      </div>
    </div>
    <div>
      <div class="section-title" style="text-align:right;">Order Status</div>
      <div style="text-align:right;margin-top:4px;">
        <span class="status-badge">${order.status}</span>
      </div>
      <div style="text-align:right;margin-top:8px;">
        <div class="section-title" style="text-align:right;">Payment Mode</div>
        <div style="font-size:10px;font-weight:700;margin-top:2px;">Cash on Delivery</div>
      </div>
    </div>
  </div>

  <table>
    <thead>
      <tr><th>Item</th><th>Brand</th><th>Size/Color</th><th class="amount">Qty</th><th class="amount">Price</th><th class="amount">Total</th></tr>
    </thead>
    <tbody>
      ${order.items.map(item => `
        <tr>
          <td style="font-weight:700;">${item.name}</td>
          <td style="color:#888;font-size:9px;">${item.brand}</td>
          <td style="color:#888;font-size:9px;">${item.size} / ${item.color}</td>
          <td class="amount">${item.quantity}</td>
          <td class="amount">₹${item.price.toFixed(0)}</td>
          <td class="amount">₹${(item.price * item.quantity).toFixed(0)}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <div style="margin-left:auto;width:280px;">
    <div class="payment-row">
      <span class="payment-label">Subtotal</span>
      <span class="payment-value">₹${order.total.toFixed(0)}</span>
    </div>
    <div class="payment-row">
      <span class="payment-label">Delivery</span>
      <span class="payment-value" style="color:#059669;">FREE</span>
    </div>
    <div class="payment-row">
      <span class="payment-label">Tax (GST 18%)</span>
      <span class="payment-value">₹${(order.total * 0.18).toFixed(0)}</span>
    </div>
    <div class="grand-total">
      <span style="letter-spacing:1px;text-transform:uppercase;">Total</span>
      <span>₹${(order.total * 1.18).toFixed(0)}</span>
    </div>
  </div>

  <div class="footer">
    Drip Doggy — Architectural silhouettes, premium fabrication, uncompromised street luxury.<br>
    Thank you for your order.
  </div>
</body>
</html>`;
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
