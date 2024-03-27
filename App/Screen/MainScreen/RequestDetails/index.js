import { View, Text, SafeAreaView, FlatList, RefreshControl, TouchableOpacity, Image, Dimensions, Alert } from 'react-native'
import React, { useCallback, useState } from 'react'
import { CommonStyle } from '../../../Utils/CommonStyle'
import Header from '../../../Container/Header'
import { ImagePath } from '../../../Utils/ImagePath'
import { useFocusEffect } from '@react-navigation/native'
import { ToastError, ToastMessage } from '../../../Service/CommonFunction'
import Apis from '../../../Service/Apis'
import Loader from '../../../Container/Loader'
import { styles } from './styles'
import List from './List'
import Button from '../../../Container/Button'
import LoaderTransparent from '../../../Container/LoaderTransparent'
import ImageViewSlider from '../../../Container/ImageViewSlider'
import Popover from 'react-native-popover-view'
import { Colors } from '../../../Utils/Colors'

const screenWidth = Dimensions.get('window').width;


const RequestDetails = ({ navigation, route }) => {

    const [state, setState] = useState({
        loading: false,
        loadingNew: false,
        data: '',
        requestList: [],
        status: '',
        sliderImage: null
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
                enq_id: route.params?.id
            }
            let response = await Apis.request_detais(datas);
            if (__DEV__) {
                console.log('RequestDetails', JSON.stringify(response))
            }
            if (response.success) {
                let li = response?.data?.requestList
                if (li.length > 0) {
                    var updateli = li.map(obj => {
                        return { ...obj, qtyErr: '', priceErr: '' }
                    })
                }
                setState(prev => ({
                    ...prev,
                    data: response?.data,
                    status: response?.data?.vendorQuotationAcceptRejectStatus,
                    requestList: updateli,
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

    const onChangePrice = useCallback(async (item, price) => {
        if (item) {
            let filterprice = price.replace(/[^0-9]/g, '');
            let updateArray = state.requestList.map(obj => {
                if (obj.enq_product_id === item.enq_product_id) {
                    return { ...obj, quote_price: filterprice, priceErr: '' }
                }
                return obj;
            });
            setState(prev => ({
                ...prev,
                requestList: updateArray
            }))
        }
    })

    const onChangeQty = useCallback(async (item, qty) => {
        if (item) {
            let updateArray = state.requestList.map(obj => {
                if (obj.enq_product_id === item.enq_product_id) {
                    return { ...obj, qty: qty, qtyErr: '' }
                }
                return obj;
            });
            setState(prev => ({
                ...prev,
                requestList: updateArray
            }))
        }
    })

    const onAcceptAlert = useCallback(async () => {
        Alert.alert(
            'Enquiry Quotation Request Accept!',
            'Do you really want to accept this request?',
            [
                {
                    text: 'No',
                    onPress: () => null
                },
                {
                    text: 'Yes',
                    onPress: () => onAcceptReject('1')
                }
            ],
            { cancelable: true }
        )
    })

    const onRejectAlert = useCallback(async () => {
        Alert.alert(
            'Enquiry Quotation Request Reject!',
            'Do you really want to reject this request?',
            [
                {
                    text: 'No',
                    onPress: () => null
                },
                {
                    text: 'Yes',
                    onPress: () => onAcceptReject('3')
                }
            ],
            { cancelable: true }
        )
    })

    const onAcceptReject = useCallback(async (value) => {
        try {
            setState(prev => ({
                ...prev,
                loadingNew: true
            }))
            let datas = {
                quotation_request_status: value,
                enq_id: state.data?.enq_id
            }
            let res = await Apis.accept_reject_request(datas)
            if (__DEV__) {
                console.log('AcceptReject', JSON.stringify(res))
            }
            if (res?.success) {
                setState(prev => ({
                    ...prev,
                    loadingNew: false
                }));
                if (value == '1') {
                    navigation.navigate('AcceptRequest');
                } else if (value == "3") {
                    navigation.navigate('RejectRequest');
                }
            } else {
                setState(prev => ({
                    ...prev,
                    loadingNew: false
                }))
            }
            ToastMessage(res?.message);
        } catch (error) {
            if (__DEV__) {
                console.log(error)
            }
            setState(prev => ({
                ...prev,
                loadingNew: false
            }))
            ToastError();
        }
    })

    const renderHeader = () => (
        <View style={[styles.listContainer, { borderWidth: 1 }]}>
            <NameValue name={'Request ID'} value={state.data?.enquiry_no} />
            <NameValue name={'Colection Date'} value={state.data?.collection_date} />

        </View>
    )

    const renderFooter = () => (
        <View style={{ paddingVertical: '3%' }}>
            <TouchableOpacity onPress={() => onShowGpsImage(state.data?.gps_image)} activeOpacity={0.5} style={[styles.imgBtn, { marginTo: '2%', paddingHorizontal: '4.5%' }]}>
                <Text style={styles.imgBtnText}>View GPS Image</Text>
            </TouchableOpacity>
            {(state.status == '0') && (
                <View style={styles.acptrejectContainer}>
                    <TouchableOpacity onPress={onRejectAlert} activeOpacity={0.5} style={styles.rejectContainer}>
                        <Image source={ImagePath.close_round} style={styles.rejecticon} />
                        <Text style={[CommonStyle.normalText, { color: Colors.white, fontWeight: '700' }]}> Click to Reject</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={onAcceptAlert} activeOpacity={0.5} style={styles.acceptContainer}>
                        <Image source={ImagePath.accept} style={styles.rejecticon} />
                        <Text style={[CommonStyle.normalText, { color: Colors.white, fontWeight: '700' }]}> Click to Accept</Text>
                    </TouchableOpacity>
                </View>
            )}
            {(state.status == '1' && state.data?.is_editable == '1') && (
                <Button
                    name={'Send Quotation'}
                    onPress={onSubmit}
                />
            )}
        </View>
    )

    const NameValue = ({ name, value }) => (
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2%' }}>
            <Text style={[CommonStyle.boldblacktext, { width: '35%' }]}>{name} :  </Text>
            <Text style={[CommonStyle.normalText, { width: '60%' }]}>{value}</Text>
        </View>
    )

    const onSubmit = useCallback(async () => {
        let priceempty = state.requestList.some(obj => (obj.quote_price.trim() != ''))
        console.log('preiceindex', priceempty);
        // let qtyEmptyIndex = state.requestList.findIndex(obj => obj.qty.trim() == '')
        let priceEmptyIndex = state.requestList.findIndex(obj => obj.quote_price.trim() == '')
        // if (qtyEmptyIndex != -1) {
        //     let updatearr = state.requestList.map(obj => {
        //         if (obj.qty.trim() == '') {
        //             return { ...obj, qtyErr: 'Enter Quantity' }
        //         }
        //         return obj
        //     })
        //     setState(prev => ({
        //         ...prev,
        //         requestList: updatearr
        //     }))
        //     return
        // } else 
        // if (priceEmptyIndex != -1) {
        //     let updatearr = state.requestList.map(obj => {
        //         if (obj.quote_price.trim() == '') {
        //             return { ...obj, priceErr: 'Enter Quote Price' }
        //         }
        //         return obj
        //     })
        //     setState(prev => ({
        //         ...prev,
        //         requestList: updatearr
        //     }))
        //     return
        // } 
        if (!priceempty) {
            let updatearr = state.requestList.map(obj => {
                if (obj.quote_price.trim() == '') {
                    return { ...obj, priceErr: 'Enter Quote Price' }
                }
                return obj
            })
            setState(prev => ({
                ...prev,
                requestList: updatearr
            }))
            return
        } else {
            try {
                setState(prev => ({
                    ...prev,
                    loadingNew: true
                }))
                let datas = {
                    enq_id: state.data?.enq_id,
                    requestList: state.requestList
                }
                // console.log('Postbody', JSON.stringify(datas))
                let res = await Apis.submit_quotation(datas);
                if (__DEV__) {
                    console.log('SubmitQuotation', JSON.stringify(res))
                }
                if (res.success) {
                    state.data.is_editable = '0'
                    state.data.is_quotation_submit = '1'
                    let updatearr = state.requestList.map(obj => {
                        if (obj.quote_price.trim() == '') {
                            return { ...obj, quote_price: '0', priceErr: '' }
                        }
                        return obj
                    })
                    setState(prev => ({
                        ...prev,
                        requestList: updatearr
                    }))
                }
                setState(prev => ({
                    ...prev,
                    loadingNew: false
                }))
                ToastMessage(res?.message);
            } catch (error) {
                if (__DEV__) {
                    console.log(error)
                }
                setState(prev => ({
                    ...prev,
                    loadingNew: false
                }))
                ToastError();
            }
        }
    })

    const getStatusName = () => {
        let val = state.status;
        if (val == "0") {
            return "Pending";
        } else if (val == "1") {
            return "Accepted";
        } else if (val == "2") {
            return "Allocated";
        } else if (val == "3") {
            return 'Rejected';
        } else {
            return ""
        }
    }

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

    return (
        <SafeAreaView style={CommonStyle.container}>
            <Header
                name={'Request Details'}
                leftIcon={ImagePath.back}
                leftOnPress={onHeaderPress}
            />
            {(state.loading) ? <Loader loading={state.loading} /> :
                <View style={styles.bodyContainer}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <View style={styles.statusContainer}>
                            {/* <Text style={styles.statusText}>STATUS ({state.data?.current_step_no + '/' + state.data?.total_step}) :</Text> */}
                            <Text style={styles.statusText}>STATUS :</Text>
                            <Text style={[styles.statusTextHighlight, state.status == "3" && { backgroundColor: 'red' }, state.status == "2" && { backgroundColor: 'green' }, state.status == "0" && { backgroundColor: 'orange' }]}>{getStatusName()}</Text>
                        </View>
                        {(state.status == '1') && (
                            <Text style={[styles.statusTextHighlight, state.data?.is_quotation_submit == '1' ? { backgroundColor: 'green' } : { backgroundColor: 'red' }]}>{state.data?.is_quotation_submit == '1' ? 'Quotation Submitted' : 'Quotation Not Submitted'}</Text>
                        )}
                    </View>
                    {(state.status != '0' && state.data?.submitted_count > 0) && (
                        <Popover
                            from={(
                                < TouchableOpacity activeOpacity={0.5} style={styles.infoContainer}>
                                    <Text style={CommonStyle.normalText}>Submited : <Text style={CommonStyle.boldblacktext}>{state.data?.submitted_count} time(s)</Text>  </Text>
                                    <Image source={ImagePath.info} style={styles.info} />
                                </TouchableOpacity>
                            )}
                        >
                            <View style={{ width: screenWidth * 0.5, padding: 12 }}>
                                <Text style={CommonStyle.boldblacktext}>Request Submited on :</Text>
                                <View >
                                    {(state.data?.submitted_dates && state.data?.submitted_dates.length > 0) && (
                                        <>
                                            {state.data?.submitted_dates.map((item, key) => (
                                                <Text key={key} style={CommonStyle.normalText}>{item}</Text>
                                            ))}
                                        </>
                                    )}
                                </View>
                            </View>
                        </Popover>
                    )}
                    <View style={{ marginTop: '2%', flex: 1 }}>
                        <FlatList
                            data={state.requestList}
                            keyExtractor={(item, index) => index}
                            renderItem={({ item }) =>
                                <List
                                    item={item}
                                    onChangePrice={onChangePrice}
                                    onChangeQty={onChangeQty}
                                    status={state.status}
                                    editable={state.data?.is_editable == "1" ? true : false}
                                    onShowImage={onShowImage}
                                />}
                            showsVerticalScrollIndicator={false}
                            // style={{ marginBottom: '4%' }}
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
            {(state.loadingNew) && (
                <LoaderTransparent loading={state.loadingNew} />
            )}
        </SafeAreaView>
    )
}

export default RequestDetails