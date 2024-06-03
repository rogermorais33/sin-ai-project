from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser

from django.http import FileResponse
from django.conf import settings

import os
import environ 
import requests
import fitz
import re
import jinja2
import pdfkit
from os.path import abspath, dirname, join


env = environ.Env()

class UploadProductView(APIView):
    parser_classes = (MultiPartParser, FormParser)
    def post(self, request, *args, **kwargs):
        pdf_file = request.FILES.get('pdf')
        if not pdf_file:
            return Response({'error': 'No PDF file provided'}, status=status.HTTP_400_BAD_REQUEST)
        file_path = f'/tmp/{pdf_file.name}'
        with open(file_path, 'wb') as f:
            for chunk in pdf_file.chunks():\
                f.write(chunk)
        source_id = self.send_to_chatpdf_api(pdf_file.name)
        return Response({'message': 'PDF uploaded successfully', 'source_id': source_id}, status=status.HTTP_200_OK)
    
    def send_to_chatpdf_api(self, file_name):
        files = [
            ('file', ('file', open(f'/tmp/{file_name}', 'rb'), 'application/octet-stream'))
        ]
        headers = {
            'x-api-key': env('CHATPDF_API'),
        }
        response = requests.post('https://api.chatpdf.com/v1/sources/add-file', headers=headers, files=files)
        if response.status_code == 200:
            print('Source ID:', response.json()['sourceId'])
            return response.json()['sourceId']
        else:
            print('Status:', response.status_code)
            print('Error:', response.text)

class UploadQuestionView(APIView):
    parser_classes = (MultiPartParser, FormParser)
    def post(self, request, *args, **kwargs):
        pdf_file = request.FILES.get('pdf', '')
        source_id = request.data.get('source_id', '')
        product = request.data.get('product', '')
        description = request.data.get('description', '')
        if not pdf_file and not source_id:
            return Response({'error': 'No PDF question file provided'}, status=status.HTTP_400_BAD_REQUEST)
        file_path = f'/tmp/{pdf_file.name}'
        with open(file_path, 'wb') as f:
            for chunk in pdf_file.chunks():\
                f.write(chunk)
        
        text = self.read_pdf(file_path)
        questions = self.extract_questions(text)
        all_contents = []
        for i, question in enumerate(questions):
            if product:
                complete_question = f"Escreva a respostas sem desculpa, e sem com base nas informações, escreva de forma formal. O produto {product} {description}, com base nisso e no pdf, a minha pergunta seria: {question[1]}"
            else:
                complete_question = f"Escreva a respostas sem desculpa, e sem com base nas informações, escreva de forma formal. Com base no pdf, a minha pergunta é: {question[1]}"
            response = self.send_question(source_id, complete_question)
            all_contents.append((f"{question[0]}| {question[1]}", response))
        all_contents_path = "/tmp/all_contents.pdf"
        self.create_pdf_file(all_contents, all_contents_path)
        return FileResponse(open(all_contents_path, 'rb'), content_type='application/pdf')
    
    def create_pdf_file(self, contents, pdf_path):
        context = {}
        for i, (quest, res) in enumerate(contents):
            context[f"question{i+1}"] = f"{quest} <br/><br/> Resposta: {res}"
        template_loader = jinja2.FileSystemLoader(searchpath=os.path.join(settings.BASE_DIR, 'sin_ai/templates'))
        template_env = jinja2.Environment(loader=template_loader)
        html_template = 'base_file.html'
        template = template_env.get_template(html_template)
        output_text = template.render(context)
        options = {
            'encoding': 'UTF-8'
        }
        config = pdfkit.configuration(wkhtmltopdf='/usr/bin/wkhtmltopdf')
        pdfkit.from_string(output_text, pdf_path, configuration=config, options=options)

    def read_pdf(self, pdf_path):
        pdf_document = pdf_path
        document = fitz.open(pdf_document)
        text = ""
        for page_num in range(len(document)):
            page = document.load_page(page_num)
            text += page.get_text()
        return text

    def extract_questions(self, text):
        pattern = re.compile(r'(\d+\w?\n)([^\d\n]+)')
        matches = pattern.findall(text)
        questions = []
        for match in matches:
            question_number = match[0].strip()
            question_text = match[1].strip()
            questions.append((question_number, question_text))
        return questions


    def send_question(self, source_id, question):
        headers = {
            'x-api-key': env('CHATPDF_API'),
            "Content-Type": "application/json",
        }
        data = {
            'sourceId': source_id,
            'messages': [
                {
                    'role': "user",
                    'content': f"{question}",
                }
            ]
        }
        response = requests.post(
            'https://api.chatpdf.com/v1/chats/message', headers=headers, json=data)

        if response.status_code == 200:
            print('Result:', response.json()['content'])
            return response.json()['content']
        else:
            print('Status:', response.status_code)
            print('Error:', response.text)
