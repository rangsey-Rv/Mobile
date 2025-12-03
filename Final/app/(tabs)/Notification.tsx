import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

export default function Notification() {
  const { theme } = useTheme();
  
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={styles.text}>Notification Screen</Text>
      <Text style={styles.subText}>Coming soon...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 10,
  },
  subText: {
    fontSize: 16,
    color: '#A1A1A1',
  },
});
