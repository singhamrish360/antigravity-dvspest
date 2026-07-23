/**
 * Email Dispatch Utility for DVS Pest Control Infrastructure Co
 * Integrates client-side email notifications using the EmailJS API.
 */

export interface LeadEmailPayload {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  serviceRequested: string;
  propertyType: string;
  squareFeet: number;
  location: string;
  referralSource: string;
  timestamp: string;
}

/**
 * Dispatches an automated email notification to the administrator (singhamrish360@gmail.com)
 * detailing the new customer inspection request.
 */
export const sendLeadNotificationEmail = async (lead: LeadEmailPayload): Promise<boolean> => {
  // Placeholder keys for EmailJS (User can customize these in their EmailJS dashboard)
  const SERVICE_ID = 'service_dvs_pest';
  const TEMPLATE_ID = 'template_new_lead';
  const PUBLIC_KEY = 'AIzaSy_Placeholder_EmailJS_Key';

  const templateParams = {
    to_email: 'singhamrish360@gmail.com',
    lead_id: lead.id,
    customer_name: lead.customerName,
    customer_email: lead.email || 'Not Provided',
    customer_phone: lead.phone || 'Not Provided',
    service_requested: lead.serviceRequested,
    property_type: lead.propertyType,
    square_feet: `${lead.squareFeet} Sq. Ft.`,
    location_address: lead.location,
    referral_source: lead.referralSource,
    submission_time: new Date(lead.timestamp).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
  };

  console.log('📧 Dispatching DVS Lead Notification Email template params:', templateParams);

  try {
    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        service_id: SERVICE_ID,
        template_id: TEMPLATE_ID,
        user_id: PUBLIC_KEY,
        template_params: templateParams
      })
    });

    if (response.ok) {
      console.log('✅ DVS Lead email notification sent successfully to singhamrish360@gmail.com.');
      return true;
    } else {
      const errorText = await response.text();
      console.warn('⚠️ EmailJS response error:', errorText);
      return false;
    }
  } catch (error) {
    console.error('❌ Failed to dispatch email notification via EmailJS:', error);
    return false;
  }
};
