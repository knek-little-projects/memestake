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
    created_at = db.Column(db.BigInteger, nullable=False, default=timestamp)
    
    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "language_code": self.language_code,            
            "is_premium": self.is_premium,
        }


class Token(db.Model):
    __tablename__ = 'tokens'

    id = db.Column(db.String, primary_key=True)
    chain = db.Column(db.Integer, nullable=False)
    address = db.Column(db.String, nullable=False)
    name = db.Column(db.String, nullable=False)
    symbol = db.Column(db.String, nullable=False)
    decimals = db.Column(db.Integer, nullable=False)
    image = db.Column(db.String, nullable=False)
    listed = db.Column(db.Boolean, nullable=False, default=False)
    created_at = db.Column(db.BigInteger, nullable=False, default=timestamp)

    @classmethod
    def getId(cls, chainId, address):
        return str(chainId).lower() + "_" + address.lower()

    def to_dict(self):
        return {
            "chain": self.chain,
            "address": self.address,
            "name": self.name,
            "symbol": self.symbol,
            "decimals": self.decimals,
            "image": self.image,
            "listed": self.listed,
        }
    