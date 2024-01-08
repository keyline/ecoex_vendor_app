import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DashBoard from '../../Screen/MainScreen/DashBoard';
import EditProfile from '../../Screen/MainScreen/EditProfile';
import ChangePassword from '../../Screen/MainScreen/ChangePassword';
import StaticPage from '../../Screen/CommonScreen/StaticPage';
import PdfViewer from '../../Screen/CommonScreen/PdfViewer';
import PendingRequest from '../../Screen/MainScreen/PendingRequest';
import AcceptRequest from '../../Screen/MainScreen/AcceptRequest';
import RejectRequest from '../../Screen/MainScreen/RejectRequest';
import CompleteRequest from '../../Screen/MainScreen/CompleteRequest';
import RequestDetails from '../../Screen/MainScreen/RequestDetails';

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
            <Stack.Screen name='PendingRequest' component={PendingRequest} />
            <Stack.Screen name='AcceptRequest' component={AcceptRequest} />
            <Stack.Screen name='RejectRequest' component={RejectRequest} />
            <Stack.Screen name='CompleteRequest' component={CompleteRequest} />
            <Stack.Screen name='RequestDetails' component={RequestDetails} />
        </Stack.Navigator>
    )
}

export default MainStack