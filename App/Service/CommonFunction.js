import Toast from 'react-native-simple-toast'
import DocumentPicker from 'react-native-document-picker';
import RNFetchBlob from 'rn-fetch-blob'
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { CameraPermission, GalleryPermission } from './Permission';
import { Platform } from 'react-native';


export const ToastMessage = (message) => {
    Toast.show(message, Toast.LONG);
}

export const ToastError = () => {
    Toast.show('Something Went Wrong', Toast.LONG);
}

export const LaunchImageLibary = async (base64, selectionLimit) => {
    try {
        let result = await GalleryPermission();
        // if (result == false) {
        //     ToastMessage('Gallery Permission Required')
        // }
        let limit = 1
        if (selectionLimit) {
            if (Platform.OS == 'android' && Platform.Version >= 33) {
                limit = selectionLimit
            } else if (Platform.OS == 'ios' && Platform.Version >= 14) {
                limit = selectionLimit
            } else {
                limit = 1
            }
        }
        let options = {
            mediaType: 'photo',
            maxHeight: 800,
            maxWidth: 800,
            quality: 1,
            includeBase64: base64 ? base64 : false,
            selectionLimit: limit ? limit : 1
        }
        let response = await launchImageLibrary(options)
        return response;
    } catch (error) {
        if (__DEV__) {
            console.log(error)
        }
        return error;
    }
}

export const LaunchCamera = async (base64) => {
    try {
        let result = await CameraPermission();
        // if (result == false) {
        //     ToastMessage('Camera Permission Required');
        // }
        let options = {
            mediaType: 'photo',
            maxHeight: 800,
            maxWidth: 800,
            quality: 1,
            includeBase64: base64 ? base64 : false,
        }
        let response = await launchCamera(options)
        // console.log('camera',JSON.stringify(response))
        return response;
    } catch (error) {
        if (__DEV__) {
            console.log(error)
        }
        return error;
    }
}

export const DocumentPickers = async (multiple) => {
    try {
        let res = await DocumentPicker.pick({
            type: [DocumentPicker.types.pdf],
            allowMultiSelection: multiple ? multiple : false
        })
        // console.log('PickerResponse', JSON.stringify(res))
        if (res.length > 0) {
            let array = await Promise.all(res.map(async item => {
                let base64res = await RNFetchBlob.fs.readFile(item.uri, 'base64')
                return { ...item, base64: base64res }
            })
            );
            // console.log('updateArray', JSON.stringify(array))
            return array
        } else {
            return [];
        }
    } catch (error) {
        // throw error
        return error
    }
}

export const GetUniqueArray = (arrays, uniquekey) => {
    try {
        if (arrays.length > 0) {
            const uniqueData = arrays.filter((item, index, array) => {
                const key = item[uniquekey];
                return index === array.findIndex((obj) => obj[uniquekey] === key);
            })
            return uniqueData;
        } else {
            return [];
        }
    } catch (error) {
        return [];
    }
}

export const GetUnitfromList = (list, value) => {
    if (list && list.length > 0 && value) {
        let filterarr = list.filter(obj => obj.value == value);
        if (filterarr.length > 0) {
            return filterarr[0].label
        } else {
            return '';
        }
    } else {
        return '';
    }
}

export const GetValuefromList = (list, label) => {
    if (list && list.length > 0 && label) {
        let filterarr = list.filter(obj => obj.label == label);
        if (filterarr.length > 0) {
            return filterarr[0].value
        } else {
            return '';
        }
    } else {
        return '';
    }
}

export const getRandomColor = () => {
    const letters = '7B509D';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 6)];
    }
    return color;
};