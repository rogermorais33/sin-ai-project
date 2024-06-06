from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.tokens import RefreshToken, UntypedToken

from django.http import FileResponse
from django.conf import settings
from django.contrib.auth import authenticate
from django.middleware import csrf

from .serializers import UserSerializer

import os
import environ 
import requests
import fitz
import re
import jinja2
import pdfkit
import asyncio
import aiohttp

env = environ.Env()


from django.http import JsonResponse

def set_cookie_view(request):
    response = JsonResponse({"message": "Cookie set successfully"})
    response.set_cookie('meu_cookie', 'valor_do_cookie', httponly=True)
    return response

class UserCreateView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LogoutView(APIView):
    def post(self, request):
        access_token = request.COOKIES.get('access_token')
        result = token_validation(access_token)
        if result != 400 and result != 401:
            response = Response({'detail': 'Logout successful'}, status=status.HTTP_200_OK)
            response.delete_cookie('access_token')
            return response
        elif result == 401:
            return Response({"error": "Invalid token."}, status=status.HTTP_401_UNAUTHORIZED)
        return Response({"error": "Token not provided"}, status=status.HTTP_400_BAD_REQUEST)

class IsAuthenticatedView(APIView):
    def get(self, request):
        access_token = request.COOKIES.get('access_token')
        result = token_validation(access_token)
        if result != 400 and result != 401:
            response = Response({'isAuthenticated': True}, status=status.HTTP_200_OK)
            return response
        elif result == 401:
            return Response({"error": "Invalid token."}, status=status.HTTP_401_UNAUTHORIZED)
        return Response({"error": "Token not provided"}, status=status.HTTP_400_BAD_REQUEST)


def token_validation(access_token):
    if access_token:
        try:
            untyped_token = UntypedToken(access_token)
            decoded = untyped_token.payload
            return decoded
        except:
            return 401
    return 400

class UploadProductView(APIView):
    parser_classes = (MultiPartParser, FormParser)
    def post(self, request, *args, **kwargs):
        access_token = request.COOKIES.get('access_token')
        print("ACESSSS_TOKEN?", access_token)
        print("PDFSSSSSS", request.FILES.get('pdf'))
        result = token_validation(access_token)
        if result != 400 and result != 401:
            pdf_file = request.FILES.get('pdf')
            if not pdf_file:
                return Response({'error': 'No PDF file provided'}, status=status.HTTP_400_BAD_REQUEST)
            file_path = f'/tmp/{pdf_file.name}'
            with open(file_path, 'wb') as f:
                for chunk in pdf_file.chunks():\
                    f.write(chunk)
            source_id = self.send_to_chatpdf_api(pdf_file.name)
            return Response({'message': 'PDF uploaded successfully', 'source_id': source_id}, status=status.HTTP_200_OK)
        elif result == 401:
            return Response({"error": "Invalid token."}, status=status.HTTP_401_UNAUTHORIZED)
        return Response({"error": "Token not provided"}, status=status.HTTP_400_BAD_REQUEST)
    
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
        access_token = request.COOKIES.get('access_token')
        result = token_validation(access_token)
        if result != 400 and result != 401:
            pdf_file = request.FILES.get('pdf', '')
            source_id = request.data.get('source_id', '')
            product = request.data.get('product', '')
            description = request.data.get('description', '')
            if not pdf_file and not source_id:
                return Response({'error': 'No PDF question file provided'}, status=status.HTTP_400_BAD_REQUEST)
            file_path = f'/tmp/{pdf_file.name}'
            with open(file_path, 'wb') as f:
                for chunk in pdf_file.chunks():
                    f.write(chunk)
            text = self.read_pdf(file_path)
            questions = self.extract_questions(text)
            all_contents = []
            responses = asyncio.run(self.call_chatpdf_api(questions, product, description, source_id))
            for i, question in enumerate(questions):
                all_contents.append((f"{question[0]}| {question[1]}", responses[i]["content"]))
            all_contents_path = "/tmp/all_contents.pdf"
            self.create_pdf_file(all_contents, all_contents_path)
            return FileResponse(open(all_contents_path, 'rb'), content_type='application/pdf')
        elif result == 401:
            return Response({"error": "Invalid token."}, status=status.HTTP_401_UNAUTHORIZED)
        return Response({"error": "Token not provided"}, status=status.HTTP_400_BAD_REQUEST)
    
    async def call_chatpdf_api(self, questions, product, description, source_id):
        tasks = []
        for i, question in enumerate(questions):
            if product:
                complete_question = f"Escreva a respostas sem desculpa, e sem com base nas informações, escreva de forma formal. O produto {product} {description}, com base nisso e no pdf, a minha pergunta seria: {question[1]}"
            else:
                complete_question = f"Escreva a respostas sem desculpa, e sem com base nas informações, escreva de forma formal. Com base no pdf, a minha pergunta é: {question[1]}"
            tasks.append(self.send_question(source_id, complete_question))
        responses = await asyncio.gather(*tasks)
        return responses
    
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

    async def send_question(self, source_id, question):
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
        async with aiohttp.ClientSession() as session:
            async with session.post('https://api.chatpdf.com/v1/chats/message', headers=headers, json=data) as response:
                if response.status == 200:
                    result = await response.json()
                    print('Result:', result['content'])
                    return result
                else:
                    print('Status:', response.status)
                    print('Error:', await response.text)
                    return None

def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

class CookieTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        username = request.data.get("username")
        password = request.data.get("password")
        user = authenticate(username=username, password=password)
        if user is not None:
            if user.is_active:
                data = get_tokens_for_user(user)
                response.set_cookie(
                    key = settings.SIMPLE_JWT['AUTH_COOKIE'],
                    value = data.get("access"),
                    expires=60*60*1,
                    secure = settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
                    httponly = settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
                    samesite = settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE']
                )
                csrf.get_token(request)
                response.data = {"Success": "Login successfully", "data": data}
                return response
            else:
                return Response({"No active" : "This account is not active!!"}, status=status.HTTP_404_NOT_FOUND)
        else: 
            return Response({"message": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)

class CookieTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        refresh_token = request.COOKIES.get('refresh_token')
        if refresh_token:
            try:
                refresh = RefreshToken(refresh_token)
                access_token = refresh.access_token
                response = super().post(request, *args, **kwargs)

                response.set_cookie(
                    key = settings.SIMPLE_JWT['AUTH_COOKIE'],
                    value = str(access_token),
                    expires=60*60*24,
                    secure = settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
                    httponly = settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
                    samesite = settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE']
                )
                return response
            except Exception as e: 
                return Response({"message": "Token invalid or expired"}, status=status.HTTP_400_BAD_REQUEST)
        return Response({"Error": "No refresh token provided"}, status=status.HTTP_400_BAD_REQUEST)
