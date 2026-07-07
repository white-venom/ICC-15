import { NextResponse } from 'next/server';

// To use this, you need to set up a Meta Developer account and get a WhatsApp API Token.
// Add these to your .env.local file:
// WHATSAPP_ACCESS_TOKEN=your_meta_token_here
// WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id_here

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customerPhone, customerName, orderId } = body;

    if (!customerPhone || !customerName || !orderId) {
      return NextResponse.json(
        { error: 'Missing required fields: customerPhone, customerName, orderId' },
        { status: 400 }
      );
    }

    const token = process.env.WHATSAPP_ACCESS_TOKEN;
    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

    if (!token || !phoneNumberId) {
      console.warn('WhatsApp API credentials are not set in environment variables.');
      return NextResponse.json(
        { error: 'WhatsApp API credentials not configured.' },
        { status: 500 }
      );
    }

    // Format the phone number (remove +, spaces, dashes)
    const formattedPhone = customerPhone.replace(/\D/g, '');

    // Official Meta WhatsApp Cloud API Endpoint
    const url = `https://graph.facebook.com/v17.0/${phoneNumberId}/messages`;

    // The message payload.
    // NOTE: If you are messaging a user outside of a 24-hour window, 
    // you MUST use an approved WhatsApp Template instead of a standard text message.
    const payload = {
      messaging_product: 'whatsapp',
      to: formattedPhone,
      type: 'template',
      template: {
        // You must create and approve this template name in your Meta WhatsApp Manager
        name: 'order_confirmation', 
        language: {
          code: 'en_US'
        },
        components: [
          {
            type: 'body',
            parameters: [
              { type: 'text', text: customerName },
              { type: 'text', text: orderId }
            ]
          }
        ]
      }
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('WhatsApp API Error:', data);
      return NextResponse.json(
        { error: 'Failed to send WhatsApp message', details: data },
        { status: response.status }
      );
    }

    return NextResponse.json({ success: true, messageId: data.messages?.[0]?.id });

  } catch (error) {
    console.error('WhatsApp Route Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
