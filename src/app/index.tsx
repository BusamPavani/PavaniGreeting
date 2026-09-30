// import { StyleSheet, Text, View } from 'react-native';

// export default function HomeScreen() {
//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>"Hello Pavani"</Text>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: 'bold',
//   },
// });


import { useEffect, useState } from 'react';
import {
  Image,
  ImageBackground,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});
async function registerForPushNotificationsAsync() {
  if (!Device.isDevice) {
    console.log('Push notifications require a physical device.');
    return;
  }

  const { status: existingStatus } =
    await Notifications.getPermissionsAsync();

  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } =
      await Notifications.requestPermissionsAsync();

    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.log('Notification permission was not granted.');
    return;
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
    });
  }

  const token = await Notifications.getExpoPushTokenAsync();

  console.log('PUSH TOKEN:', token.data);

  return token.data;
}
export default function HomeScreen() {
  const [festivalMode, setFestivalMode] = useState(false);

  // useEffect(() => {
  //    registerForPushNotificationsAsync();
  //   // Testing: festival mode after 10 seconds
  //   // For final requirement, change to: 5 * 60 * 1000
  //   const timer = setTimeout(() => {
  //     setFestivalMode(true);
  //   }, 60 * 1000);

  //   return () => clearTimeout(timer);
  // }, []);
  useEffect(() => {
  registerForPushNotificationsAsync();

  const notificationListener =
    Notifications.addNotificationReceivedListener((notification) => {
      console.log(
        'NOTIFICATION RECEIVED:',
        notification.request.content.title
      );
    });

  const responseListener =
    Notifications.addNotificationResponseReceivedListener((response) => {
      console.log(
        'NOTIFICATION OPENED:',
        response.notification.request.content.title
      );
    });

  const timer = setTimeout(() => {
    setFestivalMode(true);
  }, 60 * 1000);

  return () => {
    notificationListener.remove();
    responseListener.remove();
    clearTimeout(timer);
  };
}, []);

  return (
    <ImageBackground
      source={
        festivalMode
          ? require('../../assets/images/festival-bg.png')
          : require('../../assets/images/normal-bg.png')
      }
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.content}>

        <Image
          source={
            festivalMode
              ? require('../../assets/images/festival.png')
              : require('../../assets/images/normal.png')
          }
          style={styles.icon}
          resizeMode="contain"
        />

        <Text style={styles.title}>
          {festivalMode
            ? 'Hello Pavani'
            : 'Good Morning'
          }
        </Text>

        <Text style={styles.subtitle}>
          {festivalMode
            ? '✨ Happy Festival! ✨'
            : 'Have a wonderful day!'
            }
        </Text>

      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },

  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  icon: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  subtitle: {
    fontSize: 18,
    marginTop: 10,
    textAlign: 'center',
  },
});
