from app import app
from flask import request
from flask_restful import Resource, Api, reqparse
import werkzeug
from app.model_work import predict_number
from flask_cors import CORS

api = Api(app)
CORS(app, resources={r"/*": {"origins": "*"}})

parser = reqparse.RequestParser()
parser.add_argument('image_file', type=werkzeug.datastructures.FileStorage, location='files')


class home(Resource):

    def get(self):
        return "hello world", 200
    
    def post(self):
        args = parser.parse_args()
        image = args["image_file"]
        return {"number" : int(predict_number.predict_number(image))}
    

api.add_resource(home, "/")