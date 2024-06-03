// import React, { useState, useEffect } from 'react';
// import { Box, Button, MenuItem, Select, Tab, Tabs, TextField, Typography } from '@mui/material';
// import config from '../config.json'

// interface Tag {
//     id: number;
//     name: string;
// }

// interface TagSaveHelperProps {
//     setTag: (tag:string) => void;
// }

// interface TabPanelProps {
//     children?: React.ReactNode;
//     index: number;
//     value: number;
// }

// function CustomTabPanel(props: TabPanelProps) {
//     const { children, value, index, ...other } = props;

//     return (
//         <div
//             role="tabpanel"
//             hidden={value !== index}
//             id={`simple-tabpanel-${index}`}
//             aria-labelledby={`simple-tab-${index}`}
//             {...other}
//         >
//             {value === index && (
//                 <Box sx={{ p: 3 }}>
//                     <Typography>{children}</Typography>
//                 </Box>
//             )}
//         </div>
//     );
// }

// function a11yProps(index: number) {
//     return {
//         id: `simple-tab-${index}`,
//         'aria-controls': `simple-tabpanel-${index}`,
//     };
// }

// interface TagSaveHelperProps {
//     setTag: (tag:string) => void;
//     saveWithTags: (tags: number[]) => void; // Add this line
// }

// const TagSaveHelper: React.FC<TagSaveHelperProps> = ({ saveWithTags }) => {
//     const [tags, setTags] = useState<Tag[]>([]);
//     const [value, setValue] = React.useState(0);
//     // const [selectedTags, setSelectedTags] = useState<number[]>([]);


//     const [selectedTag, setSelectedTag] = useState('');
//     const [newTag, setNewTag] = useState('');

//     const handleChange = (newValue: number) => {
//         setValue(newValue);
//     };

//     const handleSave = () => {
//         // Existing tag
//         if (value === 0) {
//             // look up id of selected tag
//             const tag = tags.find((tag) => tag.name === selectedTag);
//             if (tag) {
//                 saveWithTags([tag.id]);
//             }
//         }else{
//             // Create new tag
//             const tag = {
//                 name: newTag,
//             };
//             fetch(config.BACKEND_URL + '/api/tags', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify(tag),
//             })
//                 .then((response) => response.json())
//                 .then((data) => {
//                     console.log('Success:', data);
//                     saveWithTags([data.id]);
//                 })
//                 .catch((error) => {
//                     console.error('Error:', error);
//                 });
//         }


//         // onSave(tag);
//         // create array from tag
//         // const tagIds = [tag];
//         // saveWithTags([tag]);
//         // onClose();
//     };

//     useEffect(() => {
//         fetchTags();
//     }, []);

//     const fetchTags = async () => {
//         try {
//             const response = await fetch(config.BACKEND_URL + '/api/tags');
//             const data = await response.json();
//             setTags(data);
//             if (data.length > 0) {
//                 setSelectedTag(data[0].name);
//             }
//         } catch (error) {
//             console.error('Error fetching tags:', error);
//         }
//     };


//     return (
//         <>
//                 <Box>
//                     <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
//                         <Tab label="Choose Tag" {...a11yProps(0)} />
//                         <Tab label="Create Tag" {...a11yProps(1)} />
//                     </Tabs>
//                 </Box>
//                 <CustomTabPanel value={value} index={0}>
//                     <Select fullWidth value={selectedTag} onChange={(e) => setSelectedTag(e.target.value)}>
//                         {tags.map((tag) => (
//                             <MenuItem value={tag.name}>{tag.name}</MenuItem>
//                         ))}
//                     </Select>
//                 </CustomTabPanel>


//                 <CustomTabPanel value={value} index={1}>
//                     <TextField
//                         sx={{ marginTop: 2 }}
//                         value={newTag}
//                         inputProps={{ minLength: 3 }}
//                         onChange={(e) => setNewTag(e.target.value)}
//                         placeholder="Tag name"
//                     /><br></br>

//                 </CustomTabPanel>

//                 <br></br>
//                 <Button sx={{ float: 'right' }} onClick={handleSave}>Save</Button>
//                 {/* right align button */}
//                 {/* <Button onClick={onClose}>Cancel</Button> */}

//                 </>
//     );
// };

// export default TagSaveHelper;