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
    deleteContainer: {
        position: 'absolute',
        top: 10,
        right: 15
    },
    delete: {
        width: 25,
        height: 25,
        resizeMode: 'contain',
        tintColor: 'red'
    },
    editContainer: {
        position: 'absolute',
        bottom: 15,
        right: 15
    },
    edit: {
        width: 25,
        height: 25,
        resizeMode: 'contain',
        tintColor: 'green'
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