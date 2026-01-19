export interface NoteModalProps {
    visible: boolean;
    onClose: () => void;
    onSubmit: () => void;
    title: string;
    description: string;
    onTitleChange: (text: string) => void;
    onDescriptionChange: (text: string) => void;
}

export interface EditNoteModalProps {
    visible: boolean;
    onClose: () => void;
    onUpdate: () => void;
    onDelete: () => void;
    title: string;
    description: string;
    onTitleChange: (text: string) => void;
    onDescriptionChange: (text: string) => void;
}