import { NoteModalProps } from "@/types/notemodal";
import React from 'react';
import { Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function NoteModal({
  visible,
  onClose,
  onSubmit,
  title,
  description,
  onTitleChange,
  onDescriptionChange,
}: NoteModalProps) {
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
                    <Text className='text-xl font-semibold'>New Note</Text>
                    <TouchableOpacity onPress={() => onSubmit && onSubmit()}>
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
                        autoFocus
                    />
                    
                    <TextInput
                        className='text-base text-gray-700'
                        placeholder='Start typing...'
                        placeholderTextColor='#D1D5DB'
                        value={description}
                        onChangeText={onDescriptionChange}
                        multiline
                        textAlignVertical='top'
                    />
                </ScrollView>
            </View>
        </Modal>
    );
}