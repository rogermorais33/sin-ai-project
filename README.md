# Sin-AI

## How to run:
```bash
git clone https://github.com/rogermorais33/sin-ai-project.git
```

### Frontend
- Create .env.local file with corresponding credentials from .env.example
```bash
cd frontend
npm install 
npm start
```

### Backend
- Create .env file with corresponding credentials from .env.example
```bash
cd backend
pip install -r requirements.txt
python3 manage.py migrate
python3 manage.py runserver
```
