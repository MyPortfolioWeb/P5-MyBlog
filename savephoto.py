import json
from flask import Flask, request

app = Flask(__name__)

@app.route('/savephoto', methods=['POST'])
def save_photo():
    data = request.get_json()
    photo = json.loads(data)

    if photo:
        with open('gallery.json', 'r') as file:
            gallery_data = json.load(file)

        # gallery_data['photos'].append(photo)
        gallery_data = photo

        with open('gallery.json', 'w') as file:
            json.dump(gallery_data, file)

    return 'OK'

if __name__ == '__main__':
    app.run()
