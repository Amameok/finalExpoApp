import { supabase } from '@/services/supabase';
import { Task } from '@/types';
import * as Haptics from 'expo-haptics';
import { Alert } from 'react-native';

// Add here you're table name, make sure to double check it too
// add you table name here
const tableName = 'appnotes';

export const fetchTask = async (
    setGetTask: (tasks: Task[]) => void, 
    setLoading: (loading: boolean) => void
) => {
    try {
        setLoading(true);
        
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            console.warn('User not authenticated');
            return;
        }
        
        const { data, error } = await supabase
            .from(tableName)
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching tasks:', error);
            Alert.alert('Error', 'Failed to load notes');
            return;
        }

        setGetTask(data || []);
    } catch (err) {
        console.error('Fetch error:', err);
        Alert.alert('Error', 'An unexpected error occurred');
    } finally {
        setLoading(false);
    }
};

export const handleSubmit = async (
    newTitle: string,
    newDesc: string,
    setNewTitle: (title: string) => void,
    setNewDesc: (desc: string) => void,
    setIsAddModalVisible: (visible: boolean) => void,
    setGetTask: (tasks: Task[]) => void,
    setLoading: (loading: boolean) => void
) => {
    if (!newTitle.trim()) {
        console.warn('Title is empty');
        Alert.alert('Error', 'Please enter a title');
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        return;
    }

    try {
        console.log('Starting note creation...');
        setLoading(true);
        
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            Alert.alert('Error', 'User not authenticated');
            return;
        }
        
        console.log('Inserting to table:', tableName);
        console.log('Data:', { title: newTitle.trim(), description: newDesc.trim(), user_id: user.id });
        
        const { data, error } = await supabase
            .from(tableName)
            .insert([{
                title: newTitle.trim(),
                description: newDesc.trim(),
                user_id: user.id,
                created_at: new Date().toISOString(),
            }])
            .select();

        console.log('Supabase response - Data:', data, 'Error:', error);

        if (error) {
            console.error('Error creating task:', error);
            Alert.alert('Error', `Failed to create note: ${error.message}`);
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            return;
        }

        console.log('Note created successfully');
        setNewTitle('');
        setNewDesc('');
        setIsAddModalVisible(false);
        
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        
        // Refresh the tasks list
        await fetchTask(setGetTask, setLoading);
    } catch (err) {
        console.error('Submit error:', err);
        Alert.alert('Error', `An unexpected error occurred: ${err instanceof Error ? err.message : 'Unknown error'}`);
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
        setLoading(false);
    }
};

export const updateTask = async (
    selectedTask: Task | null,
    updateTitle: string,
    updateDesc: string,
    setIsEditModalVisible: (visible: boolean) => void,
    setSelectedTask: (task: Task | null) => void,
    setGetTask: (tasks: Task[]) => void,
    setLoading: (loading: boolean) => void
) => {
    if (!selectedTask) {
        Alert.alert('Error', 'No task selected');
        return;
    }

    if (!updateTitle.trim()) {
        Alert.alert('Error', 'Please enter a title');
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        return;
    }

    try {
        setLoading(true);
        const { error } = await supabase
            .from(tableName)
            .update({
                title: updateTitle.trim(),
                description: updateDesc.trim(),
            })
            .eq('id', selectedTask.id);

        if (error) {
            console.error('Error updating task:', error);
            Alert.alert('Error', 'Failed to update note');
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            return;
        }

        setIsEditModalVisible(false);
        setSelectedTask(null);
        
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        
        // Refresh the tasks list
        await fetchTask(setGetTask, setLoading);
    } catch (err) {
        console.error('Update error:', err);
        Alert.alert('Error', 'An unexpected error occurred');
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
        setLoading(false);
    }
};

export const deleteTask = async (
    id: number,
    setGetTask: (tasks: Task[]) => void,
    setLoading: (loading: boolean) => void
) => {
    try {
        setLoading(true);
        const { error } = await supabase
            .from(tableName)
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting task:', error);
            Alert.alert('Error', 'Failed to delete note');
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            return;
        }

        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        
        // Refresh the tasks list
        await fetchTask(setGetTask, setLoading);
    } catch (err) {
        console.error('Delete error:', err);
        Alert.alert('Error', 'An unexpected error occurred');
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
        setLoading(false);
    }
};