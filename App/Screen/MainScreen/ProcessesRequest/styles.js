import { StyleSheet } from "react-native";
import { Colors } from "../../../Utils/Colors";
import { Font_Family } from "../../../Utils/Fonts";

export const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginHorizontal: '5%',
        marginVertical: '6%',
    },
    searchContainer: {
        borderWidth: 1,
        borderColor: Colors.grey,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '80%',
        height: 40,
        paddingHorizontal: '3%',
        backgroundColor: Colors.light_grey
    },
    searchInput: {
        // backgroundColor: 'red',
        width: '80%',
        color: Colors.black,
        textAlignVertical: 'center'
    },
    searchIcon: {
        width: 25,
        height: 25,
        resizeMode: 'contain'
    },
    sortContainer: {
        borderWidth: 1,
        padding: 4,
        borderRadius: 5,
        borderColor: Colors.theme_color,
        backgroundColor: Colors.theme_morelight
    },
    sortIcon: {
        width: 25,
        height: 25,
        resizeMode: 'contain',
        tintColor: Colors.theme_color
    },
    //List
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
    listtileContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderTopWidth: 0.8,
        borderColor: Colors.grey,
        marginTop: 5,
        paddingTop: 5
    },
    normalText:{
        fontFamily:Font_Family.NunitoSans_Regular,
        color:Colors.black,
        fontSize:12
    },
    boldblacktext:{
        fontFamily:Font_Family.NunitoSans_Bold,
        color:Colors.black,
        fontSize:12
    }
})