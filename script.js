import React, { useState } from 'react';
import { View, Button, Text } from 'react-native';


const ServerTest = () => {
  const [responseData, setResponseData] = useState(null);
  
  const fetchData = async () => {
    try {
        const url = 'http://192.168.1.4:3000/';
        console.log('getting status....')
      
        const response = await fetch(url, {
          method: 'GET',
        });
      
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
      
        const responseData = await response.text();
        console.log(responseData);
        setResponseData(responseData)
      } catch (error) {
        console.error('Error fetching data:', error);
      }
      
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="Fetch Data" onPress={fetchData} />
      {responseData && (
        <View>
          <Text>{JSON.stringify(responseData)}</Text>
        </View>
      )}
    </View>
  );
};

export default ServerTest;
