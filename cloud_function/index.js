const functions = require('@google-cloud/functions-framework');
const axios = require('axios');


functions.cloudEvent('notificationPubSub', cloudEvent => {
  try {
    const base64message = cloudEvent.data.message.data;

    const messageData = JSON.parse(base64message
      ? Buffer.from(base64message, 'base64').toString()
      : '');


    console.log("messageData:")
    console.log(messageData)
  
    const pushPayload = {
      to: messageData.device_id,
      title: messageData.title,
      body: messageData.body
    };

    console.log("pushPayLoad:")
    console.log(pushPayload)

    let response;
    
    (async () => {
      response = await axios.post('https://exp.host/--/api/v2/push/send', pushPayload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
    })();

    console.log(`Push notification sent successfully`);
  } catch (error) {
    console.error(`Error sending push notification: ${error}`);
  }
});

