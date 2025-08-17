import { Alert, Image, Modal, Pressable, StyleSheet, Text, View, ScrollView } from 'react-native';
import ModelData from '../../shared/types/ModalData';
import CalcButton from '../../pages/calc/components/CalcButton'; // используем CalcButton как FirmButton

type ModalViewProps = {
    isModalVisible: boolean,
    setModalVisible: (v: boolean) => void,
    modalData: ModelData,
}

export default function ModalView({ isModalVisible, setModalVisible, modalData }: ModalViewProps) {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isModalVisible}
            onRequestClose={() => {
                Alert.alert('Modal has been closed.');
                modalData.closeButtonAction?.();
                setModalVisible(false);
            }}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalView}>
                    {/* Кнопка закрытия */}
                    <Pressable
                        onPress={() => {
                            modalData.closeButtonAction?.();
                            setModalVisible(false);
                        }}
                        style={styles.closeButton}
                    >
                        <Image source={require("../../shared/assets/images/close.png")} style={styles.closeIcon} />
                    </Pressable>

                    {/* Прокручиваемый текст */}
                    <ScrollView style={styles.messageContainer}>
                        <Text style={styles.modalTitle}>{modalData.title}</Text>
                        <Text style={styles.modalText}>{modalData.message}</Text>
                    </ScrollView>

                    {/* Кнопки действия */}
                    <View style={styles.buttonsRow}>
                        {modalData.positiveButtonText && (
                            <CalcButton
                                title={modalData.positiveButtonText}
                                action={() => {
                                    modalData.positiveButtonAction?.();
                                    setModalVisible(false);
                                }}
                                type="equal"
                            />
                        )}
                        {modalData.negativeButtonText && (
                            <CalcButton
                                title={modalData.negativeButtonText}
                                action={() => {
                                    modalData.negativeButtonAction?.();
                                    setModalVisible(false);
                                }}
                                type="operationButton"
                            />
                        )}
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    modalView: {
        backgroundColor: 'white',
        borderRadius: 20,
        paddingVertical: 20,
        paddingHorizontal: 15,
        alignItems: 'center',
        maxWidth: 400,
        width: '100%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    closeButton: {
        position: "absolute",
        right: 10,
        top: 10,
        zIndex: 10,
        padding: 5,
    },
    closeIcon: {
        width: 30,
        height: 30,
        tintColor: '#3f3d3dff'
    },
    messageContainer: {
        maxHeight: 200,
        width: '100%',
        marginBottom: 10,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
        textAlign: 'center',
    },
    modalText: {
        fontSize: 16,
        textAlign: 'center',
    },
    buttonsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    
});
