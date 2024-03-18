import { View, Text, TouchableOpacity, Linking, Image } from 'react-native'
import React, { useCallback, useState } from 'react'
import { styles } from './styles'
import { CommonStyle } from '../../../Utils/CommonStyle'
import { Colors } from '../../../Utils/Colors'
import Button from '../../../Container/Button'
import { ToastError } from '../../../Service/CommonFunction'
import { ImagePath } from '../../../Utils/ImagePath'

const Invoice = ({ data, onPayment, navigation }) => {

    const [state, setState] = useState({
        show: false
    })
    const viewPdf = useCallback(async (link) => {
        navigation.navigate('PdfViewer', { source: link })
    })

    const onDownloadPdf = useCallback(async (link) => {
        try {
            if (link) {
                await Linking.openURL(link);
            }
        } catch (error) {
            if (__DEV__) {
                console.log(error)
            }
            ToastError();
        }
    })

    const onShowHide = useCallback(() => {
        setState(prev => ({
            ...prev,
            show: !state.show
        }))
    }, [state.show])

    return (
        <View style={{ marginTop: '2%' }}>
            <TouchableOpacity onPress={onShowHide} activeOpacity={0.5} style={styles.itemHeader}>
                <Text style={[CommonStyle.boldblacktext, { color: Colors.white }]}>Invoice :</Text>
                <Image source={state.show ? ImagePath.arrow_up : ImagePath.arrow_down} style={styles.arrow} />
            </TouchableOpacity>
            {/* <View style={[styles.itemHeader, { justifyContent: 'center' }]}>
                <Text style={[CommonStyle.boldblacktext, { color: Colors.white }]}>Invoice</Text>
            </View> */}
            {(state.show) && (
                <View style={styles.invoiceContainer}>
                    <View style={styles.flex}>
                        <Text style={CommonStyle.boldblacktext}>Invoice Amount :</Text>
                        <Text style={[CommonStyle.boldblacktext, { width: '50%' }]}>₹ {data?.vendor_invoice_amount}</Text>
                    </View>
                    <View style={[styles.flex, { marginTop: '2%' }]}>
                        <Text style={CommonStyle.boldblacktext}>Invoice Date :</Text>
                        <Text style={[CommonStyle.normalText, { width: '50%' }]}>{data?.invoice_to_vendor_date}</Text>
                    </View>
                    {(data?.vendor_invoice_file) && (
                        <View style={{ flexDirection: 'row', marginTop: '3%', paddingHorizontal: '0%', alignSelf: 'flex-end' }}>
                            <TouchableOpacity onPress={() => onDownloadPdf(data?.vendor_invoice_file)} activeOpacity={0.5} style={[styles.imgBtn, { marginRight: '4%' }]}>
                                <Text style={styles.imgBtnText}>Download Invoice</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => viewPdf(data?.vendor_invoice_file)} activeOpacity={0.5} style={[styles.imgBtn,]}>
                                <Text style={styles.imgBtnText}>View Invoice</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            )}
            {(data?.is_payment_submit == 0) && (
                <View style={{ marginTop: '0%' }}>
                    <Button
                        name={'Payment'}
                        onPress={onPayment}
                    />
                </View>
            )}
        </View>
    )
}

export default Invoice