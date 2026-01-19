import { EditNoteModalProps } from "@/types/notemodal";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import React from 'react';
import { Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function EditNoteModal({
  visible,
  onClose,
  onUpdate,
  onDelete,
  title,
  description,
  onTitleChange,
  onDescriptionChange,
}: EditNoteModalProps) {
    return (
        <Modal
            visible={visible}
            animationType='slide'
            presentationStyle='pageSheet'
        >
            <View className='flex-1 bg-white'>
                <View className='flex-row justify-between items-center px-6 pt-12 pb-4'>
                    <TouchableOpacity onPress={onClose}>
                        <Text className='text-blue-500 text-lg'>Cancel</Text>
                    </TouchableOpacity>
                    <Text className='text-xl font-semibold'>Edit Note</Text>
                    <TouchableOpacity onPress={onUpdate}>
                        <Text className='text-blue-500 text-lg font-semibold'>Done</Text>
                    </TouchableOpacity>
                </View>
                
                <ScrollView className='flex-1 px-6'>
                    <TextInput
                        className='text-2xl font-bold text-gray-900 mb-4 mt-4'
                        placeholder='Title'
                        placeholderTextColor='#D1D5DB'
                        value={title}
                        onChangeText={onTitleChange}
                    />
                    
                    <TextInput
                        className='text-base text-gray-700 mb-6'
                        placeholder='Start typing...'
                        placeholderTextColor='#D1D5DB'
                        value={description}
                        onChangeText={onDescriptionChange}
                        multiline
                        textAlignVertical='top'
                    />
                </ScrollView>

                {/* Delete Button */}
                <TouchableOpacity onPress={onDelete} className="absolute w-10 h-10 items-center justify-center"
                        style={{
                            bottom: 35,
                            right: 35,
                            elevation: 8,
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 0 },
                            shadowOpacity: 0.2,
                            shadowRadius: 8,
                        }}  
                    >
                    <FontAwesome6 name="trash" size={24} color="red" />
                </TouchableOpacity>
            </View>
        </Modal>
    );
}