import  { useEffect, useState } from 'react';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { AuthProps } from '../models';
// import { getEnv } from '../utils/EnvUtil';
// const BACKEND_URL = getEnv('VITE_BACKEND_URL');

interface DiagramListProps {
    authProps: AuthProps;
}

const DiagramList: React.FC<DiagramListProps> = ({ authProps }) => {
    const [documents, _setDocuments] = useState([]);


    useEffect(() => {
        console.log(authProps);
        // fetch(BACKEND_URL + '/api/tags',
        //     {
        //         credentials: 'include',
        //         headers: {
        //             'Authorization': `Bearer ${authProps.token}`
        //         }
        //     }
        // )
        //     .then((response) => response.json())

        //     .then((data) => {
        //         const tagsData: Tag[] = data;
        //         setTags(tagsData.map(tag => tag.name));
        //     })
        //     .catch((error) => {
        //         console.error('Error fetching tags:', error);
        //     });


// loadNotes();


    }, []);

    return (
        <div>
            <Button variant="contained" color="primary">Add</Button>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Title</TableCell>
                            <TableCell>Author</TableCell>
                            {/* Add more table headers as needed */}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {documents.map((document: any) => (
                            <TableRow key={document.id}>
                                <TableCell>{document.id}</TableCell>
                                <TableCell>{document.title}</TableCell>
                                <TableCell>{document.author}</TableCell>
                                {/* Add more table cells as needed */}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default DiagramList;