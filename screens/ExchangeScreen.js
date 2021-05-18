import React,{Component} from 'react';
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  StyleSheet,
  TouchableOpacity,
  Alert} from 'react-native';
import db from '../config';
import firebase from 'firebase';

export default class ExchangeScreen extends Component{
  constructor(){
    super();
    this.state ={
      userId : firebase.auth().currentUser.email,
      itemName:"",
      description:"",
      isExchangeRequestActive:"",
      isItemRequestActive:"",
      requestedItemName:"",
      item_status:"",
      request_id:"",
      userDocId:"",
      docId:"",
      currencyCode:""
    }
  }

  createUniqueId(){
    return Math.random().toString(36).substring(7);
  }



  addItem =(itemName,description)=>{
    var userId = this.state.userId
    var randomRequestId = this.createUniqueId()
    db.collection('exchange_requests').add({
        "user_id": userId,
        "book_name":itemName,
        "description":description,
        "request_id"  : randomRequestId,
    })

    this.setState({
        itemName :'',
        description : ''
    })

    return Alert.alert(
        'Item Ready To Exchange',
        '',
        [
            {text: 'OK', onPress:()=>{
                this.props.navigation.navigate('HomeScreen')
            }}
        ]
        )
  }
  getIsExchangeRequestActive()
  {
    db.collection('user').where('emailId','==',this.state.userId).onSnapshot(querySnapshot=>{
      querySnapshot.forEach(doc=>{
        this.setState({
          isExchangeRequestActive:doc.data().isExchangekRequestActive,
          userDocId:doc.id
        })
      })
    })
  }

  getData(){
    fetch("http://data.fixer.io/api/latest?access_key=1f7dd48123a05ae588283b5e13fae944&format=1")
    .then(response=>{
      return response.json();
    }).then(responseData =>{
      var currencyCode = this.state.currencyCode
      var currency = responseData.rates.INR
      var value = 69/currency
      console.log(value);
    })
  }


  render(){
    if(this.state.isExchangeRequestActive===true)
    {
      return(
      <View style = {{flex:1,justifyContent:'center'}}>
        <View style={{borderColor:'orange',borderWidth:2,justifyContent:'center',alignItems:'center',padding:10,margin:10}}>
        <Text>Item Name</Text>
        <Text>{this.state.requestedItemName}</Text>
        </View>
        <View style={{borderColor:'orange',borderWidth:2,justifyContent:'center',alignItems:'center',padding:10,margin:10}}>
        <Text>Item Status</Text>
        <Text>{this.state.item_status}</Text>
        </View>
        <TouchableOpacity style={{borderWidth:1,borderColor:'orange',backgroundColor:'orange',width:300,alignItems:'center',alignSelf:'center',height:30,marginTop:30}}
        onPress={()=>{
          this.sendNotification()
          this.updateItemRequestStatus()
        }}
        >
        <Text>I recieved the item</Text>
        </TouchableOpacity>
        </View>
      )
    }
    else{
    return(
        <View style={{flex:1}}>
            <KeyboardAvoidingView style={styles.keyBoardStyle}>
              <TextInput
                style ={styles.formTextInput}
                placeholder={"enter item name"}
                onChangeText={(text)=>{
                    this.setState({
                        itemName:text
                    })
                }}
                value={this.state.itemName}
              />
              <TextInput
                style ={[styles.formTextInput,{height:300}]}
                multiline
                numberOfLines ={8}
                placeholder={"Description"}
                onChangeText ={(text)=>{
                    this.setState({
                        description:text
                    })
                }}
                value ={this.state.description}
              />
              <TouchableOpacity
                style={styles.button}
                onPress={()=>{this.addItem(this.state.itemName,this.state.description)}}
                >
                <Text>Request</Text>
              </TouchableOpacity>
            </KeyboardAvoidingView>
        </View>
    )
   }
  }
}

const styles = StyleSheet.create({
  keyBoardStyle : {
    flex:1,
    alignItems:'center',
    justifyContent:'center'
  },
  formTextInput:{
    width:"75%",
    height:35,
    alignSelf:'center',
    borderColor:'#ffab91',
    borderRadius:10,
    borderWidth:1,
    marginTop:20,
    padding:10,
  },
  button:{
    width:"75%",
    height:50,
    justifyContent:'center',
    alignItems:'center',
    borderRadius:10,
    backgroundColor:"#ff5722",
    shadowColor: "#000",
    shadowOffset: {
       width: 0,
       height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 16,
    marginTop:20
    },
  }
)