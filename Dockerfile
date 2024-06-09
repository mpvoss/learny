# Use an official Python runtime as a parent image
#FROM python:3.12-slim
FROM public.ecr.aws/lambda/python:3.12

# Set the working directory in the container
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY ./backend /app/backend
COPY ./requirements-aws.txt /app

RUN dnf install gcc -y

#RUN apt-get update && apt-get install -y gcc


# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements-aws.txt

WORKDIR /app

# Run main.py when the container launches
# CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"]

# CMD ["python", "-m", "backend.main"]
CMD ["backend.main.handler"]