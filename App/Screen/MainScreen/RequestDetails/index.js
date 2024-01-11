import { View, Text, SafeAreaView, FlatList, RefreshControl } from 'react-native'
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

const RequestDetails = ({ navigation, route }) => {

    const [state, setState] = useState({
        loading: false,
        loadingNew: false,
        data: '',
        requestList: []
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
            let updateArray = state.requestList.map(obj => {
                if (obj.enq_product_id === item.enq_product_id) {
                    return { ...obj, quote_price: price, priceErr: '' }
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

    const renderHeader = () => (
        <View style={[styles.listContainer, { borderWidth: 1 }]}>
            <NameValue name={'Request ID'} value={state.data?.enquiry_no} />
            <NameValue name={'Colection Date'} value={state.data?.collection_date} />

        </View>
    )

    const renderFooter = () => (
        <View>
            <Button
                name={'Send Quotation'}
                onPress={onSubmit}
            />
        </View>
    )

    const NameValue = ({ name, value }) => (
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2%' }}>
            <Text style={[CommonStyle.boldblacktext, { width: '35%' }]}>{name} :  </Text>
            <Text style={[CommonStyle.normalText, { width: '60%' }]}>{value}</Text>
        </View>
    )

    const onSubmit = useCallback(async () => {
        let qtyEmptyIndex = state.requestList.findIndex(obj => obj.qty.trim() == '')
        let priceEmptyIndex = state.requestList.findIndex(obj => obj.quote_price.trim() == '')
        if (qtyEmptyIndex != -1) {
            let updatearr = state.requestList.map(obj => {
                if (obj.qty.trim() == '') {
                    return { ...obj, qtyErr: 'Enter Quantity' }
                }
                return obj
            })
            setState(prev => ({
                ...prev,
                requestList: updatearr
            }))
            return
        } else if (priceEmptyIndex != -1) {
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

    return (
        <SafeAreaView style={CommonStyle.container}>
            <Header
                name={'Request Details'}
                leftIcon={ImagePath.back}
                leftOnPress={onHeaderPress}
            />
            {(state.loading) ? <Loader loading={state.loading} /> :
                <View style={styles.bodyContainer}>
                    <View style={styles.statusContainer}>
                        <Text style={styles.statusText}>STATUS ({state.data?.current_step_no + '/' + state.data?.total_step}) :</Text>
                        <Text style={styles.statusTextHighlight}>{state.data?.current_step_name}</Text>
                    </View>
                    <View style={{ marginTop: '2%', flex: 1 }}>
                        <FlatList
                            data={state.requestList}
                            keyExtractor={(item, index) => index}
                            renderItem={({ item }) =>
                                <List
                                    item={item}
                                    onChangePrice={onChangePrice}
                                    onChangeQty={onChangeQty}
                                    status={state.data?.current_step_no}
                                    editable={state.data?.current_step_no == 1 ? true : false}
                                />}
                            showsVerticalScrollIndicator={false}
                            ListHeaderComponent={renderHeader}
                            ListFooterComponent={state.data?.current_step_no == 1 ? renderFooter : null}
                            refreshControl={<RefreshControl refreshing={false} onRefresh={onGetData} />}
                        />
                    </View>
                </View>
            }
            {(state.loadingNew) && (
                <LoaderTransparent loading={state.loadingNew} />
            )}
        </SafeAreaView>
    )
}

export default RequestDetails