import Toast from 'react-native-simple-toast'
import DocumentPicker from 'react-native-document-picker';
import RNFetchBlob from 'rn-fetch-blob'


export const ToastMessage = (message) => {
    Toast.show(message, Toast.LONG);
}

export const ToastError = () => {
    Toast.show('Something Went Wrong', Toast.LONG);
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