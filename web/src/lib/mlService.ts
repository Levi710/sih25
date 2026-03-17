/**
 * Machine Learning Service for Travel Mode Prediction
 * Ported from React Native to TypeScript for Web
 */

export type TravelMode = 'walking' | 'cycling' | 'driving' | 'public_transport' | 'unknown';

export interface LocationPoint {
  latitude: number;
  longitude: number;
  timestamp: number;
  accuracy?: number;
  speed?: number;
  heading?: number;
}

export interface TripData {
  locations: LocationPoint[];
  duration: number;
}

class MLService {
  private speedThresholds = {
    walking: { min: 0, max: 8 }, // km/h
    cycling: { min: 8, max: 25 },
    driving: { min: 25, max: 120 },
    public_transport: { min: 15, max: 80 }
  };

  async predictTravelMode(tripData: TripData): Promise<TravelMode> {
    try {
      const { locations, duration } = tripData;
      
      if (!locations || locations.length < 2) {
        return 'unknown';
      }

      // Calculate average speed
      const totalDistance = this.calculateTotalDistance(locations);
      const durationHours = duration / (1000 * 60 * 60);
      const averageSpeed = durationHours > 0 ? totalDistance / durationHours : 0;

      // Calculate speed variations
      const speeds: number[] = [];
      for (let i = 1; i < locations.length; i++) {
        const speed = this.calculateSpeed(locations[i-1], locations[i]);
        if (speed > 0) speeds.push(speed);
      }

      const maxSpeed = speeds.length > 0 ? Math.max(...speeds) : 0;
      const speedVariance = this.calculateVariance(speeds);

      // Rule-based prediction with multiple factors
      return this.classifyTravelMode(averageSpeed, maxSpeed, speedVariance, totalDistance);
      
    } catch (error) {
      console.error('Error predicting travel mode:', error);
      return 'unknown';
    }
  }

  private classifyTravelMode(avgSpeed: number, maxSpeed: number, variance: number, distance: number): TravelMode {
    if (avgSpeed <= 8 && maxSpeed <= 15 && variance < 10) {
      return 'walking';
    }
    
    if (avgSpeed > 8 && avgSpeed <= 25 && maxSpeed <= 35 && distance > 0.5) {
      return 'cycling';
    }
    
    if (avgSpeed > 25 && maxSpeed > 40 && distance > 2) {
      return 'driving';
    }
    
    if (avgSpeed > 15 && avgSpeed <= 50 && variance > 20 && distance > 1) {
      return 'public_transport';
    }
    
    // Default fallback based on average speed
    if (avgSpeed <= 8) return 'walking';
    if (avgSpeed <= 25) return 'cycling';
    if (avgSpeed <= 80) return 'driving';
    return 'public_transport';
  }

  public calculateSpeed(prevLocation: LocationPoint, currentLocation: LocationPoint): number {
    if (!prevLocation || !currentLocation || !prevLocation.timestamp || !currentLocation.timestamp) {
      return 0;
    }
    
    const timeDiff = (currentLocation.timestamp - prevLocation.timestamp) / 1000; // seconds
    if (timeDiff <= 0) return 0;
    
    const distance = this.calculateDistance(
      prevLocation.latitude,
      prevLocation.longitude,
      currentLocation.latitude,
      currentLocation.longitude
    );
    
    return (distance / timeDiff) * 3.6; // convert m/s to km/h
  }

  public calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371000; // Earth's radius in meters
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; // Distance in meters
  }

  public calculateTotalDistance(locations: LocationPoint[]): number {
    if (!locations || locations.length < 2) return 0;
    
    let totalDistance = 0;
    for (let i = 1; i < locations.length; i++) {
      const distance = this.calculateDistance(
        locations[i-1].latitude,
        locations[i-1].longitude,
        locations[i].latitude,
        locations[i].longitude
      );
      totalDistance += distance;
    }
    
    return totalDistance / 1000; // Convert to kilometers
  }

  private calculateVariance(speeds: number[]): number {
    if (speeds.length === 0) return 0;
    
    const mean = speeds.reduce((sum, speed) => sum + speed, 0) / speeds.length;
    const variance = speeds.reduce((sum, speed) => sum + Math.pow(speed - mean, 2), 0) / speeds.length;
    
    return variance;
  }

  public analyzeMovementPattern(locations: LocationPoint[]) {
    if (!locations || locations.length < 3) return null;
    
    const speeds: number[] = [];
    const accelerations: number[] = [];
    let stopCount = 0;
    let totalStopTime = 0;
    
    for (let i = 1; i < locations.length; i++) {
      const speed = this.calculateSpeed(locations[i-1], locations[i]);
      speeds.push(speed);
      
      const timeDiff = (locations[i].timestamp - locations[i-1].timestamp) / 1000;
      if (speed < 2 && timeDiff > 30) {
        stopCount++;
        totalStopTime += timeDiff;
      }
      
      if (i > 1) {
        const prevSpeed = this.calculateSpeed(locations[i-2], locations[i-1]);
        const acceleration = (speed - prevSpeed) / timeDiff;
        accelerations.push(Math.abs(acceleration));
      }
    }
    
    return {
      avgSpeed: speeds.reduce((sum, s) => sum + s, 0) / speeds.length,
      maxSpeed: Math.max(...speeds),
      speedVariance: this.calculateVariance(speeds),
      stopCount,
      avgAcceleration: accelerations.length > 0 ? 
        accelerations.reduce((sum, a) => sum + a, 0) / accelerations.length : 0,
      stopTimeRatio: totalStopTime / ((locations[locations.length-1].timestamp - locations[0].timestamp) / 1000)
    };
  }

  public calculateBearing(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const dLon = this.toRad(lon2 - lon1);
    const lat1Rad = this.toRad(lat1);
    const lat2Rad = this.toRad(lat2);

    const x = Math.sin(dLon) * Math.cos(lat2Rad);
    const y = Math.cos(lat1Rad) * Math.sin(lat2Rad) - 
              Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(dLon);

    const bearing = Math.atan2(x, y);
    return (this.toDeg(bearing) + 360) % 360;
  }

  public calculateRouteEfficiency(locations: LocationPoint[]): number {
    if (locations.length < 2) return 0;
    const totalDistance = this.calculateTotalDistance(locations);
    const straightLineDistance = this.calculateDistance(
      locations[0].latitude, 
      locations[0].longitude,
      locations[locations.length - 1].latitude,
      locations[locations.length - 1].longitude
    ) / 1000;
    
    return totalDistance > 0 ? straightLineDistance / totalDistance : 0;
  }

  public identifyStopPoints(locations: LocationPoint[], threshold = 50) {
    const stops = [];
    let currentStop = null;

    for (let i = 1; i < locations.length; i++) {
      const distance = this.calculateDistance(
        locations[i-1].latitude, locations[i-1].longitude,
        locations[i].latitude, locations[i].longitude
      );

      if (distance < threshold) {
        if (!currentStop) {
          currentStop = {
            startIndex: i - 1,
            endIndex: i,
            duration: 0
          };
        } else {
          currentStop.endIndex = i;
        }
      } else {
        if (currentStop) {
          currentStop.duration = locations[currentStop.endIndex].timestamp - 
                                locations[currentStop.startIndex].timestamp;
          if (currentStop.duration > 30000) {
            stops.push(currentStop);
          }
          currentStop = null;
        }
      }
    }
    return stops;
  }

  private toRad(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  private toDeg(radians: number): number {
    return radians * (180 / Math.PI);
  }
}

export const mlService = new MLService();
