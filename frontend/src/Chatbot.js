import React, { useState, useRef, useEffect } from "react";
import {
  Box, IconButton, Input, VStack, Text, HStack, useColorModeValue
} from "@chakra-ui/react";
import { ChatIcon, CloseIcon } from "@chakra-ui/icons";
import { GoogleGenerativeAI } from "@google/generative-ai";

 // Replace with your Gemini key

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const chatBg = useColorModeValue("white", "gray.800");
  const chatColor = useColorModeValue("gray.800", "gray.100");
  const inputBg = useColorModeValue("gray.100", "gray.700");
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi! How can I help you with your health queries today?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (open && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, open]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    setMessages([...messages, { from: "user", text: input }]);
    setLoading(true);
    setInput("");
    try {
      const res = await fetch("http://localhost:5001/api/gemini-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ history: messages, input })
      });
      const data = await res.json();
      setMessages(msgs => [...msgs, { from: "bot", text: data.reply }]);
    } catch (e) {
      setMessages(msgs => [
        ...msgs,
        { from: "bot", text: "Sorry, I couldn't process your request." }
      ]);
    }
    setLoading(false);
  };

  return (
    <>
      <Box position="fixed" bottom={6} right={6} zIndex={1000}>
        {!open && (
          <IconButton
            icon={<ChatIcon />}
            colorScheme="teal"
            borderRadius="full"
            size="lg"
            onClick={() => setOpen(true)}
            aria-label="Open chat"
            boxShadow="lg"
          />
        )}
        {open && (
          <Box
            bg={chatBg}
            color={chatColor}
            borderRadius="xl"
            boxShadow="2xl"
            p={4}
            w="350px"
            h="400px"
            display="flex"
            flexDirection="column"
          >
            <HStack justify="space-between" mb={2}>
              <Text fontWeight="bold" color="teal.400">HealthBot</Text>
              <IconButton
                icon={<CloseIcon />}
                size="sm"
                variant="ghost"
                onClick={() => setOpen(false)}
                aria-label="Close chat"
              />
            </HStack>
            <VStack
              align="stretch"
              spacing={2}
              flex="1"
              overflowY="auto"
              mb={2}
              px={1}
            >
              {messages.map((msg, idx) => (
                <Box
                  key={idx}
                  alignSelf={msg.from === "user" ? "flex-end" : "flex-start"}
                  bg={msg.from === "user" ? "teal.600" : "gray.700"}
                  color="white"
                  px={3}
                  py={2}
                  borderRadius="lg"
                  maxW="80%"
                  fontSize="sm"
                >
                  {msg.text}
                </Box>
              ))}
              <div ref={chatEndRef} />
            </VStack>
            <HStack>
              <Input
                placeholder="Type your question..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && sendMessage()}
                isDisabled={loading}
                bg={inputBg}
              />
              <IconButton
                icon={<ChatIcon />}
                colorScheme="teal"
                onClick={sendMessage}
                isLoading={loading}
                aria-label="Send"
              />
            </HStack>
          </Box>
        )}
      </Box>
    </>
  );
}
