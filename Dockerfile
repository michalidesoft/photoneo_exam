FROM ubuntu:20.04
FROM python:3.9.9-slim-buster

RUN apt-get update -y && \
    apt-get install -y python3-pip python-dev

# We copy just the requirements.txt first to leverage Docker cache
COPY ./requirements.txt /app/requirements.txt

WORKDIR /app

RUN pip3 install -r requirements.txt

COPY . /app

CMD [ "python3", "-m" , "flask", "run", "--host=0.0.0.0"]
#ENTRYPOINT [ "python" ]
#
#CMD [ "app.py" ]