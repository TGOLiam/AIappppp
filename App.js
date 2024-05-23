import { useReducer, useState, useEffect, useCallback } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, TextInput, KeyboardAvoidingView, ScrollView, Switch } from 'react-native';
import { processImage, OcrApiRequest, AIapiRequest, topic, speakAI, PlayAudio, soundObject, controlAudio, duration } from './APIprocess'
import Ionicons from '@expo/vector-icons/Ionicons';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { Image } from 'expo-image';
import AnimatedImage from './animation'


import Swiper from 'react-native-swiper';




export default function App() {
  const [AItext, setAItext] = useState("Watchap!! I'm Gatcha!!")
  const [textHolder, setTextHolder] = useState("Try saying summarize for me")
  const [userText, setUserText] = useState('')
  const [OCRtext, setOCRData] = useState('')
  const [soundData, setSound] = useState("")
  const [AIstatus, setStatus] = useState("Watchap!! I'm Gatcha!!\nShare a photo!")

  const [BgColor, setBg] = useState("#fffff")
  const [boxColor, setBox] = useState("#003dad")
  const [iconColor, setIcon] = useState("#123355")
  const [headerColor, setHeader] = useState('#FA9B9B')
  const [inputBoxColor, setInputBox] = useState('#FA9B9B')
  const [inputColor, setInput] = useState('#E2E2E2')



  const [showTune, setTune] = useState("flex")

  const idle = require(`./assets/GachaDefaultIdle.gif`)
  const search = require(`./assets/GachaDefaultThinking.gif`)
  const speaking = require(`./assets/GachaDefaultThinking2.gif`)
  const fail = require(`./assets/GachaDefaultError.gif`)





  const [gif, setGif] = useState(idle)



  const [buttonIcon, setBtnIcon] = useState("send")
  const [isProcessing, setProcessing] = useState(false)

  let AIspeak
  let abortController = new AbortController();


  const imageprocess = async () => {
    setAItext("Using my eyes...")
    setStatus("Using my eyes...")
    setGif(search)


    const image = await processImage()
    setAItext("Reading your image...")
    setStatus("Reading your image...")

    const ocrData = await OcrApiRequest(image)
    setOCRData(ocrData)
    AIprocess(ocrData, topic)
  }

  const AIprocess = async (data, input) => {
    try {
      setGif(search)
      setBtnIcon("stop")
      setAItext("Using my brain...")
      setStatus("Using my brain...")

      const AI = await AIapiRequest(data, input)
      setStatus("Initializing speech...")
      AIspeak = await speakAI(AI)

      const audio = await PlayAudio("play", AIspeak)
      setStatus("Launching audio...")


      setSound(AIspeak)
      console.log("AI Response: ", AI)
      setStatus("Analysis done...")
      setAItext(AI)
      setBtnIcon("send")
      setProcessing(false)
      setGif(speaking)
      setTimeout(function () {
        setGif(idle);
      }, duration + 500);

    } catch (error) {
      console.error(error)
      setAItext("An error occured")
      setStatus("An error occured")
      setGif(error)
    }
  }

  const btnProcess = async () => {
    setProcessing((isProcessing) => !isProcessing)
    if (!isProcessing) {
      console.log("OFF")
      AIprocess(OCRtext, userText)

    }
    else {
      abortController.abort()
      console.log("ON")
      setBtnIcon("send")
      setGif(fail)
    }
  }




  const [fontsLoaded] = useFonts({
    'ObelusCompact': require('./assets/fonts/ObelusCompact.ttf'),
    'Onesize': require('./assets/fonts/ONESIZE_.ttf'),
  });



  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }






  return (

    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={[styles.container, { backgroundColor: BgColor }]} onLayout={onLayoutRootView}>

      <View style={styles.header}>

        <TouchableOpacity><Text style={{ fontSize: 70, fontFamily: 'ObelusCompact', margin: 7, marginBottom: 25, color: headerColor }}>Gatcha</Text></TouchableOpacity>


      </View>






      <Swiper showsButtons={true} showsPagination={false} loop={false} index={1} nextButton={<Text style={{ color: '#f99b99', fontSize: 50, left: 5 }}>›</Text>} prevButton={<Text style={{ color: '#f99b99', fontSize: 50, right: 5 }}>‹</Text>}>



        <ScrollView style={[styles.AIcontainer, { backgroundColor: boxColor }]}>
          <Text style={{ fontSize: 20, color: "white", margin: 10, fontFamily: 'Onesize' }}>{AItext}</Text>

        </ScrollView>




        <View style={[styles.AIcontainer, { backgroundColor: boxColor, overflow: 'hidden' }]}>
          <AnimatedImage source={gif} style={[{ width: 450, height: 600, alignSelf: 'center', left: 15, zIndex: 1 }]} />
          <Text style={{ zIndex: 2, alignSelf: 'center', bottom: 70, fontFamily: 'Onesize', color: "white", fontSize: 17, textAlign: 'center' }}>{AIstatus}</Text>

        </View>





        <View style={[styles.AIcontainer, { backgroundColor: boxColor, justifyContent: 'center' }]}>
          <View style={[styles.AIcontainer, { backgroundColor: headerColor, flex: 0, height: '95%', flexDirection: "column", alignItems: 'center', justifyContent: 'space-between' }]}>
            <Text style={{ justifyContent: "flex-start", margin: 20, fontFamily: 'Onesize', fontSize: 22, borderBottomWidth: 1, width: '90%', textAlign: 'center' }}>tell me how to act!</Text>

            <TextInput style={[styles.AIcontainer, { backgroundColor: '#d99191' }]}></TextInput>




            <View style={{borderWidth: 1, width: '80%', height: 50}}>
              <TouchableOpacity></TouchableOpacity>
              <TouchableOpacity></TouchableOpacity>

            </View>



            <View style={{ width: '90%', justifyContent: "space-between", marginBottom: 25, flexDirection: 'row', borderTopWidth: 1 }}>
              <TouchableOpacity><Image source={require('./assets/defaultskin.png')} style={styles.skin} /></TouchableOpacity>
              <TouchableOpacity><Image source={require('./assets/blackskin.png')} style={styles.skin} /></TouchableOpacity>
              <TouchableOpacity><Image source={require('./assets/yellowskin.png')} style={styles.skin} /></TouchableOpacity>
            </View>
          </View>
        </View>


      </Swiper>









      <View style={[styles.inputcontainer, { backgroundColor: inputBoxColor }]}>

        <TouchableOpacity onPress={imageprocess}><Ionicons name='camera' size={30} style={[styles.play, { color: iconColor }]}></Ionicons></TouchableOpacity>

        <TextInput placeholder={textHolder} style={[styles.input, { backgroundColor: inputColor }]} value={userText} onChangeText={setUserText}></TextInput>

        <TouchableOpacity onPress={() => {

          btnProcess(OCRtext, userText)

          setTextHolder(userText)
          setUserText("")

        }}



        ><Ionicons style={[styles.sendicon, { color: iconColor }]} name={buttonIcon} size={27} /></TouchableOpacity>
      </View>

    </KeyboardAvoidingView>






  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',


  },

  AIcontainer: {
    flex: 1,
    borderRadius: 17,
    alignSelf: "center",
    width: '90%',



  },

  header: {
    alignSelf: "center",
    width: 370,
    height: 100,
    //borderWidth: 1,
    borderColor: "blue",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",

    marginTop: 25
  },

  inputcontainer: {
    backgroundColor: "white",
    flexDirection: "row",
    marginTop: 15,
    width: 500,
    height: 60,

    alignItems: 'center',
    justifyContent: 'center',

  },


  pictureIcon: {
    justifyContent: "flex-end",
    //borderWidth: 1,
    borderColor: "blue",
    color: '#fb9998'
  },

  gatcha: {
    //borderWidth: 1,
    borderColor: "blue",
    justifyContent: "flex-start",

  },



  input: {
    borderColor: 'black',
    fontFamily: 'Onesize',
    width: 260,
    borderRadius: 15,
    height: 40,
    padding: 5,

  },

  sendicon: {
    margin: 5,
    marginLeft: 12,

  },

  play: {
    margin: 1,
    marginRight: 15,
    borderWidth: 1,
    borderColor: 'red'
  },

  pause: {
    margin: 3,
    marginRight: 7,

  },

  skin: {
    width: 70,
    backgroundColor: '#d99191',
    borderRadius: 10,
    height: 70,
    marginTop: 10
  }


});
