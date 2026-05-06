const { Expo } = require('expo-server-sdk');
const expo = new Expo();

/**
 * Send push notifications to multiple recipients
 * @param {Array} tokens - Array of push tokens (ExponentPushToken[xxx])
 * @param {String} title - Notification title
 * @param {String} body - Notification body
 * @param {Object} data - Custom data to send
 */
const sendNotification = async (tokens, title, body, data = {}) => {
  let messages = [];
  
  for (let pushToken of tokens) {
    if (!Expo.isExpoPushToken(pushToken)) {
      console.error(`Push token ${pushToken} is not a valid Expo push token`);
      continue;
    }

    messages.push({
      to: pushToken,
      sound: 'default',
      title,
      body,
      data,
      priority: 'high',
      channelId: 'default'
    });
  }

  let chunks = expo.chunkPushNotifications(messages);
  let tickets = [];
  
  for (let chunk of chunks) {
    try {
      let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
      tickets.push(...ticketChunk);
    } catch (error) {
      console.error('Error sending notification chunk:', error);
    }
  }
  
  return tickets;
};

module.exports = { sendNotification };
