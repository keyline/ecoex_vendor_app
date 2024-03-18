import { View, Text, TouchableOpacity, Image } from 'react-native'
import React, { useCallback, useState } from 'react'
import { CommonStyle } from '../../../Utils/CommonStyle'
import { ImagePath } from '../../../Utils/ImagePath'
import { styles } from './styles'
import { Colors } from '../../../Utils/Colors'

const VehicleDispatch = ({ data, onVehicleDispatch }) => {

    const [state, setState] = useState({
        show: data?.enquiry_sub_status_id == 9.9 ? true : false
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
                <Text style={[CommonStyle.boldblacktext, { color: Colors.white }]}>Vehicle Dispatch :</Text>
                <Image source={state.show ? ImagePath.arrow_up : ImagePath.arrow_down} style={styles.arrow} />
            </TouchableOpacity>
            {(state.show) && (
                <View style={styles.invoiceContainer}>
                    {(data?.enquiry_sub_status_id == 9.9) && (
                        <>
                            <Text style={styles.vehicleHinttext}>Press below button when vehicle dispatch from plant</Text>
                            <TouchableOpacity onPress={onVehicleDispatch} activeOpacity={0.5} style={[styles.imgBtn, { alignSelf: 'flex-end', marginTop: '2%' }]}>
                                <Text style={styles.imgBtnText}>Vehicle Dispatch</Text>
                            </TouchableOpacity>
                        </>
                    )}
                    {(data?.enquiry_sub_status_id >= 10.10 && data?.vehicle_dispatched_date) && (
                        <View style={[styles.flex, { marginVertical: '1%' }]}>
                            <Text style={CommonStyle.boldblacktext}>Dispatch Date :</Text>
                            <Text style={[CommonStyle.normalText, { width: '50%' }]}>{data?.vehicle_dispatched_date}</Text>
                        </View>
                    )}
                </View>
            )}
        </View>
    )
}

export default VehicleDispatch