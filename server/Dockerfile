# Use the official Python image from the Docker Hub
FROM python:3.10-slim

# Set environment variables to avoid buffering and ensure logs are immediately dumped to the stream
ENV PYTHONUNBUFFERED=1


# Set the working directory
WORKDIR /app

# Copy the requirements file into the container
COPY requirements.txt /app/

RUN pip install --upgrade pip

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code into the container
COPY . /app/

# Expose the port that Gunicorn will run on
EXPOSE 8000

# Run Gunicorn
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "wsgi:app"]
