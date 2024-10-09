import { SafeAreaView } from "react-native-safe-area-context";
import { router } from 'expo-router';
import { StyleSheet,ScrollView,View } from "react-native";
import { Button } from "react-native";
import { FlatList } from "react-native";
import { Text } from "react-native";
const Card = ({ children }) => <View style={styles.card}>{children}</View>;
const CardHeader = ({ children }) => <View style={styles.cardHeader}>{children}</View>;
const CardContent = ({ children }) => <View style={styles.cardContent}>{children}</View>;
const CardTitle = ({ children }) => <Text style={styles.cardTitle}>{children}</Text>;
const CardDescription = ({ children }) => <Text style={styles.cardDescription}>{children}</Text>;




  const Separator = () => <View style={styles.separator} />;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8', // Light background color for the entire screen
  },
  content: {
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2937',
  },
  cardDescription: {
    fontSize: 14,
    color: '#4b5563',
    marginTop: 5,
  },
  cardContent: {},
  grid: {
    flexDirection: 'column',
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    backgroundColor: '#f97316',
  },
  navItem: {
    color: '#fff',
    fontSize: 16,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#4b5563',
    marginBottom: 20,
  },
});

export default function LeaderboardPage () {
    const leaderboard = [
      { id: 1, name: "Alice Johnson", points: 1200},
      { id: 2, name: "Bob Williams", points: 980 },
      { id: 3, name: "Carol Davis", points: 850 },
      { id: 4, name: "David Brown", points: 720},
      { id: 5, name: "Eva Wilson", points: 650 },
    ];
    function goToPreviousPage() {
      router.replace('/home'); // Redirect to home page
    };
  
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.content}>
          <Card>
            <CardHeader>
              <CardTitle>Community Leaderboard</CardTitle>
              <CardDescription>Recognizing our most active and helpful community members</CardDescription>
            </CardHeader>
            <CardContent>
              <FlatList
                data={leaderboard}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item, index }) => (
                  <View style={styles.leaderboardItem}>
                    <Text style={styles.leaderboardRank}>{index + 1}</Text>
                    <View style={styles.leaderboardUser}>
                      
                      <Text style={styles.leaderboardName}>{item.name}</Text>
                    </View>
                    <Text style={styles.leaderboardPoints}>{item.points}</Text>
                    
                  </View>
                )}
              />
            </CardContent>
          </Card>
          <Button title="Go to Home" onPress={goToPreviousPage} />
        </ScrollView>
      </SafeAreaView>
    );
  };