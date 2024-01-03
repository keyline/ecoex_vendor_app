import { View, Text, SafeAreaView, TouchableOpacity, ScrollView, Image } from 'react-native'
import React, { useCallback, useState } from 'react'
import { CommonStyle } from '../../../Utils/CommonStyle'
import Header from '../../../Container/Header'
import { ImagePath } from '../../../Utils/ImagePath'
import { useFocusEffect } from '@react-navigation/native'
import Apis from '../../../Service/Apis'
import { ToastError, ToastMessage } from '../../../Service/CommonFunction'
import { styles } from './styles'
import Loader from '../../../Container/Loader'

const DashBoard = ({ navigation }) => {

  const [state, setState] = useState({
    loading: false,
    data: '',
  })

  useFocusEffect(
    useCallback(() => {
      const unsubscribe = onGetData();
      return () => unsubscribe
    }, [navigation])
  )

  const showLoading = useCallback(async () => {
    setState(prev => ({
      ...prev,
      loading: true
    }))
  })

  const hideLoading = useCallback(async () => {
    setState(prev => ({
      ...prev,
      loading: false
    }))
  })

  const onGetData = useCallback(async () => {
    try {
      showLoading();
      let response = await Apis.plant_dashboard();
      if (__DEV__) {
        console.log('Dashboard', JSON.stringify(response))
      }
      if (response.success) {
        setState(prev => ({
          ...prev,
          data: response?.data,
          loading: false
        }))
      } else {
        hideLoading();
        ToastMessage(response?.message)
      }
    } catch (error) {
      if (__DEV__) {
        console.log(error)
      }
      hideLoading();
      ToastError();
    }
  })

  const onHeaderPress = useCallback(async () => {
    if (__DEV__) {
      console.log('hiiiii')
    }
  })

  const NameValue = ({ name, value }) => (
    <Text style={[styles.nametxt, { marginBottom: '1%' }]}>{name} - <Text style={styles.valuetxt}>{value}</Text></Text>
  )

  const BottonNew = ({ name, onPress, color }) => (
    <TouchableOpacity activeOpacity={0.5} onPress={onPress} disabled={!onPress} style={[styles.fullbtn, { backgroundColor: color ? color : Colors.theme_color }]}>
      <Text style={styles.btmtext}>{name}</Text>
    </TouchableOpacity>
  )

  const onBtnPress = useCallback(async (screen) => {
    if (screen) {
      navigation.navigate(screen);
    }
  })

  return (
    <SafeAreaView style={CommonStyle.container}>
      <Header
        name={'Dashboard'}
        leftIcon={ImagePath.home}
        leftOnPress={onHeaderPress}
        navigation={navigation}
      />
      {(state.loading) ? <Loader loading={state.loading} /> :
        <ScrollView>
          {(state.data) && (
            <View style={styles.bodyContent}>
              <View style={[styles.profileContainer, { width: '100%' }]}>
                <Image source={ImagePath.dp} style={styles.dp} />
                <View style={[styles.profileInfo, { width: '80%' }]}>
                  <NameValue name={'Vendor Id'} value={state.data?.plant_id} />
                  <NameValue name={'Vendor Name'} value={state.data?.company_name} />
                  <NameValue name={'GST No'} value={state.data?.gst_no} />
                  <NameValue name={'Email ID'} value={state.data?.email} />
                  <NameValue name={'Vendor Address'} value={state.data?.full_address} />
                  <NameValue name={'Vendor Location'} value={state.data?.location} />
                </View>
              </View>
              <View style={styles.btnContent}>
                <Text style={styles.headingText}>Request Status Wise Count</Text>
                <View style={styles.btnContainer}>
                  <BottonNew onPress={(() => onBtnPress('AddRequest'))} name={'Add New Request'} color={'#264CD4'} />
                  <BottonNew onPress={(() => onBtnPress('ProcessRequest'))} name={state.data?.step2_label + ' (' + state.data?.step2_count + ')'} color={'#E79D0CE8'} />
                  <BottonNew onPress={(() => onBtnPress('RejectRequest'))} name={state.data?.step3_label + ' (' + state.data?.step3_count + ')'} color={'#E70C0CC9'} />
                  <BottonNew onPress={(() => onBtnPress('CompleteRequest'))} name={state.data?.step4_label + ' (' + state.data?.step4_count + ')'} color={'#2DA952'} />
                </View>

              </View>
            </View>
          )}
        </ScrollView>
      }
    </SafeAreaView>
  )
}

export default DashBoard