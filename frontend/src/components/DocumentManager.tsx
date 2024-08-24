import React, { useState, useEffect } from "react";
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
  Container,
  Checkbox,
  Stack,
  Snackbar,
  Alert,
  IconButton,
  LinearProgress,
  AlertProps,
  DialogContentText,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import { AuthProps } from "../models";
import { getEnv } from "../utils/EnvUtil";
import { HelpOutline } from "@mui/icons-material";
const BACKEND_URL = getEnv("VITE_BACKEND_URL");

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
  const [openInfoDialog, setOpenInfoDialog] = useState(false);
  const [isSnackOpen, setIsSnackOpen] = React.useState<boolean>(false);
  const [snackErrorMsg, setSnackErrorMsg] = React.useState<string>("");
  const [fileName, setFileName] = useState("");
  const [_selectedIds, setSelectedIds] = useState<string[]>([]);
  const [reloadToggle, setReloadToggle] = useState<boolean>(false);
  const [snackSeverity, setSnackSeverity] = useState("error");
  const [isThinking, setIsThinking] = useState<boolean>(false);

  <TableCell>
    <Checkbox color="primary" inputProps={{ "aria-label": "secondary checkbox" }} />
  </TableCell>;

  useEffect(() => {
    fetch(BACKEND_URL + "/api/documents", {
      credentials: "include",
      headers: {
        Authorization: `Bearer ${authProps.token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setDocuments(data));
  }, [reloadToggle]);

  const handleSnackClose = () => {
    setIsSnackOpen(false);
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>, documentId: string) => {
    if (event.target.checked) {
      setSelectedIds((prevIds) => [...prevIds, documentId]);
    } else {
      setSelectedIds((prevIds) => prevIds.filter((id) => id !== documentId));
    }
  };

  const handleOpenDialog = () => {
    setIsThinking(false);

    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleCloseInfoDialog = () => {
    setOpenInfoDialog(false);
  };

  const handleOpenInfoDialog = () => {
    setOpenInfoDialog(true);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
    }
  };

  const handleSubmit = () => {
    setIsThinking(true);
    if (fileName) {
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput && fileInput.files && fileInput.files.length > 0) {
        const file = fileInput.files[0];
        const formData = new FormData();
        formData.append("file", file);

        fetch(BACKEND_URL + "/api/documents", {
          method: "POST",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${authProps.token}`,
          },
          body: formData,
        })
          .then((response) => response.json())
          .then((_data) => {
            // Handle the response data
            setOpenDialog(false);
            setReloadToggle(!reloadToggle);
            setIsSnackOpen(true);
            setSnackErrorMsg("Upload successful!");
            setIsThinking(true);

            setSnackSeverity("success");
          })
          .catch((error) => {
            console.log(error);
            setSnackErrorMsg("Network error occurred");
            setSnackSeverity("error");
            setIsSnackOpen(true);
            setOpenDialog(false);
            setIsThinking(false);
          });
      }
    }
  };

  const getUTCTimestamp = (dateIn: Date) => {
    const d = dateIn.toISOString().split("T");
    const date = d[0];
    const time = d[1].split(".")[0];

    return `${date} ${time}`;
  };

  return (
    <Container maxWidth="lg" style={{ paddingTop: "90px" }}>
      <Dialog
        open={openInfoDialog}
        onClose={handleCloseInfoDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Help"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            On this screen you can manage the documents Learny knows about. Once uploaded, you can chat with the AI
            about these documents by going to the Chat screen and toggling on DocChat in the AI menu.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseInfoDialog} autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <div>
        <div style={{ display: "flex", margin: 5, padding: 5, justifyContent: "space-between" }}>
          <IconButton onClick={handleOpenInfoDialog}>
            <HelpOutline />
          </IconButton>

          <div>
            <Button
              variant="contained"
              color="error"
              style={{ marginRight: 10 }}
              onClick={handleOpenDialog}
              startIcon={<DeleteIcon />}
            >
              Delete
            </Button>
            <Button variant="contained" color="primary" onClick={handleOpenDialog} startIcon={<CloudUploadIcon />}>
              Upload
            </Button>
          </div>
        </div>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Upload Timestamp</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {documents.map((document) => (
                <TableRow key={document.id}>
                  <TableCell>
                    <Checkbox
                      color="primary"
                      inputProps={{ "aria-label": "secondary checkbox" }}
                      onChange={(event) => handleCheckboxChange(event, "" + document.id)}
                    />
                  </TableCell>
                  <TableCell>{document.id}</TableCell>
                  <TableCell>{document.name}</TableCell>
                  <TableCell>TODO</TableCell>
                  <TableCell>{getUTCTimestamp(new Date(document.created_date))}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>Upload Document</DialogTitle>
          <DialogContent>
            <Stack spacing={2}>
              {!isThinking && <input type="file" onChange={handleFileChange} />}

              {isThinking && (
                <>
                  Processing document upload, this might take a minute or two...
                  <LinearProgress sx={{ marginTop: 2 }} />
                </>
              )}
            </Stack>
          </DialogContent>

          <DialogActions>
            <Button onClick={handleCloseDialog} color="primary" disabled={isThinking}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} color="primary" disabled={isThinking}>
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </div>

      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        open={isSnackOpen}
        autoHideDuration={6000}
        onClose={handleSnackClose}
        action={
          <>
            <IconButton size="small" aria-label="close" color="inherit" onClick={handleSnackClose}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </>
        }
      >
        <Alert
          onClose={handleSnackClose}
          severity={snackSeverity as AlertProps["severity"]}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackErrorMsg}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default DocumentManager;
