const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'localhost',
    port: 2525,
    secure: false, // true for 465, false for other ports
    tls: {
        rejectUnauthorized: false
    }
});

async function sendTestEmail() {
    try {
        const info = await transporter.sendMail({
            from: '"Zoom Support" <no-reply@zoom.us>', // sender address
            to: 'demo@catty.my.id', // list of receivers
            subject: 'Please verify your Zoom account', // Subject line
            text: 'Your OTP code is 123456. This is a text body.', // plain text body
            html: '<b>Your OTP code is <h1>123456</h1></b><br><p>This is an HTML body.</p>', // html body
        });

        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    } catch (err) {
        console.error('Error sending:', err);
    }
}

sendTestEmail();
