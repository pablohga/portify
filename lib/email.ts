import nodemailer from 'nodemailer';

// Create transporter only if SMTP settings are available

const createTransporter = () => {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn("SMTP configuration is missing. Email functionality will be disabled.");
    return null;
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_PORT === "465", // Use SSL if port is 465
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: false, // Aceitar certificados não confiáveis
    },
    /* logger: true,
    debug: true, */
  });
};

const transporter = createTransporter();

if (transporter) {
  transporter.verify((error, success) => {
    if (error) {
      console.error("SMTP connection failed:", error);
    } else {
      console.log("SMTP connection established successfully");
    }
  });
}

const emailTemplate = (content: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Portify</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .logo {
      text-align: center;
      margin-bottom: 30px;
    }
    .logo img {
      max-width: 200px;
      height: auto;
    }
    .content {
      background: #ffffff;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    .button {
      display: inline-block;
      padding: 12px 24px;
      background-color: #5221e6;
      color: white;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 600;
      margin-top: 20px;
    }
    .footer {
      text-align: center;
      margin-top: 30px;
      color: #666;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">
      <img src="https://mundonews.pt/portify/logo_nova_txt_m_dark.png" alt="Portify">
    </div>
    <div class="content">
      ${content}
    </div>
    <div class="footer">
      © ${new Date().getFullYear()} Portify. Todos os direitos reservados.
    </div>
  </div>
</body>
</html>
`;

export async function sendWelcomeEmail(email: string, name: string) {
  console.log('sendWelcomeEmail');
  try {
    // Garantir que o transporter não seja null antes de usar
    if (!transporter) {
      console.log('Email sending skipped - SMTP not configured');
      return;
    }

    const loginUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/signin`;

    const content = `
      <h1>Bem-vindo ao Portify, ${name}! 🚀</h1>
      <p>Estamos muito felizes em ter você conosco! Você acaba de dar o primeiro passo para transformar sua presença profissional online.</p>
      <p>Com o Portify, você terá todas as ferramentas necessárias para:</p>
      <ul>
        <li>Criar um portfólio profissional impressionante</li>
        <li>Destacar seus melhores projetos</li>
        <li>Atrair clientes de qualidade</li>
        <li>Gerenciar seu negócio com eficiência</li>
      </ul>
      <p>Pronto para começar sua jornada de sucesso?</p>
      <div style="text-align: center;">
        <a href="${loginUrl}" style="display: inline-block; padding: 12px 24px; background-color: #5221e6; color: white; text-decoration: none; border-radius: 6px; font-weight: 600;">
          Acessar Minha Conta
        </a>
      </div>
    `;

    await transporter.sendMail({
      from: process.env.SMTP_FROM || 'noreply@example.com',
      to: [email, 'pablohga@gmail.com'],
      subject: 'Bem-vindo ao Portify! Comece sua jornada de sucesso',
      html: emailTemplate(content),
    });

    console.log('Welcome email sent successfully to:', email);
  } catch (error) {
    /* console.error('Error sending welcome email:', error); */
    console.log('Error sending welcome email:', error);
    // Não lançar o erro, apenas logá-lo
  }
}

export async function sendResetEmail(email: string, token: string) {
  try {
    // Garantir que o transporter não seja null antes de usar
    if (!transporter) {
      console.log('Email sending skipped - SMTP not configured');
      return;
    }

    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${token}`;

    const content = `
      <h1>Redefinição de Senha</h1>
      <p>Você solicitou a redefinição de sua senha. Clique no botão abaixo para criar uma nova senha. 
      Este link expirará em 1 hora.</p>
      <div style="text-align: center;">
        <a href="${resetUrl}" class="button">Redefinir Minha Senha</a>
      </div>
      <p style="margin-top: 20px; font-size: 14px;">Se você não solicitou esta redefinição, por favor ignore este email.</p>
    `;

    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: 'Redefinição de Senha - Portify',
      html: emailTemplate(content),
    });

    console.log('Reset password email sent successfully to:', email);
  } catch (error) {
    /* console.error('Error sending reset email:', error); */
    console.log('Error sending reset email:', error);
    // Não lançar o erro, apenas logá-lo
  }
}