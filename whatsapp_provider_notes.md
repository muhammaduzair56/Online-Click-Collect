# WhatsApp provider notes

Meta's official WhatsApp Cloud API documentation states that Cloud API supports programmatic message sending and webhooks. The getting-started flow includes creating a Meta app with WhatsApp, using the API, sending and receiving messages, setting up a webhook, creating a system user, and generating a permanent access token. Meta also documents non-template messages and template messages separately. Order-status notifications should be sent from the FastAPI backend, not directly from the browser, so access tokens and provider secrets stay server-side. The frontend can call a FastAPI status-notification endpoint and display queued/sent/failed states.

Source: https://developers.facebook.com/documentation/business-messaging/whatsapp/get-started
Source: https://developers.facebook.com/documentation/business-messaging/whatsapp/messages/send-messages
Source: https://developers.facebook.com/documentation/business-messaging/whatsapp/templates/overview
Source: https://developers.facebook.com/documentation/business-messaging/whatsapp/webhooks/overview

Current blocker: the user has not supplied a deployed FastAPI base URL, Meta WhatsApp phone-number ID, access token, approved template name, or webhook verification configuration. Do not invent or expose secrets; implement provider-neutral frontend contracts until the user provides these values through a secure configuration path.
