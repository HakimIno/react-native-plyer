import React from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    Dimensions,
} from 'react-native';
import { Gift } from '../../utility/constants/chat';

interface GiftModalProps {
    onClose: () => void;
    onSelectGift: (gift: Gift) => void;
    availableGifts: Gift[];
}

const { width: screenWidth } = Dimensions.get('window');

export const GiftModal: React.FC<GiftModalProps> = ({
    onClose,
    onSelectGift,
    availableGifts,
}) => {
    const renderGiftSelectItem = ({ item }: { item: Gift }) => (
        <TouchableOpacity
            style={styles.giftSelectItem}
            onPress={() => {
                onSelectGift(item);
                onClose();
            }}
            activeOpacity={0.7}
        >
            <Image 
                source={{ uri: item.imageUrl }} 
                style={styles.giftSelectImage}
                resizeMode="contain"
            />
            <Text style={styles.giftSelectName}>{item.name}</Text>
            <Text style={styles.giftSelectValue}>{item.value} Coins</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.modalContainer}>
            <TouchableOpacity 
                style={styles.overlay} 
                onPress={onClose}
                activeOpacity={1}
            />
            <View style={styles.modalContent}>
                <View style={styles.header}>
                    <Text style={styles.modalTitle}>เลือกของขวัญ</Text>
                    <TouchableOpacity onPress={onClose} style={styles.closeIcon}>
                        <Text style={styles.closeIconText}>✕</Text>
                    </TouchableOpacity>
                </View>
                
                <FlatList
                    data={availableGifts}
                    renderItem={renderGiftSelectItem}
                    keyExtractor={(item) => item.id}
                    numColumns={3}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.giftList}
                />
                
                <TouchableOpacity
                    style={styles.closeButton}
                    onPress={onClose}
                    activeOpacity={0.8}
                >
                    <Text style={styles.closeButtonText}>ปิด</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        backgroundColor: '#1a1a1a',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        maxHeight: '80%',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
    },
    closeIcon: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#333',
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeIconText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    giftList: {
        paddingBottom: 20,
    },
    giftSelectItem: {
        flex: 1,
        alignItems: 'center',
        margin: 6,
        padding: 15,
        backgroundColor: '#2a2a2a',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#444',
    },
    giftSelectImage: {
        width: 50,
        height: 50,
        marginBottom: 8,
    },
    giftSelectName: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '500',
        textAlign: 'center',
        marginBottom: 4,
    },
    giftSelectValue: {
        color: '#FFD700',
        fontSize: 12,
        fontWeight: 'bold',
    },
    closeButton: {
        marginTop: 20,
        backgroundColor: '#FF6B6B',
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 25,
        alignItems: 'center',
    },
    closeButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
}); 