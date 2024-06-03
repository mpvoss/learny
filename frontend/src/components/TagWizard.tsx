import React, { useEffect, useState } from 'react';
import { Select, MenuItem, TextField, FormControl, InputLabel } from '@mui/material';
import config from '../config.json'

interface TagSaveHelperProps {
    updateTag: (tag: string) => void;
}

const TagWizard: React.FC<TagSaveHelperProps> = ({ updateTag }) => {
    const [tag, setTag] = useState('');
    const [tags, setTags] = useState([]); // Replace with your tags
    const [isCreatingNew, setIsCreatingNew] = useState(false);


    useEffect(() => {
        fetchTags();
    }, []);

    const fetchTags = async () => {
        try {
            const response = await fetch(config.BACKEND_URL + '/api/tags');
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