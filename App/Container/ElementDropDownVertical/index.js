import { View, Text } from 'react-native'
import React, { useState } from 'react'
import { Dropdown } from 'react-native-element-dropdown';
import { styles } from './styles';
import { CommonStyle } from '../../Utils/CommonStyle';
import { Colors } from '../../Utils/Colors';

const ElementDropDownVertical = ({ name, setValue, data, mode, value, search, labelField, valueField, placeholder, error, width }) => {

    const [isFocus, setIsFocus] = useState(false);

    return (
        <View>
            <View style={styles.container}>
                {(name) && (
                    <Text style={[CommonStyle.boldblacktext, { color: Colors.theme_color }]}>{name} :</Text>
                )}

                <Dropdown
                    data={data}
                    style={[styles.dropdown, { width: width ? width : '100%' }, error && { borderColor: 'red', borderWidth: 2 }, isFocus && { borderColor: Colors.theme_color, borderWidth: 1 }]}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    inputSearchStyle={styles.inputSearchStyle}
                    maxHeight={200}
                    labelField={labelField ? labelField : "label"}
                    valueField={valueField ? valueField : "value"}
                    placeholder={placeholder ? placeholder : `Select ${name}`}
                    searchPlaceholder={`Search ${name}`}
                    value={value}
                    search={search ? search : false}
                    onFocus={() => setIsFocus(true)}
                    onBlur={() => setIsFocus(false)}
                    onChange={item => {
                        setValue(item);
                        setIsFocus(false);
                    }}
                    containerStyle={{
                        borderWidth: 1,
                    }}
                    mode={mode ? mode : 'auto'}
                />
            </View>
            {(error) && (
                <Text style={styles.errortext}>{error}</Text>
            )}
        </View>
    )
}

export default ElementDropDownVertical