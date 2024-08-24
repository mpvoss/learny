import React, { useState, useEffect } from "react";
import { Card, CardContent, Button, Typography, Container, Box, DialogActions, DialogContentText } from "@mui/material";
import { useLocation } from "react-router-dom";
import { Divider } from "@mui/material";
import { AuthProps, Flashcard } from "../models";
import { getEnv } from "../utils/EnvUtil";
const BACKEND_URL = getEnv("VITE_BACKEND_URL");
import { LinearProgress } from "@mui/material";
import { Dialog, DialogTitle, DialogContent, IconButton } from "@mui/material";
import { HelpOutline } from "@mui/icons-material";
import ScaleLoader from "react-spinners/ScaleLoader";

const cardStyle = {
  backgroundColor: "#F5F5F5", // light gray
  border: "1px solid #DDD", // light border
  boxShadow: "5px 5px 15px rgba(0, 0, 0, 0.3)", // shadow for 3D effect
  borderRadius: "15px", // rounded corners
  width: "100%",
  marginTop: "200px",
};

interface FlashcardComponentProps {
  authProps: AuthProps;
}

const FlashcardComponent: React.FC<FlashcardComponentProps> = ({ authProps }) => {
  const location = useLocation();
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showDefinition, setShowDefinition] = useState(false);
  const [_selectedTags, setSelectedTags] = useState<string>();
  const [openDialog, setOpenDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [reviewAll, setReviewAll] = useState(false);
  const [reloadToggle, setReloadToggle] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const queryParams = new URLSearchParams(location.search);
    const tagsFromQueryParams = queryParams.getAll("tag");

    const tagsString = tagsFromQueryParams.length >= 2 ? tagsFromQueryParams.join(", ") : tagsFromQueryParams[0];
    setSelectedTags(tagsString);

    fetch(BACKEND_URL + "/api/flashcards?" + (reviewAll ? "" : "due_filter=true&") + queryParams.toString(), {
      credentials: "include",
      headers: {
        Authorization: `Bearer ${authProps.token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setFlashcards(data))
      .then(() => setCurrentCardIndex(0))
      .then(() => setIsLoading(false))
      .catch((error) => console.error("Error:", error));
  }, [reloadToggle]);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleReviewAnyway = () => {
    setReviewAll(true);
    setReloadToggle(!reloadToggle);
  };

  const handleButtonClick = (flashcardId: number, score: number) => {
    // Wrong answer, put it back in deck, no need to update the backend
    if (score == 0) {
      const newFlashcards = [...flashcards];
      newFlashcards[currentCardIndex].didForget = true;
      if (currentCardIndex < flashcards.length - 1) {
        [newFlashcards[currentCardIndex], newFlashcards[currentCardIndex + 1]] = [
          newFlashcards[currentCardIndex + 1],
          newFlashcards[currentCardIndex],
        ];
      }
      setFlashcards(newFlashcards);
      setShowDefinition(false);
      return;
    }

    // If the user messed up before getting it right, reflect that.
    if (flashcards[currentCardIndex].didForget) {
      score = 1;
    }

    fetch(`${BACKEND_URL}/api/flashcards/${flashcardId}/review`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authProps.token}`,
      },
      body: JSON.stringify({ quality: score }),
    })
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => console.error("Error:", error));

    setCurrentCardIndex((prevIndex) => prevIndex + 1);
    setShowDefinition(false);
  };

  const currentCard = flashcards[currentCardIndex];

  return (
    <Container maxWidth="lg" style={{ paddingTop: "90px" }}>
      {isLoading && (
        <>
          <ScaleLoader width={10} color="grey" speedMultiplier={0.7} />
        </>
      )}

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Help"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            After you answer a flashcard, you'll rate your confidence in the answer using four levels: IDK, HARD, OK,
            and EASY
            <br></br>
            <br></br>
            Learny uses your response to intelligently schedule when this card should appear next in your study session.
            The better you know the answer, the longer Learny will wait to show you the card again. If you're less sure,
            you'll see it sooner. This method helps to optimize your learning efficiency by focusing on cards you need
            more practice with.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {!isLoading && flashcards.length > 0 && (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            {/* <Button variant="outlined" to="/flashcards" component={Link}>Back</Button> */}
            {/* <div>
                    {selectedTags && selectedTags.split(',').map((tag, index) => (
                       <Chip key={index} label={tag} color="primary" style={{ margin: '5px' }} />
                    ))}
                    </div> */}
            {/* <Typography color='black'>Selected: {selectedTags}</Typography> */}

            <IconButton onClick={handleOpenDialog}>
              <HelpOutline />
            </IconButton>
            <Typography color="grey">
              {currentCardIndex}/{flashcards.length}
            </Typography>
          </div>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box sx={{ width: "100%", mr: 1 }}>
              <LinearProgress
                variant="determinate"
                sx={{ height: 10, borderRadius: 5 }}
                value={(currentCardIndex / flashcards.length) * 100}
                style={{ marginTop: 15, paddingTop: 3 }}
              />
            </Box>
          </Box>

          {currentCardIndex < flashcards.length && (
            <Card style={cardStyle}>
              <CardContent>
                <div>{currentCard.term}</div>

                {!showDefinition && (
                  <div>
                    <Button
                      style={{ margin: "5px", marginTop: "20px" }}
                      color="primary"
                      variant="outlined"
                      onClick={() => setShowDefinition(!showDefinition)}
                    >
                      Show Answer
                    </Button>
                  </div>
                )}

                {showDefinition && (
                  <div>
                    <Divider style={{ margin: "5px 0" }} />
                    {currentCard.description}
                    <br></br>
                    <Button
                      style={{ margin: "5px" }}
                      color="error"
                      variant="contained"
                      onClick={() => handleButtonClick(currentCard.id, 0)}
                    >
                      IDK
                    </Button>
                    <Button
                      style={{ margin: "5px" }}
                      color="secondary"
                      variant="outlined"
                      onClick={() => handleButtonClick(currentCard.id, 3)}
                    >
                      HARD
                    </Button>
                    <Button
                      style={{ margin: "5px" }}
                      color="primary"
                      variant="outlined"
                      onClick={() => handleButtonClick(currentCard.id, 4)}
                    >
                      OK
                    </Button>
                    <Button
                      style={{ margin: "5px" }}
                      color="success"
                      variant="contained"
                      onClick={() => handleButtonClick(currentCard.id, 5)}
                    >
                      EASY
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </>
      )}

      {((!isLoading && flashcards.length === 0) || (!isLoading && flashcards.length == currentCardIndex)) && (
        <>
          <Typography style={{ marginTop: "100px" }}>
            All cards that are due have been reviewed. Click below to study review them again.
          </Typography>
          <Button variant="contained" color="primary" onClick={handleReviewAnyway}>
            Continue
          </Button>
        </>
      )}
    </Container>
  );
};

export default FlashcardComponent;
