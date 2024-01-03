import { Dimensions, StyleSheet } from "react-native";
import { Font_Family } from "../../../Utils/Fonts";
import { Colors } from "../../../Utils/Colors";
import { CommonStyle } from "../../../Utils/CommonStyle";

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
    bodyContent: {
        flex: 1,
        marginTop: '8%',
        // alignItems: 'center',
        paddingHorizontal: '6%',
        marginBottom: '6%'
    },
    logo: {
        width: width * 0.4,
        height: height * 0.05,
        resizeMode: 'contain',
        marginBottom: '2%'
    },
    btmText: {
        ...CommonStyle.normalText,
        marginVertical: '4%',
        textAlign: 'center'
    },
    checkContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center',
        marginTop: '4%'
    },
    aceptText: {
        fontFamily: Font_Family.NunitoSans_Bold,
        color: Colors.black,
        fontSize: 12
    },
    termstext: {
        fontFamily: Font_Family.NunitoSans_Bold,
        color: Colors.theme_color,
        textDecorationLine: 'underline'
    },
    modalStyle: {
        margin: 0
    },
    modalContainer: {
        flex: 1,
        width: '100%',
        backgroundColor: Colors.white,
        // maxHeight: height * 0.56,
        position: 'absolute',
        bottom: 0,
        right: 0,
        left: 0,
        paddingVertical: '6%',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20
    },
    modalContent: {
        paddingHorizontal: '6%'
    },
    otp: {
        width: '100%',
        alignSelf: 'center',
        height: '40%',
    },
    underlineStyleBase: {
        width: 45,
        height: 45,
        borderWidth: 1.5,
        // borderBottomWidth: 1.5,
        borderColor: Colors.theme_color,
        color: Colors.theme_color,
        fontFamily: Font_Family.NunitoSans_Bold,
        borderRadius: 5
    },
    underlineStyleHighLighted: {
        borderColor: Colors.theme_color,
    },
    resendContainer: {
        alignSelf: 'flex-end',
        marginVertical: '3%'
    },
    resendTimer: {
        fontFamily: Font_Family.NunitoSans_Bold,
        color: Colors.grey,
        textDecorationLine: 'underline'
    },
    resendText: {
        fontFamily: Font_Family.NunitoSans_Bold,
        color: Colors.theme_color
    },
    skiptext: {
        textAlign: 'center',
        fontFamily: Font_Family.NunitoSans_Bold,
        color: Colors.grey,
        textDecorationLine: 'underline'
    },
    viewdocContainer: {
        backgroundColor: '#91c3f2',
        alignSelf: 'flex-start',
        paddingHorizontal: '2%',
        paddingVertical: '0.5%',
        marginTop: '2%',
        marginLeft: '2%',
        borderRadius: 10
    },
    viewdocText: {
        fontFamily: Font_Family.NunitoSans_Regular,
        color: Colors.white
    }
})