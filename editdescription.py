import json
from flask import Flask, request

app = Flask(__name__)

@app.route('/editdescription', methods=['POST'])
def edit_description():
    data = request.get_json()
    request_data = json.loads(data)

    if request_data and 'photo' in request_data:
        with open('gallery.json', 'r') as file:
            gallery_data = json.load(file)

        index = int(request_data['photo']['id'])
        description = request_data['photo']['description']

        if 0 <= index < len(gallery_data['photos']):
            gallery_data['photos'][index]['description'] = description

            with open('gallery.json', 'w') as file:
                json.dump(gallery_data, file, indent=4)

            return '', 200
        else:
            return 'Invalid photo index', 400
    else:
        return 'Invalid request or data', 400

if __name__ == '__main__':
    app.run()
