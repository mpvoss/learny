import React, { useEffect, useState } from "react";
import { Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getEnv } from "../utils/EnvUtil";
import { AuthProps, Discussion } from "../models";
import ScaleLoader from "react-spinners/ScaleLoader";
const BACKEND_URL = getEnv("VITE_BACKEND_URL");

interface ChatWelcomeProps {
  authProps: AuthProps;
}

const ChatWelcome: React.FC<ChatWelcomeProps> = ({ authProps }) => {
  const [buttonData, setButtonData] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);
    fetch(BACKEND_URL + "/api/discussions/suggest", {
      method: "POST",
      credentials: "include",
      headers: {
        Authorization: `Bearer ${authProps.token}`,
      },
    })
      .then((result) => result.json())
      .then((data) => {
        setButtonData(data.questions);
      })
      .then(() => setIsLoading(false));
  }, []);

  const handleTopicSelect = (topic: string) => {
    fetch(BACKEND_URL + "/api/discussions", {
      method: "POST",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${authProps.token}`,
      },
      body: JSON.stringify({ topic: topic }),
    })
      .then((result) => result.json())

      .then((data: Discussion) => {
        navigate(`/chats/${data.id}`, {
          state: { firstMessage: "Can you tell me more about the following: " + topic },
        });
      });
  };

  const colors = ["#FFFF00", "#22CAE0", "#FFC5D0", "#E7F2F8"];
  return (
    <>
      <Typography variant="h6">Ask me anything, or click one of the topics below to learn more</Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: { sm: "column", md: "row" },
          justifyContent: "space-between",
          flexWrap: "wrap",
        }}
      >
        {isLoading && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              width: "100%",
            }}
          >
            <ScaleLoader width={10} color="grey" speedMultiplier={0.7} />
          </Box>
        )}
        {!isLoading &&
          buttonData &&
          buttonData.map((buttonText, index) => (
            <Box
              key={index}
              sx={{
                width: {
                  sm: "100%",
                  md: "30%",
                },
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                whiteSpace: "normal",
                wordWrap: "break-word",
                margin: "10px",
                padding: "10px",
                border: "2px solid lightgrey",
                borderRadius: "10px",
                cursor: "pointer",
                backgroundImage: `linear-gradient(45deg, ${colors[index % colors.length]}, ${
                  colors[(index + 1) % colors.length]
                })`, 
              }}
              onClick={() => {
                handleTopicSelect(buttonText);
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: "bold", textShadow: "1px 1px 2px white" }}>
                {buttonText}
              </Typography>
            </Box>
          ))}
      </Box>
    </>
  );
};

export default ChatWelcome;
