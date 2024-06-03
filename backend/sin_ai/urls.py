from django.urls import path
from sin_ai.views import UploadProductView, UploadQuestionView

urlpatterns = [
    path('upload/product/', UploadProductView.as_view(), name='upload_product'),
    path('upload/question/', UploadQuestionView.as_view(), name='upload_question'),
]
