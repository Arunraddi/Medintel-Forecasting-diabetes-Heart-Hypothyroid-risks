import React, { useState } from "react";
import {
  ChakraProvider, Box, Flex, Heading, Button, Input, FormControl, FormLabel,
  VStack, Select, Text, extendTheme, ColorModeScript, SimpleGrid
} from "@chakra-ui/react";
import axios from "axios";
import Chatbot from "./Chatbot";

// Dark theme config
const theme = extendTheme({
  config: {
    initialColorMode: "dark",
    useSystemColorMode: false,
  },
  styles: {
    global: {
      body: {
        bg: "gray.900",
        color: "gray.100",
      },
    },
  },
  colors: {
    brand: {
      100: "#B2F5EA",
      500: "#319795",
      700: "#234E52",
    },
  },
});

const diseaseForms = {
  diabetes: [
    { name: "Pregnancies", label: "Number of Pregnancies" },
    { name: "Glucose", label: "Glucose Level (mg/dL)" },
    { name: "BloodPressure", label: "Blood Pressure (mm Hg)" },
    { name: "SkinThickness", label: "Skin Thickness (mm)" },
    { name: "Insulin", label: "Insulin Level (μU/ml)" },
    { name: "BMI", label: "BMI (kg/m²)" },
    { name: "DiabetesPedigreeFunction", label: "Diabetes Pedigree Function" },
    { name: "Age", label: "Age (years)" }
  ],
  heart: [
    { name: "age", label: "Age" },
    { name: "sex", label: "Sex (0=F, 1=M)" },
    { name: "cp", label: "Chest Pain Type (0-3)" },
    { name: "trestbps", label: "Resting Blood Pressure" },
    { name: "chol", label: "Serum Cholesterol" },
    { name: "fbs", label: "Fasting Blood Sugar > 120 mg/dl (0/1)" },
    { name: "restecg", label: "Resting ECG (0-2)" },
    { name: "thalach", label: "Max Heart Rate" },
    { name: "exang", label: "Exercise Induced Angina (0/1)" },
    { name: "oldpeak", label: "ST Depression" },
    { name: "slope", label: "Slope (0-2)" },
    { name: "ca", label: "Major Vessels (0-3)" },
    { name: "thal", label: "Thal (1=normal, 2=fixed, 3=reversible)" }
  ],
  thyroid: [
    { name: "age", label: "Age" },
    { name: "sex", label: "Sex (0=F, 1=M)" },
    { name: "on_thyroxine", label: "On Thyroxine (0/1)" },
    { name: "tsh", label: "TSH" },
    { name: "t3_measured", label: "T3 Measured (0/1)" },
    { name: "t3", label: "T3" },
    { name: "tt4", label: "TT4" }
  ]
};

const diseaseNames = {
  diabetes: "Diabetes",
  heart: "Heart Disease",
  thyroid: "Hypo-Thyroid"
};

function App() {
  const [disease, setDisease] = useState("diabetes");
  const [form, setForm] = useState({});
  const [result, setResult] = useState(null);
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleDiseaseChange = (e) => {
    setDisease(e.target.value);
    setForm({});
    setResult(null);
    setTips([]);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResult(null);
    setTips([]);
    setError("");
    setLoading(true);
    try {
      const res = await axios.post(
        `http://localhost:4000/api/predict/${disease}`,
        form
      );
      setResult(res.data.prediction);
      setTips(res.data.tips || []);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode="dark" />
      <Flex minH="100vh" bg="gray.900">
        {/* Sidebar */}
        <Box w={{ base: "100%", md: "320px" }} bg="gray.800" borderRight="1px solid #2D3748" p={8} minH="100vh">
          <Heading mb={10} fontSize="2xl" color="teal.300" letterSpacing="tight">
            MedPredict AI
          </Heading>
          <VStack align="stretch" spacing={4}>
            <Select value={disease} onChange={handleDiseaseChange} bg="gray.700" color="teal.200" borderColor="teal.600">
              {Object.keys(diseaseNames).map((key) => (
                <option key={key} value={key} style={{ color: "#234E52" }}>
                  {diseaseNames[key]}
                </option>
              ))}
            </Select>
            <Text mt={10} fontSize="sm" color="gray.400">
              Need assistance? Contact our support team for help with predictions.
            </Text>
          </VStack>
        </Box>
        {/* Main Content */}
        <Flex flex="1" align="center" justify="center" minH="100vh">
          <Box
            bg="gray.800"
            p={{ base: 6, md: 10 }}
            borderRadius="2xl"
            minW={{ base: "90vw", md: "700px" }}
            maxW="900px"
            boxShadow="2xl"
            width="100%"
          >
            <Heading color="teal.300" mb={6} textAlign="center" fontWeight="bold" fontSize="2xl" letterSpacing="tight">
              {diseaseNames[disease]} Prediction
            </Heading>
            <form onSubmit={handleSubmit}>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mb={4}>
                {diseaseForms[disease].map((field) => (
                  <FormControl key={field.name} isRequired>
                    <FormLabel color="teal.200" fontWeight="semibold">{field.label}</FormLabel>
                    <Input
                      name={field.name}
                      value={form[field.name] || ""}
                      onChange={handleChange}
                      bg="gray.700"
                      color="teal.100"
                      borderColor="teal.600"
                      _placeholder={{ color: "gray.400" }}
                      placeholder={field.label}
                    />
                  </FormControl>
                ))}
              </SimpleGrid>
              <Button
                colorScheme="teal"
                size="lg"
                type="submit"
                w="100%"
                mt={2}
                isLoading={loading}
              >
                Analyze & Predict
              </Button>
            </form>
            {error && (
              <Box mt={6} p={4} bg="red.900" color="red.200" borderRadius="md" textAlign="center" fontWeight="semibold">
                {error}
              </Box>
            )}
            {result !== null && !error && (
              <Box mt={8} p={6} bg={result === 1 ? "red.700" : "teal.700"} color="white" borderRadius="lg" textAlign="center">
                <Heading size="md" fontWeight="bold">
                  {result === 1
                    ? `⚠️ High Risk Detected`
                    : `✅ No Risk Detected`}
                </Heading>
                <Text mt={2} fontWeight="medium">
                  {result === 1
                    ? "Please consult a healthcare provider for further evaluation."
                    : "Continue maintaining a healthy lifestyle!"}
                </Text>
              </Box>
            )}
            {tips && tips.length > 0 && (
              <Box mt={4} p={4} bg="teal.900" color="teal.100" borderRadius="md">
                <Text fontWeight="bold" mb={2}>Personalized Health Tips:</Text>
                <VStack align="start" spacing={1}>
                  {tips.map((tip, idx) => (
                    <Text key={idx}>• {tip}</Text>
                  ))}
                </VStack>
              </Box>
            )}
          </Box>
        </Flex>
      </Flex>
      <Chatbot />
    </ChakraProvider>
  );
}

export default App;
