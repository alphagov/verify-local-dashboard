import requests
import json
from flask import Flask
from flask import request, url_for, redirect, render_template, jsonify
import pandas as pd
from json_data_from_sheets import get_data


app = Flask(__name__)

@app.route('/')

def index():
        # return render_template('series_local.html')
        # return render_template('area_local.html')
        return render_template('local.html')
        # return render_template('local_all_dims.html')



@app.route('/buckinghamshire')

def bucks():

	return render_template('buckinghamshire.html')

json_data_url = 'https://spreadsheets.google.com/feeds/list/1CHmcBuINK-zcd8JAnIvrzswzIGxLEyW3yFSKx_pcV30/2/public/basic?alt=json'

# buckinghamshire = get_data(json_data_url,'buckinghamshire')
get_data(json_data_url,'buckinghamshire')

# if __name__ == "__main__":
app.run(host="0.0.0.0",port=5000,debug=True)


