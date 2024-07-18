import Masonry from '@mui/lab/Masonry';
import { Typography, Card, CardContent, Container, Chip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useEffect, useState } from 'react';
import { TextField, Autocomplete, Stack, Fab, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import { AuthProps, Flashcard, Tag } from '../models';
import { getEnv } from '../utils/EnvUtil';
const BACKEND_URL = getEnv('VITE_BACKEND_URL');

const cardStyle = {
    backgroundColor: '#F5F5F5', // light gray
    border: '1px solid #DDD', // light border
    boxShadow: '5px 5px 10px rgba(0, 0, 0, 0.3)', // shadow for 3D effect
    borderRadius: '15px', // rounded corners
    padding: '10px',
    marginTop: '10px',
    margin: '10px',
};

const InformationCard = () => {

    return (
                <Typography variant="h6" gutterBottom>
                    No cards available for the current selection
                </Typography>
    );
};

const FlashcardComponent = ({flashcard}:{flashcard: Flashcard}) => {
    return (
        <Card style={cardStyle}>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    {flashcard.term}
                </Typography>
                <Typography variant="body1">
                    {flashcard.description}
                </Typography>


                <Box display="flex" paddingTop={1} flexDirection="row" flexWrap="wrap" alignItems="flex-start">
                {flashcard.tags.map((tag) => (
                    <Chip label={tag.name} variant="outlined" style={{ margin: '4px' }} />
                ))}
            </Box>
            </CardContent>
        </Card>
    );
};

interface FlashcardHomeProps {
    authProps:AuthProps;
}

const FlashcardHome:React.FC<FlashcardHomeProps> = ({ authProps }) => {
    // const [inputValue, setInputValue] = useState('');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
    

    const [tags, setTags] = useState<string[]>([]);


    // const handleTagDelete = (tagToDelete:any) => () => {
    //     setSelectedTags((tags) => tags.filter((tag) => tag !== tagToDelete));
    // };


    const loadFlashcards = () => {
        const queryParams = new URLSearchParams();

        selectedTags.forEach((tag) => {
            queryParams.append('tag', tag);
        });

        fetch(BACKEND_URL + '/api/flashcards?' + queryParams.toString(),
            {
                credentials: 'include',
                headers: {
                    'Authorization': `Bearer ${authProps.token}`
                }
            })
            .then((response) => response.json())
            .then((data) => {
                setFlashcards(data);
            })
            .catch((error) => {
                console.error('Error fetching notes:', error);
            });
    };

    useEffect(() => {
        loadFlashcards();
    }, [selectedTags]);

    useEffect(() => {
        fetch(BACKEND_URL + '/api/tags',
            {
                credentials: 'include',
                headers: {
                    'Authorization': `Bearer ${authProps.token}`
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
        <Container style={{ paddingTop: '64px' }}>

            <Stack direction="row" justifyContent="space-between" alignItems="center" style={{ marginBottom: '10px' }}>

                <Box sx={{ width: '75%' }}>
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
                    <Box sx={{ width: '50%' }}>
                    </Box>
                    <Box sx={{ width: '50%' }}>
                        <Button variant="contained" color="primary"
                        disabled={flashcards.length === 0 } 
                        to={{
                            pathname: "/study",
                            search: "?" + selectedTags.reduce((params, tag) => {
                                params.append('tag', tag);
                                return params;
                            }, new URLSearchParams()).toString()
                        }} 
                        component={Link}>Study</Button>

                    </Box>
                </Stack>
            </Stack>

            {flashcards.length === 0 && <InformationCard />}

            <Masonry columns={{ xs: 1, md: 3, lg:4 }} spacing={3}>
            {flashcards.map((flashcard) => (
                    <FlashcardComponent flashcard={flashcard} />
            ))}
        </Masonry>
            <Fab color="primary" aria-label="add" style={{ position: 'fixed', bottom: '16px', right: '16px' }}>
                <AddIcon />
            </Fab>
        </Container>
    );
};

export default FlashcardHome;