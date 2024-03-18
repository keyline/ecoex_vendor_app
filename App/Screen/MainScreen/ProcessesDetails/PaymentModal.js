import { View, Text, TouchableOpacity, Image, Keyboard } from 'react-native'
import React, { useCallback, useState } from 'react'
import Modal from 'react-native-modal'
import { styles } from './styles'
import { CommonStyle } from '../../../Utils/CommonStyle'
import InputField from '../../../Container/InputField'
import LoaderTransparent from '../../../Container/LoaderTransparent'
import DatePickerModal from '../../../Container/DatePickerModal'
import { ImagePath } from '../../../Utils/ImagePath'
import ElementDropDownVertical from '../../../Container/ElementDropDownVertical'
import { Colors } from '../../../Utils/Colors'
import Button from '../../../Container/Button'
import { LaunchCamera, LaunchImageLibary, ToastError, ToastMessage, convertISOString, dateConvertWithTime } from '../../../Service/CommonFunction'
import ImageOptions from '../../../Container/ImageOptions'
import Apis from '../../../Service/Apis'

const PaymentModal = ({ isVisible, showModal, onHideModal, data, onShowImage, onPaymentSubmit }) => {
    const [state, setState] = useState({
        loading: false,
        modalVisible: true,
        ammount: '',
        ammountErr: '',
        transNo: '',
        transNoErr: '',
        paymentDate: '',
        paymentDateErr: '',
        datePicker: false,
        paymentType: '',
        paymentTypeErr: '',
        slipImage: null,
        slipImageErr: '',
        imageOptionModal: false
    })

    const paymentMode = [
        { label: 'Cash', value: 'CASH' },
        { label: 'Cheque', value: 'CHEQUE' },
        { label: 'Netbanking', value: 'NETBANKING' }
    ]

    const onHide = useCallback(() => {
        setState(prev => ({
            ...prev,
            modalVisible: false,
            ammount: '',
            ammountErr: '',
            transNo: '',
            transNoErr: '',
            paymentDate: '',
            paymentDateErr: '',
            datePicker: false,
            paymentType: '',
            paymentTypeErr: '',
            slipImage: null,
            slipImageErr: ''
        }));
        onHideModal();
    })

    const onChangeAmmount = useCallback((text) => {
        setState(prev => ({
            ...prev,
            ammount: text,
            ammountErr: ''
        }))
    }, [state.ammount])

    const onChangepaymentDate = useCallback((value) => {
        setState(prev => ({
            ...prev,
            paymentDate: dateConvertWithTime(value),
            paymentDateErr: '',
            datePicker: false
        }))
    }, [state.paymentDate, state.datePicker])

    const onOpenDatePicker = useCallback(() => {
        setState(prev => ({
            ...prev,
            datePicker: true
        }))
    }, [state.datePicker])

    const onCloseDatePicker = useCallback(() => {
        setState(prev => ({
            ...prev,
            datePicker: false
        }))
    }, [state.datePicker])

    const onChangeTransNo = useCallback((text) => {
        setState(prev => ({
            ...prev,
            transNo: text,
            transNoErr: ''
        }))
    }, [state.transNo])

    const onChangePaymentMode = useCallback(async (item) => {
        if (item) {
            setState(prev => ({
                ...prev,
                paymentType: item?.value,
                paymentTypeErr: ''
            }))
        }
    }, [state.paymentType])

    const onDeleteImage = useCallback(() => {
        setState(prev => ({
            ...prev,
            slipImage: null,
            slipImageErr: ''
        }))
    }, [state.slipImage])

    const onShowImgoptnModal = useCallback(() => {
        Keyboard.dismiss();
        setState(prev => ({
            ...prev,
            imageOptionModal: true
        }))
    }, [state.imageOptionModal])

    const onHideImgoptnModal = useCallback(() => {
        setState(prev => ({
            ...prev,
            imageOptionModal: false
        }))
    }, [state.imageOptionModal])

    const onSelectImageOption = useCallback(async (value) => {
        try {
            if (value == 1) {
                let libaryImageRes = await LaunchImageLibary(true, 1);
                if (__DEV__) {
                    console.log('libaryResponse', JSON.stringify(libaryImageRes));
                }
                if (libaryImageRes.assets && libaryImageRes.assets.length > 0) {
                    setState(prev => ({
                        ...prev,
                        slipImage: libaryImageRes.assets[0],
                        slipImageErr: '',
                        imageOptionModal: false
                    }))
                } else {
                    onHideImgoptnModal();
                }
            } else if (value == 2) {
                let cameraImageRes = await LaunchCamera(true);
                if (__DEV__) {
                    console.log('CameraImage', cameraImageRes)
                }
                if (cameraImageRes.assets && cameraImageRes.assets.length > 0) {
                    setState(prev => ({
                        ...prev,
                        slipImage: cameraImageRes.assets[0],
                        slipImageErr: '',
                        imageOptionModal: false
                    }))
                } else {
                    onHideImgoptnModal();
                }
            }
        } catch (error) {
            if (__DEV__) {
                console.log(error)
            }
            onHideImgoptnModal();
            ToastError();
        }
    }, [state.slipImage])

    const onSubmit = useCallback(async () => {
        if (state.ammount.trim() == '') {
            setState(prev => ({
                ...prev,
                ammountErr: 'Enter Amount'
            }))
            return;
        } else if (isNaN(Number(state.ammount)) || Number(state.ammount) <= 0) {
            setState(prev => ({
                ...prev,
                ammountErr: 'Enter Valid Amount'
            }))
            return;
        } else if (state.paymentDate == '') {
            setState(prev => ({
                ...prev,
                paymentDateErr: 'Choose Payment Date & Time'
            }))
            return;
        } else if (state.paymentType == '') {
            setState(prev => ({
                ...prev,
                paymentTypeErr: 'Select Transaction Mode'
            }))
            return;
        } else if (state.paymentType != 'CASH' && state.transNo.trim() == '') {
            setState(prev => ({
                ...prev,
                transNoErr: 'Enter Transaction No'
            }))
            return;
        } else if (state.paymentType != 'CASH' && state.slipImage == null) {
            setState(prev => ({
                ...prev,
                slipImageErr: 'Upload Transaction Screenshot'
            }))
            return;
        } else {
            try {
                setState(prev => ({
                    ...prev,
                    loading: true
                }))
                let datas = {
                    sub_enq_no: data?.sub_enquiry_no,
                    payment_amount: state.ammount,
                    payment_mode: state.paymentType,
                    payment_date: state.paymentDate,
                    txn_no: state.paymentType == 'CASH' ? '' : state.transNo,
                    txn_screenshot: state.paymentType == 'CASH' ? '' : state.slipImage
                }
                // console.log('paymentBody', JSON.stringify(datas));
                let response = await Apis.invoice_payment(datas);
                if (__DEV__) {
                    console.log('PaymentResponse', JSON.stringify(response))
                }
                if (response.success) {
                    setState(prev => ({
                        ...prev,
                        loading: false
                    }))
                    onHide();
                    onPaymentSubmit()
                } else {
                    setState(prev => ({
                        ...prev,
                        loading: false
                    }))
                }
                ToastMessage(response?.message);
            } catch (error) {
                if (__DEV__) {
                    console.log(error)
                }
                setState(prev => ({
                    ...prev,
                    loading: false
                }))
                ToastError();
            }
        }
    })

    return (
        <Modal
            isVisible={isVisible}
            animationInTiming={800}
            animationOutTiming={800}
            coverScreen={false}
            style={styles.modalStyle}
            onBackdropPress={() => { state.loading ? null : onHide() }}
            onBackButtonPress={() => { state.loading ? null : onHide() }}
        >
            <View style={styles.modalContainer}>
                <Text style={[CommonStyle.boldblacktext, { textAlign: 'center', fontSize: 16 }]}>Payment Details</Text>
                <InputField
                    name={'Amount :'}
                    value={state.ammount}
                    placeholder={'Enter Amount'}
                    keyboardType={'number-pad'}
                    error={state.ammountErr}
                    onChangeText={onChangeAmmount}
                />
                <InputField
                    name={'Payment Date & Time :'}
                    editable={false}
                    value={state.paymentDate}
                    placeholder={'Choose Payment Date & Time'}
                    rightIcon={ImagePath.date}
                    rightonPress={onOpenDatePicker}
                    error={state.paymentDateErr}
                />
                <ElementDropDownVertical
                    name={'Transaction Mode'}
                    data={paymentMode}
                    value={state.paymentType}
                    error={state.paymentTypeErr}
                    setValue={onChangePaymentMode}
                    mode={'modal'}
                />
                {(state.paymentType == 'CHEQUE' || state.paymentType == 'NETBANKING') && (
                    <>
                        <InputField
                            name={'Transaction No. :'}
                            value={state.transNo}
                            placeholder={'Enter Transaction No.'}
                            onChangeText={onChangeTransNo}
                            error={state.transNoErr}
                        />
                        <View style={{ marginVertical: '2%' }}>
                            <Text style={[CommonStyle.boldblacktext, { color: Colors.theme_color }]}>Transaction Screenshot :</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: '3%' }}>
                                {(state.slipImage && state.slipImage?.uri) ? (
                                    <View style={{ alignSelf: 'center' }}>
                                        <TouchableOpacity onPress={() => onShowImage(state.slipImage?.uri)} activeOpacity={0.5}>
                                            <Image source={{ uri: state.slipImage?.uri }} style={styles.listimg} />
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => onDeleteImage()} style={styles.imgCloseContainer}>
                                            <Image source={ImagePath.close_round} style={{ width: 20, height: 20, resizeMode: 'contain' }} />
                                        </TouchableOpacity>
                                    </View>
                                ) : (
                                    <TouchableOpacity onPress={onShowImgoptnModal} activeOpacity={0.5}>
                                        <Image source={ImagePath.upload_image} style={styles.uploadimg} />
                                    </TouchableOpacity>
                                )}
                            </View>
                            {(state.slipImageErr) && (
                                <Text style={[CommonStyle.errortxt, { textAlign: 'center', marginTop: '2%' }]}>{state.slipImageErr}</Text>
                            )}
                        </View>
                    </>
                )}
                <View style={{ marginTop: '2%' }}>
                    <Button
                        name={'Submit'}
                        onPress={onSubmit}
                    />
                </View>
                {(state.loading) && (
                    <LoaderTransparent loading={state.loading} />
                )}
            </View>
            <DatePickerModal
                isVisible={state.datePicker}
                value={state.paymentDate ? convertISOString(state.paymentDate, 'lll') : new Date()}
                onConfirm={onChangepaymentDate}
                minimumDate={data?.assigned_date ? convertISOString(data?.assigned_date, 'lll') : null}
                maximumDate={new Date()}
                mode={'datetime'}
                onClose={onCloseDatePicker}
            />
            <ImageOptions
                modalVisible={state.imageOptionModal}
                onHideModal={onHideImgoptnModal}
                onSortItemSelect={onSelectImageOption}
            />
        </Modal>
    )
}

export default PaymentModal