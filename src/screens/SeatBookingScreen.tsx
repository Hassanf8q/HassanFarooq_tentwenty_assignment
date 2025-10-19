import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Dimensions,
  Image 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { AppText } from '../components/AppText';
import { useHideBottomTabs } from '../hooks';
import images from '../assets/images';
import CustomStatusBar from '../components/CustomStatusBar';

interface SeatBookingScreenProps {
  navigation: any;
  route: {
    params: {
      movie: any;
    };
  };
}

const SeatBookingScreen: React.FC<SeatBookingScreenProps> = ({ navigation, route }) => {
  const { state } = useTheme();
  const { theme } = state;
  const { width } = Dimensions.get('window');

  // Hide bottom tabs when this screen is focused
  useHideBottomTabs(navigation);

  // State for selected date and showtime
  const [selectedDate, setSelectedDate] = useState('5 Mar');
  const [selectedShowtime, setSelectedShowtime] = useState(0);

  // Sample data
  const dates = ['5 Mar', '6 Mar', '7 Mar', '8 Mar', '9 Mar', '10 Mar', '11 Mar'];
  const showtimes = [
    {
      time: '12:30',
      hall: 'Cinetech + Hall 1',
      price: '50$',
      bonus: '2500 bonus',
      seats: [
        ['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8'],
        ['B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8'],
        ['C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8'],
        ['D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8'],
        ['E1', 'E2', 'E3', 'E4', 'E5', 'E6', 'E7', 'E8'],
        ['F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8'],
      ]
    },
    {
      time: '13:30',
      hall: 'Cinetech',
      price: '75$',
      bonus: '300 bonus',
      seats: [
        ['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8'],
        ['B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8'],
        ['C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8'],
        ['D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8'],
        ['E1', 'E2', 'E3', 'E4', 'E5', 'E6', 'E7', 'E8'],
        ['F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8'],
      ]
    },
    {
      time: '15:30',
      hall: 'Cinetech + Hall 2',
      price: '60$',
      bonus: '2800 bonus',
      seats: [
        ['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8'],
        ['B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8'],
        ['C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8'],
        ['D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8'],
        ['E1', 'E2', 'E3', 'E4', 'E5', 'E6', 'E7', 'E8'],
        ['F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8'],
      ]
    }
  ];

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleSelectSeats = () => {
    // Navigate to seat selection sub-screen
    navigation.navigate('SeatSelection', {
      movie: route.params?.movie,
      showtime: showtimes[selectedShowtime],
      date: selectedDate
    });
  };

  const renderSeatLayout = () => {
    return (
      <View style={styles.seatLayout}>
        {/* Use allseats.png icon directly */}
        <Image 
          source={images.allseats} 
          style={styles.allseatsImage}
          resizeMode="contain"
        />
      </View>
    );
  };

  const getSeatColor = (seat: string, rowIndex: number) => {
    // Different colors for different seat types/rows
    const colors = ['#61C3F2', '#E26CA5', '#564CA3', '#F9B091', '#8E8E93'];
    return colors[rowIndex % colors.length];
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <CustomStatusBar barStyle="dark-content" backgroundColor="white" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <AppText variant="bold" size="xl" color="textPrimary">
            ←
          </AppText>
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <AppText variant="bold" size="lg" color="textPrimary">
            {route.params?.movie?.title || 'The King\'s Man'}
          </AppText>
          <AppText variant="regular" size="sm" color="primary" style={styles.releaseDate}>
            In Theaters December 22, 2021
          </AppText>
        </View>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Date Selection */}
        <View style={styles.section}>
          <AppText variant="bold"   size="lg"  weight="semiBold" color="textPrimary" style={styles.sectionTitle}>
            Date
          </AppText>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.dateScrollView}
            contentContainerStyle={styles.dateContainer}
          >
            {dates.map((date, index) => (
              <TouchableOpacity
                key={date}
                style={[
                  styles.dateButton,
                  selectedDate === date && styles.selectedDateButton
                ]}
                onPress={() => setSelectedDate(date)}
              >
                <AppText 
                  variant="medium" 
                  size="sm" 
                  color={selectedDate === date ? "textLight" : "textPrimary"}
                >
                  {date}
                </AppText>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Showtime Selection */}
        <View style={styles.section}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.showtimeScrollView}
            contentContainerStyle={styles.showtimeContainer}
          >
            {showtimes.map((showtime, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.showtimeCard,
                  selectedShowtime === index && styles.selectedShowtimeCard
                ]}
                onPress={() => setSelectedShowtime(index)}
              >
                <AppText variant="bold" size="md" color="textPrimary">
                  {showtime.time}
                </AppText>
                <AppText variant="regular" size="sm" color="textSecondary" style={styles.hallName}>
                  {showtime.hall}
                </AppText>
                
                {/* Seat Layout */}
                {renderSeatLayout()}
                
                {/* Pricing */}
                <AppText variant="bold" size="sm" color="textPrimary" style={styles.pricing}>
                  From {showtime.price} or {showtime.bonus}
                </AppText>
              </TouchableOpacity>
            ))}
            
          </ScrollView>
         
        </View>

       
      </ScrollView>

      {/* Select Seats Button */}
      <View style={styles.bottomButtonContainer}>
        <TouchableOpacity 
          style={styles.selectSeatsButton}
          onPress={handleSelectSeats}
        >
          <AppText variant="bold" size="lg" color="textLight">
            Select Seats
          </AppText>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'white',
  },
  backButton: {
    padding: 8,
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
  },
  releaseDate: {
    marginTop: 4,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 12,
    marginTop:100,
    paddingVertical: 8,
    
  },
  dateScrollView: {
    marginBottom: 8,
   
  
  },
  dateContainer: {
    paddingRight: 20,
  },
  dateButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    marginRight: 12,
    minWidth: 60,
    alignItems: 'center',
  },
  selectedDateButton: {
    backgroundColor: '#61C3F2',
    borderColor: '#61C3F2',
  },
  showtimeScrollView: {
    marginBottom: 8,
  },
  showtimeContainer: {
    paddingRight: 20,
  },
  showtimeCard: {
    width: 280,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginRight: 16,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    minHeight: 280,
    justifyContent: 'space-between',
  },
  selectedShowtimeCard: {
    borderColor: '#61C3F2',
    borderWidth: 2,
  },
  hallName: {
    marginTop: 4,
    marginBottom: 8,
  },
  seatLayout: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#61C3F2',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  allseatsImage: {
    width: 200,
    height: 100,
  },
  pricing: {
    textAlign: 'center',
    marginTop: 8,
  },
  bottomButtonContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  selectSeatsButton: {
    backgroundColor: '#61C3F2',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default SeatBookingScreen;
