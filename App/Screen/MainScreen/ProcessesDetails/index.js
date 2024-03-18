import { View, Text, SafeAreaView, RefreshControl, TouchableOpacity, Image, ScrollView } from 'react-native'
import React, { useCallback, useState } from 'react'
import { useFocusEffect } from '@react-navigation/native'
import Apis from '../../../Service/Apis'
import { LaunchCamera, LaunchImageLibary, ToastError, ToastMessage, convertISOString, dateConvertWithTime, generateRandomId, getSubStatus } from '../../../Service/CommonFunction'
import { CommonStyle } from '../../../Utils/CommonStyle'
import Header from '../../../Container/Header'
import { ImagePath } from '../../../Utils/ImagePath'
import { styles } from './styles'
import Loader from '../../../Container/Loader'
import List from './List'
import ImageViewSlider from '../../../Container/ImageViewSlider'
import LoaderTransparent from '../../../Container/LoaderTransparent'
import Button from '../../../Container/Button'
import DatePickerModal from '../../../Container/DatePickerModal'
import { Colors } from '../../../Utils/Colors'
import PickupSection from './PickupSection'
import VehicleList from './VehicleList'
import ImageOptions from '../../../Container/ImageOptions'
import HeaderContent from './HeaderContent'
import VehicleDetails from './VehicleDetails'
import MaterialWeightList from './MaterialWeightList'
import Invoice from './Invoice'
import PaymentModal from './PaymentModal'
import PaymentDetails from './PaymentDetails'
import VehicleDispatch from './VehicleDispatch'

const VehicleObject = () => {
    let id = generateRandomId();
    return {
        id: id,
        vehicle_img: [],
        vehicle_imgErr: '',
        vehicle_no: '',
        vehicle_noErr: '',
    }
}

