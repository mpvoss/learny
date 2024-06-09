FROM public.ecr.aws/lambda/python:3.12

COPY . "${LAMBDA_TASK_ROOT}"
RUN dnf install gcc -y
RUN pip install --no-cache-dir -r requirements.txt --target "${LAMBDA_TASK_ROOT}"

CMD ["main.handler"]