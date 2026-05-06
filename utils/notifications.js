/**
 * utils/notifications.js
 */

// حلينا مشكلة الـ ESM عن طريق تحميل المكتبة وقت التشغيل فقط
let Expo;
let expoInstance;

const getExpoClient = async () => {
  if (!expoInstance) {
    // Dynamic import for ES Modules in CommonJS
    const sdk = await import('expo-server-sdk');
    Expo = sdk.Expo;
    expoInstance = new Expo();
  }
  return { Expo, expoInstance };
};

/**
 * Send push notifications to multiple recipients
 */
const sendNotification = async (tokens, title, body, data = {}) => {
  const { Expo, expoInstance: expo } = await getExpoClient();
  
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
