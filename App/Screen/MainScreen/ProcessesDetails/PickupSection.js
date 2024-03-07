import { View, Text } from 'react-native'
import React from 'react'
import { CommonStyle } from '../../../Utils/CommonStyle'
import { styles } from './styles'
import { Colors } from '../../../Utils/Colors'
import InputField from '../../../Container/InputField'
import { ImagePath } from '../../../Utils/ImagePath'
import Button from '../../../Container/Button'

const PickupSection = ({ value, onOpenDatePicker, pickupDateErr, data, onPickup }) => {
    return (
        <View style={{ marginTop: '2%' }}>
            <View style={[styles.itemHeader, { justifyContent: 'center', marginBottom: -5 }]}>
                <Text style={[CommonStyle.boldblacktext, { color: Colors.white }]}>Pickup Scheduled Date & Time</Text>
            </View>
            <InputField
                // name={'Pickup Date :'}
                editable={false}
                value={value}
                placeholder={'Choose Pickup Date & Time'}
                rightIcon={data?.pickup_schedule_edit_access == "1" ? ImagePath.date : null}
                rightonPress={onOpenDatePicker}
                error={pickupDateErr}
            // width={'70%'}
            />
            {(data?.pickup_schedule_edit_access == "1") && (
                <Button
                    name={'Pickup Scheduled'}
                    onPress={onPickup}
                />
            )}
        </View>
    )
}

export default PickupSection