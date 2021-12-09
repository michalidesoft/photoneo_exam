import io
from flask_cors import CORS, cross_origin
from flask import Flask, jsonify, Response
from flask import render_template, request
import filetype
from PIL import Image, ImageOps
import base64

UPLOAD_FOLDER = '/tmp'

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'


@app.route("/")
def index():
    return render_template('index.html', segment='index')


@app.route('/upload', methods=['POST'])
@cross_origin()
def process_file():

    image = request.files["file"]

    if filetype.is_image(image):
        print(f"{image} is a valid image...")
        img = Image.open(image)
        im2 = ImageOps.grayscale(img)
        img_io2 = io.BytesIO()
        im2.save(img_io2, 'jpeg')
        img_io2.seek(0)
        img_base64 = base64.b64encode(img_io2.read())
        return jsonify({
                   'msg': 'success',
                   'size': [im2.width, im2.height],
                   'img':  str(img_base64)
              })
    return Response(
        "Bad file, cannot greyscale",
        status=400,
    )


if __name__ == '__main__':
    app.run(debug=True)
