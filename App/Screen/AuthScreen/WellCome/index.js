import { View, Text, SafeAreaView, Image, ScrollView, Dimensions } from 'react-native'
import React, { useCallback, useContext, useState } from 'react'
import { CommonStyle, tagsStyles } from '../../../Utils/CommonStyle'
import { styles } from './styles'
import { ImagePath } from '../../../Utils/ImagePath'
import AuthContext from '../../../Service/Context'
import { useFocusEffect } from '@react-navigation/native'
import Apis from '../../../Service/Apis'
import { ToastError, ToastMessage } from '../../../Service/CommonFunction'
import Loader from '../../../Container/Loader'
import RenderHTML from 'react-native-render-html'
import Button from '../../../Container/Button'

const { width, height } = Dimensions.get('window')

const WellCome = ({ navigation }) => {

    const context = useContext(AuthContext);
    const { siteData } = context.allData

    const [state, setState] = useState({
        loading: false,
        data: null
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
            let datas = {
                page_slug: 'welcome-text'
            }
            let response = await Apis.static_page(datas)
            if (__DEV__) {
                console.log('WelcomeResponse', JSON.stringify(response))
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

    const onSubmit = useCallback(async () => {
        navigation.replace('Login')
    })

    return (
        <SafeAreaView style={CommonStyle.container}>
            <View style={styles.headerContainer}>
                <Image source={ImagePath.shape} style={styles.headerImage} />
            </View>
            {(state.loading) ?
                <Loader loading={state.loading} />
                :
                <ScrollView showsVerticalScrollIndicator={false}>
                    {(state.data) && (
                        <View style={styles.bodyContent}>
                            <Image source={(siteData && siteData.site_logo) ? { uri: siteData?.site_logo } : ImagePath.logo} style={styles.logo} />
                            <Text style={styles.boldText}>Empowering the recycling industry.</Text>
                            <Image source={ImagePath.wellcome_logo} style={styles.image} />
                            {/* <Text style={styles.infoText}>Ecoex is a term that combines "eco" (short for ecology or ecological) and "ex" (short for exchange). It can refer to various concepts related to ecological exchange, sustainability, or environmentally-friendly practices. Depending on the context, Ecoex could represent a company, organization, or initiative focused on promoting eco-friendly products, services, or exchanges that benefit the environment. The specific meaning and purpose of "Ecoex" would depend on its use and context.</Text> */}
                            <View style={{ marginHorizontal: '4%', alignItems: 'center' }}>
                                <RenderHTML
                                    contentWidth={width * 0.5}
                                    source={{ html: state.data?.long_description }}
                                    tagsStyles={tagsStyles}
                                />
                            </View>
                            <Button
                                name={'Get Started'}
                                onPress={onSubmit}
                            />
                        </View>
                    )}
                </ScrollView>
            }
        </SafeAreaView>
    )
}

export default WellCome