const ProcessesDetails = ({ navigation, route }) => {

    const vehicleobj = VehicleObject();

    const [state, setState] = useState({
        loading: false,
        loadingNew: false,
        data: '',
        requestList: [],
        status: '',
        sliderImage: null,
        pickupDate: '',
        pickupDateErr: '',
        pickupDatePicker: false,
        show: false,
        imageOptionModal: false,
        imagetype: null,
        selectedVehicle: null,
        showPaymentModal: false,
    })
    const [vehicleList, setvehicleList] = useState(Array.from({ length: 1 }, (_, index) => (vehicleobj)));
    const [materialWeightList, setmaterialWeightList] = useState([]);

    const onShowHide = useCallback(async () => {
        setState(prev => ({
            ...prev,
            show: !state.show
        }))
    })

    useFocusEffect(
        useCallback(() => {
            const unsubscribe = onGetData();
            return () => unsubscribe
        }, [navigation])
    )

    const onGetData = useCallback(async () => {
        try {
            showLoading();
            let datas = {
                sub_enquiry_no: route.params?.id
            }
            let response = await Apis.processes_request_detais(datas);
            if (__DEV__) {
                console.log('RequestDetails', JSON.stringify(response))
            }
            if (response.success) {
                let li = response?.data?.items
                if (response?.data?.enquiry_sub_status_id == '5.5' && li && li.length > 0) {
                    let tempdata = li.map(obj => {
                        let weight = obj?.materials?.actual_weight;
                        let slipimage = obj?.materials?.weighing_slip_img;
                        return { ...obj, actual_weight: (weight && weight > 0) ? weight : '', actual_weightErr: '', weighing_slip_img: (slipimage) ? slipimage : [], weighing_slip_imgErr: '' }
                    })
                    setmaterialWeightList(tempdata);
                }
                setState(prev => ({
                    ...prev,
                    data: response?.data,
                    status: response?.data?.enquiry_sub_status_id,
                    requestList: li,
                    pickupDate: response?.data?.pickup_scheduled_date,
                    loading: false
                }))
            } else {
                hideLoading();
                ToastMessage(response?.message);
            }
        } catch (error) {
            if (__DEV__) {
                console.log(error)
            }
            hideLoading();
            ToastError();
        }
    })

    const showLoading = useCallback(async () => {
        setState(prev => ({
            ...prev,
            loading: true,
        }))
    }, [state.loading])

    const hideLoading = useCallback(async () => {
        setState(prev => ({
            ...prev,
            loading: false,
        }))
    }, [state.loading])

    const showLoadingNew = useCallback(async () => {
        setState(prev => ({
            ...prev,
            loadingNew: true,
        }))
    }, [state.loadingNew])

    const hideLoadingNew = useCallback(async () => {
        setState(prev => ({
            ...prev,
            loadingNew: false,
        }))
    }, [state.loadingNew])

    const onHeaderPress = useCallback(async () => {
        navigation.goBack();
    })

    const onShowImage = useCallback(async (image, key = 'link') => {
        console.log('key', key)
        if (image && image.length > 0) {
            let updatearr = image.map(obj => {
                return { uri: key ? obj[key] : obj }
            })
            setState(prev => ({
                ...prev,
                sliderImage: updatearr
            }))
        }
    })

    const onShowGpsImage = useCallback(async (image) => {
        if (image) {
            let array = [];
            let obj = { uri: image }
            array.push(obj);
            setState(prev => ({
                ...prev,
                sliderImage: array
            }))
        }
    })

    const onCloseSlider = useCallback(async () => {
        setState(prev => ({
            ...prev,
            sliderImage: null
        }))
    })

    const onOpenDatePicker = useCallback(async () => {
        setState(prev => ({
            ...prev,
            pickupDatePicker: true
        }))
    }, [state.pickupDatePicker])

    const onCloseDatePicker = useCallback(async () => {
        setState(prev => ({
            ...prev,
            pickupDatePicker: false
        }))
    }, [state.pickupDatePicker])

    const onChangePickupDate = useCallback(async (value) => {
        if (value) {
            setState(prev => ({
                ...prev,
                pickupDate: dateConvertWithTime(value),
                pickupDatePicker: false,
                pickupDateErr: ''
            }))
        } else {
            setState(prev => ({
                ...prev,
                pickupDatePicker: false
            }))
        }
    })

    const onPickup = useCallback(async () => {
        if (state.pickupDate == '' || state.pickupDate == null) {
            setState(prev => ({
                ...prev,
                pickupDateErr: 'Choose Pickup Date & Time'
            }))
        } else {
            try {
                showLoadingNew();
                let datas = {
                    sub_enquiry_no: state.data?.sub_enquiry_no,
                    pickup_scheduled_date: state.pickupDate
                }
                let res = await Apis.pickup_scheduled(datas);
                if (__DEV__) {
                    console.log('pickupSchedule', JSON.stringify(res));
                }
                if (res.success) {
                    state.data.pickup_schedule_edit_access = "0"
                    state.data.pickup_scheduled_date = state.pickupDate
                }
                hideLoadingNew();
                ToastMessage(res?.message);
            } catch (error) {
                if (__DEV__) {
                    console.log(error)
                }
                hideLoadingNew();
                ToastError();
            }
        }
    })

    const onVehicleAddmore = useCallback(async () => {
        setvehicleList([...vehicleList, vehicleobj]);
    }, [vehicleList])

    const onDeleteVehicle = useCallback(async (item) => {
        let temparr = vehicleList.filter(obj => obj.id != item.id)
        setvehicleList(temparr);
    }, [vehicleList])

    const onChangeVehicleNo = useCallback(async (text, item) => {
        if (item) {
            let temparr = vehicleList.map(obj => {
                if (obj.id == item.id) {
                    return { ...obj, vehicle_no: text, vehicle_noErr: '' };
                }
                return obj;
            })
            setvehicleList(temparr);
        }
    }, [vehicleList])

    const onShowImgoptnModal = useCallback((item, type) => {
        setState(prev => ({
            ...prev,
            selectedVehicle: item,
            imagetype: type,
            imageOptionModal: true
        }))
    }, [state.imageOptionModal])

    const onHideImgoptnModal = useCallback(() => {
        setState(prev => ({
            ...prev,
            selectedVehicle: null,
            imagetype: null,
            imageOptionModal: false
        }))
    }, [state.imageOptionModal])

    const onSelectImageOption = useCallback(async (value) => {
        try {
            if (value == 1) {
                var selectlimit = 1
                if (state.imagetype && state.imagetype == 'vehicle') {
                    selectlimit = 4 - state.selectedVehicle?.vehicle_img.length
                } else if (state.imagetype && state.imagetype == 'weight_slip') {
                    selectlimit = 4 - state.selectedVehicle?.weighing_slip_img.length
                }
                let libaryImageRes = await LaunchImageLibary(true, selectlimit);
                if (__DEV__) {
                    console.log('LibaryImage', libaryImageRes)
                }
                if (libaryImageRes.assets && libaryImageRes.assets.length > 0) {
                    if (state.imagetype && state.imagetype == 'vehicle') {
                        let temparr = vehicleList.map(obj => {
                            if (obj.id == state.selectedVehicle.id) {
                                return { ...obj, vehicle_img: [...obj.vehicle_img, ...libaryImageRes.assets], vehicle_imgErr: '' };
                            }
                            return obj;
                        })
                        setvehicleList(temparr);
                    } else if (state.imagetype && state.imagetype == 'weight_slip') {
                        let temparr = materialWeightList.map(obj => {
                            if (obj.item_id == state.selectedVehicle.item_id) {
                                return { ...obj, weighing_slip_img: [...obj.weighing_slip_img, ...libaryImageRes.assets], weighing_slip_imgErr: '' };
                            }
                            return obj;
                        })
                        setmaterialWeightList(temparr);
                    }
                }
                onHideImgoptnModal();
            } else {
                let cameraImageRes = await LaunchCamera(true);
                if (__DEV__) {
                    console.log('CameraImage', cameraImageRes)
                }
                if (cameraImageRes.assets && cameraImageRes.assets.length > 0) {
                    if (state.imagetype && state.imagetype == 'vehicle') {
                        let temparr = vehicleList.map(obj => {
                            if (obj.id == state.selectedVehicle.id) {
                                return { ...obj, vehicle_img: [...obj.vehicle_img, ...cameraImageRes.assets], vehicle_imgErr: '' };
                            }
                            return obj;
                        })
                        setvehicleList(temparr);
                    } else if (state.imagetype && state.imagetype == 'weight_slip') {
                        let temparr = materialWeightList.map(obj => {
                            if (obj.item_id == state.selectedVehicle.item_id) {
                                return { ...obj, weighing_slip_img: [...obj.weighing_slip_img, ...cameraImageRes.assets], weighing_slip_imgErr: '' };
                            }
                            return obj;
                        })
                        setmaterialWeightList(temparr);
                    }
                }
                onHideImgoptnModal();
            }
        } catch (error) {
            if (__DEV__) {
                console.log(error)
            }
            onHideImgoptnModal();
            ToastError();
        }
    })

    const onDeleteVehicleImg = useCallback(async (item, img) => {
        if (item && img) {
            let temparr = vehicleList.map(obj => {
                if (obj.id == item.id) {
                    let filterobj = obj.vehicle_img.filter(ob => ob != img);
                    return { ...obj, vehicle_img: filterobj };
                }
                return obj;
            })
            setvehicleList(temparr);
        }
    }, [vehicleList])

    const onVehiclePlaced = useCallback(async () => {
        let findNoEmptyIndex = vehicleList.findIndex(obj => (obj.vehicle_no.trim() == ''));
        let findNoValidIndex = vehicleList.findIndex(obj => obj.vehicle_no.length < 8);
        let findImgEmptyIndex = vehicleList.findIndex(obj => obj.vehicle_img.length < 1);
        let duplicateNoObj = null;
        const hasDuplicates = new Set();
        vehicleList.some(obj => {
            if (hasDuplicates.has(obj.vehicle_no)) {
                duplicateNoObj = obj;
                return true; // Stop iteration once a duplicate is found
            } else {
                hasDuplicates.add(obj.vehicle_no);
                return false;
            }
        });
        if (findNoEmptyIndex != -1) {
            let temparr = vehicleList.map(obj => {
                if (obj.vehicle_no.trim() == '') {
                    return { ...obj, vehicle_noErr: 'Enter Vehicle No' };
                }
                return obj;
            })
            setvehicleList(temparr);
            ToastMessage('Enter Vehicle No');
            return;
        } else if (findNoValidIndex != -1) {
            let temparr = vehicleList.map(obj => {
                if (obj.vehicle_no.length < 8) {
                    return { ...obj, vehicle_noErr: 'Enter Valid Vehicle No' };
                }
                return obj;
            })
            setvehicleList(temparr);
            ToastMessage('Enter Valid Vehicle No');
            return;
        } else if (duplicateNoObj) {
            let temparr = vehicleList.map(obj => {
                if (obj.id == duplicateNoObj.id) {
                    return { ...obj, vehicle_noErr: 'Duplicate Vehicle No' };
                }
                return obj;
            })
            setvehicleList(temparr);
            ToastMessage('Duplicate Vehicle No');
            return;
        } else if (findImgEmptyIndex != -1) {
            let temparr = vehicleList.map(obj => {
                if (obj.vehicle_img.length < 1) {
                    return { ...obj, vehicle_imgErr: 'Upload Vehicle Image' };
                }
                return obj;
            })
            setvehicleList(temparr);
            ToastMessage('Upload Vehicle Image');
            return;
        } else {
            try {
                showLoading();
                let datas = {
                    sub_enq_no: state.data?.sub_enquiry_no,
                    vehicles: vehicleList
                }
                let response = await Apis.vehicle_placed(datas);
                if (__DEV__) {
                    console.log('VehiclePlaced', JSON.stringify(response))
                }
                if (response.success) {
                    onGetData();
                } else {
                    hideLoading();
                }
                ToastMessage(response?.message);
            } catch (error) {
                if (__DEV__) {
                    console.log(error)
                }
                hideLoading();
                ToastError();
            }
        }
    })

    const onChangematerialWeight = useCallback((text, item) => {
        if (item) {
            let temparr = materialWeightList.map(obj => {
                if (obj.item_id == item.item_id) {
                    return { ...obj, actual_weight: text, actual_weightErr: '' };
                }
                return obj;
            })
            setmaterialWeightList(temparr);
        }
    }, [materialWeightList])

    const onDeleteWeightSlipImg = useCallback(async (item, img) => {
        if (item && img) {
            let temparr = materialWeightList.map(obj => {
                if (obj.item_id == item.item_id) {
                    let filterobj = obj.weighing_slip_img.filter(ob => ob != img);
                    return { ...obj, weighing_slip_img: filterobj };
                }
                return obj;
            })
            setmaterialWeightList(temparr);
        }
    }, [materialWeightList])

    const onMaterialWeighted = useCallback(async () => {
        let findWeightEmptyIndex = materialWeightList.findIndex(obj => (obj.actual_weight.trim() == ''));
        let findWeightValidindex = materialWeightList.findIndex(obj => (isNaN(Number(obj?.actual_weight)) || Number(obj?.actual_weight) <= 0));
        let findSlipEmptyIndex = materialWeightList.findIndex(obj => (obj.weighing_slip_img.length < 1));
        if (findWeightEmptyIndex != -1) {
            let temparr = materialWeightList.map(obj => {
                if (obj.actual_weight.trim() == '') {
                    return { ...obj, actual_weightErr: 'Enter Material Weight' };
                }
                return obj;
            })
            setmaterialWeightList(temparr);
            ToastMessage('Enter Material Weight');
            return;
        } else if (findWeightValidindex != -1) {
            let temparr = materialWeightList.map(obj => {
                if (isNaN(Number(obj?.actual_weight)) || Number(obj?.actual_weight) <= 0) {
                    return { ...obj, actual_weightErr: 'Enter Valid Weight' };
                }
                return obj;
            })
            setmaterialWeightList(temparr);
            ToastMessage('Enter Valid Weight');
            return;
        } else if (findSlipEmptyIndex != -1) {
            let temparr = materialWeightList.map(obj => {
                if (obj?.weighing_slip_img.length < 1) {
                    return { ...obj, weighing_slip_imgErr: 'Upload Weight Slip Image' };
                }
                return obj;
            })
            setmaterialWeightList(temparr);
            ToastMessage('Upload Weight Slip Image');
            return;
        } else {
            try {
                showLoading();
                let datas = {
                    sub_enq_no: state.data?.sub_enquiry_no,
                    materials: materialWeightList
                }
                let response = await Apis.material_weighted(datas);
                if (__DEV__) {
                    console.log('MaterialWeighted', JSON.stringify(response))
                }
                if (response.success) {
                    onGetData();
                } else {
                    hideLoading();
                }
                ToastMessage(response?.message);
            } catch (error) {
                if (__DEV__) {
                    console.log(error)
                }
                hideLoading();
                ToastError();
            }
        }
    })

    const onShowPaymentModal = useCallback(() => {
        setState(prev => ({
            ...prev,
            showPaymentModal: true
        }))
    })

    const onHidePaymentModal = useCallback(() => {
        setState(prev => ({
            ...prev,
            showPaymentModal: false
        }))
    })

    const onVehicleDispatch = useCallback(async () => {
        try {
            setState(prev => ({
                ...prev,
                loadingNew: true
            }))
            let datas = {
                sub_enq_no: state.data?.sub_enquiry_no
            }
            let res = await Apis.vehicle_dispatch(datas);
            if (res.success) {
                state.data.enquiry_sub_status_id = '10.10';
                state.data.enquiry_sub_status = getSubStatus('10.10');
                state.data.vehicle_dispatched_date = dateConvertWithTime(new Date());
            }
            setState(prev => ({
                ...prev,
                loadingNew: false
            }))
            ToastMessage(res?.message);
        } catch (error) {
            if (__DEV__) {
                console.log(error)
            }
            setState(prev => ({
                ...prev,
                loadingNew: false
            }))
            ToastError();
        }
    })

    return (
        <SafeAreaView style={CommonStyle.container}>
            <Header
                name={'Enquiry Details'}
                leftIcon={ImagePath.back}
                leftOnPress={onHeaderPress}
            />
            {(state.loading) ? <Loader loading={state.loading} /> :
                <ScrollView showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={false} onRefresh={onGetData} />}>
                    {(state.data) && (
                        <View style={styles.bodyContainer}>
                            <View style={styles.statusContainer}>
                                <Text style={styles.statusText}>STATUS :</Text>
                                <Text style={[styles.statusTextHighlight, { backgroundColor: 'green' }]}>{state.data?.enquiry_sub_status}</Text>
                            </View>
                            <View>
                                <HeaderContent data={state.data} />
                                <TouchableOpacity onPress={onShowHide} activeOpacity={0.5} style={styles.itemHeader}>
                                    <Text style={[CommonStyle.boldblacktext, { color: Colors.white }]}>Total Item(s) : {state.requestList.length}</Text>
                                    <Image source={state.show ? ImagePath.arrow_up : ImagePath.arrow_down} style={styles.arrow} />
                                </TouchableOpacity>
                            </View>
                            {(state.show) && (
                                <View style={{ flex: 1 }}>
                                    {(state.requestList).map((item, key) => (
                                        <List
                                            key={key}
                                            item={item}
                                            data={state.data}
                                            status={state.status}
                                            onShowImage={onShowImage}
                                        />
                                    ))}
                                </View>
                            )}
                            <View style={{ paddingVertical: '2%' }}>
                                <TouchableOpacity onPress={() => onShowGpsImage(state.data?.gps_image)} activeOpacity={0.5} style={[styles.imgBtn, { marginTo: '2%', paddingHorizontal: '4.5%' }]}>
                                    <Text style={styles.imgBtnText}>View GPS Image</Text>
                                </TouchableOpacity>
                                {(state.status == '3.3') && (
                                    <PickupSection
                                        data={state.data}
                                        value={state.pickupDate}
                                        onOpenDatePicker={onOpenDatePicker}
                                        onPickup={onPickup}
                                        pickupDateErr={state.pickupDateErr}
                                    />
                                )}
                                {(state.status == '4.4') && (
                                    <View style={{ paddingVertical: '2%' }}>
                                        <View style={[styles.itemHeader, { justifyContent: 'center' }]}>
                                            <Text style={[CommonStyle.boldblacktext, { color: Colors.white }]}>Vehicle Details</Text>
                                        </View>
                                        {(vehicleList.length > 0) && (
                                            <View style={{ marginTop: '2%', paddingHorizontal: '2%' }}>
                                                {(vehicleList).map((item, key) => (
                                                    <VehicleList
                                                        item={item}
                                                        index={key}
                                                        key={key}
                                                        length={vehicleList.length}
                                                        onDeleteVehicle={onDeleteVehicle}
                                                        onChangeVehicleNo={onChangeVehicleNo}
                                                        onShowModal={onShowImgoptnModal}
                                                        onShowImage={onShowGpsImage}
                                                        onDeleteImage={onDeleteVehicleImg}
                                                    />
                                                ))}
                                            </View>
                                        )}
                                        <TouchableOpacity onPress={onVehicleAddmore} style={styles.addmoreBtn}>
                                            <Text style={[CommonStyle.boldtext, { color: Colors.white }]}>+ Add More</Text>
                                        </TouchableOpacity>
                                        <View style={{ marginTop: '2%' }}>
                                            <Button
                                                name={'Submit'}
                                                onPress={onVehiclePlaced}
                                            />
                                        </View>
                                    </View>
                                )}
                                {(state.data?.vehicles && state.data?.vehicles.length > 0) && (
                                    <VehicleDetails vehicleData={state.data?.vehicles} onShowImage={onShowImage} />
                                )}
                                {(state.status == '5.5' && state.data?.material_weighing_edit_vendor == '1' && materialWeightList.length > 0) && (
                                    <View style={{ paddingVertical: '2%' }}>
                                        <View style={[styles.itemHeader, { justifyContent: 'center' }]}>
                                            <Text style={[CommonStyle.boldblacktext, { color: Colors.white }]}>Material Weighed</Text>
                                        </View>
                                        <View style={{ marginTop: '2%' }}>
                                            {(materialWeightList).map((item, key) => (
                                                <View key={key} style={{ marginTop: '0%', paddingHorizontal: '0%' }}>
                                                    <MaterialWeightList
                                                        item={item}
                                                        onChangematerialWeight={onChangematerialWeight}
                                                        onShowModal={onShowImgoptnModal}
                                                        onDeleteImage={onDeleteWeightSlipImg}
                                                        onShowImage={onShowGpsImage}
                                                    />
                                                </View>
                                            ))}
                                        </View>
                                        <View style={{ marginTop: '1%' }}>
                                            <Button
                                                name={'Submit'}
                                                onPress={onMaterialWeighted}
                                            />
                                        </View>
                                    </View>
                                )}
                                {(state.data?.enquiry_sub_status_id >= 8.8) && (
                                    <Invoice data={state.data} onPayment={onShowPaymentModal} navigation={navigation} />
                                )}
                                {(state.data?.enquiry_sub_status_id >= 8.8 && state.data?.payment?.payment_amount) && (
                                    <PaymentDetails data={state.data?.payment} onShowImage={onShowGpsImage} />
                                )}
                                {(state.data?.enquiry_sub_status_id == 9.9 && state.data?.payment?.is_approve_vendor_payment > 0) && (
                                    <VehicleDispatch data={state.data} onVehicleDispatch={onVehicleDispatch} />
                                )}
                            </View>
                        </View>
                    )}
                </ScrollView>
            }
            <PaymentModal
                isVisible={state.showPaymentModal}
                onHideModal={onHidePaymentModal}
                data={state.data}
                onShowImage={onShowGpsImage}
                onPaymentSubmit={onGetData}
            />
            {(state.sliderImage) && (
                <ImageViewSlider
                    images={state.sliderImage}
                    onClose={onCloseSlider}
                />
            )}
            {(state.pickupDatePicker) && (
                <DatePickerModal
                    isVisible={state.pickupDatePicker}
                    value={state.pickupDate ? convertISOString(state.pickupDate) : new Date()}
                    onConfirm={onChangePickupDate}
                    minimumDate={new Date()}
                    mode={'datetime'}
                    onClose={onCloseDatePicker}
                />
            )}
            <ImageOptions
                modalVisible={state.imageOptionModal}
                onHideModal={onHideImgoptnModal}
                onSortItemSelect={onSelectImageOption}
            />
            {(state.loadingNew) && (
                <LoaderTransparent loading={state.loadingNew} />
            )}
        </SafeAreaView>
    )
}

export default ProcessesDetails