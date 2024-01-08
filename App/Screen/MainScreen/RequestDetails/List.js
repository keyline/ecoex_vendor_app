import { View, Text, TextInput } from 'react-native'
import React from 'react'
import { CommonStyle } from '../../../Utils/CommonStyle'
import { styles } from './styles'
import { Colors } from '../../../Utils/Colors'

const List = ({ item, onChangePrice, onChangeQty }) => {

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
            <NameValue name={'Unit'} value={item?.unit_name} />
            <View style={styles.priceContainer}>
                <Text style={[CommonStyle.boldblacktext, { width: '35%' }]}>Quantity :</Text>
                <TextInput
                    value={item?.qty}
                    onChangeText={text => onChangeQty(item, text)}
                    style={styles.priceInput}
                    keyboardType='number-pad'
                    editable={true}
                    textAlignVertical='center'
                    placeholder='Enter Quantity'
                />
            </View>
            <View style={styles.priceContainer}>
                <Text style={[CommonStyle.boldblacktext, { width: '35%' }]}>Quote Price :</Text>
                <TextInput
                    value={item?.quote_price}
                    onChangeText={text => onChangePrice(item, text)}
                    style={styles.priceInput}
                    keyboardType='number-pad'
                    editable={true}
                    textAlignVertical='center'
                    placeholder='Enter Price'
                />
            </View>
        </View>
    )
}

export default List