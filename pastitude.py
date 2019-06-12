import json
import os
import redis

from flask import Flask, render_template, request, jsonify
from utils import genereate_random_string

app = Flask(__name__)
r = redis.StrictRedis(os.environ.get('REDIS_HOST', 'localhost'))


@app.route('/', methods=['GET'])
def store_form():
    return render_template('pastitude.html')


@app.route('/', methods=['POST'])
def store():
    while True:
        paste_id = genereate_random_string(8)

        if r.get(paste_id + ':data') is None:
            break

    data = request.get_json()

    expiration = int(data['expiration'])

    if expiration not in [15, 60, 1440, 10080, 302400, 110376000] and expiration > 0:
        return 'Nice try!'

    r.set(paste_id + ':data', json.dumps(data), ex=(expiration * 60 if expiration > 0 else None))
    r.set(paste_id + ':expiration', expiration, ex=(expiration * 60 if expiration > 0 else None))

    return jsonify({
        'uuid': paste_id
    })


@app.route('/<uuid>', methods=['GET'])
def get_paste(uuid):
    try:
        data = r.get(uuid + ':data').decode('utf-8')
        expiration = int(r.get(uuid + ':expiration').decode('utf-8'))

        if expiration == -1:
            r.decr(uuid + ':expiration', 1)
        elif expiration == -2:
            r.delete(uuid + ':data')
    except AttributeError:
        return 'Oops!'

    return render_template('pastitude.html', data=data)


if __name__ == '__main__':
    app.run()
