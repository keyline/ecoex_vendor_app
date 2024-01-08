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

const RequestDetails = ({ navigation, route }) => {

    const [state, setState] = useState({
        loading: false,
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
                setState(prev => ({
                    ...prev,
                    data: response?.data,
                    requestList: response?.data?.requestList,
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
                    return { ...obj, quote_price: price }
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
                    return { ...obj, qty: qty }
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
            />
        </View>
    )

    const NameValue = ({ name, value }) => (
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2%' }}>
            <Text style={[CommonStyle.boldblacktext, { width: '35%' }]}>{name} :  </Text>
            <Text style={[CommonStyle.normalText, { width: '60%' }]}>{value}</Text>
        </View>
    )

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
                                />}
                            showsVerticalScrollIndicator={false}
                            ListHeaderComponent={renderHeader}
                            ListFooterComponent={renderFooter}
                            refreshControl={<RefreshControl refreshing={false} onRefresh={onGetData} />}
                        />
                    </View>
                </View>
            }

        </SafeAreaView>
    )
}

export default RequestDetails