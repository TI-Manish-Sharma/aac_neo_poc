import { NextRequest, NextResponse } from 'next/server';

// Just create a simple route handler that recieves a POST request and sends an email

export async function POST(req: NextRequest) {
    try {
        const { to, subject, message } = await req.json();

        if (!to || !subject || !message) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Simulate sending an email (replace with actual email-sending logic)
        console.log(`Sending email to: ${to}, Subject: ${subject}, Message: ${message}`);

        return NextResponse.json({ success: true, message: 'Email sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error);
        return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }
}