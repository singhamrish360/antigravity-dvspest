/**
 * Email Dispatch Utility for DVS Pest Control Infrastructure Co
 * Integrates client-side email notifications using the free FormSubmit API.
 * Requires zero registration keys to work out-of-the-box.
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
 * Dispatches an automated email notification to dvsinfrapest@gmail.com
 * detailing the new customer inspection request.
 */
export const sendLeadNotificationEmail = async (lead: LeadEmailPayload): Promise<boolean> => {
  const targetEmail = 'dvsinfrapest@gmail.com';
  
  // Construct clean form fields for FormSubmit.co email formatting
  const payload = {
    'Lead ID': lead.id,
    'Customer Name': lead.customerName,
    'Phone Number': lead.phone || 'Not Provided',
    'Email Address': lead.email || 'Not Provided',
    'Service Requested': lead.serviceRequested,
    'Property Type': lead.propertyType,
    'Area (Sq. Ft.)': `${lead.squareFeet} Sq. Ft.`,
    'Location Address': lead.location,
    'Referral Source': lead.referralSource,
    'Submission Time': new Date(lead.timestamp).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
    '_subject': `🚨 New DVS Lead Alert: ${lead.customerName} (${lead.id})`,
    '_captcha': 'false', // Disable captcha step for direct AJAX submission
    '_template': 'table'  // Request professional table layout in inbox
  };

  console.log('📧 Dispatching DVS Lead Alert to FormSubmit API:', payload);

  try {
    const response = await fetch(`https://formsubmit.co/ajax/${targetEmail}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      console.log(`` + `✅ DVS Lead email notification successfully dispatched to ${targetEmail}.`);
      return true;
    } else {
      const errorData = await response.json();
      console.warn('⚠️ FormSubmit response error:', errorData);
      return false;
    }
  } catch (error) {
    console.error('❌ Failed to dispatch email notification via FormSubmit:', error);
    return false;
  }
};
