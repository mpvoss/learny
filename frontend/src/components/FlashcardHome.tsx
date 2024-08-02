import Masonry from '@mui/lab/Masonry';
import { Typography, Card, CardContent, Container, Chip, Select, Checkbox, ListItemText, MenuItem, OutlinedInput, SelectChangeEvent, Theme, useTheme } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useEffect, useState } from 'react';
import { Stack, Fab, Button, Box } from '@mui/material';
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

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
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
    const theme = useTheme();

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

    const handleChange = (event: SelectChangeEvent<typeof selectedTags>) => {
        const {
          target: { value },
        } = event;
        setSelectedTags(
          // On autofill we get a stringified value.
          typeof value === 'string' ? value.split(',') : value,
        );
      };

      function getStyles(name: string, personName: readonly string[], theme: Theme) {
        return {
          fontWeight:
            personName.indexOf(name) === -1
              ? theme.typography.fontWeightRegular
              : theme.typography.fontWeightMedium,
        };
      }

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

                <Box 
                // sx={{ width: '75%' }}
                >
                <Select
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          displayEmpty
          renderValue={(selected) => {
            if (selected.length === 0) {
              return <em>All</em>;
            }

            return selected.join(', ');
          }}
          value={selectedTags}
          onChange={handleChange}
        // sx={{width:'100%'}}
          input={<OutlinedInput label="Tag" />}
        //   renderValue={(selected) => selected.join(', ')}
          MenuProps={MenuProps}
        >
            <MenuItem disabled value="">
             <em>All</em>
           </MenuItem>
          {tags.map((name) => (
             
            <MenuItem key={name} value={name}
            style={getStyles(name, [name], theme)}
            >
              <Checkbox checked={selectedTags.indexOf(name) > -1} />
              <ListItemText primary={name} />
            </MenuItem>
          ))}
        </Select>

                    {/* <Autocomplete
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
                    /> */}
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