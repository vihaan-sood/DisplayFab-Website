import os
import sys
from django.core.wsgi import get_wsgi_application

sys.path.append('/opt/render/project/src/backend')

os.environ.setdefault("DJANGO_SETTINGS_MODULE","backend.backend.settings")

application = get_wsgi_application()