import {
  Button,
  Checkbox,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";

interface Quiz {
  id: number;
  name: string;
  highestScore: number;
  lastTaken: string;
}

const QuizListView: React.FC = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [_selectedIds, setSelectedIds] = useState<string[]>([]);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>, documentId: string) => {
    if (event.target.checked) {
      setSelectedIds((prevIds) => [...prevIds, documentId]);
    } else {
      setSelectedIds((prevIds) => prevIds.filter((id) => id !== documentId));
    }
  };

  const handleOpenDialog = () => {};

  useEffect(() => {
    setQuizzes([
      {
        id: 1,
        name: "Quiz 1",
        highestScore: 10,
        lastTaken: "2021-10-01",
      },
      {
        id: 2,
        name: "Quiz 2",
        highestScore: 20,
        lastTaken: "2021-10-02",
      },
    ]);
  }, []);

  return (
    <Container maxWidth="lg" style={{ paddingTop: "90px" }}>
      <div>
        <div style={{ display: "flex", margin: 5, padding: 5, justifyContent: "flex-end" }}>
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
            Create
          </Button>
        </div>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Highest Score</TableCell>
                <TableCell>Last Taken</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {quizzes.map((quiz, _index) => (
                <TableRow key={quiz.id}>
                  <TableCell>
                    <Checkbox
                      color="primary"
                      inputProps={{ "aria-label": "secondary checkbox" }}
                      onChange={(event) => handleCheckboxChange(event, "" + quiz.id)}
                    />
                  </TableCell>
                  <TableCell>{quiz.name}</TableCell>
                  <TableCell>{quiz.highestScore}</TableCell>
                  <TableCell>{quiz.lastTaken}</TableCell>
                  <TableCell>
                    <Button variant="contained" color="primary" href="/quizzes/1">
                      Go to Quiz
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </Container>
  );
};

export default QuizListView;
