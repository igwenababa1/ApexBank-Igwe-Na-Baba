import { CustomerGroup, Transaction } from '../types';

/**
 * Simulates sending a push notification to a group of customers.
 * In a real application, this would call a service like Firebase Cloud Messaging.
 * @param customerGroup - The group of customers to target.
 * @param title - The title of the push notification.
 * @param body - The body content of the push notification.
 */
export const sendPushNotification = (customerGroup: CustomerGroup, title: string, body: string) => {
  console.log(`
    ==================================================
    🚀 SIMULATING PUSH NOTIFICATION 🚀
    --------------------------------------------------
    TARGET GROUP: ${customerGroup.toUpperCase()}
    TITLE:        ${title}
    BODY:         ${body}
    TIMESTAMP:    ${new Date().toISOString()}
    ==================================================
  `);
};

/**
 * Simulates sending a transactional email to a customer.
 * In a real application, this would use an email service like SendGrid or AWS SES.
 * @param recipientEmail - The customer's email address.
 * @param subject - The subject line of the email.
 * @param body - The HTML or text body of the email.
 */
export const sendTransactionalEmail = (recipientEmail: string, subject: string, body: string) => {
    console.log(`
    ==================================================
    📧 SIMULATING TRANSACTIONAL EMAIL 📧
    --------------------------------------------------
    RECIPIENT:    ${recipientEmail}
    SUBJECT:      ${subject}
    TIMESTAMP:    ${new Date().toISOString()}
    --------------------------------------------------
    BODY:
    ${body}
    ==================================================
  `);
};


// --- Email Template Generators ---

export const generateTransactionReceiptEmail = (transaction: Transaction, cardholderName: string): { subject: string, body: string } => {
    const subject = `Your ApexBank Transaction Receipt: #${transaction.id}`;
    const body = `
      <div style="font-family: sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
        <h2 style="color: #0052FF;">Transaction Submitted</h2>
        <p>Dear ${cardholderName || 'Customer'},</p>
        <p>This email confirms that your transaction has been successfully submitted.</p>
        <hr style="border: 0; border-top: 1px solid #eee;">
        <h3>Transaction Details:</h3>
        <ul style="list-style: none; padding: 0;">
          <li><strong>ID:</strong> ${transaction.id}</li>
          <li><strong>Amount Sent:</strong> ${transaction.sendAmount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</li>
          <li><strong>Recipient:</strong> ${transaction.recipient.fullName}</li>
          <li><strong>Recipient Gets:</strong> ${transaction.receiveAmount.toLocaleString('en-US', { style: 'currency', currency: transaction.recipient.country.currency })}</li>
          <li><strong>Estimated Arrival:</strong> ${transaction.estimatedArrival.toLocaleDateString()}</li>
        </ul>
        <hr style="border: 0; border-top: 1px solid #eee;">
        <p>You can view the full details by logging into your ApexBank account.</p>
        <p>Thank you for using ApexBank.</p>
      </div>
    `;
    return { subject, body: body.trim() };
};

export const generateCardStatusEmail = (cardholderName: string, isFrozen: boolean): { subject: string; body: string } => {
  const status = isFrozen ? 'Frozen' : 'Unfrozen';
  const subject = `Security Alert: Your ApexBank Card has been ${status}`;
  const body = `
    <div style="font-family: sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
      <h2 style="color: #D97706;">Security Alert</h2>
      <p>Dear ${cardholderName},</p>
      <p>This is a confirmation that your ApexBank card (ending in <strong>8842</strong>) has been successfully <strong>${status}</strong>.</p>
      <ul>
        <li>If you initiated this action, no further steps are needed.</li>
        <li>If you did NOT authorize this change, please contact our support team immediately.</li>
      </ul>
      <p>Thank you for helping us keep your account secure.</p>
      <p>Sincerely,<br/>The ApexBank Security Team</p>
    </div>
  `;
  return { subject, body: body.trim() };
};

export const generateNewRecipientEmail = (cardholderName: string, recipientName: string): { subject: string; body: string } => {
  const subject = `Security Alert: New Recipient Added to Your ApexBank Account`;
  const body = `
    <div style="font-family: sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
      <h2 style="color: #D97706;">Security Alert</h2>
      <p>Dear ${cardholderName},</p>
      <p>A new recipient, "<strong>${recipientName}</strong>", has been added to your ApexBank account.</p>
      <ul>
        <li>If you added this recipient, you can disregard this message.</li>
        <li>If you do NOT recognize this activity, please log in to your account immediately to review your recipients and contact our support team.</li>
      </ul>
      <p>For your security, we notify you of any changes to your list of approved payees.</p>
      <p>Sincerely,<br/>The ApexBank Security Team</p>
    </div>
  `;
  return { subject, body: body.trim() };
};

export const generateFundsArrivedEmail = (transaction: Transaction, cardholderName: string): { subject: string, body: string } => {
    const subject = `Your ApexBank Transfer Has Arrived: #${transaction.id}`;
    const body = `
      <div style="font-family: sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
        <h2 style="color: #16A34A;">Transfer Completed!</h2>
        <p>Dear ${cardholderName},</p>
        <p>Great news! Your transfer to <strong>${transaction.recipient.fullName}</strong> has arrived.</p>
        <hr style="border: 0; border-top: 1px solid #eee;">
        <h3>Transaction Summary:</h3>
        <ul style="list-style: none; padding: 0;">
          <li><strong>ID:</strong> ${transaction.id}</li>
          <li><strong>Amount Sent:</strong> ${transaction.sendAmount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</li>
          <li><strong>Recipient Received:</strong> ${transaction.receiveAmount.toLocaleString('en-US', { style: 'currency', currency: transaction.recipient.country.currency })}</li>
        </ul>
        <hr style="border: 0; border-top: 1px solid #eee;">
        <p>Thank you for using ApexBank.</p>
      </div>
    `;
    return { subject, body: body.trim() };
};
