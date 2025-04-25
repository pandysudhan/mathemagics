FROM python:3.9

WORKDIR /code

COPY ./requirements.txt ./

RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

COPY . .

EXPOSE 8080

CMD ["gunicorn", "-b" ,"0.0.0.0:8080", "mathemagics:app"]
