import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Dimensions,
  Image,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { AppText } from '../components/AppText';
import { useHideBottomTabs } from '../hooks';
import images from '../assets/images';
import CustomStatusBar from '../components/CustomStatusBar';

interface SeatSelectionScreenProps {
  navigation: any;
  route: {
    params: {
      movie: any;
      showtime: any;
      date: string;
    };
  };
}

const SeatSelectionScreen: React.FC<SeatSelectionScreenProps> = ({ navigation, route }) => {
  const { state } = useTheme();
  const { theme } = state;
  const { width, height } = Dimensions.get('window');
  const isLandscape = width > height;

  // Hide bottom tabs when this screen is focused
  useHideBottomTabs(navigation);

  // State for selected seats
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [scale, setScale] = useState(1);
  const [translateX, setTranslateX] = useState(0);
  const [translateY, setTranslateY] = useState(0);

  const { movie, showtime, date } = route.params;

  // Sample seat data matching screenshot layout with aisles
  const seatRows = [
    // Row 1 - fewer seats on sides
    ['1C', '1D', '1E', '1F', '1G', '1H'],
    // Row 2 - fewer seats on sides  
    ['2C', '2D', '2E', '2F', '2G', '2H'],
    // Row 3 - full row
    ['3A', '3B', '3C', '3D', '3E', '3F', '3G', '3H'],
    // Row 4 - fewer seats on sides
    ['4C', '4D', '4E', '4F', '4G', '4H'],
    // Row 5 - fewer seats on sides
    ['5C', '5D', '5E', '5F', '5G', '5H'],
    // Row 6 - fewer seats on sides
    ['6C', '6D', '6E', '6F', '6G', '6H'],
    // Row 7 - fewer seats on sides
    ['7C', '7D', '7E', '7F', '7G', '7H'],
    // Row 8 - fewer seats on sides
    ['8C', '8D', '8E', '8F', '8G', '8H'],
    // Row 9 - fewer seats on sides
    ['9C', '9D', '9E', '9F', '9G', '9H'],
    // Row 10 - VIP row, fewer seats on sides
    ['10C', '10D', '10E', '10F', '10G', '10H'],
  ];

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.15, 1.8));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.15, 0.6));
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleSeatPress = (seatId: string) => {
    setSelectedSeats(prev => {
      if (prev.includes(seatId)) {
        return prev.filter(seat => seat !== seatId);
      } else {
        return [...prev, seatId];
      }
    });
  };

  const getSeatStatus = (seatId: string, rowIndex: number) => {
    if (selectedSeats.includes(seatId)) {
      return 'selected';
    }
    
    // VIP seats (rows 9 and 10)
    if (rowIndex >= 8) {
      return 'vip';
    }
    
    // Some seats are not available (scattered)
    const unavailableSeats = ['2C', '3F', '5A', '6D', '7G', '8B'];
    if (unavailableSeats.includes(seatId)) {
      return 'unavailable';
    }
    
    return 'available';
  };

  const getSeatTintColor = (seatId: string, rowIndex: number) => {
    const status = getSeatStatus(seatId, rowIndex);
    
    switch (status) {
      case 'selected':
        return '#FFD700'; // Gold/Yellow
      case 'vip':
        return '#8B5CF6'; // Purple
      case 'unavailable':
        return '#8E8E93'; // Grey
      default:
        return '#61C3F2'; // Light blue
    }
  };

  const calculateTotal = () => {
    let total = 0;
    selectedSeats.forEach(seatId => {
      const rowIndex = seatRows.findIndex(row => row.includes(seatId));
      if (rowIndex >= 8) {
        total += 150; // VIP seats
      } else {
        total += 50; // Regular seats
      }
    });
    return total;
  };

  const renderSeatMap = () => {
    return (
      <View style={styles.seatMapContainer}>
        {/* Upper Layer above first row */}
        <View style={styles.upperLayerContainer}>
          <Image 
            source={images.upperlayer} 
            style={[styles.upperLayerImage, Platform.OS === 'android' && { height: 34 }]}
            resizeMode="contain"
          />
        </View>
        
        {/* Screen indicator */}
        <View style={styles.screenIndicator}>
          {/* <View style={styles.screenLine} /> */}
          <AppText variant="bold" size="md" color="textSecondary">
            SCREEN
          </AppText>
        </View>
        
        {/* Seat map with zoom */}
        <View style={[
          styles.zoomableContainer,
          Platform.OS === 'android' && (isLandscape ? { height: 260 } : { height: 300 }),
          Platform.OS === 'ios' && isLandscape ? { height: 280 } : null,
        ]}>
          <View 
            style={[
              styles.seatMapContent,
              {
                transform: [
                  { scale: scale },
                  { translateX: translateX },
                  { translateY: translateY }
                ]
              }
            ]}
          >
            {/* Seat rows */}
            {seatRows.map((row, rowIndex) => (
              <View key={rowIndex} style={styles.seatRow}>
                {/* Row number */}
                <AppText variant="medium" size="sm" color="textSecondary" style={styles.rowNumber}>
                  {rowIndex + 1}
                </AppText>
                
                {/* Seats */}
                {row.map((seatId) => (
                  <TouchableOpacity
                    key={seatId}
                    style={styles.seatContainer}
                    onPress={() => {
                      const status = getSeatStatus(seatId, rowIndex);
                      if (status !== 'unavailable') {
                        handleSeatPress(seatId);
                      }
                    }}
                    disabled={getSeatStatus(seatId, rowIndex) === 'unavailable'}
                  >
                    <Image 
                      source={images.singleseat} 
                      style={[
                        styles.singleseatImage,
                        Platform.OS === 'android' && (isLandscape ? { width: 16, height: 16 } : { width: 18, height: 18 }),
                        Platform.OS === 'ios' && isLandscape ? { width: 17, height: 17 } : null,
                        { tintColor: getSeatTintColor(seatId, rowIndex) }
                      ]}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </View>
          
          {/* Zoom controls */}
          <View style={styles.zoomControls}>
            <TouchableOpacity style={styles.zoomButton} onPress={handleZoomOut}>
              <AppText variant="bold" size="lg" color="textPrimary">-</AppText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.zoomButton} onPress={handleZoomIn}>
              <AppText variant="bold" size="lg" color="textPrimary">+</AppText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      <CustomStatusBar barStyle="dark-content" backgroundColor="white" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
        <Image 
              source={images.back} 
              style={{ 
                width: 15, 
                height: 15, 
                
              }} 
              resizeMode="contain"
            />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <AppText variant="bold" size="lg" color="textPrimary">
            {movie?.title || 'The King\'s Man'}
          </AppText>
          <AppText variant="regular" size="sm" color="primary" style={styles.showtimeInfo}>
            March 5, 2021 | {showtime.time} Hall 1
          </AppText>
        </View>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Seat Map */}
        <View style={styles.seatSection}>
          {renderSeatMap()}
        </View>

        {/* Seat Legend */}
        <View style={styles.legendSection}>
          <View style={styles.legendContainer}>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#FFD700' }]} />
              <AppText variant="regular" size="sm" color="textSecondary">
                Selected
              </AppText>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#8E8E93' }]} />
              <AppText variant="regular" size="sm" color="textSecondary">
                Not available
              </AppText>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#8B5CF6' }]} />
              <AppText variant="regular" size="sm" color="textSecondary">
                VIP (150$)
              </AppText>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#61C3F2' }]} />
              <AppText variant="regular" size="sm" color="textSecondary">
                Regular (50 $)
              </AppText>
            </View>
          </View>
        </View>

        {/* Selected Seat Information */}
        {selectedSeats.length > 0 && (
          <View style={styles.selectedSeatInfo}>
            <View style={styles.selectedSeatPill}>
              <AppText variant="medium" size="sm" color="textPrimary">
                {selectedSeats[0]} / {selectedSeats[0].charAt(0)} row
              </AppText>
              <TouchableOpacity 
                onPress={() => setSelectedSeats([])}
                style={styles.removeButton}
              >
                <AppText variant="bold" size="sm" color="textPrimary">X</AppText>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.bottomActionBar}>
        <View style={styles.totalSection}>
          <AppText variant="regular" size="sm" color="textSecondary">
            Total Price
          </AppText>
          <AppText variant="bold" size="lg" color="textPrimary">
            $ {calculateTotal()}
          </AppText>
        </View>
        
        <TouchableOpacity 
          style={[
            styles.proceedButton,
            selectedSeats.length === 0 && styles.disabledButton
          ]}
          onPress={() => {
            if (selectedSeats.length > 0) {
              navigation.navigate('Payment', {
                movie,
                showtime,
                date,
                selectedSeats,
                total: calculateTotal()
              });
            }
          }}
          disabled={selectedSeats.length === 0}
        >
          <AppText variant="bold" size="lg" color="textLight">
            Proceed to pay
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
  showtimeInfo: {
    marginTop: 4,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  seatSection: {
    marginVertical: 20,
    alignItems: 'center',
  },
  seatMapContainer: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 20,
    // borderWidth: 2,
    borderColor: '#61C3F2',
    minWidth: "100%",
    position: 'relative',
  },
  upperLayerContainer: {
    position: 'absolute',
    top: 5,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
  },
  upperLayerImage: {
    width: "100%",
    height: 40,
  },
  screenIndicator: {
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 8,
  },
  screenLine: {
    width: 200,
    height: 2,
    backgroundColor: '#61C3F2',
    borderRadius: 1,
    marginBottom: 8,
  },
  zoomableContainer: {
    position: 'relative',
    height: 400,
    overflow: 'hidden',
  },
  seatMapContent: {
    paddingTop: 20,
  },
  seatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Platform.OS === 'android' ? 4 : 6,
    justifyContent: 'flex-start',
    paddingHorizontal: Platform.OS === 'android' ? 16 : 20,
  },
  rowNumber: {
    width: Platform.OS === 'android' ? 26 : 30,
    textAlign: 'center',
    marginRight: Platform.OS === 'android' ? 10 : 12,
    fontSize: Platform.OS === 'android' ? 11 : 12,
  },
  seatContainer: {
    marginHorizontal: Platform.OS === 'android' ? 2 : 3,
  },
  singleseatImage: {
    width: 20,
    height: 20,
  },
  zoomControls: {
    position: 'absolute',
    right: Platform.OS === 'android' ? 8 : 10,
    bottom: Platform.OS === 'android' ? 8 : 10,
    flexDirection: 'row',
  },
  zoomButton: {
    width: Platform.OS === 'android' ? 28 : 32,
    height: Platform.OS === 'android' ? 28 : 32,
    borderRadius: Platform.OS === 'android' ? 14 : 16,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Platform.OS === 'android' ? 6 : 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  legendSection: {
    marginBottom: 24,
  },
  legendContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    width: '48%',
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  selectedSeatInfo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  selectedSeatPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  removeButton: {
    marginLeft: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomActionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  totalSection: {
    alignItems: 'flex-start',
  },
  proceedButton: {
    backgroundColor: '#61C3F2',
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginLeft: 16,
  },
  disabledButton: {
    backgroundColor: '#E5E5E5',
  },
});

export default SeatSelectionScreen;
