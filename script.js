import React, { useState } from 'react';
import { View, Button, Text } from 'react-native';


const ServerTest = () => {
  

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      
      {responseData && (
        <View>
          <Text>{JSON.stringify(responseData)}</Text>
        </View>
      )}
    </View>
  );
};

export default ServerTest;
