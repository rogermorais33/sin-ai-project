# Sin-AI

## Description
Sin-AI is a project that allows uploading a product file and a questions file. The system sends the product file to the ChatPDF API and the questions to the corresponding API. Then, it returns a PDF with the answers to the provided questions.

## Features
- **File Upload:** Upload a product file and a questions file.
- **Data Processing:** The product file is sent to the ChatPDF API, while the questions are sent to the questions API.
- **Answers Generation:** Receive a PDF with the answers generated based on the submitted questions.

## How to Run

### Clone the Repository
```bash
git clone https://github.com/rogermorais33/sin-ai-project.git
```

### Frontend Setup
1. Create a `.env` file with the corresponding credentials from `.env.example`.
2. Navigate to the frontend directory:
    ```bash
    cd frontend
    ```
3. Install dependencies:
    ```bash
    npm install
    ```
4. Start the frontend server:
    ```bash
    npm start
    ```

### Backend Setup
1. Create a `.env` file with the corresponding credentials from `.env.example`.
2. Navigate to the backend directory:
    ```bash
    cd backend
    ```
3. Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```
4. Run database migrations:
    ```bash
    python3 manage.py migrate
    ```
5. Start the backend server:
    ```bash
    python3 manage.py runserver
    ```

## Project Structure
- **frontend:** Contains the frontend code of the application.
- **backend:** Contains the backend code of the application.
- **.env.example:** Example environment configuration file.

## Technologies Used

### Frontend
- **React:** A JavaScript library for building user interfaces.
- **React Router DOM:** Declarative routing for React.
- **Material-UI:** A popular React UI framework for building responsive and customizable user interfaces.
  - **@mui/material:** Material-UI core components.
  - **@mui/icons-material:** Material-UI icons.
- **Axios:** A promise-based HTTP client for the browser and Node.js.

### Backend
- **Django:** A high-level Python web framework that encourages rapid development and clean, pragmatic design.
- **Django REST Framework:** A powerful and flexible toolkit for building Web APIs in Django.
- **Django CORS Headers:** A Django application for handling CORS headers.
- **Django Environ:** Environment variables for Django applications.
- **Aiohttp:** An asynchronous HTTP client/server framework for asyncio.
- **PyMuPDF:** A Python binding for the MuPDF library, enabling PDF processing capabilities.
- **pdfkit:** A Python wrapper for the wkhtmltopdf tool, used for converting HTML to PDF.
- **Psycopg2-binary:** PostgreSQL adapter for Python.

### Other Tools
- **wkhtmltopdf:** A command-line tool to convert HTML to PDF using the WebKit rendering engine.
