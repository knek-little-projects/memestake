from flask import Flask, request, jsonify, redirect, url_for, session
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import func
from flask_migrate import Migrate
from flask_cors import CORS, cross_origin
from flask import Response
from flask_apscheduler import APScheduler

from apscheduler.schedulers.background import BackgroundScheduler
from dotenv import load_dotenv

import telebot
import atexit

import json
import time
import os

from models import *
from utils.token.image import get_token_image
from utils.token.details import get_token_details

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


def update_tvls():
    with app.app_context():
        pass


def watch_events():
    with app.app_context():
        pass


def start_scheduler():
    scheduler = BackgroundScheduler()
    # scheduler.add_job(func=update_tvls, trigger="interval", seconds=1) # minutes=1)
    # scheduler.add_job(func=watch_events, trigger="interval", seconds=10) # minutes=1)
    scheduler.start()
    # Shut down the scheduler when exiting the app
    atexit.register(lambda: scheduler.shutdown())


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


@app.route('/events')
def test_events():
    pass


@app.route('/token/<int:chain_id>/<addr>', methods=["GET", "POST"])
def token(chain_id, addr):

    if request.method == "GET":

        if token := Token.query.get(Token.getId(chain_id, addr)):
            return jsonify(token.to_dict())

        details = get_token_details(chain_id, addr)
        assert details, "Token details not found"

        image = get_token_image(chain_id, addr)
        assert image, "Token image not found"

        token = Token(
            id=Token.getId(chain_id, addr),
            chain_id=chain_id,
            address=addr,
            name=details.name,
            symbol=details.symbol,
            decimals=details.decimals,
            image=image,
        )
        db.session.add(token)
        db.session.commit()

        return jsonify(token.to_dict())
        
    if request.method == "POST":

        token = Token.query.get(Token.getId(chain_id, addr))
        assert token, f"Token chain_id={chain_id} addr={addr} not found"

        token.listed = True
        db.session.commit()

        return jsonify({})


@app.route('/tokens/<int:chain_id>')
def tokens(chain_id):
    return jsonify([t.to_dict() for t in Token.query.filter_by(chain_id=chain_id, listed=True).order_by(Token.points)])



if __name__ == '__main__':
    start_scheduler()
    app.run(host="0.0.0.0", port=int(os.getenv('PORT', 8000)), debug=os.getenv('DEBUG', 'True').lower() in ['true', '1', 't'])
