import { StyleSheet, Dimensions } from "react-native";
import { CommonStyle } from "../../../Utils/CommonStyle";

const { width, height } = Dimensions.get('window')

export const styles = StyleSheet.create({
    bodyContent: {
        flex: 1,
        marginTop: '50%',
        // alignItems: 'center',
        paddingHorizontal: '6%',
        marginBottom: '2%'
    },
    logo: {
        width: width * 0.4,
        height: height * 0.05,
        resizeMode: 'contain',
        marginBottom: '2%'
    },
    btmText: {
        ...CommonStyle.normalText,
        marginVertical: '6%',
        textAlign: 'center'
    }
})