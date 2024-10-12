import { View, Text, StyleSheet, TouchableOpacity , Image} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import MapView, { Circle } from 'react-native-maps';
import * as Location from 'expo-location';

const Home = () => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [radius, setRadius] = useState(200); 
  const mapRef = useRef(null); // referece for MapView

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);
    })();
  }, []);

  const centerMap = () => {
    if (location && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }, 1250); 
    }
  };

  const handleRegionChange = (region) => {
    const newRadius = Math.max(50, Math.round(1000 * region.latitudeDelta));
    setRadius(newRadius);
  };

  if (errorMsg) {
    return (
      <View style={styles.container}>
        <Text>{errorMsg}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {location && (
        <>
          <MapView
            ref={mapRef} 
            style={styles.map}
            initialRegion={{
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            onRegionChangeComplete={handleRegionChange} 
          >
            {/* Circle for current location */}
            <Circle
              center={{
                latitude: location.latitude,
                longitude: location.longitude,
              }}
              radius={radius} // calculated radius
              fillColor="rgba(0, 0, 255, 0.3)" 
              strokeColor="rgba(0, 0, 255, 1)" 
            />
          </MapView>
          <TouchableOpacity style={styles.button} onPress={centerMap}>
        <Image
          source={require('../../assets/images/location.png')} 
          style={styles.buttonImage} 
        />
      </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  button: {
    position: 'absolute',
    bottom: 30, 
    right: '10%', 
    marginLeft: -75, 
    backgroundColor: '#FFFF', 
    borderRadius: 100, 
    paddingVertical: 10, 
    paddingHorizontal: 20, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 5 }, 
    shadowOpacity: 0.3, 
    shadowRadius: 3, 
    elevation: 5, 
  },
  buttonText: {
    color: '#FFFFFF', 
    fontSize: 16, 
    fontWeight: 'bold', 
  },
  buttonImage:{
    width:25,
    height:25,
    color: '#FFF',
    
  }
});

export default Home;
