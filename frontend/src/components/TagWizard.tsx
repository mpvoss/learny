import React, { useEffect, useState } from 'react';
import { Select, MenuItem, TextField, FormControl, InputLabel } from '@mui/material';
import { getEnv } from '../utils/EnvUtil';
import { Session } from '@supabase/supabase-js';
const BACKEND_URL = getEnv('VITE_BACKEND_URL');

interface TagSaveHelperProps {
    updateTag: (tag: string) => void;
    session: Session
}

const TagWizard: React.FC<TagSaveHelperProps> = ({ updateTag, session }) => {
    const [tag, setTag] = useState('');
    const [tags, setTags] = useState([]); // Replace with your tags
    const [isCreatingNew, setIsCreatingNew] = useState(false);


    useEffect(() => {
        fetchTags();
    }, []);

    const fetchTags = async () => {
        try {
            const response = await fetch(BACKEND_URL + '/api/tags',
            {
                credentials: 'include',
                headers: {
                   'Authorization': `Bearer ${session.access_token}`
                }
            }
            );
            let data = await response.json();
            // extract "name" field out of json array
            data = data.map((tag: { name: any; }) => tag.name);
            setTags(data);
            setTag('Tag name');
            setIsCreatingNew(true);
            
        } catch (error) {
            console.error('Error fetching tags:', error);
        }
    };


    const handleTagChange = (event: { target: { value: any; }; }) => {
        const newValue = event.target.value;
        setTag(newValue);
        updateTag(newValue);
        setIsCreatingNew(newValue === 'Tag name');
    };

    const setAndBubbleUpTag = (tagValue:string) =>{
        updateTag(tagValue);
        setTag(tagValue)
    }

    return (
        <div style={{ paddingTop: '20px' }}>
            <FormControl
                fullWidth
            >
                <InputLabel id="tag-select-label"
                >Tag</InputLabel>
                <Select
                    labelId="tag-select-label"
                    value={tag}
                    onChange={handleTagChange}
                    label="Tag"
                    sx={{ marginBottom: '20px' }}
                >
                     <MenuItem value="Tag name">*Create New*</MenuItem>
                    {tags.map((tag) => (
                        <MenuItem key={tag} value={tag}>
                            {tag}
                        </MenuItem>
                    ))}
                   
                </Select>
            </FormControl>
            {isCreatingNew && (
                <TextField
                    label="Tag name"
                    value={tag}
                    fullWidth
                    onChange={(event) => setAndBubbleUpTag(event.target.value)}
                />
            )}
        </div>
    );
};

export default TagWizard;