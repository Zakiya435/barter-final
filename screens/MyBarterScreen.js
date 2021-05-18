import React, { Component } from 'react';
import {
    View,
    Text,
    TextInput,
    Modal,
    KeyboardAvoidingView,
    StyleSheet,
    TouchableOpacity,
    Alert,
    ScrollView} from 'react-native';
import { Card, Header, Icon } from 'react-native-elements';
import MyHeader from '../components/MyHeader';
import db from '../config'


    export default class MyBarterScreen extends Component{
        constructor(){
            super();
            this.state={
                userId:firebase.auth().currentUser.email,
                allBarters:[]
            }
            this.requestRef=null
        }

        getAllBarters =()=>{
            this.requestRef = db.collection("allBarters").where("barter_Id",'==',this.state.userId)
            .onSnapshot((snapshot)=>{
              var allBarters = snapshot.docs.map(document => document.data());
              this.setState({
                allBarters : allBarters
              });
            })
          }

          keyExtractor = (item, index) => index.toString()

          componentDidMount(){
            this.getAllBarters()
          }
        
          componentWillUnmount(){
            this.requestRef();
          }
          sendNotification=(barterDetails,request_status)=>{
            var requestId = barterDetails.requestId
            var barterId = barterDetails.barterId
            db.collection("all_notifications")
            .where("request_id","==",requestId)
            .where("barter_id","==",barterId)
            .get()
            .then(snapShot=>{
                var message = ""
            })
            if(request_status === "itemSent")
            {
                message = this.state.donorName + "sent you a item"
            }
            else{
                message = this.state.donorName + "has shown interest in donating the item"
            }
            db.collection("all_notifications").doc(doc.id).update({
                "message":message,
                "notification_status":'unread',
                "date":firebase.firestore.FieldValue.serverTimestamp()
            })
        }

        sendItem=(barterDetails)=>{
            if(barterDetails.request_status === "itemSent"){
                var request_status = "donor interested"
                db.collection("all_notifications").doc(barterDetails.doc_id).update({
                    "request_status" : "donor interested"                    
                })
                this.sendNotification(barterDetails,request_status)
            }
            else{
                var request_status = "item sent"
                db.collection("all_notifications").doc(barterDetails.doc_id).update({
                    "request_status" : "item sent"                    
                })
                this.sendNotification(barterDetails,request_status)
            }
        }


  renderItem = ( {item, i} ) =>{
    return (
      <ListItem
        key={i}
        title={item.book_name}
        subtitle={"Requested By:" +item.requested_by +"\nStatus : " + item.request_status} 
        leftElement={<Icon name="book" type="font-awesome" color ='#696969'/>} 
        titleStyle={{ color: 'black', fontWeight: 'bold' }} 
        rightElement={ 
        <TouchableOpacity style={styles.button}
        onPress={()=>{
          this.sendItem(item)
        }}
        > 
        <Text style={{color:'#ffff'}}>{item.request_status === "itemsent"?"itemsent":"sendItem"}</Text> 
        </TouchableOpacity> } 
        bottomDivider
         />
    )}
    render(){
         return( 
         <View style={{flex:1}}>
              <MyHeader navigation={this.props.navigation} 
              title="My Bartera"/> <View style={{flex:1}}> 
              { this.state.allBarters.length === 0 ?
              ( <View style={styles.subtitle}> 
              <Text style={{ fontSize: 20}}>List of all Baters</Text> 
              </View> ) 
              :( <FlatList keyExtractor={this.keyExtractor} 
                data={this.state.allBarters} 
                renderItem={this.renderItem} /> 
                ) }
                 </View> 
                 </View>
                )}
}