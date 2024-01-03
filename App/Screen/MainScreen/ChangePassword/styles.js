import { Dimensions, StyleSheet } from "react-native";

const { width, height } = Dimensions.get('window')

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
})