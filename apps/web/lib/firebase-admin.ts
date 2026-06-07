import admin from 'firebase-admin'

function initFirebase() {
  if (!admin.apps.length) {
    if (
      process.env.FIREBASE_PROJECT_ID &&
      process.env.FIREBASE_CLIENT_EMAIL &&
      process.env.FIREBASE_PRIVATE_KEY
    ) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        }),
      })
    }
  }
}

export async function sendPushNotification(
  fcmToken: string,
  title: string,
  body: string,
  data?: Record<string, string>
) {
  initFirebase()

  if (!admin.apps.length) {
    console.warn('Firebase Admin not initialized. Skipping notification.')
    return
  }

  try {
    await admin.messaging().send({
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
