import  { useState } from 'react';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { AuthProps } from '../models';

interface DiagramListProps {
    authProps: AuthProps;
}

const DiagramList: React.FC<DiagramListProps> = () => {
    const [documents, _setDocuments] = useState([]);


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
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {documents.map((document: any) => (
                            <TableRow key={document.id}>
                                <TableCell>{document.id}</TableCell>
                                <TableCell>{document.title}</TableCell>
                                <TableCell>{document.author}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default DiagramList;