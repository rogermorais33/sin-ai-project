from django.urls import path
from sin_ai.views import UploadProductView, UploadQuestionView, UserCreateView, CookieTokenObtainPairView, CookieTokenRefreshView, LogoutView, set_cookie_view

urlpatterns = [
    path('upload/product/', UploadProductView.as_view(), name='upload_product'),
    path('upload/question/', UploadQuestionView.as_view(), name='upload_question'),
    path('register/', UserCreateView.as_view(), name='register'),
    path('login/', CookieTokenObtainPairView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('refresh/', CookieTokenRefreshView.as_view(), name='token_refresh'),
    path('set-cookie/', set_cookie_view, name='set_cookie'),
]
