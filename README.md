# Medintel-Forecasting-diabetes-Heart-Hypothyroid-risks" 

MedIntel AI is a full-stack web application that predicts the risk of Diabetes, Heart Disease, and Hypo-Thyroid using machine learning models. The system consists of a React frontend, a Node.js/Express backend, and a Python Flask-based ML service.

---

## Project Structure

```
updated mini project/
  backend/         # Node.js/Express API server
  frontend/        # React + Chakra UI frontend
  ml_service/      # Python Flask ML API and models
```

---

## 1. ML Service (Python/Flask)

**Location:** `ml_service/`

- Serves ML models for diabetes, heart disease, and thyroid prediction.
- Exposes `/predict/<disease>` endpoint.
- Loads models from `.sav` files.

### Setup & Run
```bash
cd ml_service
pip install flask numpy
python app.py
```
- Service runs on `http://localhost:5000`

---

## 2. Backend API (Node.js/Express)

**Location:** `backend/`

- Forwards prediction requests from frontend to ML service.
- Handles CORS and JSON parsing.

### Setup & Run
```bash
cd backend
npm install
node index.js
```
- Server runs on `http://localhost:4000`

---

## 3. Frontend (React + Chakra UI)

**Location:** `frontend/`

- User interface for entering health data and viewing predictions.
- Communicates with backend at `http://localhost:4000/api/predict/:disease`

### Setup & Run
```bash
cd frontend
npm install
npm start
```
- App runs on `http://localhost:3000`

---

## Usage
1. Start the ML service, backend, and frontend (in separate terminals).
2. Open [http://localhost:3000](http://localhost:3000) in your browser.
3. Select a disease, fill in the form, and click "Analyze & Predict".
4. View risk prediction and personalized health tips.

---

## Troubleshooting
- **react-scripts not found:**
  - Delete `node_modules` and `package-lock.json` in `frontend/`, then run `npm install` again.
- **ML service connection errors:**
  - Ensure `ml_service/app.py` is running on port 5000.
- **Port conflicts:**
  - Make sure ports 3000 (frontend), 4000 (backend), and 5000 (ML service) are free.
- **Dependency issues:**
  - Use compatible Node.js (v14–18) and Python (3.7+).

---

## License
This project is for educational purposes. 
