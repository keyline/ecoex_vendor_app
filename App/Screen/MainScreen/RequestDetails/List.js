import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import React, { memo } from 'react'
import { CommonStyle } from '../../../Utils/CommonStyle'
import { styles } from './styles'
import { Colors } from '../../../Utils/Colors'
import { Font_Family } from '../../../Utils/Fonts'

const List = ({ item, onChangePrice, onChangeQty, status, editable, onShowImage }) => {
    const NameValue = ({ name, value, bold }) => (
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2%' }}>
            <Text style={[CommonStyle.boldblacktext, { width: '35%' }]}>{name} :  </Text>
            <Text style={[CommonStyle.normalText, { width: '60%' }, bold && { fontFamily: Font_Family.NunitoSans_Bold }]}>{value}</Text>
        </View>
    )

    return (
        <View style={styles.listContainer}>
            <NameValue name={'Product Name'} value={item?.product_name} bold={true} />
            <NameValue name={'HSN Code'} value={item?.hsn} />
            {(status == "0" || status == "3") && (
                <NameValue name={'Unit'} value={item?.unit_name} />
            )}
            {(status == "1" || status == "2") && (
                <>
                    {/* <View style={[styles.priceContainer, item?.qtyErr && { marginBottom: 0 }]}>
                        <Text style={[CommonStyle.boldblacktext, { width: '35%' }]}>Quantity :</Text>
                        <View style={{ width: '60%', flexDirection: 'row', alignItems: 'center' }}>
                            <TextInput
                                value={item?.qty}
                                onChangeText={text => onChangeQty(item, text)}
                                style={[styles.priceInput, { width: '50%' }, item?.qtyErr && { borderColor: 'red', borderWidth: 1 }]}
                                keyboardType='number-pad'
                                editable={editable}
                                textAlignVertical='center'
                                placeholder='Enter Qty'
                            />
                            <Text style={CommonStyle.boldblacktext}>  {item?.unit_name}</Text>
                        </View>
                    </View>
                    {(item?.qtyErr) && (
                        <View style={{ width: '60%', alignSelf: 'flex-end', marginBottom: '2%' }}>
                            <Text style={CommonStyle.errortxt}>{item?.qtyErr}</Text>
                        </View>
                    )} */}
                    <View style={[styles.priceContainer, item?.priceErr && { marginBottom: 0 }]}>
                        <Text style={[CommonStyle.boldblacktext, { width: '35%' }]}>Unit Price :</Text>
                        <View style={{ width: '60%', flexDirection: 'row', alignItems: 'center' }}>
                            <TextInput
                                value={item?.quote_price}
                                onChangeText={text => onChangePrice(item, text)}
                                style={[styles.priceInput, { width: '60%' }, item?.priceErr && { borderColor: 'red', borderWidth: 1 }]}
                                keyboardType='number-pad'
                                editable={editable}
                                textAlignVertical='center'
                                placeholder='Enter Price'
                            />
                            <Text style={CommonStyle.boldblacktext}>  / {item?.unit_name}</Text>
                        </View>
                    </View>
                    {(item?.priceErr) && (
                        <View style={{ width: '60%', alignSelf: 'flex-end' }}>
                            <Text style={CommonStyle.errortxt}>{item?.priceErr}</Text>
                        </View>
                    )}
                </>
            )}
            {(item.product_image && item.product_image.length > 0) && (
                <TouchableOpacity onPress={() => onShowImage(item?.product_image)} activeOpacity={0.5} style={styles.imgBtn}>
                    <Text style={styles.imgBtnText}>View Product Image</Text>
                </TouchableOpacity>
            )}
        </View>
    )
}

export default List