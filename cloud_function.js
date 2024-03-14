const functions = require('@google-cloud/functions-framework');
const axios = require('axios');


functions.cloudEvent('notificationPubSub', cloudEvent => {
  try {
    const base64message = cloudEvent.data.message;

    const messageData = JSON.parse(Buffer.from(base64message, 'base64').toString());

    /*[3:46:01 AM] - Error sending push notification: TypeError 
    [ERR_INVALID_ARG_TYPE]: The first argument must be of type string or an instance 
    of Buffer, ArrayBuffer, or Array or an Array-like Object. Received an instance of Object*/

  
    const pushPayload = {
      to: messageData.device_id,
      title: messageData.title,
      body: messageData.body
    };
    
    (async () => {
      const response = await axios.post('https://exp.host/--/api/v2/push/send', pushPayload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
    })();

    console.log(`Push notification sent successfully: ${response.data}`);
  } catch (error) {
    console.error(`Error sending push notification: ${error}`);
  }
});

