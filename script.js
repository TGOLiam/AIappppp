import { useState } from 'react';
const [isProcessing, setProcessing] = useState(true)

export {isProcessing, setProcessing}




export const processBtn = async () => {
    
    if (isProcessing == true) {
      console.log("TRUEE")
      AIprocess(OCRtext, topic)
      setBtnIcon("stop")
    }

    if (isProcessing == false){
      console.log("FALSEEE")
      setBtnIcon("send")
    }
  }