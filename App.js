import { useReducer, useState, useEffect, useCallback } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, TextInput, KeyboardAvoidingView, ScrollView, Switch } from 'react-native';
import { processImage, OcrApiRequest, AIapiRequest, topic, speakAI, PlayAudio, soundObject, controlAudio } from './APIprocess'
import Ionicons from '@expo/vector-icons/Ionicons';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { Image } from 'expo-image';



import Swiper from 'react-native-swiper';




export default function App() {
  const [AItext, setAItext] = useState("Watchap!! I'm Gatcha!!")
  const [textHolder, setTextHolder] = useState("Try saying summarize for me")
  const [userText, setUserText] = useState('')
  const [OCRtext, setOCRData] = useState('')
  const [soundData, setSound] = useState("")

  const [BgColor, setBg] = useState("white")
  const [boxColor, setBox] = useState("#003fae")
  const [inputColor, setInput] = useState("#083256")
  const [headerColor, setHeader] = useState('#fb9998')
  const [showTune, setTune] = useState("flex")

  const [buttonIcon, setBtnIcon] = useState("send")
  const [isProcessing, setProcessing] = useState(false)

  let AIspeak
  let abortController = new AbortController();


  const imageprocess = async () => {
    setAItext("Using my eyes...")
    const image = await processImage()
    setAItext("Reading your image...")
    const ocrData = await OcrApiRequest(image)
    setOCRData(ocrData)
    AIprocess(ocrData, topic)
  }

  const AIprocess = async (data, input) => {
    try {


      setBtnIcon("stop")

      setAItext("Using my brain")


      const AI = await AIapiRequest(data, input)
      AIspeak = await speakAI(AI)
      const audio = await PlayAudio("play", AIspeak)




      setSound(AIspeak)


      console.log("AI Response: ", AI)
      setAItext(AI)
      setBtnIcon("send")
      setProcessing(false)

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

        <View style={[styles.AIcontainer, { backgroundColor: boxColor, justifyContent: 'center' }]}>








        </View>

        <View style={[styles.AIcontainer, { backgroundColor: boxColor, justifyContent: 'center'}]}>
          <Image source={require('./assets/face.png')} style={[styles.face, { display: showTune }]} contentFit="cover"></Image>
          <TextInput style={[styles.finetune]} textAlignVertical="top" multiline={true} onFocus={() => { setTune("none") }} onBlur={() => { setTune("flex") }}></TextInput>
          <TouchableOpacity style={styles.save} ><Text>hello</Text></TouchableOpacity>
        </View>


      </Swiper>









      <View style={styles.inputcontainer}>
        <TouchableOpacity onPress={() => controlAudio("stop", soundData)}><Ionicons name='pause-outline' size={30} style={[styles.pause, { color: inputColor }]} ></Ionicons></TouchableOpacity>
        <TouchableOpacity onPress={() => controlAudio("resume", soundData)}><Ionicons name='play-outline' size={30} style={[styles.play, { color: inputColor }]}></Ionicons></TouchableOpacity>
        <TextInput placeholder={textHolder} style={styles.input} value={userText} onChangeText={setUserText}></TextInput>

        <TouchableOpacity onPress={() => {

          btnProcess(OCRtext, userText)

          setTextHolder(userText)
          setUserText("")

        }}



        ><Ionicons style={[styles.sendicon, { color: inputColor }]} name={buttonIcon} size={27} /></TouchableOpacity>
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
    backgroundColor: "#f99b99",
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
    backgroundColor: '#e4e2e2'
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
    
    alignSelf:'center',
    borderColor: 'yellow',
    borderWidth: 1
  }


});
