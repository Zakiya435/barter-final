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
import db from '../config'


    export default class RecieverDetailsScreen extends Component{
        constructor(props){
            super(props);
            this.state={
                userId:firebase.auth().currentUser.email,
                recieverId:this.props.navigation.getParam('details')['user_Id'],
                requestId:this.props.navigation.getParam('details')['request_Id'],
                itemName:this.props.navigation.getParam('details')['item_Name'],
                recieverName:'',
                recieverContact:'',
                recieverAddress:'',
                recieverRequestDocId:''
           }
        }

        getRecieverDetails(){
            db.collection('users').where('emailId','==',this.state.recieverId).get()
            .then(snapShot=>{
                snapShot.forEach(doc=>{
                    this.setState({recieverName:doc.data().firstName,recieverContact:doc.data().contact,recieverAddress:doc.data().address,currencyCode:doc.data().currencyCode});
                })
            });
            db.collection('requestedItems').where('request_Id','==',this.state.requestId).get()
            .then(snapShot=>{
                snapShot.forEach(doc=>{
                    this.setState({recieverRequestDocId:doc.id})
                })
            })
        }

        
        addNotification=()=>{
            var message = this.state.userName+"has requested Item"
            db.collection("all_notifications").add({
                "targeted_user_id":this.state.recieverId,
                "donor_id":this.state.userId,
                "request_id":this.state.requestId,
                "item_name":this.state.itemName,
                "date":firebase.firestore.FieldValue.serverTimestamp(),
                "notification_status":'unread',
                "message":message,
            })
        }
        updateItemStatus=()=>{
          db.collection('all_donations').add({
              itemName:this.state.itemName,
              request_Id:this.state.requestId,
              requested_by:this.state.recieverName,
              doner_Id:this.state.userId,
              request_status:"Doner Interested"
          })
        }

        componentDidMount(){
            this.getRecieverDetails()
        }
        render(){
            return(
                <View>
                    <View>
                    <Header
                        leftComponent={<Icon name='arrow-left' type='feather' color='blue' onPress={()=>this.props.navigation.goBack()} />}
                        centerComponent={{text:'Donate Books', style:{color:'green', fontSize:20, fontWeight:"bold",}}}
                        backgroundColor= 'yellow'
                    />
                    </View>
                    <View>
                        <Card title={"Item Information"} titleStyle={{fontSize:20}}>

                        <Card>
                            <Text style = {{fontSize:15, fontWeight:"bold"}}>Name:{this.state.itemName}</Text>
                        </Card>
                    </Card>
                    </View>

                    <View>
                        <Card title={"Reciever Information"} titleStyle={{fontSize:20}}>

                        <Card>
                            <Text style = {{fontSize:15, fontWeight:"bold"}}>Name:{this.state.recieverName}</Text>
                        </Card>

                        <Card>
                            <Text style = {{fontSize:15, fontWeight:"bold"}}>Contact:{this.state.contact}</Text>
                        </Card>
                        <Card>
                            <Text style = {{fontSize:15, fontWeight:"bold"}}>Address:{this.state.address}</Text>
                        </Card>
                        <Card>
                            <Text style = {{fontSize:15, fontWeight:"bold"}}>Currency:{this.state.currencyCode}</Text>
                        </Card>

                    </Card>
                    </View>
                    
                <View>
                    {this.state.recieverId != this.state.userId?(<TouchableOpacity onPress={()=>{
                        this.updateItemStatus()
                        this.addNotification()
                        this.props.navigation.navigate('MyDonationScreen')
                    }}>
                    <Text>I want to donate</Text>
                    </TouchableOpacity>
                    ):null}
                    </View>
                    <Text>Reciever Details Screen</Text>
                </View>
            )
        }
        
    }