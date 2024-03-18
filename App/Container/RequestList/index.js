import { View, Text, TouchableOpacity, Image, Dimensions } from 'react-native'
import React, { memo, useCallback, useContext, useEffect, useState } from 'react'
import { styles } from './styles'
import { CommonStyle } from '../../Utils/CommonStyle'
import { ImagePath } from '../../Utils/ImagePath'
import { Colors } from '../../Utils/Colors'
import AuthContext from '../../Service/Context'
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated'
import Popover from 'react-native-popover-view';

const screenWidth = Dimensions.get('window').width;

const RequestList = ({ item, index, headingColor, backgroundColor, onAccept, onReject, onViewDetails, viewableItems }) => {

    const context = useContext(AuthContext)
    const { siteData, userProfile } = context.allData
    const [show, setshow] = useState(true);

    // useEffect(() => {
    //     if (index == 0 || index == 1) {
    //         setshow(true)
    //     }
    // }, [])

    const onShow = useCallback(async () => {
        setshow(!show);
    }, [show])

    const rStyle = useAnimatedStyle(() => {
        if (viewableItems) {
            const isVisible = Boolean(
                viewableItems.value
                    .filter((item) => item?.isViewable)
                    .find((obj) => obj.item?.enq_id == item?.enq_id)
            );
            return {
                opacity: withTiming(isVisible ? 1 : 0.4),
                transform: [
                    {
                        scale: withTiming(isVisible ? 1 : 0.8),
                    }
                ]
            }
        } else {
            return {}
        }
    });

    return (
        <Animated.View style={[styles.listContainer, { borderColor: headingColor ? headingColor : Colors.process, backgroundColor: backgroundColor ? backgroundColor : Colors.white }, viewableItems && rStyle]}>
            <TouchableOpacity onPress={onShow} activeOpacity={0.5} style={[styles.headingContainer, { backgroundColor: headingColor ? headingColor : Colors.process }]}>
                <Text style={CommonStyle.boldblacktext}>{item?.enquiry_no}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={[CommonStyle.boldblacktext, { fontSize: 14, marginRight: 10 }]}>Products: {item?.product_count}</Text>
                    <Image source={show ? ImagePath.arrow_up : ImagePath.arrow_down} style={styles.arrow} />
                </View>
            </TouchableOpacity>
            {(show) && (
                <TouchableOpacity onPress={() => onViewDetails(item)} disabled={!onViewDetails} activeOpacity={0.5} style={styles.listContent}>
                    <View style={{ width: '80%' }}>
                        <View style={{ borderBottomWidth: 0.8, borderColor: Colors.grey, marginBottom: 5, paddingBottom: 5 }}>
                            <Text style={CommonStyle.normalText}>Added :</Text>
                            <Text style={CommonStyle.boldblacktext}> {item?.created_at}</Text>
                        </View>
                        <View style={{ borderBottomWidth: 0.8, borderColor: Colors.grey, marginBottom: 5, paddingBottom: 5 }}>
                            <Text style={CommonStyle.normalText}>Modified :</Text>
                            <Text style={CommonStyle.boldblacktext}> {item.updated_at ? item?.updated_at : '---'}</Text>
                        </View>
                        <View style={{ borderBottomWidth: 0.8, borderColor: Colors.grey, marginBottom: 10, paddingBottom: 5 }}>
                            <Text style={CommonStyle.normalText}>Plant :</Text>
                            <Text style={[CommonStyle.boldblacktext, { fontSize: 10 }]}> {item?.plant_name}</Text>
                        </View>
                    </View>
                    {(item?.status == "0") && (
                        <>
                            <TouchableOpacity onPress={() => onReject(item, "3")} disabled={!onReject} activeOpacity={0.5} style={styles.deleteContainer}>
                                <Image source={ImagePath.close_round} style={styles.delete} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => onAccept(item, "1")} disabled={!onAccept} activeOpacity={0.5} style={styles.editContainer}>
                                <Image source={ImagePath.accept} style={styles.edit} />
                            </TouchableOpacity>
                        </>
                    )}
                    {(item?.status != "0" && item?.submitted_count > 0) && (
                        <Popover
                            from={(
                                < TouchableOpacity activeOpacity={0.5} style={styles.infoContainer}>
                                    <Text style={[CommonStyle.normalText, { fontSize: 12 }]}>Submited : <Text style={CommonStyle.boldblacktext}>{item?.submitted_count} time(s)</Text>  </Text>
                                    <Image source={ImagePath.info} style={styles.info} />
                                </TouchableOpacity>
                            )}
                        >
                            <View style={{ width: screenWidth * 0.5, padding: 12 }}>
                                <Text style={CommonStyle.boldblacktext}>Request Submited on :</Text>
                                <View >
                                    {(item?.submitted_dates && item?.submitted_dates.length > 0) && (
                                        <>
                                            {item?.submitted_dates.map((item, key) => (
                                                <Text key={key} style={CommonStyle.normalText}>{item}</Text>
                                            ))}
                                        </>
                                    )}
                                </View>
                            </View>
                        </Popover>
                    )}
                    {(item?.status == 1 && item?.submitted_count < 1) && (
                        <View style={styles.infoContainer}>
                            <Text style={[CommonStyle.normalText, { color: Colors.red, fontSize: 12 }]}>Quotation Not Submited </Text>
                        </View>
                    )}
                </TouchableOpacity>
            )}
        </Animated.View>
    )
}

export default memo(RequestList)