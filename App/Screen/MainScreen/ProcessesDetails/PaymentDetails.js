import { View, Text, TouchableOpacity, Image } from 'react-native'
import React, { useCallback, useState } from 'react'
import { CommonStyle } from '../../../Utils/CommonStyle'
import { ImagePath } from '../../../Utils/ImagePath'
import { styles } from './styles'
import { Colors } from '../../../Utils/Colors'
import { Font_Family } from '../../../Utils/Fonts'

const PaymentDetails = ({ data, onShowImage }) => {

    const [state, setState] = useState({
        show: false
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
                <Text style={[CommonStyle.boldblacktext, { color: Colors.white }]}>Payment Details :</Text>
                <Image source={state.show ? ImagePath.arrow_up : ImagePath.arrow_down} style={styles.arrow} />
            </TouchableOpacity>
            {(state.show) && (
                <View style={styles.invoiceContainer}>
                    <View style={styles.flex}>
                        <Text style={CommonStyle.boldblacktext}>Payment Amount :</Text>
                        <Text style={[CommonStyle.boldblacktext, { width: '50%' }]}>₹ {data?.payment_amount} <Text style={{ fontSize: 10, fontFamily: Font_Family.NunitoSans_Regular, color: data?.is_approve_vendor_payment == 0 ? Colors.yellow : Colors.theme_color }}>{data?.is_approve_vendor_payment == 0 ? '(Approve Pending)' : '(Approved)'}</Text></Text>
                    </View>
                    <View style={[styles.flex, { marginTop: '2%' }]}>
                        <Text style={CommonStyle.boldblacktext}>Payment Date :</Text>
                        <Text style={[CommonStyle.normalText, { width: '50%' }]}>{data?.payment_date}</Text>
                    </View>
                    <View style={[styles.flex, { marginTop: '2%' }]}>
                        <Text style={CommonStyle.boldblacktext}>Payment Mode :</Text>
                        <Text style={[CommonStyle.normalText, { width: '50%' }]}>{data?.payment_mode}</Text>
                    </View>
                    {(data?.txn_no) && (
                        <View style={[styles.flex, { marginTop: '2%' }]}>
                            <Text style={CommonStyle.boldblacktext}>Transaction No :</Text>
                            <Text style={[CommonStyle.normalText, { width: '50%' }]}>{data?.txn_no}</Text>
                        </View>
                    )}
                    {(data?.txn_screenshot) && (
                        <View style={[styles.flex, { marginTop: '2%' }]}>
                            <Text style={[CommonStyle.boldblacktext,{width:'50%'}]}>Transaction Screenshot :</Text>
                            <View style={{ width: '48%' }}>
                                <TouchableOpacity onPress={() => onShowImage(data?.txn_screenshot)} style={{ alignSelf: 'flex-start' }}>
                                    <Image source={{ uri: data?.txn_screenshot }} style={styles.listimg} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                </View>
            )}
        </View>
    )
}

export default PaymentDetails