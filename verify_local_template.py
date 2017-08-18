import requests
import json
from flask import Flask
from flask import request, url_for, redirect, render_template, jsonify
import pandas as pd
import os
from json_data_from_sheets import get_data


app = Flask(__name__)

@app.route('/')

def index():
        # return render_template('series_local.html')
        # return render_template('area_local.html')
        return render_template('bokeh_test.html')
        # return render_template('local_all_dims.html')



port = os.getenv('PORT', '5050')
if __name__ == "__main__":
	app.run(host="0.0.0.0",port=int(port),debug=True)


