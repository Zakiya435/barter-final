import React, { Component } from 'react';
import{View, Text, TextInput, StyleSheet, TouchableOpacity, Image, Alert, Modal, KeyboardAvoidingView} from 'react-native';
import db from '../config';
import firebase from 'firebase';

export default class WelcomeScreen extends Component{
    constructor(){
        super()
        this.state={
            email:'',
            password:'',
            isModalVisible:false,
            firstName:'',
            lastName:'',
            mobileNumber:'',
            address:'',
            confirmPassword:'',
            currencyCode: ''
        }
    }

    showModal=()=>{
        return(
            <Modal animationType="fade" transparent= {true} visible={this.state.isModalVisible}>
                <View style={styles.modalContainer}>
                    <scrollView style={{width:'100%'}}>
                        <KeyboardAvoidingView style={styles.keyboardAvoidingView}>
                            <Text style={styles.modalTitle}>Registeration</Text>
                            <TextInput style={styles.formTextInput}
                                placeholder={"First Name"}
                                maxLength={8}
                                onChangeText={(text)=>{
                                    this.setState({
                                        firstName:text
                                    })
                                }}
                                />

                            <TextInput style={styles.formTextInput}
                                placeholder={"Last Name"}
                                maxLength={8}
                                onChangeText={(text)=>{
                                    this.setState({
                                        lastName:text
                                    })
                                }}
                                />

                            <TextInput style={styles.formTextInput}
                                placeholder={"Mobile Number"}
                                maxLength={10}
                                onChangeText={(text)=>{
                                    this.setState({
                                        mobileNumber:text
                                    })
                                }}
                                />

                            <TextInput style={styles.formTextInput}
                                placeholder={"Address"}
                                multiline={true}
                                onChangeText={(text)=>{
                                    this.setState({
                                        address:text
                                    })
                                }}
                                />

                                <TextInput style={styles.formTextInput}
                                placeholder={"Email"}
                                keyboardType={"email-address"}
                                onChangeText={(text)=>{
                                    this.setState({
                                        email:text
                                    })
                                }}
                                />

                                <TextInput style={styles.formTextInput}
                                placeholder={"Password"}
                                secureTextEntry={true}
                                onChangeText={(text)=>{
                                    this.setState({
                                        password:text
                                    })
                                }}
                                />

                                <TextInput style={styles.formTextInput}
                                placeholder={"Confirm Password"}
                                secureTextEntry={true}
                                onChangeText={(text)=>{
                                    this.setState({
                                        confirmPassword:text
                                    })
                                }}
                                />
                                <TextInput
                                    style={styles.formTextInput}
                                    placeholder ={"Country currency code"}
                                    maxLength ={8}
                                    onChangeText={(text)=>{
                                    this.setState({
                                        currencyCode: text
                                    })
                                    }}
                                    />

                                <View style={styles.modalBackButton}>
                                    <TouchableOpacity style = {styles.registerButton}
                                    onPress={()=> this.userSignup(this.state.email, this.state.password, this.state.confirmPassword) }
                                    >
                                        <Text style={styles.registerButtonText}>Register</Text>
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.modalBackButton}>
                                    <TouchableOpacity style = {styles.cancelButton}
                                    onPress={()=>this.setState({
                                    isModalVisible:false
                                    })}
                                    >
                                    <Text style={{color:'#81007f'}}>Cancel</Text>
                                    </TouchableOpacity>
                                </View>
                        </KeyboardAvoidingView>
                    </scrollView>
                </View>
            </Modal>
        )
    }

    userLogin=(emailid,password)=>{
     firebase.auth().signInWithEmailAndPassword(emailid,password)
     .then(()=>{
         return(Alert.alert("Successfully Login"))
     })
     .catch((error)=>{
      var errorCode = error.code;
      var errorMessages = error.message;
      return(Alert.alert(errorMessages))
     })
    }

    userSignup=(emailId,password,confirmPassword)=>{
        if(password!==confirmPassword)
        {
        return Alert.alert("password does not match\nCheck password")
        }
        else{
        firebase.auth().createUserWithEmailAndPassword(emailId,password)
        .then(()=>{
            db.collection('user'.add({
                firstName:this.state.firstName,
                lastName:this.state.lastName,
                mobileNumber:this.state.mobileNumber,
                address:this.state.address,
                email:this.state.email,
            }))
        })
        
        return Alert.alert(
            "User Added Succesfully",
            '',
            [
                {text: 'OK', onPress: ()=> this.setState({"isModalVisible":false})},
            ]
        )

        .catch((error)=>{
         var errorCode = error.code;
         var errorMessages = error.message;
         return(Alert.alert(errorMessages))
        });
         }
       }
       render(){
           return(
            <View style={styles.container}> 
            <View style={styles.profileContainer}>
                {
                    this.showModal()
                }
                <Text style={styles.title}>Barter App</Text>
                  </View>
            <View style={styles.buttonContainer}> 
                   <TextInput style={styles.loginBox} 
                   placeholder="example@barter.com" 
                   placeholderTextColor = "#ffff" 
                   keyboardType ='email-address' 
                   onChangeText={(text)=>{ this.setState({ emailId: text }) 
                   }} /> 
                   <TextInput style={styles.loginBox} 
                   secureTextEntry = {true} 
                   placeholder="password" 
                   placeholderTextColor = "#ffff" 
                   onChangeText={(text)=>{ this.setState({ password: text }) 
                   }} />

                <TouchableOpacity style={[styles.button,{marginBottom:20, marginTop:20}]}
                 onPress = {()=>{
                     this.userLogin(this.state.emailId, this.state.password)}} >
                         <Text style={styles.buttonText}>Login</Text> 
                         </TouchableOpacity>
                         <TouchableOpacity style={styles.button} 
                         onPress={()=>{this.userSignup(this.state.emailId, this.state.password)}} > 
                         <Text style={styles.buttonText}>SignUp</Text> 
                    </TouchableOpacity>
                </View>
            </View>
           )
       }
    }
    const styles = StyleSheet.create({
        container:{
         flex:1,
         backgroundColor:'#F8BE85',
         alignItems: 'center',
         justifyContent: 'center'
       },
       profileContainer:{
         flex:1,
         justifyContent:'center',
         alignItems:'center',
       },
       title :{
         fontSize:65,
         fontWeight:'300',
         paddingBottom:30,
         color : '#ff3d00'
       },
       loginBox:{
         width: 300,
         height: 40,
         borderBottomWidth: 1.5,
         borderColor : '#ff8a65',
         fontSize: 20,
         margin:10,
         paddingLeft:10
       },
       KeyboardAvoidingView:{
         flex:1,
         justifyContent:'center',
         alignItems:'center'
       },
       modalTitle :{
         justifyContent:'center',
         alignSelf:'center',
         fontSize:30,
         color:'#ff5722',
         margin:50
       },
       modalContainer:{
         flex:1,
         borderRadius:20,
         justifyContent:'center',
         alignItems:'center',
         backgroundColor:"#ffff",
         marginRight:30,
         marginLeft : 30,
         marginTop:80,
         marginBottom:80,
       },
       formTextInput:{
         width:"75%",
         height:35,
         alignSelf:'center',
         borderColor:'#ffab91',
         borderRadius:10,
         borderWidth:1,
         marginTop:20,
         padding:10
       },
       registerButton:{
         width:200,
         height:40,
         alignItems:'center',
         justifyContent:'center',
         borderWidth:1,
         borderRadius:10,
         marginTop:30
       },
       registerButtonText:{
         color:'#ff5722',
         fontSize:15,
         fontWeight:'bold'
       },
       cancelButton:{
         width:200,
         height:30,
         justifyContent:'center',
         alignItems:'center',
         marginTop:5,
       },
      
       button:{
         width:300,
         height:50,
         justifyContent:'center',
         alignItems:'center',
         borderRadius:25,
         backgroundColor:"#ff9800",
         shadowColor: "#000",
         shadowOffset: {
            width: 0,
            height: 8,
         },
         shadowOpacity: 0.30,
         shadowRadius: 10.32,
         elevation: 16,
         padding: 10
       },
       buttonText:{
         color:'#ffff',
         fontWeight:'200',
         fontSize:20
       }
      })