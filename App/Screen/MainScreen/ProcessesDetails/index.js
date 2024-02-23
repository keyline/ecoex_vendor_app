import { View, Text, SafeAreaView, FlatList, RefreshControl, TouchableOpacity } from 'react-native'
import React, { useCallback, useState } from 'react'
import { useFocusEffect } from '@react-navigation/native'
import Apis from '../../../Service/Apis'
import { ToastError, ToastMessage, dateConvertNew, getStatusName } from '../../../Service/CommonFunction'
import { CommonStyle } from '../../../Utils/CommonStyle'
import Header from '../../../Container/Header'
import { ImagePath } from '../../../Utils/ImagePath'
import { styles } from './styles'
import Loader from '../../../Container/Loader'
import List from './List'
import ImageViewSlider from '../../../Container/ImageViewSlider'
import LoaderTransparent from '../../../Container/LoaderTransparent'
import InputField from '../../../Container/InputField'
import Button from '../../../Container/Button'
import DatePickerModal from '../../../Container/DatePickerModal'

const ProcessesDetails = ({ navigation, route }) => {

    const [state, setState] = useState({
        loading: false,
        loadingNew: false,
        data: '',
        requestList: [],
        status: '',
        sliderImage: null,
        pickupDate: '',
        pickupDateErr: '',
        pickupDatePicker: false
    })

    useFocusEffect(
        useCallback(() => {
            const unsubscribe = onGetData();
            return () => unsubscribe
        }, [navigation])
    )

    const onGetData = useCallback(async () => {
        try {
            showLoading();
            let datas = {
                sub_enquiry_no: route.params?.id
            }
            let response = await Apis.processes_request_detais(datas);
            if (__DEV__) {
                console.log('RequestDetails', JSON.stringify(response))
            }
            if (response.success) {
                let li = response?.data?.items

                setState(prev => ({
                    ...prev,
                    data: response?.data,
                    status: response?.data?.enquiry_sub_status_id,
                    requestList: li,
                    loading: false
                }))
            } else {
                hideLoading();
                ToastMessage(response?.message);
            }
        } catch (error) {
            if (__DEV__) {
                console.log(error)
            }
            hideLoading();
            ToastError();
        }
    })

    const showLoading = useCallback(async () => {
        setState(prev => ({
            ...prev,
            loading: true,
        }))
    })

    const hideLoading = useCallback(async () => {
        setState(prev => ({
            ...prev,
            loading: false,
        }))
    })

    const onHeaderPress = useCallback(async () => {
        navigation.goBack();
    })

    const onShowImage = useCallback(async (image) => {
        if (image && image.length > 0) {
            let updatearr = image.map(obj => {
                return { uri: obj?.link }
            })
            setState(prev => ({
                ...prev,
                sliderImage: updatearr
            }))
        }
    })

    const onShowGpsImage = useCallback(async (image) => {
        if (image) {
            let array = [];
            let obj = { uri: image }
            array.push(obj);
            setState(prev => ({
                ...prev,
                sliderImage: array
            }))
        }
    })

    const onCloseSlider = useCallback(async () => {
        setState(prev => ({
            ...prev,
            sliderImage: null
        }))
    })

    const onOpenDatePicker = useCallback(async () => {
        setState(prev => ({
            ...prev,
            pickupDatePicker: true
        }))
    }, [state.pickupDatePicker])

    const onCloseDatePicker = useCallback(async () => {
        setState(prev => ({
            ...prev,
            pickupDatePicker: false
        }))
    }, [state.pickupDatePicker])

    const onChangePickupDate = useCallback(async (value) => {
        if (value) {
            setState(prev => ({
                ...prev,
                pickupDate: value,
                pickupDatePicker: false,
                pickupDateErr: ''
            }))
        } else {
            setState(prev => ({
                ...prev,
                pickupDatePicker: false
            }))
        }
    })

    const NameValue = ({ name, value }) => (
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2%' }}>
            <Text style={[CommonStyle.boldblacktext, { width: '35%' }]}>{name} :  </Text>
            <Text style={[CommonStyle.normalText, { width: '60%' }]}>{value}</Text>
        </View>
    )

    const renderHeader = () => (
        <View style={[styles.listContainer, { borderWidth: 1 }]}>
            <NameValue name={'Request ID'} value={state.data?.sub_enquiry_no} />
            <NameValue name={'Assigned Date'} value={state.data?.assigned_date} />
        </View>
    )

    const renderFooter = () => (
        <View style={{ paddingVertical: '3%' }}>
            <TouchableOpacity onPress={() => onShowGpsImage(state.data?.gps_image)} activeOpacity={0.5} style={[styles.imgBtn, { marginTo: '2%', paddingHorizontal: '4.5%' }]}>
                <Text style={styles.imgBtnText}>View GPS Image</Text>
            </TouchableOpacity>
            {(state.status == '3.3') && (
                <View>
                    <InputField
                        name={'Pickup Date :'}
                        editable={false}
                        value={dateConvertNew(state.pickupDate)}
                        placeholder={'Choose Pickup Date'}
                        rightIcon={ImagePath.date}
                        rightonPress={onOpenDatePicker}
                        error={state.pickupDateErr}
                    // width={'70%'}
                    />
                    <Button
                        name={'Pickup Schedule'}
                        onPress={onPickup}
                    />
                </View>
            )}
        </View>
    )

    const onPickup = useCallback(async () => {

    })

    return (
        <SafeAreaView style={CommonStyle.container}>
            <Header
                name={'Enquiry Details'}
                leftIcon={ImagePath.back}
                leftOnPress={onHeaderPress}
            />
            {(state.loading) ? <Loader loading={state.loading} /> :
                <View style={styles.bodyContainer}>
                    <View style={styles.statusContainer}>
                        <Text style={styles.statusText}>STATUS :</Text>
                        <Text style={[styles.statusTextHighlight, { backgroundColor: 'green' }]}>{state.data?.enquiry_sub_status}</Text>
                    </View>
                    <View style={{ marginTop: '2%', flex: 1 }}>
                        <FlatList
                            data={state.requestList}
                            keyExtractor={(item, index) => index}
                            renderItem={({ item }) =>
                                <List
                                    item={item}
                                    status={state.status}
                                    onShowImage={onShowImage}
                                />}
                            showsVerticalScrollIndicator={false}
                            ListHeaderComponent={renderHeader}
                            ListFooterComponent={renderFooter}
                            refreshControl={<RefreshControl refreshing={false} onRefresh={onGetData} />}

                        />
                    </View>
                </View>
            }
            {(state.sliderImage) && (
                <ImageViewSlider
                    images={state.sliderImage}
                    onClose={onCloseSlider}
                />
            )}
            {(state.pickupDatePicker) && (
                <DatePickerModal
                    isVisible={state.pickupDatePicker}
                    value={state.pickupDate ? new Date(state.pickupDate) : new Date()}
                    onConfirm={onChangePickupDate}
                    minimumDate={new Date()}
                    onClose={onCloseDatePicker}//
                />
            )}
            {(state.loadingNew) && (
                <LoaderTransparent loading={state.loadingNew} />
            )}
        </SafeAreaView>
    )
}

export default ProcessesDetails