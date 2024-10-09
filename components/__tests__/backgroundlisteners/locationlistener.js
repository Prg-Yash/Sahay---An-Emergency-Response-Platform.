import * as TaskManager from "expo-task-manager";
import * as Location from "expo-location";

const LOCATION_TASK_NAME = "background-location-task";

// Define the task that will run in the background
TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
  if (error) {
    console.error(error);
    return;
  }
  if (data) {
    const { locations } = data;
    const [location] = locations;
    if (location) {
      const { latitude, longitude } = location.coords;
      console.log("Received new location:", latitude, longitude);
      await sendLocationToServer(latitude, longitude);
    }
  }
});

// Function to start background location tracking
const startBackgroundLocationTracking = async () => {
  const { status } = await Location.requestBackgroundPermissionsAsync();
  if (status === "granted") {
    await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
      accuracy: Location.Accuracy.High,
      timeInterval: 60000, // Update every 60 seconds
      distanceInterval: 50, // Update every 50 meters
      showsBackgroundLocationIndicator: true,
      foregroundService: {
        notificationTitle: "App Tracking Location",
        notificationBody: "Your location is being tracked in the background",
      },
    });
  } else {
    console.log("Background location permission not granted");
  }
};

// Call this function to stop the location tracking
const stopBackgroundLocationTracking = async () => {
  await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
};

// Function to send location to the server
const sendLocationToServer = async (latitude, longitude) => {
  try {
    // const response = await fetch('https://your-server-endpoint.com/location', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     latitude,
    //     longitude,
    //     timestamp: new Date().toISOString(),
    //   }),
    // });
    // if (!response.ok) {
    //   throw new Error('Failed to send location to the server');
    // }
    console.log("Location sent successfully! ", latitude, longitude);
  } catch (error) {
    console.error("Error sending location:", error);
  }
};

export { startBackgroundLocationTracking, stopBackgroundLocationTracking };
