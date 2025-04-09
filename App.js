import React, { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  Image, 
  ScrollView,
  SafeAreaView,
  FlatList,
  Alert
} from 'react-native';
import { Camera } from 'expo-camera';
import * as Notifications from 'expo-notifications';
import { FontAwesome } from '@expo/vector-icons';

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function App() {
  const [cameraPermission, setCameraPermission] = useState(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [showElephants, setShowElephants] = useState(false);
  const [showReminders, setShowReminders] = useState(false);
  const [cameraType, setCameraType] = useState('front');
  const cameraRef = useRef(null);
  
  // Sample elephant images
  const elephantImages = [
    { id: '1', imageUrl: 'https://images.unsplash.com/photo-1535077516733-ad29da1026f6?q=80&w=3025&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', title: 'Baby elephant playing' },
    { id: '2', imageUrl: 'https://media.istockphoto.com/id/1485921650/photo/mother-and-baby-elephant-8.jpg?s=1024x1024&w=is&k=20&c=J-3FPvHWB1ghk4y5g9hKXzVYBUkLCRnZbL5XuVwJXFI=', title: 'Baby elephant with mother' },
    { id: '3', imageUrl: 'https://t3.ftcdn.net/jpg/01/84/70/82/360_F_184708212_OEq2Y6AqmiNSqSxwdPIUCVZDOCE1nlb2.jpg', title: 'Baby elephant in joy' },
    { id: '4', imageUrl: 'https://media.istockphoto.com/id/1502026225/photo/african-elephants-on-savannah.jpg?s=1024x1024&w=is&k=20&c=-e5xSg_E46Cpo_EPz63E5KYhuxs90_vVF6ZSr776F44=', title: 'Cute you and me elephant' },
    { id: '5', imageUrl: 'https://iso.500px.com/wp-content/uploads/2014/08/2048-5-1500x1000.jpg', title: 'Our baby elephant' },
    { id: '6', imageUrl: 'https://static.vecteezy.com/system/resources/thumbnails/030/634/635/small_2x/close-up-of-a-cute-baby-elephant-with-textured-background-and-space-for-text-background-image-ai-generated-photo.jpg', title: 'Souru elephant' },
    { id: '7', imageUrl: 'https://iso.500px.com/wp-content/uploads/2014/08/2048-5-1500x1000.jpg', title: 'our Baby elephants' },
  ];

  // Sample reminders
  const [reminders, setReminders] = useState([
    { id: '1', text: 'Talk to sourabh! 💊', isIMP: true },
    { id: '2', text: 'Stay hydrated today! 💧', isIMP: false },
    { id: '3', text: 'Did you exercise today? 🏃‍♀️', isIMP: false },
    { id: '4', text: 'Lee je Jal peelo', isIMP: false },
    { id: '5', text: 'Talk to sourabh! 💊', isIMP: true },
        { id: '1', text: 'Talk to sourabh! 💊', isIMP: true },
    { id: '2', text: 'Stay hydrated today! 💧', isIMP: false },
    { id: '3', text: 'Did you exercise today? 🏃‍♀️', isIMP: false },
    { id: '4', text: 'Lee je Jal peelo', isIMP: false },
  ]);

  // Handle camera permissions
  useEffect(() => {
    (async () => {
      try {
        const { status } = await Camera.requestCameraPermissionsAsync();
        setCameraPermission(status === 'granted');
      } catch (err) {
        console.log("Camera permission error:", err);
        setCameraPermission(false);
      }
    })();

    // Request notification permissions
    registerForPushNotificationsAsync();
  }, []);

  // Register for push notifications
  async function registerForPushNotificationsAsync() {
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
    } catch (err) {
      console.log("Notification permission error:", err);
    }
  }

  // Schedule a push notification
  async function schedulePushNotification(title, body) {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: title,
          body: body,
          sound: true,
          vibrate: [0, 250, 250, 250],
        },
        trigger: { seconds: 2 },
      });
    } catch (err) {
      console.log("Notification scheduling error:", err);
    }
  }

  // Add a new reminder
  const addReminder = () => {
    Alert.prompt(
      "Add a new reminder",
      "What should I remind you?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Add",
          onPress: (text) => {
            if (text) {
              const newReminder = {
                id: (reminders.length + 1).toString(),
                text: text,
                isIMP: false
              };
              setReminders([...reminders, newReminder]);
              schedulePushNotification("New Reminder Added", "Your reminder has been set!");
            }
          }
        }
      ]
    );
  };

  // Open camera view
  const openCamera = () => {
    setCameraActive(true);
    setShowElephants(false);
    setShowReminders(false);
    schedulePushNotification("Moon Camera", "Look at the moon anytime you want! 🌙");
  };

  // Open elephant gallery
  const openElephantGallery = () => {
    setShowElephants(true);
    setCameraActive(false);
    setShowReminders(false);
    schedulePushNotification("Elephant Gallery", "Enjoy these cute baby elephants! 🐘");
  };

  // Open reminders
  const openReminders = () => {
    setShowReminders(true);
    setCameraActive(false);
    setShowElephants(false);
    schedulePushNotification("Reminders", "Here are your daily reminders! 📝");
  };

  // Close all active views
  const closeAll = () => {
    setCameraActive(false);
    setShowElephants(false);
    setShowReminders(false);
  };

  // Flip camera
  const flipCamera = () => {
    setCameraType(cameraType === 'front' ? 'back' : 'front');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <FontAwesome name="heart" size={20} color="#ff6b81" />
        <Text style={styles.headerText}>Sakshi App</Text>
        <FontAwesome name="heart" size={20} color="#ff6b81" />
      </View>

      {/* Main Button Menu */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, { backgroundColor: '#e0cffc' }]}
          onPress={openCamera}
        >
          <FontAwesome name="moon-o" size={32} color="#9c88ff" />
          <Text style={styles.buttonText}>Moon Camera</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, { backgroundColor: '#c3ffc1' }]}
          onPress={openElephantGallery}
        >
          <FontAwesome name="image" size={32} color="#20bf6b" />
          <Text style={styles.buttonText}>Elephant Pics</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, { backgroundColor: '#fff0c1' }]}
          onPress={openReminders}
        >
          <FontAwesome name="bell" size={32} color="#f7b731" />
          <Text style={styles.buttonText}>Reminders</Text>
        </TouchableOpacity>
      </View>

      {/* Content Area */}
      <View style={styles.contentArea}>
        {/* Default Welcome View */}
        {!cameraActive && !showElephants && !showReminders && (
          <View style={styles.welcomeView}>
            <FontAwesome name="heart" size={64} color="#ff9ff3" />
            <Text style={styles.welcomeText}>Welcome to your special app!</Text>
            <Text style={styles.welcomeSubText}>Choose a feature above to get started.</Text>
          </View>
        )}

        {/* Camera View - SIMPLIFIED TO FIX ERROR */}
        {cameraActive && (
          <View style={styles.cameraContainer}>
            <View style={[styles.camera, {backgroundColor: '#000', justifyContent: 'center', alignItems: 'center'}]}>
              <Text style={{color: 'white', fontSize: 18}}>Moon Camera View</Text>
              <Text style={{color: 'white', marginTop: 10, fontSize: 14}}>Look at the moon anytime! 🌙</Text>
              
              <View style={{position: 'absolute', bottom: 20, width: '100%', flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20}}>
                <TouchableOpacity 
                  style={styles.cameraButton}
                  onPress={flipCamera}>
                  <FontAwesome name="refresh" size={24} color="white" />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.cameraButton}
                  onPress={closeAll}>
                  <FontAwesome name="times" size={24} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* Elephant Gallery View */}
        {showElephants && (
          <View style={styles.galleryContainer}>
            <Text style={styles.sectionTitle}>Cute Baby Elephants 🐘</Text>
            <FlatList
              data={elephantImages}
              numColumns={2}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.elephantCard}>
                  <Image
                    source={{ uri: item.imageUrl }}
                    style={styles.elephantImage}
                  />
                  <Text style={styles.elephantTitle}>{item.title}</Text>
                </View>
              )}
            />
          </View>
        )}

        {/* Reminders View */}
        {showReminders && (
          <View style={styles.remindersContainer}>
            <Text style={styles.sectionTitle}>Daily Reminders 📝</Text>
            <ScrollView style={styles.remindersList}>
              {reminders.map((reminder) => (
                <View key={reminder.id} style={styles.reminderCard}>
                  <Text style={styles.reminderText}>{reminder.text}</Text>
                  {reminder.isIMP && (
                    <View style={styles.impBadge}>
                      <Text style={styles.impText}>imp</Text>
                    </View>
                  )}
                </View>
              ))}
            </ScrollView>
            <TouchableOpacity 
              style={styles.addReminderButton}
              onPress={addReminder}>
              <Text style={styles.addReminderText}>Add New Reminder</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff5f7',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ffcde0',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ff6b81',
    marginHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    margin: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 12,
    width: '30%',
  },
  buttonText: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  contentArea: {
    flex: 1,
    backgroundColor: '#fff',
    margin: 12,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  welcomeView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ff6b81',
    marginTop: 16,
    textAlign: 'center',
  },
  welcomeSubText: {
    fontSize: 14,
    color: '#ff6b81',
    opacity: 0.7,
    marginTop: 8,
    textAlign: 'center',
  },
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 20,
  },
  cameraButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cameraButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraOverlayText: {
    color: 'white',
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 8,
    borderRadius: 8,
    overflow: 'hidden',
  },
  galleryContainer: {
    flex: 1,
    padding: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#ff6b81',
    textAlign: 'center',
  },
  elephantCard: {
    flex: 1,
    margin: 6,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    overflow: 'hidden',
  },
  elephantImage: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  elephantTitle: {
    padding: 8,
    fontSize: 12,
    color: '#333',
  },
  remindersContainer: {
    flex: 1,
    padding: 12,
  },
  remindersList: {
    flex: 1,
  },
  reminderCard: {
    backgroundColor: '#fff9db',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#fcc419',
  },
  reminderText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  memeBadge: {
    backgroundColor: '#fcc419',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  memeText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: 'bold',
  },
  addReminderButton: {
    backgroundColor: '#ffd8a8',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  addReminderText: {
    color: '#e8590c',
    fontWeight: '500',
  },
});