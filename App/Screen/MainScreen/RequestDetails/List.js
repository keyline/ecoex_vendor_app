import { View, Text, TextInput } from 'react-native'
import React, { memo } from 'react'
import { CommonStyle } from '../../../Utils/CommonStyle'
import { styles } from './styles'
import { Colors } from '../../../Utils/Colors'

const List = ({ item, onChangePrice, onChangeQty, status, editable }) => {

    const NameValue = ({ name, value }) => (
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2%' }}>
            <Text style={[CommonStyle.boldblacktext, { width: '35%' }]}>{name} :  </Text>
            <Text style={[CommonStyle.normalText, { width: '60%' }]}>{value}</Text>
        </View>
    )

    return (
        <View style={styles.listContainer}>
            <NameValue name={'Product Name'} value={item?.product_name} />
            <NameValue name={'HSN Code'} value={item?.hsn} />
            {(status == 0) && (
                <NameValue name={'Unit'} value={item?.unit_name} />
            )}
            {(status != 0) && (
                <>
                    <View style={[styles.priceContainer, item?.qtyErr && { marginBottom: 0 }]}>
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
                    )}
                    <View style={[styles.priceContainer, item?.priceErr && { marginBottom: 0 }]}>
                        <Text style={[CommonStyle.boldblacktext, { width: '35%' }]}>Quote Price :</Text>
                        <TextInput
                            value={item?.quote_price}
                            onChangeText={text => onChangePrice(item, text)}
                            style={[styles.priceInput, item?.priceErr && { borderColor: 'red', borderWidth: 1 }]}
                            keyboardType='number-pad'
                            editable={editable}
                            textAlignVertical='center'
                            placeholder='Enter Price'
                        />
                    </View>
                    {(item?.priceErr) && (
                        <View style={{ width: '60%', alignSelf: 'flex-end' }}>
                            <Text style={CommonStyle.errortxt}>{item?.priceErr}</Text>
                        </View>
                    )}
                </>
            )}
        </View>
    )
}

export default List