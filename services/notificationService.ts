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


/**
 * Simulates sending an SMS notification to a customer.
 * In a real application, this would use a service like Twilio.
 * @param phoneNumber - The customer's phone number.
 * @param message - The text message content.
 */
export const sendSmsNotification = (phoneNumber: string, message: string) => {
  console.log(`
    ==================================================
    📱 SIMULATING SMS NOTIFICATION 📱
    --------------------------------------------------
    RECIPIENT:    ${phoneNumber}
    MESSAGE:      ${message}
    TIMESTAMP:    ${new Date().toISOString()}
    ==================================================
  `);
};


// --- Email & SMS Template Generators ---

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

export const generateTransactionReceiptSms = (transaction: Transaction): string => {
  const amount = transaction.sendAmount.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  return `ApexBank: Your transfer of ${amount} to ${transaction.recipient.fullName} has been submitted. Txn ID: ${transaction.id}`;
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

export const generateNewRecipientSms = (recipientName: string): string => {
  return `ApexBank: A new recipient, "${recipientName}", has been added to your account. If this was not you, contact us immediately.`;
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


export const generateLoginAlertEmail = (userName: string): { subject: string, body: string } => {
  const subject = `Security Alert: New Sign-in to Your ApexBank Account`;
  const body = `
    <div style="font-family: sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
        <h2 style="color: #D97706;">Security Alert</h2>
        <p>Dear ${userName},</p>
        <p>We detected a new sign-in to your ApexBank account. If this was you, you can safely ignore this email.</p>
        <p>If you do not recognize this activity, please change your password and contact our support team immediately.</p>
        <p>Sincerely,<br/>The ApexBank Security Team</p>
    </div>
  `;
  return { subject, body: body.trim() };
};

export const generateLoginAlertSms = (): string => {
  return `ApexBank Security Alert: A new sign-in to your account was detected. If this was not you, please contact support immediately.`;
};

export const generateOtpSms = (): string => {
  return `Your ApexBank verification code is 123456. Do not share this code. It will expire in 10 minutes.`;
};

export const generateOtpEmail = (userName: string): { subject: string, body: string } => {
    const subject = `Your ApexBank Verification Code`;
    const body = `
      <div style="font-family: sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
        <h2 style="color: #0052FF;">Confirm Your Action</h2>
        <p>Dear ${userName},</p>
        <p>Please use the following verification code to complete your action: <strong>123456</strong></p>
        <p>This code will expire in 10 minutes. If you did not request this, please contact support immediately.</p>
        <p>Thank you for helping us keep your account secure.</p>
      </div>
    `;
    return { subject, body: body.trim() };
};

export const generateWelcomeEmail = (userName: string): { subject: string, body: string } => {
  const subject = `Welcome to ApexBank, ${userName}!`;
  const body = `
    <div style="font-family: sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
        <h2 style="color: #0052FF;">Welcome to the Future of Banking!</h2>
        <p>Hi ${userName},</p>
        <p>Your ApexBank account has been successfully created. We're thrilled to have you on board.</p>
        <p>You can now send money internationally with transparent fees, track your transfers in real-time, and manage your finances with our suite of powerful, secure tools.</p>
        <p>To get started, simply log in to your dashboard.</p>
        <p>Welcome to ApexBank,<br/>The ApexBank Team</p>
    </div>
  `;
  return { subject, body: body.trim() };
};

export const generateWelcomeSms = (userName: string): string => {
  return `Welcome to ApexBank, ${userName}! Your account is now active. Log in to start sending money globally.`;
};

export const generateDepositConfirmationEmail = (userName: string, amount: number, cardLastFour: string): { subject: string, body: string } => {
  const subject = `Deposit Confirmation: ${amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} Added to Your Account`;
  const body = `
    <div style="font-family: sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
        <h2 style="color: #16A34A;">Funds Added Successfully!</h2>
        <p>Hi ${userName},</p>
        <p>This email confirms that <strong>${amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</strong> has been successfully deposited into your ApexBank account from your card ending in <strong>${cardLastFour}</strong>.</p>
        <p>Your new balance is available immediately. Thank you for using ApexBank.</p>
    </div>
  `;
  return { subject, body: body.trim() };
};

export const generateDepositConfirmationSms = (amount: number, cardLastFour: string): string => {
  return `ApexBank: A deposit of ${amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} from card **** ${cardLastFour} was successful. Your funds are now available.`;
};