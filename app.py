import io

from flask import Flask, jsonify
from flask import render_template, request, send_file
import filetype
from PIL import Image, ImageOps
from io import BytesIO
import base64

UPLOAD_FOLDER = '/tmp'

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


@app.route("/")
def index():
    return render_template('index.html', segment='index')


@app.route('/upload', methods=['POST'])
def process_file():
    # print(request.data)
    # print("form",request.form)
    # print("files",request.files)
    # print("data",request.data)
    # print("values",request.values)
    # if request.method == 'POST':
    #     f = request.files['the_file']

    image = request.files["file"]
    print("TT", image.filename)
    print("Ta", image.name)
    print("Tnb", image.stream)
    # image = request.data
    if filetype.is_image(image):
        print(f"{image} is a valid image...")
        img = Image.open(image)
        # im1 = Image.open(r"C:\Users\System-Pc\Desktop\a.JPG")
        im2 = ImageOps.grayscale(img)
        img_io = BytesIO()
        img_io2 = io.BytesIO()
        im2.save(img_io, 'png')
        im2.save(img_io2, 'png')
        img_io.seek(0)
        img_io2.seek(0)
        img_base64 = base64.b64encode(img_io2.read())
        # return jsonify({'status': str(img_base64)})
        # im3 = im2.save('output.png')
        # return send_file(download_name=im3)
        return jsonify({
                   'msg': 'success',
                   'size': [im2.width, im2.height],

                   'img':  str(img_base64)
              })
        # return send_file(img_io,
        #                  attachment_filename='output.png',
        #                  mimetype='image/png')
    return jsonify({'file': "a"})


if __name__ == '__main__':
    app.run()
