import React from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { AppText } from '../components/AppText';
import { useHideBottomTabs } from '../hooks';

interface PaymentScreenProps {
  navigation: any;
  route: {
    params: {
      movie: any;
      showtime: any;
      date: string;
      selectedSeats: string[];
      total: number;
    };
  };
}

const PaymentScreen: React.FC<PaymentScreenProps> = ({ navigation, route }) => {
  const { state } = useTheme();
  const { theme } = state;

  // Hide bottom tabs when this screen is focused
  useHideBottomTabs(navigation);

  const { movie, showtime, date, selectedSeats, total } = route.params;

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handlePayment = () => {
    // Handle payment logic here
    Alert.alert('Success', 'Payment completed successfully!');
    navigation.navigate('WatchMain');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <AppText variant="bold" size="xl" color="textPrimary">
            ←
          </AppText>
        </TouchableOpacity>
        <AppText variant="bold" size="lg" color="textPrimary">
          Payment
        </AppText>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        <AppText variant="bold" size="xxl" color="textPrimary">
          Payment Screen
        </AppText>
        <AppText variant="regular" size="md" color="textSecondary" style={styles.description}>
          This screen will handle payment processing for the selected seats.
        </AppText>
        
        <View style={styles.summary}>
          <AppText variant="bold" size="lg" color="textPrimary" style={styles.summaryTitle}>
            Booking Summary
          </AppText>
          <AppText variant="regular" size="md" color="textSecondary">
            Movie: {movie?.title}
          </AppText>
          <AppText variant="regular" size="md" color="textSecondary">
            Showtime: {showtime?.time}
          </AppText>
          <AppText variant="regular" size="md" color="textSecondary">
            Hall: {showtime?.hall}
          </AppText>
          <AppText variant="regular" size="md" color="textSecondary">
            Date: {date}
          </AppText>
          <AppText variant="regular" size="md" color="textSecondary">
            Seats: {selectedSeats.join(', ')}
          </AppText>
          <AppText variant="bold" size="lg" color="textPrimary" style={styles.total}>
            Total: ${total}
          </AppText>
        </View>
      </View>

      {/* Payment Button */}
      <View style={styles.bottomButtonContainer}>
        <TouchableOpacity 
          style={styles.paymentButton}
          onPress={handlePayment}
        >
          <AppText variant="bold" size="lg" color="textLight">
            Complete Payment
          </AppText>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  backButton: {
    padding: 8,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  description: {
    textAlign: 'center',
    marginTop: 16,
  },
  summary: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    marginTop: 24,
  },
  summaryTitle: {
    marginBottom: 12,
  },
  total: {
    marginTop: 12,
    textAlign: 'center',
  },
  bottomButtonContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  paymentButton: {
    backgroundColor: '#61C3F2',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default PaymentScreen;
