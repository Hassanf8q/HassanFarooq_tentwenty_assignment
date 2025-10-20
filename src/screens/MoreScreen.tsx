import React from 'react';
import { View, StyleSheet, ScrollView, Platform, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { AppText } from '../components/AppText';
import AppImage from '../components/AppImage';
import { s, vs } from '../utils/responsive';
import CustomStatusBar from '../components/CustomStatusBar';
import images from '../assets/images';

interface MoreScreenProps {
  navigation: any;
}

const MoreScreen: React.FC<MoreScreenProps> = ({ navigation }) => {
  const { state, toggleTheme } = useTheme();
  const { theme, isDarkMode } = state;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <CustomStatusBar 
        barStyle={isDarkMode ? "light-content" : "dark-content"} 
        backgroundColor={theme.colors.surface} 
      />
      
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.surface }]}>
        <AppText variant="bold" size="xxl" color="textPrimary">
          More
        </AppText>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* User Profile Card */}
        <View style={[styles.profileCard, { backgroundColor: theme.colors.surface }]}>
          {/* Profile Avatar */}
          <View style={styles.avatarContainer}>
            <View style={[styles.avatar, { backgroundColor: theme.colors.primary }]}>
              <AppText variant="bold" size="xl" color="textLight">
                HF
              </AppText>
            </View>
          </View>

          {/* User Information */}
          <View style={styles.userInfo}>
            <AppText variant="bold" size="xl" color="textPrimary" style={styles.userName}>
              Hassan Farooq
            </AppText>
            <AppText variant="medium" size="md" color="textSecondary" style={styles.userTitle}>
              Mobile Application Developer
            </AppText>
          </View>
        </View>

        {/* Contact Information */}
        <View style={[styles.contactCard, { backgroundColor: theme.colors.surface }]}>
          <AppText variant="bold" size="lg" color="textPrimary" style={styles.sectionTitle}>
            Contact Information
          </AppText>
          
          {/* Email */}
          <View style={styles.contactItem}>
            <View style={styles.contactIcon}>
              <AppImage source={images.more} size={20} tintColor={theme.colors.primary} />
            </View>
            <View style={styles.contactDetails}>
              <AppText variant="medium" size="sm" color="textSecondary">
                Email
              </AppText>
              <AppText variant="regular" size="md" color="textPrimary">
                hassan00farooq@gmail.com
              </AppText>
            </View>
          </View>

          {/* Phone */}
          <View style={styles.contactItem}>
            <View style={styles.contactIcon}>
              <AppImage source={images.more} size={20} tintColor={theme.colors.primary} />
            </View>
            <View style={styles.contactDetails}>
              <AppText variant="medium" size="sm" color="textSecondary">
                Phone
              </AppText>
              <AppText variant="regular" size="md" color="textPrimary">
                +92-3116591873
              </AppText>
            </View>
          </View>
        </View>

        {/* About Section */}
        <View style={[styles.aboutCard, { backgroundColor: theme.colors.surface }]}>
          <AppText variant="bold" size="lg" color="textPrimary" style={styles.sectionTitle}>
            About
          </AppText>
          <AppText variant="regular" size="md" color="textSecondary" style={styles.aboutText}>
            Passionate Mobile Application Developer with expertise in React Native, 
            creating innovative and user-friendly mobile experiences.
          </AppText>
        </View>

        {/* Theme Settings */}
        <View style={[styles.themeCard, { backgroundColor: theme.colors.surface }]}>
          <AppText variant="bold" size="lg" color="textPrimary" style={styles.sectionTitle}>
            Appearance
          </AppText>
          <View style={styles.themeToggleItem}>
            <View style={styles.themeToggleInfo}>
              <AppText variant="medium" size="md" color="textPrimary">
                Dark Mode
              </AppText>
              <AppText variant="regular" size="sm" color="textSecondary">
                Switch between light and dark themes
              </AppText>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={toggleTheme}
              trackColor={{ false: '#E5E5E5', true: theme.colors.primary }}
              thumbColor={isDarkMode ? '#FFFFFF' : '#FFFFFF'}
              ios_backgroundColor="#E5E5E5"
            />
          </View>
        </View>

        {/* App Info */}
        <View style={[styles.appInfoCard, { backgroundColor: theme.colors.surface }]}>
          <AppText variant="bold" size="lg" color="textPrimary" style={styles.sectionTitle}>
            App Information
          </AppText>
          <View style={styles.appInfoItem}>
            <AppText variant="medium" size="sm" color="textSecondary">Version</AppText>
            <AppText variant="regular" size="md" color="textPrimary">1.0.0</AppText>
          </View>
          <View style={styles.appInfoItem}>
            <AppText variant="medium" size="sm" color="textSecondary">Platform</AppText>
            <AppText variant="regular" size="md" color="textPrimary">React Native</AppText>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom:70
  },
  header: {
    paddingHorizontal: s(20),
    paddingVertical: vs(16),
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  content: {
    flex: 1,
    paddingHorizontal: s(20),
    paddingTop: vs(20),
    paddingBottom: vs(100), // Space for bottom tab bar
  },
  
  // Profile Card
  profileCard: {
    borderRadius: s(16),
    padding: s(24),
    marginBottom: vs(20),
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarContainer: {
    marginBottom: vs(16),
  },
  avatar: {
    width: s(80),
    height: s(80),
    borderRadius: s(40),
    alignItems: 'center',
    justifyContent: 'center',
  },
  userInfo: {
    alignItems: 'center',
  },
  userName: {
    textAlign: 'center',
    marginBottom: vs(4),
  },
  userTitle: {
    textAlign: 'center',
  },
  
  // Contact Card
  contactCard: {
    borderRadius: s(16),
    padding: s(20),
    marginBottom: vs(20),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: {
    marginBottom: vs(16),
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vs(16),
  },
  contactIcon: {
    width: s(40),
    height: s(40),
    borderRadius: s(20),
    backgroundColor: 'rgba(97, 195, 242, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: s(12),
  },
  contactDetails: {
    flex: 1,
  },
  
  // About Card
  aboutCard: {
    borderRadius: s(16),
    padding: s(20),
    marginBottom: vs(20),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  aboutText: {
    lineHeight: vs(22),
  },
  
  // Theme Card
  themeCard: {
    borderRadius: s(16),
    padding: s(20),
    marginBottom: vs(20),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  themeToggleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  themeToggleInfo: {
    flex: 1,
    marginRight: s(16),
  },
  
  // App Info Card
  appInfoCard: {
    borderRadius: s(16),
    padding: s(20),
    marginBottom: vs(20),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  appInfoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: vs(12),
  },
});

export default MoreScreen;
