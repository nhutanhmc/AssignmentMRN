// PondStack.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import PondListScreen from '../screens/PondListScreen';
import KoiListScreen from '../screens/KoiListScreen';
import KoiDetailScreen from '../screens/KoiDetailScreen';
import ScheduleScreen from '../screens/ScheduleScreen';
import CreateScheduleScreen from '../screens/CreateScheduleScreen';
import ShowScheduleScreen from '../screens/ShowScheduleScreen';

const PondStack = createStackNavigator();

const PondStackNavigator = () => {
  return (
    <PondStack.Navigator>
      <PondStack.Screen name="PondList" component={PondListScreen} options={{ title: 'Ponds' }} />
      <PondStack.Screen name="KoiList" component={KoiListScreen} options={{ title: 'Koi List' }} />
      <PondStack.Screen name="KoiDetail" component={KoiDetailScreen} options={{ title: 'Koi Detail' }} />
      <PondStack.Screen name="Schedule" component={ScheduleScreen} options={{ title: 'Schedule' }} />
      <PondStack.Screen name="CreateSchedule" component={CreateScheduleScreen} options={{ title: 'Create Schedule' }} />
      <PondStack.Screen name="ShowSchedule" component={ShowScheduleScreen} options={{ title: 'Show Schedule' }} />
    </PondStack.Navigator>
  );
};

export default PondStackNavigator;
