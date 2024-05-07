import { useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, TextInput, KeyboardAvoidingView, ScrollView } from 'react-native';
import { processImage, OcrApiRequest, AIapiRequest, topic, speakAI, PlayAudio, soundObject, controlAudio } from './APIprocess'
import Ionicons from '@expo/vector-icons/Ionicons';


 
import Swiper from 'react-native-swiper';

export default function App() {
  const [AItext, setAItext] = useState("Try askin me smth.......")
  const [textHolder, setTextHolder] = useState("Try saying summarize for me")
  const [userText, setUserText] = useState('')
  const [OCRtext, setOCRData] = useState('')
  const [soundData, setSound] = useState("")
 

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

      const signal = abortController.signal;


      setAItext("Using my brain")

      if (signal.aborted) {
        // Handle the cancellation appropriately
        console.log("Request was cancelled");
        return;
      }

      const AI = await AIapiRequest(data, input, signal)
      AIspeak = await speakAI(AI)
      const audio = await PlayAudio("play", AIspeak)




      setSound(AIspeak)


      console.log("AI Response: ", AI)
      setAItext(AI)
      setBtnIcon("send")
      setProcessing(!isProcessing)
    } catch (error) {


      setAItext("An error occured")


    }
  }

  const processBtn = async (data, input) => {
    setProcessing(!isProcessing)
    if (!isProcessing) {

      if (userText.trim() !== '') {
        setBtnIcon("stop")
        console.log("processing")
        await AIprocess(data, input)
        setProcessing(!isProcessing)
        setBtnIcon("send")
      }

    }
    else {
      console.log("cancelling")
      setBtnIcon("send")
      if (abortController) {
        abortController.abort();
      }
    }
  }






  return (

    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>

      <View style={styles.header}>
        <TouchableOpacity><Ionicons name="settings" size={35} style={styles.addIcon} > </Ionicons></TouchableOpacity>
        <TouchableOpacity><Text style={{ fontSize: 20}}>Gatcha</Text></TouchableOpacity>
        <TouchableOpacity onPress={imageprocess}><Ionicons name="camera" size={40} style={styles.pictureIcon}></Ionicons></TouchableOpacity>


      </View>






      <Swiper showsButtons={false} showsPagination={false}>
        <ScrollView style={styles.AIcontainer}>
          <Text style={{ paddingBottom: 100, fontSize: 20 }}>{AItext}</Text>

        </ScrollView>

        <View style={{ borderWidth: 1, borderColor: "blue" }}>
          <Text>hello</Text>
        </View>

      </Swiper>









      <View style={styles.inputcontainer}>
        <TouchableOpacity onPress={() => controlAudio("stop", soundData)}><Ionicons name='pause-outline' size={30} style={styles.pause} ></Ionicons></TouchableOpacity>
        <TouchableOpacity onPress={() => controlAudio("resume", soundData)}><Ionicons name='play-outline' size={30} style={styles.play}></Ionicons></TouchableOpacity>
        <TextInput placeholder={textHolder} style={styles.input} value={userText} onChangeText={setUserText}></TextInput>

        <TouchableOpacity onPress={() => {

          processBtn(OCRtext, userText)

          setTextHolder(userText)
          setUserText("")

        }}><Ionicons style={styles.sendicon} name={buttonIcon} size={27} color="black" /></TouchableOpacity>
      </View>

    </KeyboardAvoidingView>






  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: "white",

  },

  AIcontainer: {
    //borderWidth: 1,
    borderColor: "red",
    alignSelf: "center",
    width: 350,
    height: 500,

  },

  header: {
    alignSelf: "center",
    width: 370,
    height: 100,
    //borderWidth: 1,
    borderColor: "blue",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between"
  },

  inputcontainer: {
    backgroundColor: "white",
    flexDirection: "row",
    margin: 30
  },


  pictureIcon: {
    justifyContent: "flex-end",
    //borderWidth: 1,
    borderColor: "blue",

  },

  addIcon: {
    //borderWidth: 1,
    borderColor: "blue",
    justifyContent: "flex-start"
  },



  input: {
    borderColor: 'black',
    borderWidth: 1,
    width: 240,
    borderRadius: 7,
    height: 40,
    padding: 5,

  },

  sendicon: {
    margin: 5,
    marginLeft: 12
  },

  play: {
    margin: 3,
    marginRight: 7
  },

  pause: {
    margin: 3,
    marginRight: 7
  },
});
