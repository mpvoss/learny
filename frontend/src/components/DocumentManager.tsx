import React, { useState, useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Container,
    Checkbox,
    Stack,
} from '@mui/material';

import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import { AuthProps } from '../models';
import { getEnv } from '../utils/EnvUtil';
const BACKEND_URL = getEnv('VITE_BACKEND_URL');

interface Document {
    id: number;
    name: string;
    created_date: string;
}


interface DocManagerProps {
    authProps: AuthProps;
}

const DocumentManager: React.FC<DocManagerProps> = ({ authProps }) => {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [fileName, setFileName] = useState('');
    const [_selectedIds, setSelectedIds] = useState<string[]>([]);

    <TableCell>
        <Checkbox
            color="primary"
            inputProps={{ 'aria-label': 'secondary checkbox' }}
        />
    </TableCell>
    useEffect(() => {
        fetch(BACKEND_URL + '/api/documents',
            {
                credentials: 'include',
                headers: {
                    'Authorization': `Bearer ${authProps.token}`
                }
            }
        )
            .then((response) => response.json())
            .then((data) => setDocuments(data));
    }, []);

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>, documentId: string) => {
        if (event.target.checked) {
            setSelectedIds(prevIds => [...prevIds, documentId]);
        } else {
            setSelectedIds(prevIds => prevIds.filter(id => id !== documentId));
        }
    };

    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setFileName(file.name);
            // setFileSize(file.size);
        }
    };

    const handleSubmit = () => {
        if (fileName) {
            const fileInput = document.querySelector('input[type="file"]')as HTMLInputElement;
            if (fileInput && fileInput.files && (fileInput ).files.length > 0) {
                const file = fileInput.files[0];
                const formData = new FormData();
                formData.append('file', file);

                fetch(BACKEND_URL + '/api/documents', {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Authorization': `Bearer ${authProps.token}`
                    },
                    body: formData
                })
                    .then((response) => response.json())
                    .then((_data) => {
                        // Handle the response data
                    })
                    .catch((_error) => {
                        // Handle the error
                    });
            }
        }
    };

    return (
        <Container maxWidth="lg" style={{ paddingTop: '90px' }}>
            <div>
                <div style={{ display: 'flex', margin: 5, padding: 5, justifyContent: 'flex-end' }}>
                    <Button variant="contained" color="error" style={{ marginRight: 10 }} onClick={handleOpenDialog} startIcon={<DeleteIcon />}>
                        Delete
                    </Button>
                    <Button variant="contained" color="primary" onClick={handleOpenDialog} startIcon={<CloudUploadIcon />}>
                        Upload
                    </Button>
                </div>

                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell></TableCell>
                                <TableCell>ID</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Upload Timestamp</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {documents.map((document) => (
                                <TableRow key={document.id}>
                                    <TableCell>
                                        <Checkbox
                                            color="primary"
                                            inputProps={{ 'aria-label': 'secondary checkbox' }}
                                            onChange={(event) => handleCheckboxChange(event, ''+document.id)}
                                        />
                                    </TableCell>
                                    <TableCell>{document.id}</TableCell>
                                    <TableCell>{document.name}</TableCell>
                                    <TableCell>{document.created_date}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Dialog open={openDialog} onClose={handleCloseDialog}>
                    <DialogTitle>Upload Document</DialogTitle>
                    <DialogContent>
                        <Stack spacing={2}>
                            <TextField
                                label="File Name"
                                value={fileName}
                                onChange={(event) => setFileName(event.target.value)}
                            />
                            <input type="file" onChange={handleFileChange} />
                        </Stack>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={handleSubmit} color="primary">
                            Save
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        </Container>
    );
};

export default DocumentManager;