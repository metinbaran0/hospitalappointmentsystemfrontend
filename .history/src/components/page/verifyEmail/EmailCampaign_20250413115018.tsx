import React, { useState } from 'react';
// @ts-ignore
import SibApiV3Sdk from 'sib-api-v3-sdk';

const EmailCampaign = () => {
  const [status, setStatus] = useState('');

  const createCampaign = () => {
    // Brevo API Client instance
    const defaultClient = SibApiV3Sdk.ApiClient.instance;
    const apiKey = defaultClient.authentications['api-key'];
    apiKey.apiKey = process.env.REACT_APP_API_KEY; 

    const apiInstance = new SibApiV3Sdk.EmailCampaignsApi();

    // Kampanya ayarlarını belirleyin
    const emailCampaigns = new SibApiV3Sdk.CreateEmailCampaign();
    emailCampaigns.name = "Campaign sent via the API";
    emailCampaigns.subject = "My subject";
    emailCampaigns.sender = { "name": "From name", "email": "myfromemail@mycompany.com" };
    emailCampaigns.type = "classic";
    emailCampaigns.htmlContent = 'Congratulations! You successfully sent this example campaign via the Brevo API.';
    emailCampaigns.recipients = { listIds: [2, 7] }; // Alıcı listelerini burada belirleyin
    emailCampaigns.scheduledAt = "2023-01-01 00:00:01"; // Kampanya zamanı

    // API'yi çağırarak kampanya oluşturma
    apiInstance.createEmailCampaign(emailCampaigns)
      .then((data: SibApiV3Sdk.CreateEmailCampaignResponse) => { // 'data' parametresinin tipini belirtiyoruz
        setStatus('Campaign created successfully!');
        console.log('API called successfully. Returned data:', data);
      })
      .catch((error: Error) => { // 'error' parametresinin tipini belirtiyoruz
        setStatus('Error creating campaign.');
        console.error(error);
      });
  };

  return (
    <div>
      <h2>Create an Email Campaign</h2>
      <button onClick={createCampaign}>Create Campaign</button>
      {status && <p>{status}</p>}
    </div>
  );
};

export default EmailCampaign;