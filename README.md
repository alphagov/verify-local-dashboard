# verify-local-dashboard
A mock up of a performance monitoring dashboard for a local authority service

## Overview
This is a prototype dashbord for Local Authority service teams that are using GOV.UK Verify

It is built using Flask, Google Sheets and DC.JS

The data is provided by the Local Authority using a Google Form.

The output of the form is loaded into a Google sheet linked to the form.  It is possible to get the data from a Google sheet using JSON.  The flask app uses the python requests library to get the data, shape it and output it into a set of csv files.

Each dashboard chart or modile has a separate csv file which provides the data for the chart.

DC.JS is used to build the charts

# Running the app
Clone the app into your working directory

Using the command line cd to the folder and run pip install -r requirements.txt

Once all the libraries are installed type
```
source bin/activate
```
This will activate your virtual environment

Run the app using 
```
python3 verify-local.py
```

Open up your web browser and navigate to localhost:5000/buckinghamshire
