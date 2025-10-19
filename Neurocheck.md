# **Functionality of the Neurocheck Web Application**

The **Neurocheck** web application is designed for **automated prediction of neurological disorders** (_Depression_, _ME/CFS_, _Both_) using **machine learning** and an integrated **chatbot** for explaining results.
The app includes **user authentication** and a **history of predictions**.

Below is a detailed description of the **paths** and their functionality:

---

## **1. /sign-up and /sign-in**

- Pages for **user registration and authentication**.
- **Purpose:** to protect application features related to prediction and history saving.
- A non-authenticated user:

  - Cannot perform diagnosis.
  - Their results are **not saved** in the database.

---

## **2. /home**

- The **landing page** of the application.
- Contains:

  - General information about the service and its capabilities.
  - A **“Start Diagnosis”** button that redirects the user to the `/diagnosis` page.

- **Purpose:** to introduce the user to the service and provide easy navigation to testing.

---

## **3. /diagnosis**

- Page for **collecting user symptom data**.
- Contains an **interactive form** for entering the features used by the ML model.
- At the end of the test, there is a **“Get Prediction”** button that:

  - Calls the **ML model** via **FastAPI**.
  - Redirects the user to the `/results` page with the obtained prediction.

- **Purpose:** to gather all necessary data for an accurate prediction.

---

## **4. /results**

- Page for **displaying the model’s prediction**.
- Contains:

  - The main **diagnosis result** (`Depression`, `ME/CFS`, `Both`).
  - The **prediction confidence score**.
  - A **“Explain Results”** button leading to the `/chat` page for detailed consultation via **Gemini Pro**.
  - A **“Save to History”** button that saves the result in the user’s **PostgreSQL database**.

- **Purpose:** to provide the user with a clear and informative prediction outcome.

---

## **5. /chat**

- Page with an **integrated chatbot** based on the **Gemini Pro API**.
- Features:

  - The user can ask questions about their prediction.
  - The bot responds **only regarding the prediction and symptoms**, refusing to answer unrelated queries.

- **Purpose:** to explain the prediction to the user and help them understand which symptoms influenced the result.

---

## **6. /history**

- Page for **viewing the history** of all previous user tests.
- Contains:

  - Date and time of each test.
  - Entered symptoms.
  - Prediction result and confidence.

- Additional features (optional):

  - Sorting or filtering results.
  - Exporting history to **CSV**.

- **Purpose:** to track the dynamics of changes in results and maintain a personal record of diagnostic tests.

---
