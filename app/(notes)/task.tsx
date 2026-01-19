import EditNoteModal from '@/components/modals/EditNoteModal';
import NoteModal from '@/components/modals/NoteModal';
import { noteColors } from '@/lib/color-notes';
import { getNumColumns } from "@/lib/notes-column";
import AntDesign from '@expo/vector-icons/AntDesign';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';

import { 
    ActivityIndicator, 
    Dimensions, FlatList, 
    RefreshControl, 
    StatusBar, 
    Text, 
    TextInput, 
    TouchableOpacity,
     View 
    } from 'react-native';
    
import { SafeAreaView } from 'react-native-safe-area-context';
import { deleteTask, fetchTask, handleSubmit, updateTask } from '../../components/functions/NotesFunctions';
import { Task } from "../../types";

import { supabase } from "@/services/supabase";

export default function task() {
    
    const [loadingSession, setLoadingSession] = useState(true);
    const [newTitle, setNewTitle] = useState("");
    const [newDesc, setNewDesc] = useState("");
    const [getTask, setGetTask] = useState<Task[]>([]);
    const [updateDesc, setUpdateDesc] = useState("");
    const [updateTitle, setUpdateTitle] = useState("");
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [screenWidth, setScreenWidth] = useState(Dimensions.get("window").width);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const router = useRouter()
    
    const numColumns = getNumColumns(screenWidth);

     useEffect(() => {
        const checkSession = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            router.replace("/(auth)/SignIn/signin");
        }
        setLoadingSession(false);
        };

    checkSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
        if (!session) {
            router.replace("/(auth)/SignIn/signin");
        }
        });

        return () => {
        listener.subscription.unsubscribe();
        };
    }, []);

    useEffect(() => {
        fetchTask(setGetTask, setLoading);

        const subscription = Dimensions.addEventListener('change', ({ window }) => {
            setScreenWidth(window.width);
        });

        return () => subscription?.remove();
    }, []);

    if (loadingSession) {
        return (
        <View className="flex-1 items-center justify-center bg-white">
            <ActivityIndicator size="large" color="black" />
            <Text className="mt-3 text-gray-600">Checking session...</Text>
        </View>
        );
    }

    const onSubmit = async () => {
        await handleSubmit(
            newTitle,
            newDesc,
            setNewTitle,
            setNewDesc,
            setIsAddModalVisible,
            setGetTask,
            setLoading
        );
    };

    const onUpdate = () => {
        updateTask(
            selectedTask,
            updateTitle,
            updateDesc,
            setIsEditModalVisible,
            setSelectedTask,
            setGetTask,
            setLoading
        );
    };

    const onDelete = (id: number) => {
        deleteTask(
            id, 
            setGetTask, 
            setLoading
        );
    };

    const openEditModal = async (task: Task) => {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setSelectedTask(task);
        setUpdateTitle(task.title);
        setUpdateDesc(task.description || '');
        setIsEditModalVisible(true);
    };

    const handleDeleteFromModal = () => {
        if (selectedTask) {
            setIsEditModalVisible(false);
            onDelete(selectedTask.id);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    const onRefresh = async () => {
        setRefreshing(true);

        // haptics feedback
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

        // await fetchTask
        await fetchTask(setGetTask, setLoading);
        setRefreshing(false);
    };

    const getColorForIndex = (index: number) => {
        return noteColors[index % noteColors.length];
    };

    const filteredTasks = getTask.filter(task => 
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const handlePress = async (open: boolean) => {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setIsAddModalVisible(open);
    };

    return (
        <SafeAreaView edges={['left', 'right', 'top']}  className='flex-1 bg-gray-50'>
            <StatusBar barStyle="dark-content" />
            
            {/* Header */}
            <View className='bg-white pt-12 pb-4 px-6 shadow-sm'>
                <View className='mb-4'>
                    <View className='flex flex-row'>
                        <Text className='flex-1 text-3xl font-bold text-gray-900'>Notes</Text>
                        <View className='bg-red-500 rounded-full'>
                            <Text 
                                className='p-4 px-7 text-white'
                                onPress={async () => {
                                    await supabase.auth.signOut()
                                    router.replace("/(auth)/SignIn/signin")
                                }}>
                                Logout
                            </Text>
                        </View>
                    </View>
                </View>
                
                {/* Search Bar */}
                <View className='bg-gray-100 rounded-xl px-4 py-3 flex-row items-center'>
                    <TextInput
                        placeholder='Search'
                        placeholderTextColor='#9CA3AF'
                        className='flex-1 text-gray-900'
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>
            </View>

            {/* Loading Indicator */}
            {loading && (
                <View className='absolute top-0 left-0 right-0 bottom-0 justify-center items-center bg-black/20 z-50'>
                    <View className='bg-white rounded-lg p-6'>
                        <ActivityIndicator size="large" color="black" />
                        <Text className='mt-3 text-gray-800 font-medium'>Loading...</Text>
                    </View>
                </View>
            )}

            {/* Notes Grid */}
            <FlatList
                data={filteredTasks}
                numColumns={numColumns}
                key={numColumns}
                contentContainerStyle={{ padding: 12, paddingBottom: 100 }}
                columnWrapperStyle={numColumns > 1 ? { justifyContent: 'space-between' } : undefined}
                keyExtractor={(task) => task.id.toString()}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor="#000000"
                        colors={["#000000"]}
                        title="Pull to refresh"
                        titleColor="#666666"
                    />
                }
                renderItem={({item, index}) => (
                    <TouchableOpacity 
                        className='mb-4 rounded-2xl p-4 shadow-sm'
                        style={{ 
                            backgroundColor: getColorForIndex(index), 
                            minHeight: 160,
                            width: numColumns === 1 ? '100%' : `${100 / numColumns - 2}%`
                        }}
                        onPress={() => openEditModal(item)}
                        activeOpacity={0.7}
                        disabled={loading}
                    >
                        <View className='flex-1'>
                            <Text className='text-gray-900 font-semibold text-base mb-2' numberOfLines={3}>
                                {item.title}
                            </Text>
                            {item.description && (
                                <Text className='text-gray-700 text-sm' numberOfLines={2}>
                                    {item.description}
                                </Text>
                            )}
                        </View>
                        <View className='flex-row justify-between items-center mt-auto pt-3'>
                            <Text className='text-gray-600 text-xs'>
                                {formatDate(item.created_at)}
                            </Text>
                            <TouchableOpacity 
                                className='bg-black rounded-full w-7 h-7 items-center justify-center'
                                onPress={(e) => {
                                    e.stopPropagation();
                                    openEditModal(item);
                                }}
                                disabled={loading}
                            >
                                <Text className='text-white text-xs'>✎</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                )}
                ListEmptyComponent={
                    !loading ? (
                        <View className='items-center justify-center py-20'>
                            <Text className='text-gray-400 text-lg'>No notes yet</Text>
                            <Text className='text-gray-400 text-sm mt-2'>Tap + to create your first note!</Text>
                        </View>
                    ) : null
                }
            />

            {/* Floating Action Button */}
            <TouchableOpacity 
                className='absolute bg-black rounded-full w-20 h-20 items-center justify-center shadow-lg'
                style={{
                    bottom: 30,
                    right: 30,
                    elevation: 8,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: 0.2,
                    shadowRadius: 8,
                }}
                onPress={() => handlePress(true)}
                activeOpacity={0.8}
                disabled={loading}
            >
                <AntDesign className="m-4" name="plus" size={40} color="white" />
            </TouchableOpacity>

            {/* Add Note Modal Component */}
            <NoteModal
                visible={isAddModalVisible}
                onClose={() => setIsAddModalVisible(false)}
                onSubmit={onSubmit}
                title={newTitle}
                description={newDesc}
                onTitleChange={setNewTitle}
                onDescriptionChange={setNewDesc}
            />

            {/* Edit Note Modal Component */}
            <EditNoteModal
                visible={isEditModalVisible}
                onClose={() => setIsEditModalVisible(false)}
                onUpdate={onUpdate}
                onDelete={handleDeleteFromModal}
                title={updateTitle}
                description={updateDesc}
                onTitleChange={setUpdateTitle}
                onDescriptionChange={setUpdateDesc}
            />
        </SafeAreaView>
    );
}