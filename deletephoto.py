import json
from flask import Flask, request

app = Flask(__name__)

@app.route('/deletephoto', methods=['POST'])
def delete_photo():
    data = request.get_json()
    request_data = json.loads(data)

    if request_data and 'index' in request_data:
        index = request_data['index']
        with open('gallery.json', 'r') as file:
            gallery_data = json.load(file)

        if 0 <= index < len(gallery_data['photos']):
            del gallery_data['photos'][index]

            with open('gallery.json', 'w') as file:
                json.dump(gallery_data, file, indent=4)

        return '', 200

if __name__ == '__main__':
    app.run()
