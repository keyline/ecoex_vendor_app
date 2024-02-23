import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { CommonStyle } from '../../../Utils/CommonStyle'
import { Font_Family } from '../../../Utils/Fonts'
import { styles } from './styles'

const List = ({ item, status, onShowImage }) => {

    const NameValue = ({ name, value, bold }) => (
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2%' }}>
            <Text style={[CommonStyle.boldblacktext, { width: '35%' }]}>{name} :  </Text>
            <Text style={[CommonStyle.normalText, { width: '60%' }, bold && { fontFamily: Font_Family.NunitoSans_Bold }]}>{value}</Text>
        </View>
    )

    return (
        <View style={styles.listContainer}>
            <NameValue name={'Product Name'} value={item?.item_name} bold={true} />
            <NameValue name={'HSN Code'} value={item?.item_hsn} />
            <NameValue name={'Quantity'} value={item?.item_qty+' '+item?.item_unit} />
            <NameValue name={'Unit Price'} value={'₹ ' + item?.item_quote_price + ' / ' + item?.item_unit} bold={true} />
            {(item.item_images && item.item_images.length > 0) && (
                <TouchableOpacity onPress={() => onShowImage(item?.item_images)} activeOpacity={0.5} style={styles.imgBtn}>
                    <Text style={styles.imgBtnText}>View Product Image</Text>
                </TouchableOpacity>
            )}
        </View>
    )
}

export default List