import { useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, TextInput, KeyboardAvoidingView, ScrollView } from 'react-native';
import { processImage, OcrApiRequest, AIapiRequest, topic, speakAI, PlayAudio } from './APIprocess'
import Icon from 'react-native-vector-icons/Ionicons'; // Or your preferred icon set


export default function App() {
  const [AItext, setAItext] = useState("Try askin me smth.......")
  const [AIstatus, setStatus] = useState("status")
  const [userText, setUserText] = useState('')
  const [OCRtext, setOCRData] = useState('')

  const [buttonIcon, setBtnIcon] = useState("send")
  const [isProcessing, setProcessing] = useState(false)




  const imageprocess = async () => {
    setStatus("Using my eyes...")
    const image = await processImage()
    setStatus("Reading your image...")
    const ocrData = await OcrApiRequest(image)
    setOCRData(ocrData)
    AIprocess(ocrData, topic)
  }

  const AIprocess = async (data, input) => {
    setProcessing((isProcessing) => !isProcessing)

    try {
      setBtnIcon("stop")
      setAItext("Hmmm....")
      setStatus("Using my brain...")


      const [AI, AIspeak] = await Promise.all([
        AIapiRequest(data, input),
        AIapiRequest(data, input).then(speakAI)
      ]);



      const audio = await PlayAudio(AIspeak)

      setStatus("I'm done...")
      setBtnIcon("send")



      console.log("AI Response: ", AI)
      setAItext(AI)
    } catch (error) {
      setAItext("An error occured")
      setStatus("Error")
      setBtnIcon("send")
    }












  }







  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>

      <View style={styles.header}>
        <TouchableOpacity><Icon name="settings" size={35} style={styles.addIcon}> </Icon></TouchableOpacity>
        <TouchableOpacity><Text style={{ fontSize: 20, fontStyle: "italic" }}>Gatcha</Text></TouchableOpacity>
        <TouchableOpacity onPress={imageprocess}><Icon name="camera" size={40} style={styles.pictureIcon}></Icon></TouchableOpacity>


      </View>







      <ScrollView style={styles.AIcontainer}>
        <Text style={{ paddingBottom: 100, fontSize: 20 }}>{AItext}</Text>

      </ScrollView>




      <Text>{AIstatus}</Text>



      <View style={styles.inputcontainer}>
        <TouchableOpacity><Icon name='pause-outline' size={30} style={styles.pause}></Icon></TouchableOpacity>
        <TouchableOpacity><Icon name='play-outline' size={30} style={styles.play}></Icon></TouchableOpacity>
        <TextInput placeholder="Try saying summarize for me" style={styles.input} value={userText} onChangeText={setUserText}></TextInput>

        <TouchableOpacity onPress={() => {
          if (userText.trim() !== '') {
            AIprocess(OCRtext, userText);
          }
        }}><Icon style={styles.sendicon} name={buttonIcon} size={27} color="black" /></TouchableOpacity>
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
