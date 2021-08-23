FROM python:3.9-alpine

ENV PIPENV_VENV_IN_PROJECT=1
WORKDIR /app
COPY ./Pipfile ./Pipfile.lock /app/
RUN pip install pipenv && pipenv install

COPY ./configure.py /app/

CMD ["/app/.venv/bin/python", "/app/configure.py"]