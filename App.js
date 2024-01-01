import { View, Text, StatusBar } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import AuthContext from './App/Service/Context'
import { NavigationContainer } from '@react-navigation/native'
import { navigationRef } from './App/Service/NavigationRef'
import AuthMainStack from './App/Navigation/AuthStack/AuthMainStack'
import { getAccessToken, getStoreFcmToken, getUserData } from './App/Service/AsyncStorage'
import Apis from './App/Service/Apis'
import { ToastError, ToastMessage } from './App/Service/CommonFunction'
import SplashScreen from 'react-native-splash-screen'

const App = () => {

  const [state, setState] = useState({
    loading: false,
    isLogin: false,
    userData: null,
    accesstoken: null,
    appData: null,
    userProfile: null,
    siteData: null,
  })

  useEffect(() => {
    // onGetDeviceToken();
    onGetData();
    // onAppUpdate();
  }, [])

  const onGetDeviceToken = async () => {
    try {
      let premission = await getFcmPermission();
      // let token = await generateFcmToken();
      let fcmToken = await getStoreFcmToken();
      if (__DEV__) {
        console.log('FcmPremission', premission)
        console.log('FcmToken', fcmToken);
      }
    } catch (error) {
      if (__DEV__) {
        console.log(error)
      }
    }
  }

  const onGetData = useCallback(async () => {
    try {
      setState(prev => ({
        ...prev,
        loading: true
      }))
      let response = await Apis.app_setting()
      if (__DEV__) {
        console.log('AppSettingApp.js', JSON.stringify(response))
      }
      await onGetStoreData();
      if (response.success) {
        setState(prev => ({
          ...prev,
          siteData: response?.data,
          loading: false
        }))
        SplashScreen.hide();
      } else {
        ToastMessage(response?.message);
      }
    } catch (error) {
      if (__DEV__) {
        console.log(error)
      }
      ToastError();
    }
  })

  const onGetUserProfile = useCallback(async () => {
    // let accesstoken = await getAccessToken();
    // if (accesstoken) {
    //   try {
    //     let res = await Apis.get_profile();
    //     if (__DEV__) {
    //       console.log('UserProfileAppjs', JSON.stringify(res))
    //     }
    //     if (res.success) {
    //       setState(prev => ({
    //         ...prev,
    //         userProfile: res?.data,
    //         userType: res?.data?.type
    //       }))
    //     }
    //   } catch (error) {
    //     if (__DEV__) {
    //       console.log(error)
    //     }
    //     ToastError();
    //   }
    // }
  })

  const onGetStoreData = async () => {
    // try {
    //   let userdata = await getUserData();
    //   let accesstoken = await getAccessToken();
    //   if (__DEV__) {
    //     console.log('UserData', userdata);
    //     console.log('token', accesstoken)
    //   }
    //   if (userdata && accesstoken) {
    //     setState(prevState => ({
    //       ...prevState,
    //       userdata: userdata,
    //       accesstoken: accesstoken,
    //       userType: userdata?.type,
    //       isLogin: true
    //     }))
    //     onGetUserProfile();
    //   } else {
    //     setState(prevState => ({
    //       ...prevState,
    //       userdata: null,
    //       accesstoken: null,
    //       isLogin: false
    //     }))
    //   }
    // } catch (error) {
    //   if (__DEV__) {
    //     console.log('dataError', error)
    //   }
    // }
  }

  const onClearStoreData = async () => {
    // try {
    //   setState(prevState => ({
    //     ...prevState,
    //     isLogin: false,
    //     userdata: null,
    //     accesstoken: null,
    //     userProfile: null
    //   }))
    //   await clearUserData();
    // } catch (error) {
    //   if (__DEV__) {
    //     console.log('dataError', error)
    //   }
    // }
  }

  return (
    <AuthContext.Provider value={{ allData: state, setState, onGetStoreData, onClearStoreData, onGetUserProfile }}>
      <NavigationContainer ref={navigationRef}>
        <StatusBar backgroundColor={'green'} barStyle={'light-content'} />
        {(!state.loading) && (
          <AuthMainStack />
        )}
      </NavigationContainer>
    </AuthContext.Provider>
  )
}

export default App