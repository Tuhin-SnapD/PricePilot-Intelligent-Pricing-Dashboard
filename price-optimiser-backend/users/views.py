from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .serializers import RegisterSerializer, UserSerializer
from django.contrib.auth import get_user_model
import logging

User = get_user_model()
logger = logging.getLogger(__name__)

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = (permissions.AllowAny,)

    def create(self, request, *args, **kwargs):
        try:
            response = super().create(request, *args, **kwargs)
            logger.info(f"User registered successfully: {request.data.get('username')}")
            return Response({
                'success': True,
                'message': 'User registered successfully',
                'data': response.data
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            logger.error(f"Registration failed: {str(e)}")
            return Response({
                'success': False,
                'error': 'Registration failed'
            }, status=status.HTTP_400_BAD_REQUEST)

class CustomLoginView(generics.GenericAPIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        try:
            username = request.data.get('username')
            password = request.data.get('password')
            
            logger.info(f"Login attempt for user: {username}")
            
            if not username or not password:
                return Response({
                    'success': False,
                    'error': 'Username and password are required'
                }, status=status.HTTP_400_BAD_REQUEST)

            user = authenticate(username=username, password=password)
            
            if user:
                # Generate tokens
                refresh = RefreshToken.for_user(user)
                access_token = str(refresh.access_token)
                refresh_token = str(refresh)
                
                logger.info(f"User logged in successfully: {username}")
                logger.info(f"Access token generated: {access_token[:20]}...")
                logger.info(f"Refresh token generated: {refresh_token[:20]}...")
                
                return Response({
                    'success': True,
                    'access': access_token,
                    'refresh': refresh_token,
                    'user': {
                        'id': user.id,
                        'username': user.username,
                        'email': user.email,
                        'role': user.role
                    }
                }, status=status.HTTP_200_OK)
            else:
                logger.warning(f"Failed login attempt for username: {username}")
                return Response({
                    'success': False,
                    'error': 'Invalid credentials'
                }, status=status.HTTP_401_UNAUTHORIZED)
                
        except Exception as e:
            logger.error(f"Login error: {str(e)}")
            return Response({
                'success': False,
                'error': f'Login failed: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class FallbackLoginView(TokenObtainPairView):
    """Fallback to default JWT view if custom view fails"""
    
    def post(self, request, *args, **kwargs):
        try:
            response = super().post(request, *args, **kwargs)
            # Add success field to maintain consistency
            response.data['success'] = True
            logger.info("Using fallback login view")
            return response
        except Exception as e:
            logger.error(f"Fallback login error: {str(e)}")
            return Response({
                'success': False,
                'error': 'Login failed'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class UserDetailView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_object(self):
        # Return the currently authenticated user
        return self.request.user

    def retrieve(self, request, *args, **kwargs):
        try:
            response = super().retrieve(request, *args, **kwargs)
            return Response({
                'success': True,
                'data': response.data
            })
        except Exception as e:
            logger.error(f"Error retrieving user details: {str(e)}")
            return Response({
                'success': False,
                'error': 'Failed to retrieve user details'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
