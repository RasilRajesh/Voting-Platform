"""
URL configuration for voting_platform project.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('auth/', include('users.urls')),
    path('api/users/', include('users.urls')),
    path('api/candidates/', include('candidates.urls')),
    path('api/votes/', include('votes.urls')),
]

# Optional: API Documentation (uncomment after installing drf-yasg)
# try:
#     from rest_framework import permissions
#     from drf_yasg.views import get_schema_view
#     from drf_yasg import openapi
#     from django.urls import re_path
#     
#     schema_view = get_schema_view(
#        openapi.Info(
#           title="Voting Platform API",
#           default_version='v1',
#           description="API documentation for the Online Voting Platform",
#           terms_of_service="https://www.google.com/policies/terms/",
#           contact=openapi.Contact(email="contact@votingplatform.local"),
#           license=openapi.License(name="BSD License"),
#        ),
#        public=True,
#        permission_classes=(permissions.AllowAny,),
#     )
#     
#     urlpatterns += [
#         re_path(r'^swagger(?P<format>\.json|\.yaml)$', schema_view.without_ui(cache_timeout=0), name='schema-json'),
#         re_path(r'^swagger/$', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
#         re_path(r'^redoc/$', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
#     ]
# except ImportError:
#     pass  # drf-yasg not installed, skip API docs

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

