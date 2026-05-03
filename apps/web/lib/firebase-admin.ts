import admin from 'firebase-admin'

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID!,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL!,
      privateKey: process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
    }),
  })
}

export const messaging = admin.messaging()

export async function sendPushNotification(
  fcmToken: string,
  title: string,
  body: string,
  data?: Record<string, string>
) {
  try {
    await messaging.send({
      token: fcmToken,
      notification: { title, body },
      data,
      webpush: {
        fcmOptions: { link: process.env.NEXT_PUBLIC_APP_URL },
        notification: {
          icon: '/icons/icon-192.png',
          badge: '/icons/badge-72.png',
        },
      },
    })
  } catch (error) {
    console.error('FCM send error:', error)
  }
}
