FROM python:3.9

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /app

COPY requirements/base.txt /app/
RUN pip install --no-cache-dir -r base.txt

COPY . /app/

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]