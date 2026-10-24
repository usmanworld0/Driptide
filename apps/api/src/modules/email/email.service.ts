import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Order } from '@driptide/contracts';

/** Formats a minor-unit integer (cents) to a dollar string, e.g. 10900 → "$109.00" */
function formatMoney(minor: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(minor / 100);
}

/** Builds a fully branded, dark-luxury HTML order confirmation email. */
function buildOrderConfirmationHtml(order: Order): string {
  const itemRows = order.items
    .map(
      (item) => `
      <tr>
        <td style="padding:12px 0;border-bottom:1px solid #e5e5e5;vertical-align:top;">
          <span style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:13px;font-weight:600;color:#0a0a0a;display:block;text-transform:uppercase;letter-spacing:0.05em;">${item.productName}</span>
          <span style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:11px;color:#737373;text-transform:uppercase;letter-spacing:0.04em;">${item.variantTitle} &middot; SKU: ${item.sku} &middot; Qty: ${item.quantity}</span>
        </td>
        <td style="padding:12px 0;border-bottom:1px solid #e5e5e5;text-align:right;vertical-align:top;">
          <span style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:13px;font-weight:600;color:#0a0a0a;">${formatMoney(item.totalPriceMinor)}</span>
        </td>
      </tr>`,
    )
    .join('');

  const addr = order.shippingAddress;
  const addressLines = [addr.street1, addr.street2, `${addr.city}, ${addr.state || ''} ${addr.postalCode}`, addr.country]
    .filter(Boolean)
    .join('<br/>');

  const discountRow =
    order.discountMinor > 0
      ? `<tr>
          <td style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:12px;color:#16a34a;padding:4px 0;text-transform:uppercase;letter-spacing:0.04em;">Promo Code (${order.couponCode})</td>
          <td style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:12px;color:#16a34a;padding:4px 0;text-align:right;font-weight:600;">−${formatMoney(order.discountMinor)}</td>
        </tr>`
      : '';

  const paymentMethodLabel =
    order.paymentMethod === 'cod' ? 'Cash on Delivery' : order.paymentMethod === 'credit_card' ? 'Credit / Debit Card' : 'Manual';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Order Confirmed — Driptide #${order.orderNumber}</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#ffffff;border:1px solid #e5e5e5;">

          <!-- Header / Brand Bar -->
          <tr>
            <td style="background-color:#0a0a0a;padding:28px 40px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <span style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:22px;font-weight:900;color:#ffffff;letter-spacing:0.18em;text-transform:uppercase;">DRIPTIDE</span>
                  </td>
                  <td align="right">
                    <span style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:10px;color:#737373;text-transform:uppercase;letter-spacing:0.12em;">Order Confirmation</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Confirmation Banner -->
          <tr>
            <td style="padding:36px 40px 24px;border-bottom:1px solid #e5e5e5;">
              <p style="margin:0 0 6px;font-size:11px;font-weight:700;color:#16a34a;text-transform:uppercase;letter-spacing:0.12em;">&#10003; Order Confirmed &amp; Received</p>
              <h1 style="margin:0 0 10px;font-size:26px;font-weight:900;color:#0a0a0a;text-transform:uppercase;letter-spacing:-0.01em;line-height:1.2;">Thank you, ${order.customerName}.</h1>
              <p style="margin:0;font-size:12px;color:#737373;text-transform:uppercase;letter-spacing:0.06em;">
                Order Reference: <strong style="color:#0a0a0a;font-family:monospace;">${order.orderNumber}</strong>
              </p>
            </td>
          </tr>

          <!-- Status Block -->
          <tr>
            <td style="padding:24px 40px;background-color:#fafafa;border-bottom:1px solid #e5e5e5;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="33%" style="vertical-align:top;padding-right:12px;">
                    <p style="margin:0 0 4px;font-size:10px;font-weight:700;color:#737373;text-transform:uppercase;letter-spacing:0.1em;">Status</p>
                    <p style="margin:0;font-size:12px;font-weight:700;color:#0a0a0a;text-transform:capitalize;">${order.status}</p>
                    <p style="margin:2px 0 0;font-size:10px;color:#a3a3a3;">Being packed &amp; prepared</p>
                  </td>
                  <td width="33%" style="vertical-align:top;padding-right:12px;">
                    <p style="margin:0 0 4px;font-size:10px;font-weight:700;color:#737373;text-transform:uppercase;letter-spacing:0.1em;">Courier</p>
                    <p style="margin:0;font-size:12px;font-weight:700;color:#0a0a0a;">${order.trackingNumber ? `${order.courier}: ${order.trackingNumber}` : 'Dispatch Pending'}</p>
                    <p style="margin:2px 0 0;font-size:10px;color:#a3a3a3;">2–4 business days</p>
                  </td>
                  <td width="33%" style="vertical-align:top;">
                    <p style="margin:0 0 4px;font-size:10px;font-weight:700;color:#737373;text-transform:uppercase;letter-spacing:0.1em;">Payment</p>
                    <p style="margin:0;font-size:12px;font-weight:700;color:#0a0a0a;">${paymentMethodLabel}</p>
                    <p style="margin:2px 0 0;font-size:10px;color:#a3a3a3;">${order.paymentStatus}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Order Items -->
          <tr>
            <td style="padding:28px 40px 0;">
              <p style="margin:0 0 16px;font-size:10px;font-weight:700;color:#0a0a0a;text-transform:uppercase;letter-spacing:0.12em;border-bottom:2px solid #0a0a0a;padding-bottom:8px;">Purchased Silhouettes</p>
              <table width="100%" cellpadding="0" cellspacing="0">
                ${itemRows}
              </table>
            </td>
          </tr>

          <!-- Totals -->
          <tr>
            <td style="padding:20px 40px 28px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="font-size:12px;color:#737373;padding:4px 0;text-transform:uppercase;letter-spacing:0.04em;">Subtotal</td>
                  <td style="font-size:12px;color:#737373;padding:4px 0;text-align:right;">${formatMoney(order.subtotalMinor)}</td>
                </tr>
                ${discountRow}
                <tr>
                  <td style="font-size:12px;color:#737373;padding:4px 0;text-transform:uppercase;letter-spacing:0.04em;">Shipping</td>
                  <td style="font-size:12px;color:#737373;padding:4px 0;text-align:right;">${order.shippingMinor === 0 ? 'FREE' : formatMoney(order.shippingMinor)}</td>
                </tr>
                <tr>
                  <td style="font-size:12px;color:#737373;padding:4px 0;text-transform:uppercase;letter-spacing:0.04em;">Taxes</td>
                  <td style="font-size:12px;color:#737373;padding:4px 0;text-align:right;">${formatMoney(order.taxMinor)}</td>
                </tr>
                <tr>
                  <td colspan="2" style="border-top:1px solid #e5e5e5;padding:0;height:1px;"></td>
                </tr>
                <tr>
                  <td style="font-size:15px;font-weight:900;color:#0a0a0a;padding:10px 0 0;text-transform:uppercase;letter-spacing:0.06em;">Total Charged</td>
                  <td style="font-size:15px;font-weight:900;color:#0a0a0a;padding:10px 0 0;text-align:right;">${formatMoney(order.totalMinor)}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Shipping Address -->
          <tr>
            <td style="padding:0 40px 28px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="border-top:1px solid #e5e5e5;padding-top:20px;">
                    <p style="margin:0 0 8px;font-size:10px;font-weight:700;color:#0a0a0a;text-transform:uppercase;letter-spacing:0.12em;">Shipping To</p>
                    <p style="margin:0;font-size:12px;color:#404040;line-height:1.7;">${addr.fullName}<br/>${addressLines}<br/>${addr.phone ? `&#128222; ${addr.phone}` : ''}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- CTA Button -->
          <tr>
            <td style="padding:0 40px 36px;text-align:center;">
              <a href="https://driptide.com/shop" style="display:inline-block;background-color:#0a0a0a;color:#ffffff;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.15em;text-decoration:none;padding:14px 36px;">Continue Shopping</a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#0a0a0a;padding:20px 40px;">
              <p style="margin:0;font-size:10px;color:#525252;text-align:center;text-transform:uppercase;letter-spacing:0.08em;">
                Driptide &mdash; Quality Fashion &mdash; <a href="mailto:support@driptide.com" style="color:#737373;text-decoration:none;">support@driptide.com</a>
              </p>
              <p style="margin:6px 0 0;font-size:9px;color:#404040;text-align:center;">
                You received this email because you placed an order at driptide.com. &copy; ${new Date().getFullYear()} Driptide. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter | null = null;
  private fromAddress: string;

  constructor(private readonly config: ConfigService) {
    const host = this.config.get<string>('email.host');
    const port = this.config.get<number>('email.port') || 587;
    const user = this.config.get<string>('email.user');
    const pass = this.config.get<string>('email.pass');
    this.fromAddress = this.config.get<string>('email.from') || 'orders@driptide.com';

    if (host && !/mock|placeholder/i.test(host) && user && pass) {
      this.transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass },
      });
      this.logger.log(`SMTP transporter configured → ${host}:${port} (from: ${this.fromAddress})`);
    } else {
      this.logger.warn(
        'No SMTP credentials configured — transactional emails will be logged to console only. Set SMTP_HOST, SMTP_USER, SMTP_PASS in .env to enable live email.',
      );
    }
  }

  /**
   * Sends a branded HTML order confirmation email to the customer.
   * Falls back to console logging when no SMTP credentials are configured.
   */
  async sendOrderConfirmation(order: Order): Promise<void> {
    const subject = `Order Confirmed — ${order.orderNumber} | Driptide`;
    const html = buildOrderConfirmationHtml(order);

    if (!this.transporter) {
      // Dev/no-SMTP fallback: log a preview to the terminal
      this.logger.log(
        `[DEV EMAIL — NOT SENT] To: ${order.customerEmail} | Subject: ${subject} | Order: ${order.orderNumber} | Total: ${(order.totalMinor / 100).toFixed(2)} USD`,
      );
      return;
    }

    try {
      const info = await this.transporter.sendMail({
        from: this.fromAddress,
        to: order.customerEmail,
        subject,
        html,
      });
      this.logger.log(`Order confirmation sent → ${order.customerEmail} (messageId: ${info.messageId})`);
    } catch (err: any) {
      this.logger.error(`Failed to send order confirmation for ${order.orderNumber}: ${err.message}`);
      throw err;
    }
  }
}
