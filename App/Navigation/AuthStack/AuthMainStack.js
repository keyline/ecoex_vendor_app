import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WellCome from '../../Screen/AuthScreen/WellCome';
import Login from '../../Screen/AuthScreen/Login';
import SignUp from '../../Screen/AuthScreen/SignUp';
import ForgotPassword from '../../Screen/AuthScreen/ForgotPassword';
import OtpValidate from '../../Screen/AuthScreen/OtpValidate';
import ResetPassword from '../../Screen/AuthScreen/ResetPassword';
import LoginWithMobile from '../../Screen/AuthScreen/LoginWithMobile';
import StaticPage from '../../Screen/CommonScreen/StaticPage';
import PdfViewer from '../../Screen/CommonScreen/PdfViewer';

const AuthMainStack = () => {

    const Stack = createNativeStackNavigator();

    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false
            }}
        >
            <Stack.Screen name='WellCome' component={WellCome} />
            <Stack.Screen name='LoginWithMobile' component={LoginWithMobile} />
            <Stack.Screen name='Login' component={Login} />
            <Stack.Screen name='SignUp' component={SignUp} />
            <Stack.Screen name='ForgotPassword' component={ForgotPassword} />
            <Stack.Screen name='OtpValidate' component={OtpValidate} />
            <Stack.Screen name='ResetPassword' component={ResetPassword} />
            <Stack.Screen name='StaticPage' component={StaticPage} />
            <Stack.Screen name='PdfViewer' component={PdfViewer} />
        </Stack.Navigator>
    )
}

export default AuthMainStack