FROM python:3.9

WORKDIR /code

COPY ./requirements.txt ./

RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

COPY . .

CMD ["gunicorn", "-b" ,"0.0.0.0:$PORT", "mathemagics:app"]
