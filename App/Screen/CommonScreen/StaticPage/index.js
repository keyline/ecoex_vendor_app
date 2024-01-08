import { View, Text, SafeAreaView, ScrollView, Dimensions } from 'react-native'
import React, { useCallback, useContext, useState } from 'react'
import AuthContext from '../../../Service/Context';
import { useFocusEffect } from '@react-navigation/native';
import Apis from '../../../Service/Apis';
import { ToastError, ToastMessage } from '../../../Service/CommonFunction';
import { CommonStyle, tagsStyles } from '../../../Utils/CommonStyle';
import Header from '../../../Container/Header';
import Loader from '../../../Container/Loader';
import RenderHTML from 'react-native-render-html';
import { ImagePath } from '../../../Utils/ImagePath';

const { width, height } = Dimensions.get('window')

const StaticPage = ({ navigation, route }) => {

    const context = useContext(AuthContext);
    const { isLogin } = context.allData

    const [state, setState] = useState({
        loading: true,
        data: ''
    })

    useFocusEffect(
        useCallback(() => {
            const unsubscribe = onGetData();
            return () => unsubscribe
        }, [navigation, route])
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
            let datas = {
                page_slug: route.params.page
            }
            let response = await Apis.static_page(datas)
            if (__DEV__) {
                console.log('StaticPage', JSON.stringify(response))
            }
            if (response.success) {
                setState(prev => ({
                    ...prev,
                    data: response?.data,
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

    const onHeaderPress = useCallback(async () => {
        if (isLogin) {
            navigation.navigate('DashBoard');
        } else {
            navigation.goBack();
        }
    })

    return (
        <SafeAreaView style={CommonStyle.container}>
            <Header
                name={state.data?.page_title}
                leftIcon={isLogin ? ImagePath.home : ImagePath.back}
                leftOnPress={onHeaderPress}
            />
            {(state.loading) ?
                <Loader loading={state.loading} />
                :
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{ marginHorizontal: '4%', alignItems: 'center' }}>
                        <RenderHTML
                            contentWidth={width * 0.5}
                            source={{ html: state.data?.long_description }}
                            tagsStyles={tagsStyles}
                        />
                    </View>
                </ScrollView>
            }
        </SafeAreaView>
    )
}

export default StaticPage