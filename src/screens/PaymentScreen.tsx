import React, { useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  TouchableOpacity, 
  Alert, 
  Dimensions, 
  Platform 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { AppText } from '../components/AppText';
import AppImage from '../components/AppImage';
import { s, vs } from '../utils/responsive';
import CustomStatusBar from '../components/CustomStatusBar';
import images from '../assets/images';

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
  const { width, height } = Dimensions.get('window');
  const isLandscape = width > height;

  // Hide bottom tabs manually when this screen is focused
  useEffect(() => {
    const hideTabs = () => {
      let currentNav = navigation;
      for (let i = 0; i < 5; i++) {
        currentNav = currentNav.getParent();
        if (currentNav) {
          try {
            currentNav.setOptions({
              tabBarStyle: { display: 'none' }
            });
          } catch {
            // Ignore errors
          }
        } else {
          break;
        }
      }
    };

    // Hide tabs when component mounts
    hideTabs();
    
    // Also hide after a short delay
    const timeout = setTimeout(hideTabs, 100);
    
    return () => clearTimeout(timeout);
  }, [navigation]);

  const { movie, showtime, date, selectedSeats, total } = route.params;
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);

  // Payment methods
  const paymentMethods = [
    { id: 'card', name: 'Credit/Debit Card', icon: images.card },
    { id: 'paypal', name: 'PayPal', icon: images.paypal },
    { id: 'apple', name: 'Apple Pay', icon: images.applepay },
    { id: 'google', name: 'Google Pay', icon: images.googlepay },
  ];

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      Alert.alert(
        'Payment Successful!', 
        'Your tickets have been booked successfully. You will receive a confirmation email shortly.',
        [
          {
            text: 'OK',
            onPress: () => {
              // Use popToTop to go back to the first screen in the stack (WatchMain)
              navigation.popToTop();
            }
          }
        ]
      );
    }, 2000);
  };


  const calculateSubtotal = () => {
    return selectedSeats.reduce((sum, seatId) => {
      const rowIndex = parseInt(seatId.charAt(0), 10) - 1;
      return sum + (rowIndex >= 8 ? 150 : 50);
    }, 0);
  };

  const calculateTax = () => {
    return Math.round(calculateSubtotal() * 0.08); // 8% tax
  };

  const calculateServiceFee = () => {
    return Math.round(calculateSubtotal() * 0.05); // 5% service fee
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <CustomStatusBar barStyle="dark-content" backgroundColor="white" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <AppImage source={require('../assets/images/back.png')} size={15} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <AppText variant="bold" size="lg" color="textPrimary">
            Payment
          </AppText>
        </View>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        {/* Movie Summary Card */}
        <View style={[
          styles.summaryCard,
          Platform.OS === 'android' && isLandscape && styles.summaryCardAndroidLandscape
        ]}>
          <View style={styles.movieHeader}>
            <AppText variant="bold" size="lg" color="textPrimary" style={styles.movieTitle}>
              {movie?.title || 'The King\'s Man'}
            </AppText>
            <View style={styles.movieMeta}>
              <AppText variant="medium" size="sm" color="textSecondary">{date}</AppText>
              <AppText variant="medium" size="sm" color="textSecondary">•</AppText>
              <AppText variant="medium" size="sm" color="textSecondary">{showtime?.time}</AppText>
              <AppText variant="medium" size="sm" color="textSecondary">•</AppText>
              <AppText variant="medium" size="sm" color="textSecondary">{showtime?.hall}</AppText>
            </View>
          </View>
          
          {/* Seats */}
          <View style={styles.seatsRow}>
            <AppText variant="medium" size="sm" color="textSecondary">Seats:</AppText>
            <View style={styles.seatsContainer}>
              {selectedSeats.map((seat) => (
                <View key={seat} style={styles.seatTag}>
                  <AppText variant="medium" size="xs" color="textPrimary">{seat}</AppText>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Payment Method */}
        <View style={[
          styles.paymentSection,
          Platform.OS === 'android' && isLandscape && styles.paymentSectionAndroidLandscape
        ]}>
          <AppText variant="bold" size="md" color="textPrimary" style={styles.sectionTitle}>
            Payment Method
          </AppText>
          <View style={[
            styles.paymentMethodsGrid,
            isLandscape && styles.paymentMethodsGridLandscape
          ]}>
            {paymentMethods.map((method) => (
              <TouchableOpacity
                key={method.id}
                style={[
                  styles.paymentMethodCard,
                  selectedPaymentMethod === method.id && styles.selectedPaymentMethod,
                  Platform.OS === 'android' && isLandscape && styles.paymentMethodCardAndroidLandscape
                ]}
                onPress={() => setSelectedPaymentMethod(method.id)}
              >
                <AppImage 
                  source={method.icon} 
                  size={24}
                  style={styles.paymentIcon}
                  tintColor={undefined}
                />
                <AppText 
                  variant="medium" 
                  size="xs" 
                  color={selectedPaymentMethod === method.id ? "textLight" : "textPrimary"}
                  style={styles.paymentMethodText}
                >
                  {method.name}
                </AppText>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Invoice */}
        <View style={[
          styles.invoiceCard,
          Platform.OS === 'android' && isLandscape && styles.invoiceCardAndroidLandscape
        ]}>
          <View style={styles.invoiceHeader}>
            <AppText variant="bold" size="md" color="textPrimary">Invoice</AppText>
          </View>
          
          <View style={styles.invoiceRows}>
            <View style={styles.invoiceRow}>
              <AppText variant="regular" size="sm" color="textSecondary">Subtotal</AppText>
              <AppText variant="medium" size="sm" color="textPrimary">${calculateSubtotal()}</AppText>
            </View>
            <View style={styles.invoiceRow}>
              <AppText variant="regular" size="sm" color="textSecondary">Service Fee</AppText>
              <AppText variant="medium" size="sm" color="textPrimary">${calculateServiceFee()}</AppText>
            </View>
            <View style={styles.invoiceRow}>
              <AppText variant="regular" size="sm" color="textSecondary">Tax (8%)</AppText>
              <AppText variant="medium" size="sm" color="textPrimary">${calculateTax()}</AppText>
            </View>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.totalRow}>
            <AppText variant="bold" size="lg" color="textPrimary">Total</AppText>
            <AppText variant="bold" size="xl" color="primary">${total}</AppText>
          </View>
        </View>

        {/* Terms */}
        <View style={styles.termsSection}>
          <AppText variant="regular" size="xs" color="textSecondary" style={styles.termsText}>
            By proceeding, you agree to our Terms of Service. Tickets are non-refundable.
          </AppText>
        </View>
      </View>

      {/* Payment Button */}
      <View style={[
        styles.bottomButtonContainer,
        Platform.OS === 'android' && isLandscape && styles.bottomButtonContainerAndroidLandscape
      ]}>
        <TouchableOpacity 
          style={[
            styles.paymentButton,
            isProcessing && styles.processingButton,
            Platform.OS === 'android' && isLandscape && styles.paymentButtonAndroidLandscape
          ]}
          onPress={handlePayment}
          disabled={isProcessing}
        >
          <AppText variant="bold" size="lg" color="textLight">
            {isProcessing ? 'Processing...' : `Pay $${total}`}
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
    paddingHorizontal: s(20),
    paddingVertical: vs(16),
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  backButton: {
    padding: s(8),
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
  },
  placeholder: {
    width: s(40),
  },
  content: {
    flex: 1,
    paddingHorizontal: s(20),
    paddingTop: vs(20),
  },
  
  // Summary Card
  summaryCard: {
    backgroundColor: 'white',
    borderRadius: s(16),
    padding: s(20),
    marginBottom: vs(20),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  summaryCardAndroidLandscape: {
    padding: s(16),
    marginBottom: vs(16),
  },
  movieHeader: {
    marginBottom: vs(12),
  },
  movieTitle: {
    textAlign: 'center',
    marginBottom: vs(8),
  },
  movieMeta: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: s(8),
  },
  seatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(8),
  },
  seatsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: s(6),
  },
  seatTag: {
    backgroundColor: '#61C3F2',
    borderRadius: s(12),
    paddingHorizontal: s(8),
    paddingVertical: vs(4),
  },
  
  // Payment Section
  paymentSection: {
    marginBottom: vs(20),
  },
  paymentSectionAndroidLandscape: {
    marginBottom: vs(16),
  },
  sectionTitle: {
    marginBottom: vs(12),
  },
  paymentMethodsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: s(8),
  },
  paymentMethodsGridLandscape: {
    justifyContent: 'space-between',
  },
  paymentMethodCard: {
    backgroundColor: 'white',
    borderRadius: s(12),
    padding: s(8),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    minWidth: s(80),
    flex: 1,
    maxWidth: s(100),
    minHeight: s(80),
  },
  paymentMethodCardAndroidLandscape: {
    padding: s(10),
    minWidth: s(70),
    maxWidth: s(90),
    minHeight: s(70),
  },
  selectedPaymentMethod: {
    backgroundColor: '#61C3F2',
    borderColor: '#61C3F2',
  },
  paymentIcon: {
    marginBottom: vs(6),
    tintColor: undefined, // Let the image show its original colors
  },
  paymentMethodText: {
    textAlign: 'center',
  },
  
  // Invoice
  invoiceCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: s(16),
    padding: s(20),
    marginBottom: vs(20),
  },
  invoiceCardAndroidLandscape: {
    padding: s(16),
    marginBottom: vs(16),
  },
  invoiceHeader: {
    marginBottom: vs(12),
  },
  invoiceRows: {
    marginBottom: vs(8),
  },
  invoiceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: vs(6),
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E5E5',
    marginVertical: vs(12),
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  // Terms
  termsSection: {
    marginBottom: vs(20),
  },
  termsText: {
    textAlign: 'center',
    lineHeight: vs(16),
  },
  
  // Bottom Button
  bottomButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: s(20),
    paddingVertical: vs(16),
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  bottomButtonContainerAndroidLandscape: {
    paddingVertical: vs(12),
  },
  paymentButton: {
    backgroundColor: '#61C3F2',
    borderRadius: s(16),
    paddingVertical: vs(16),
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  paymentButtonAndroidLandscape: {
    paddingVertical: vs(14),
    borderRadius: s(12),
  },
  processingButton: {
    backgroundColor: '#8E8E93',
  },
});

export default PaymentScreen;
