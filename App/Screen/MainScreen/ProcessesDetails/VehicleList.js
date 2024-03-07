import { View, Text, TouchableOpacity, Image, TextInput } from 'react-native'
import React from 'react'
import { styles } from './styles'
import { ImagePath } from '../../../Utils/ImagePath'
import { CommonStyle } from '../../../Utils/CommonStyle'
import { Colors } from '../../../Utils/Colors'

const VehicleList = ({ item, index, length, onDeleteVehicle, onChangeVehicleNo, onShowModal, onShowImage, onDeleteImage }) => {
    return (
        <View style={styles.vehiclelist}>
            {(length && length > 1) && (
                <TouchableOpacity onPress={() => onDeleteVehicle(item)} activeOpacity={0.5} style={styles.closeContainer}>
                    <Image source={ImagePath.close_round} style={styles.closeicon} />
                </TouchableOpacity>
            )}
            <Text style={[CommonStyle.boldblacktext, { textAlign: 'center' }]}>Vehicle No. : {index + 1}</Text>
            <View style={{ paddingBottom: '4%', paddingTop: '5%' }}>
                <View style={[styles.flex,]}>
                    <Text style={CommonStyle.boldblacktext}>Vehicle No. :</Text>
                    <TextInput
                        placeholder='Enter Vehicle No.'
                        style={[styles.veListInput, { borderWidth: 1 }, item.vehicle_noErr && { borderColor: 'red', borderWidth: 1.5 }]}
                        value={item?.vehicle_no}
                        textAlignVertical='center'
                        placeholderTextColor={Colors.grey}
                        autoCapitalize='characters'
                        maxLength={10}
                        onChangeText={(e) => onChangeVehicleNo(e, item)}
                    />
                </View>
                {(item.vehicle_noErr) && (
                    <Text style={[CommonStyle.errortxt, { width: '60%', alignSelf: 'flex-end' }]}>{item?.vehicle_noErr}</Text>
                )}
            </View>
            <View style={styles.flex}>
                <Text style={CommonStyle.boldblacktext}>Vehicle Image :</Text>
                <View style={styles.veimgContainer}>
                    {(item?.vehicle_img && item?.vehicle_img.length > 0) && (
                        <>
                            {(item?.vehicle_img).map((obj, key) => (
                                <View key={key} style={{ marginRight: '8%', marginBottom: '4%' }}>
                                    <TouchableOpacity onPress={() => onShowImage(obj?.uri)} activeOpacity={0.5} style={{ borderWidth: 1, overflow: 'hidden', borderRadius: 5 }}>
                                        <Image source={{ uri: obj?.uri }} style={styles.listimg} />
                                    </TouchableOpacity>
                                    {(item.vehicle_img.length > 1) && (
                                        <TouchableOpacity onPress={() => onDeleteImage(item, obj)} style={styles.imgCloseContainer}>
                                            <Image source={ImagePath.close_round} style={{ width: 20, height: 20, resizeMode: 'contain' }} />
                                        </TouchableOpacity>
                                    )}
                                </View>
                            ))}
                        </>
                    )}
                    {(item?.vehicle_img.length < 4) && (
                        <TouchableOpacity onPress={() => onShowModal(item, 'vehicle')} activeOpacity={0.5}>
                            <Image source={ImagePath.image_upload} style={styles.uploadimg} />
                        </TouchableOpacity>
                    )}
                </View>
            </View>
            {(item?.vehicle_imgErr) && (
                <Text style={[CommonStyle.errortxt, { width: '60%', alignSelf: 'flex-end' }]}>{item?.vehicle_imgErr}</Text>
            )}
        </View>
    )
}

export default VehicleList