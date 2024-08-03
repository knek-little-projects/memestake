from flask_sqlalchemy import SQLAlchemy
import time
import json


db = SQLAlchemy()


def timestamp():
    return int(time.time())


def ms():
    return int(time.time() * 1000)


class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.BigInteger, primary_key=True)
    username = db.Column(db.String, nullable=True, default=None)
    first_name = db.Column(db.String, nullable=True, default=None)
    last_name = db.Column(db.String, nullable=True, default=None)
    language_code = db.Column(db.String, nullable=True, default=None)
    is_premium = db.Column(db.Boolean, nullable=True, default=False)
    created = db.Column(db.BigInteger, nullable=False, default=ms)
    
    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "language_code": self.language_code,            
            "is_premium": self.is_premium,
        }
