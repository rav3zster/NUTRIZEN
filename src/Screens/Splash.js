import { View, Text, StyleSheet , ImageBackground } from 'react-native'
import React, { useEffect } from 'react'
import { Image } from 'react-native-animatable'
import * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';




const Splash = () => {
    const navigation = useNavigation()
    useEffect(() => {
        setTimeout(() => {
            navigation.navigate("Login")
        }, 3000)
    }, [])
    return (
        <ImageBackground source={require('../Images/blueberry.jpg')} style={styles.container}>
            <Animatable.Text animation={'slideInUp'} style={styles.appname}>NUTRIZEN</Animatable.Text>
            <Text style={styles.tag}>SAVOUR THE SPECTRUM</Text>
        </ImageBackground>
    )
}

export default Splash
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '',
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: 200,
        height: 200,
    },
    appname: {
        fontSize: 50,
        fontWeight: '600',
        color:'white',
        marginBottom:20,
        fontFamily:'sans-serif',
        marginBottom:'10px',
        marginHorizontal: '1px',
    },
    tag:{
        fontSize:18,
        fontWeight:'300',
        color:'white',
        top:320
    }

})
