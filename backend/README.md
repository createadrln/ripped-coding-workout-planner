# Django Backend Project

This is a Django backend application for the project. Below are the instructions for setting up and running the application.

## Prerequisites

- Python 3.x
- Django
- Docker (optional, if you want to run the application in a container)
- Docker Compose (optional, if you want to use Docker Compose)

## Setup Instructions

### Local Setup

1. Clone the repository:
   ```
   git clone <repository-url>
   cd django-backend
   ```

2. Create a virtual environment:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```

3. Install the required packages:
   ```
   pip install -r requirements.txt
   ```

4. Run database migrations:
   ```
   python backend/manage.py migrate
   ```

5. Start the development server:
   ```
   python backend/manage.py runserver
   ```

### Docker Setup

1. Build the Docker image:
   ```
   docker build -t django-backend .
   ```

2. Run the application using Docker Compose:
   ```
   docker-compose up
   ```

## Usage

- Access the application at `http://localhost:8000`.
- Use the Django admin interface at `http://localhost:8000/admin` (create a superuser to access it).

## Directory Structure

- `backend/`: Contains the Django project files.
- `app/`: Contains the Django application files.
- `Dockerfile`: Docker configuration for building the image.
- `docker-compose.yml`: Configuration for running the application in Docker.
- `requirements.txt`: Lists the required Python packages.

## License

This project is licensed under the MIT License. See the LICENSE file for details.