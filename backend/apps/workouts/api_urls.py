from rest_framework.routers import DefaultRouter
from .api_views import ExerciseViewSet, WorkoutTemplateViewSet, WorkoutViewSet, SetViewSet

router = DefaultRouter()
router.register(r'exercises', ExerciseViewSet)
router.register(r'workout-templates', WorkoutTemplateViewSet)
router.register(r'workouts', WorkoutViewSet)
router.register(r'sets', SetViewSet)

urlpatterns = router.urls
