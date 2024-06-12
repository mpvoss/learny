import { Typography, Card, CardContent } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import  { useEffect, useState } from 'react';
import { TextField, Autocomplete, Stack, Fab, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import { AuthProps, Note, Tag } from '../models';
import { getEnv } from '../utils/EnvUtil';
const BACKEND_URL = getEnv('VITE_BACKEND_URL');


const cardStyle = {
    backgroundColor: '#F5F5F5', // light gray
    border: '1px solid #DDD', // light border
    boxShadow: '5px 5px 15px rgba(0, 0, 0, 0.3)', // shadow for 3D effect
    borderRadius: '15px', // rounded corners
    padding: '20px',
    marginTop: '100px',
    margin: '10px',
};

const InformationCard = () => {
    const totalCards = 45; // Replace with actual number of cards
    const cardsDueForReview = 10; // Replace with actual number of cards due for review

    return (
        <Card style={cardStyle}>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    {totalCards} cards available, {cardsDueForReview} due for review
                </Typography>
                <Typography variant="body1">
                    Select a tag to filter first or click Study to review all
                </Typography>
            </CardContent>
        </Card>
    );
};

const FlashcardHome = ({session}:AuthProps) => {
    // const [inputValue, setInputValue] = useState('');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [_notes, setNotes] = useState<Note[]>([]);

    const [tags, setTags] = useState<string[]>([]);


    // const handleTagDelete = (tagToDelete:any) => () => {
    //     setSelectedTags((tags) => tags.filter((tag) => tag !== tagToDelete));
    // };


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




<Stack direction="row" justifyContent="space-between" alignItems="center" style={{ marginBottom: '10px' }}>
            
            <Box sx={{width: '75%'}}>
            <Autocomplete
                multiple
                options={tags}
                
                value={selectedTags}
                onChange={(_event, newValue) => {
                    setSelectedTags(newValue);
                }}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Select tags"
                        variant="outlined"
                        fullWidth
                    />
                )}
            />
            </Box>
            <Stack direction="row" spacing={1}>
            <Box sx={{width: '50%'}}>
                <Button variant="contained" color="primary" style={{ marginRight: '10px' }}>
                    Export
                </Button>
                </Box>
                <Box sx={{width: '50%'}}>
                <Button variant="contained" color="primary" to="/study" component={Link}>Study</Button>
                    
                </Box>
            </Stack>
        </Stack>
            
            

        

            <InformationCard />

            {/* <Autocomplete
                freeSolo
                options={tags}
                onInputChange={(event, newInputValue) => {
                    setInputValue(newInputValue);
                }}
                onChange={(event, newValue) => {
                    if (tags.includes(newValue) && !selectedTags.includes(newValue)) {
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
             */}
           

          
               
                    <Fab color="primary" aria-label="add" style={{ position: 'fixed', bottom: '16px', right: '16px' }}>
                        <AddIcon />
                    </Fab>
               
        
        </div>
    );
};

export default FlashcardHome;