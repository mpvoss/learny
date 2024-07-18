import React, { useEffect, useState } from 'react';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const Diagram: React.FC = () => {
    const [documents, setDocuments] = useState([]);

    // useEffect(() => {
    //     fetch('/api/documents')
    //         .then(response => response.json())
    //         .then(data => setDocuments(data))
    //         .catch(error => console.error(error));
    // }, []);

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

export default Demo;