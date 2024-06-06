FROM python:3.10

WORKDIR /opt/server

COPY . .

RUN pip install -r api/requirements.txt

EXPOSE 8000

CMD ["python3", "sin_ai/manage.py", "runserver", "0.0.0.0:8000"]