import React, { Component } from 'react';
import {createStackNavigator} from 'react-navigation-stack';
import ExchangeScreen from '../screens/ExchangeScreen';

export const AppStackNavigator = createStackNavigator({
    ItemDonateList:{screen:ExchangeScreen,navigationOptions:{headerShown:false}},},
    {initialRouteName:'BookDonateList'}
);
//complete this