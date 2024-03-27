import { StyleSheet } from "react-native";
import { Colors } from "../../Utils/Colors";


export const styles = StyleSheet.create({
    listContainer: {
        marginBottom: 10,
        marginHorizontal: 10,
        backgroundColor: '#FBFAF4',
        borderWidth: 2,
        borderColor: Colors.process,
        borderRadius: 5
    },
    headingContainer: {
        backgroundColor: Colors.process,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        paddingVertical: 5
    },
    arrow: {
        width: 20,
        height: 20,
        tintColor: Colors.white
    },
    listContent: {
        paddingHorizontal: 10,
        paddingVertical: 10
    },
    btnContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        // alignSelf: 'flex-end',
        justifyContent:'space-evenly',
        marginTop:'2%'
    },
    deleteContainer: {
        // position: 'absolute',
        // top: 10,
        // right: 15
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'red',
        paddingHorizontal: '2%',
        paddingVertical: '1.2%',
        borderRadius: 20
    },
    delete: {
        width: 15,
        height: 15,
        resizeMode: 'contain',
        tintColor: 'white'
    },
    editContainer: {
        // position: 'absolute',
        // bottom: 15,
        // right: 15
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.theme_color,
        paddingHorizontal: '2%',
        paddingVertical: '1.2%',
        borderRadius: 20
    },
    edit: {
        width: 15,
        height: 15,
        resizeMode: 'contain',
        tintColor: 'white'
    },
    infoContainer: {
        // backgroundColor:'red',
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-end'
    },
    info: {
        width: 15,
        height: 15,
        resizeMode: 'contain'
    },
})