import { useReducer, useState, useEffect, useCallback } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, TextInput, KeyboardAvoidingView, ScrollView, Switch } from 'react-native';
import { processImage, OcrApiRequest, AIapiRequest, topic, speakAI, PlayAudio, soundObject, controlAudio } from './APIprocess'
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
  const [AIstatus, setStatus] = useState("Watchap!! I'm Gatcha!!")

  const [BgColor, setBg] = useState("#fffff")
  const [boxColor, setBox] = useState("#003dad")
  const [iconColor, setIcon] = useState("#123355")
  const [headerColor, setHeader] = useState('#FA9B9B')
  const [inputBoxColor, setInputBox] = useState('#FA9B9B')
  const [inputColor, setInput] = useState('#E2E2E2')



  const [showTune, setTune] = useState("flex")

  const idle = require(`./assets/GachaDefaultIdle.gif`)
  const search = require(`./assets/GachaDefaultThinking.gif`)
  const speaking = require(`./assets/GachaDefaultSpeaking.gif`)
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
      setGif(idle)
    } catch (error) {
      console.error(error)
      setAItext("An error occured")
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
        <TouchableOpacity onPress={imageprocess}><Ionicons name="camera" size={40} style={[styles.pictureIcon, { color: headerColor }]}></Ionicons></TouchableOpacity>


      </View>






      <Swiper showsButtons={true} showsPagination={false} loop={false} index={1} nextButton={<Text style={{ color: '#f99b99', fontSize: 50, left: 5 }}>›</Text>} prevButton={<Text style={{ color: '#f99b99', fontSize: 50, right: 5 }}>‹</Text>}>



        <ScrollView style={[styles.AIcontainer, { backgroundColor: boxColor }]}>
          <Text style={{ fontSize: 20, color: "white", margin: 10, fontFamily: 'Onesize' }}>{AItext}</Text>

        </ScrollView>




        <View style={[styles.AIcontainer, { backgroundColor: boxColor, overflow: 'hidden' }]}>
          <AnimatedImage source={gif} style={[{ width: 450, height: 600, alignSelf: 'center', left: 15, zIndex: 1 }]} />
          <Text style={{ zIndex: 2, alignSelf: 'center', bottom: 50, fontFamily: 'Onesize', color: "white", fontSize: 17}}>{AIstatus}</Text>

        </View>





        <View style={[styles.AIcontainer, { backgroundColor: boxColor, justifyContent: 'center' }]}>
          <Image source={require('./assets/face.png')} style={[styles.face, { display: showTune }]} contentFit="cover"></Image>
          <TextInput style={[styles.finetune]} textAlignVertical="top" multiline={true} onFocus={() => { setTune("none") }} onBlur={() => { setTune("flex") }}></TextInput>
          <TouchableOpacity style={styles.save} ><Text>hello</Text></TouchableOpacity>
        </View>


      </Swiper>









      <View style={[styles.inputcontainer, { backgroundColor: inputBoxColor }]}>
        <TouchableOpacity onPress={() => controlAudio("stop", soundData)}><Ionicons name='pause-outline' size={30} style={[styles.pause, { color: iconColor }]} ></Ionicons></TouchableOpacity>
        <TouchableOpacity onPress={() => controlAudio("resume", soundData)}><Ionicons name='play-outline' size={30} style={[styles.play, { color: iconColor }]}></Ionicons></TouchableOpacity>
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
    width: 350,
    height: '100%',


  },

  header: {
    alignSelf: "center",
    width: 370,
    height: 100,
    //borderWidth: 1,
    borderColor: "blue",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
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
    width: 240,
    borderRadius: 15,
    height: 40,
    padding: 5,

  },

  sendicon: {
    margin: 5,
    marginLeft: 12,

  },

  play: {
    margin: 3,
    marginRight: 7,

  },

  pause: {
    margin: 3,
    marginRight: 7,

  },


  finetune: {
    borderColor: 'black',
    fontFamily: 'Onesize',
    width: 300,
    borderRadius: 15,
    height: 50,
    padding: 5,
    borderColor: "white",
    borderWidth: 1,
    margin: 20,
    color: "white",
    alignSelf: 'center',

  },

  save: {
    borderColor: 'black',
    fontFamily: 'Onesize',
    width: 300,
    borderRadius: 15,
    height: 40,
    padding: 5,
    backgroundColor: '#e4e2e2',
    flexWrap: 'wrap',

    alignSelf: 'center',
  },

  face: {
    width: 300,
    height: 400,

    alignSelf: 'center',
    borderColor: 'yellow',
    borderWidth: 1
  }


});
