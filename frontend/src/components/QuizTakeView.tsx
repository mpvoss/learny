import React, { useEffect, useState } from "react";
import { getEnv } from "../utils/EnvUtil";
import {
  Card,
  CardContent,
  Container,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
const BACKEND_URL = getEnv("VITE_BACKEND_URL");

const QuizTakeView: React.FC = () => {
  const [quizData, setQuizData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(BACKEND_URL + "/api/quizzes/1");
        const data = await response.json();
        setQuizData(data);
      } catch (error) {
        console.error("Error fetching quiz data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <Container maxWidth="lg" style={{ paddingTop: "90px" }}>
      {quizData.map((quizItem, index) => (
        <Card key={index} style={{ marginBottom: "20px" }}>
          <CardContent>
            <Typography variant="h6" align="left">
              {quizItem.question}
            </Typography>
            <FormControl component="fieldset" fullWidth>
              <RadioGroup>
                <FormControlLabel
                  style={{ textAlign: "left" }}
                  key={quizItem.question}
                  value={quizItem.wrong1}
                  control={<Radio />}
                  label={quizItem.wrong1}
                />
                <FormControlLabel
                  style={{ textAlign: "left" }}
                  key={quizItem.question}
                  value={quizItem.wrong2}
                  control={<Radio />}
                  label={quizItem.wrong2}
                />
                <FormControlLabel
                  style={{ textAlign: "left" }}
                  key={quizItem.question}
                  value={quizItem.wrong3}
                  control={<Radio />}
                  label={quizItem.wrong3}
                />
                <FormControlLabel
                  style={{ textAlign: "left" }}
                  key={quizItem.question}
                  value={quizItem.answer}
                  control={<Radio />}
                  label={quizItem.answer}
                />
              </RadioGroup>
            </FormControl>
          </CardContent>
        </Card>
      ))}
    </Container>
  );
};

export default QuizTakeView;
