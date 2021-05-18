import React, { Component} from 'react';
import {StyleSheet, View, Text,TouchableOpacity, Dimensions} from 'react-native';
import firebase from 'firebase';
import db from '../config';
import {SwipeListView} from 'react-native-swipe-list-view';
import { Notifications } from 'expo';

export default class SwipeableFlatlist extends Component{
    constructor(props){
        super(props)
        this.state={
            allNotifications:this.props.allNotifications
        }
    }

    updateMarkAsRead=(notification)=>{
        db.collection("all_notifications").doc(notification.doc_id).update({
            "notification_status":"read"
        })
    }

    closeRow=(item,key)=>{
        if(item[key]){
            item[key].closeRow()
        }
    };

    deleteRow=(item,key)=>{
        var allNotifications = this.state.allNotifications
        this.closeRow(item,key)
        const renewData = [...allNotifications]
        const previousIndex = allNotifications.findIndex(item=>item.key===key);
        this.updateMarkAsRead(allNotifications[previousIndex]);
        newData.splice(previousIndex,1)
        this.setState({allNotifications:newData})
    };
    onRowDidOpen = key=>{console.log("This Row Opened",key)}

    renderItem = data => (
            <ListItem leftElement={<Icon name="item" type="font-awesome" color ='#696969'/>} 
            title={data.item.item_name} 
            titleStyle={{ color: 'black', fontWeight: 'bold' }} 
            subtitle={data.item.message} 
            bottomDivider /> 
    );

    renderHiddenItem = ()=>{
        <View style = {styles.rowBack}>
            <View style = {[styles.backRightButton,styles.backRightButtonRight]}>
                <Text style = {styles.backTextWhite}></Text>
            </View>
        </View>
    };

    onSwipeValueChange = (swipeData)=>{
        var allNotifications = this.state.allNotifications
        const {key,value} = swipeData
        if(value < -Dimensions.get('window').width){
            const newData = [...allNotifications]
            const previousIndex = allNotifications.findIndex(item=>item.key===key);
            this.updateMarkAsRead(allNotifications[previousIndex])
            newData.splice(previousIndex,1)
            this.setState({allNotifications:newData})
        }
    }

    render(){
        return(
            <View style={styles.container}>
                <SwipeListView 
                disableRightSwipe
                data = {this.state.allNotifications} 
                renderItem = {this.renderItem} 
                renderHiddenItem={this.renderHiddenItem}
                rightOpenValue = {-Dimensions.get('window').width}
                previewRowKey = {'0'}
                previewOpenValue = {-40}
                previewOpenDelay = {3000}
                onSwipeValueChange = {this.onSwipeValueChange}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'white'
    },
    rowBack:{
        alignItems:'center',
        backgroundColor:'#DDD',
        flex:1,
        flexDirection:'row',
        justifyContent:'space-between',
        paddingLeft:50
    },
    rowFront:{
        alignItems:'center',
        backgroundColor:'#CCC',
        borderBottomColor:'black',
        borderBottomWidth:1,
        justifyContent:'center',
        height:50
    },
    backRightButton:{
        alignItems:'center',
        bottom:0,
        justifyContent:'center',
        position:'absolute',
        top:0,
        width:75
    },
    backRightButtonLeft:{
        backgroundColor:'blue',
        right:75
    },
    backRightButtonRight:{
        backgroundColor:'red',
        right:0
    },
    backTextWhite:{
        color:'blue'
    }
})