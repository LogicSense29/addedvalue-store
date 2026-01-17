export const orderReceiptTemplate = ({ userName, orderItems, total, orderId }) => {
  const itemsHtml = orderItems.map(item => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.product.name} (x${item.quantity})</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">$${(item.price * item.quantity).toFixed(2)}</td>
    </tr>
  `).join('');

  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
      <h2 style="color: #333; text-align: center;">Order Confirmation</h2>
      <p>Hi ${userName},</p>
      <p>Thank you for your order! We've received your request and are processing it.</p>
      <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3 style="margin-top: 0;">Order #${orderId.slice(-8).toUpperCase()}</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr>
              <th style="text-align: left; padding: 10px; border-bottom: 2px solid #ddd;">Item</th>
              <th style="text-align: right; padding: 10px; border-bottom: 2px solid #ddd;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
          <tfoot>
            <tr>
              <td style="padding: 10px; font-weight: bold;">Total</td>
              <td style="padding: 10px; font-weight: bold; text-align: right;">$${total.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
      <p style="text-align: center;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/orders/${orderId}/track" style="background: #000; color: #fff; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Track Your Order</a>
      </p>
      <p style="color: #666; font-size: 12px; text-align: center; margin-top: 30px;">
        If you have any questions, please contact our support team.
      </p>
    </div>
  `;
};
