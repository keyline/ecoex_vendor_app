import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DashBoard from '../../Screen/MainScreen/DashBoard';
import EditProfile from '../../Screen/MainScreen/EditProfile';
import ChangePassword from '../../Screen/MainScreen/ChangePassword';
import StaticPage from '../../Screen/CommonScreen/StaticPage';
import PdfViewer from '../../Screen/CommonScreen/PdfViewer';

const MainStack = () => {

    const Stack = createNativeStackNavigator();

    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false
            }}
        >
            <Stack.Screen name='DashBoard' component={DashBoard} />
            <Stack.Screen name='EditProfile' component={EditProfile} />
            <Stack.Screen name='ChangePassword' component={ChangePassword} />
            <Stack.Screen name='StaticPage' component={StaticPage} />
            <Stack.Screen name='PdfViewer' component={PdfViewer} />
        </Stack.Navigator>
    )
}

export default MainStack