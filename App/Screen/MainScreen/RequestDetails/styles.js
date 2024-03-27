import { StyleSheet } from "react-native";
import { Font_Family } from "../../../Utils/Fonts";
import { Colors } from "../../../Utils/Colors";

export const styles = StyleSheet.create({
    bodyContainer: {
        marginHorizontal: '2%',
        marginVertical: '2%',
        flex: 1
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    statusText: {
        fontFamily: Font_Family.NunitoSans_Bold,
        color: Colors.black
    },
    statusTextHighlight: {
        fontFamily: Font_Family.NunitoSans_Bold,
        backgroundColor: Colors.blue,
        color: Colors.white,
        borderRadius: 5,
        paddingHorizontal: '1.5%',
        paddingVertical: '0.5%',
        marginLeft: '1%'
    },
    listContainer: {
        backgroundColor: Colors.light_grey,
        overflow: 'hidden',
        paddingHorizontal: '3%',
        paddingVertical: '3%',
        marginTop: '2%',
        borderRadius: 5
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '2%'
    },
    priceInput: {
        fontFamily: Font_Family.NunitoSans_Regular,
        backgroundColor: Colors.white,
        width: '60%',
        borderWidth: 0.8,
        borderRadius: 5,
        height: 38,
        borderColor: Colors.grey,
        paddingHorizontal: 10,
        color: Colors.black
    },
    imgBtn: {
        alignSelf: 'center',
        backgroundColor: Colors.theme_color,
        paddingHorizontal: '2%',
        paddingVertical: '1%',
        borderRadius: 5,
        marginBottom: '1%',
        marginTop: '2%'
    },
    imgBtnText: {
        color: Colors.white,
        fontFamily: Font_Family.NunitoSans_Regular
    },
    infoContainer: {
        // backgroundColor:'red',
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-end',
        marginRight: '1%',
        marginTop: '1%'
    },
    info: {
        width: 15,
        height: 15,
        resizeMode: 'contain'
    },
    acptrejectContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        marginTop: '10%'
    },
    rejectContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'red',
        paddingHorizontal: '2%',
        paddingVertical: '2%',
        borderRadius: 5
    },
    acceptContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.theme_color,
        paddingHorizontal: '2%',
        paddingVertical: '2%',
        borderRadius: 5
    },
    rejecticon: {
        width: 20,
        height: 20,
        tintColor: 'white'
    },

})