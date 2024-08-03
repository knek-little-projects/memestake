HOW TO RUN

```
python3 -mvenv venv
. venv/bin/activate
pip install -r requirements.txt

flask db init
flask db migrate
flask db upgrade

python app.py
```