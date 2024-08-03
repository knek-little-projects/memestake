from flask import Flask, request, jsonify, redirect, url_for, session
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import func
from flask_migrate import Migrate
from flask_cors import CORS, cross_origin
from flask import Response
from flask_apscheduler import APScheduler

from dotenv import load_dotenv
import telebot

import json
import time
import os

from models import *

load_dotenv()
bot = telebot.TeleBot(os.getenv('TELEBOT'))

class Config:
    SCHEDULER_API_ENABLED = True

app = Flask(__name__)

app.config.from_object(Config())
cors = CORS(app)
scheduler = APScheduler()
scheduler.daemonic = False

# Configuring the app using environment variables
app.config['SECRET_KEY'] = os.environ['SECRET_KEY']
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ['SQLALCHEMY_DATABASE_URI']
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = os.getenv('SQLALCHEMY_TRACK_MODIFICATIONS', 'False').lower() in ['true', '1', 't']
app.config['DISABLE_SCHEDULER'] = os.getenv('DISABLE_SCHEDULER', 'False').lower() in ['true', '1', 't']

db.init_app(app)
migrate = Migrate(app, db)


def get_user(request):
    user_id = request.headers.get('X-USER-ID')
    user_id = int(user_id)
    user = User.query.get(user_id)
    assert user
    return user


@app.route('/test', methods=['GET'])
def test():
    User.query.count()
    return "It works", 200


@app.route('/login', methods=['POST'])
def login():
    user_id = int(request.headers.get('X-USER-ID'))
    user = User.query.get(user_id)

    if not user:

        user = User(
            id=user_id,
            username=request.json.get('username'),
            first_name=request.json.get('first_name'),
            last_name=request.json.get('last_name'),
            language_code=request.json.get('language_code'),
            is_premium=request.json.get('is_premium'),
        )

        db.session.add(user)
        db.session.commit()

    return jsonify(User.query.get(user_id).to_dict())


if __name__ == '__main__':
    app.run(host="0.0.0.0", port=int(os.getenv('PORT', 8000)), debug=os.getenv('DEBUG', 'True').lower() in ['true', '1', 't'])
