import React from 'react';
import {createDrawerNavigator} from 'react-navigation-drawer';
import { AppTabNavigator } from './AppTabNavigator'
import CustomSideBarMenu  from './CustomSideBarMenu';
import SettingsScreen from '../screens/SettingsScreen';
import ExchangeScreen from '../screens/ExchangeScreen';
import MyBarterScreen from '../screens/MyBarterScreen';

export const AppDrawerNavigator = createDrawerNavigator({
  Home : {
    screen : AppTabNavigator
    },
    ExchangeScreen:{
      screen:ExchangeScreen
    },
    MyBarters:{
      screen:MyBarterScreen
    },
    Setting:{
      screen: SettingsScreen
    },
  },
  {
    contentComponent:CustomSideBarMenu
  },
  {
    initialRouteName : 'Home'
  })