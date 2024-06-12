
import AddIcon from '@mui/icons-material/Add';
import { useEffect, useState } from 'react';
import { TextField, Autocomplete, Chip, Stack, Fab } from '@mui/material';
import NoteCard from './NoteCard';
import { AuthProps, Note, Tag } from '../models';
import { getEnv } from '../utils/EnvUtil';
const BACKEND_URL = getEnv('VITE_BACKEND_URL');


const NotesSearch = ({session}:AuthProps) => {
    const [_inputValue, setInputValue] = useState('');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [notes, setNotes] = useState<Note[]>([]);

    const [tags, setTags] = useState<string[]>([]);


    const handleTagDelete = (tagToDelete:any) => () => {
        setSelectedTags((tags) => tags.filter((tag) => tag !== tagToDelete));
    };


    const loadNotes = () => {
        const queryParams = new URLSearchParams();

        if (selectedTags.length === 0) {
            setNotes([]);
            return;
        }

        selectedTags.forEach((tag) => {
            queryParams.append('tag', tag);
        });

        fetch(BACKEND_URL +'/api/notes?' + queryParams.toString(),
        {
            credentials: 'include',
            headers: {
               'Authorization': `Bearer ${session.access_token}`
            }
        })
            .then((response) => response.json())
            .then((data) => {
                setNotes(data);
            })
            .catch((error) => {
                console.error('Error fetching notes:', error);
            });
    };

    useEffect(() => {
        loadNotes();
    }, [selectedTags]);

    useEffect(() => {
        fetch(BACKEND_URL + '/api/tags',
        {
            credentials: 'include',
            headers: {
               'Authorization': `Bearer ${session.access_token}`
            }
        }
        )
            .then((response) => response.json())
            
            .then((data) => {
                const tagsData: Tag[] = data;
                setTags(tagsData.map(tag => tag.name));
            })
            .catch((error) => {
                console.error('Error fetching tags:', error);
            });
    }, []);

    return (
        <div style={{paddingTop: '64px', maxWidth: '1000px' }}>
            <Autocomplete
                freeSolo
                options={tags}
                onInputChange={(_event, newInputValue) => {
                    setInputValue(newInputValue);
                }}
                onChange={(_event, newValue) => {
                    if (newValue != null && tags.includes(newValue) && !selectedTags.includes(newValue)) {
                        setSelectedTags([...selectedTags, newValue]);
                    }
                }}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Search notes"
                        variant="outlined"
                        fullWidth
                    />
                )}
            />
            <Stack direction="row" spacing={1} style={{ marginTop: '10px' }}>
                {selectedTags.map((tag) => (
                    <Chip
                        key={tag}
                        label={tag}
                        onDelete={handleTagDelete(tag)}
                    />
                ))}
            </Stack>
            <Stack direction="column" spacing={1} style={{ marginTop: '10px' }}>
                {notes.map((note) => (
                    <NoteCard 
                        key={note.id}
                        id={note.id}
                        content={note.content}
                        title={note.title}
                    />
                ))}
            </Stack>
           

          
               
                    <Fab color="primary" aria-label="add" style={{ position: 'fixed', bottom: '16px', right: '16px' }}>
                        <AddIcon />
                    </Fab>
               
        
        </div>
    );
};

export default NotesSearch;