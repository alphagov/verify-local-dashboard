import requests
import json
from flask import Flask
from flask import request, url_for, redirect, render_template, jsonify
import pandas as pd
import sys
from io import StringIO
from flask.ext.wtf import form
from flask_wtf.csrf import CsrfProtect
from flask_httpauth import HTTPBasicAuth

app = Flask(__name__)
app.secret_key = 'GTF_CSRF_hackers!'
CsrfProtect(app)
auth = HTTPBasicAuth()

users = {
    "buckinghamshire": "bucksdataviz"
}

@auth.get_password
def get_pw(username):
    if username in users:
        return users.get(username)
    return None

@app.route('/')
# @app.route('/buckinghamshire')
@auth.login_required
def index():
        # return render_template('series_local.html')
        # return render_template('area_local.html')
        # return render_template('local.html')
        return render_template('buckinghamshire.html',
                        avtop=avtop)
        
        # return render_template('local_all_dims.html')
    
# sheets = requests.get('https://spreadsheets.google.com/feeds/list/1CHmcBuINK-zcd8JAnIvrzswzIGxLEyW3yFSKx_pcV30/2/public/basic?alt=json')
sheets = requests.get('https://spreadsheets.google.com/feeds/list/13RVOMzKocVQFW0I00uOHBM6LULGiMb_vfJwzlbyxtMA/1/public/basic?alt=json')

jsondata = json.loads(sheets.text)

datastr = jsondata['feed']['entry'][0]['content']['$t']
datestr = jsondata['feed']['entry'][0]['title']['$t']

with open('verifylocal_modules.json') as md:
	modules = json.load(md)

modules_keys = list(modules.keys())

def get_modules(mod):
	for k in modules_keys:
		if mod in modules[k]:
			return k
			break

def format_str(dstr):

	datastr = dstr.replace(': ','":"')
	datastr = datastr.replace(',','","')
	datastr = datastr.replace(' ','')
	# datastr = datastr.replace('0:','0\:')
	datastr = '{"'+datastr+'"}'

	datajson = json.loads(datastr)

	return datajson
df = pd.DataFrame()
dictlist = []
i = 0
for data in jsondata['feed']['entry']:
	datastr = data['content']['$t']
	datestr = data['title']['$t']

	datajson = format_str(datastr)
	
	datajson['date'] = jsondata['feed']['entry'][i]['title']['$t']
	
	# data_df['date'] = jsondata['feed']['entry'][i]['title']['$t']
	
	# df = df.append(data_df)
	# print(i)

	i = i+1
	dictlist.append(datajson)

df = pd.DataFrame.from_dict(dictlist)
print(df.head())

replace_columns = {"abandonapplication":"Other ways to apply",
       "numberofpicturedoesnotmeetstandards":"Picture does not meet standards",
       "date":"date",
       "forfacetoface":"Face to face", 
       "foronlinegov.ukverify":"Online GOV.UK Verify", 
       "foronlinelegacyroute":"Online legacy route",
       "forpost":"Post", 
       "fortelephone":"Telephone", 
       "numberoferrorsofform":"Error of form", 
       "numberofillegible":"Illegible",
       "numberofincomplete":"Incomplete", 
       "numberofnoteligible":"Elegible",
       "numberoftransactionsfacetoface":"Application process",
       "numberoftransactionsonlinegov.ukverify":"Eligibility",
       "numberoftransactionsonlinelegacy":"GOV.UK Verify",
       "numberoftransactionsphone":"Certified companies",
       "numberoftransactionspost":"Application outcome",
       "numberofincorrectpayments":"Incorrect payments", 
       "totalcontact":"Total contact",
       "usegov.ukverify":"Use GOV.UK Verify", 
       "uselegacyroute":"Legacy route",
       "weeklyvisits":"Visits",
       "weeklyuniquevisits":"Unique visitors",
       "weeklypageviews": "Pageviews",
       "averagetimeonpage":"Average time on page",
       "usersatisfaction":"User satisfaction",
       "successrate":"Success rate"}



df = df.rename(columns=replace_columns)

df = df[['date',
		'Post',
		'Face to face',
		'Online GOV.UK Verify',
		'Online legacy route',
		'Telephone',
		'Total contact',
		'Legacy route',
		'Use GOV.UK Verify',
		'Other ways to apply',
		'Application process',
		'Eligibility',
		'Application outcome',
		'GOV.UK Verify',
		'Certified companies',
		'Incomplete',
		'Illegible',
		'Error of form',
		'Elegible',
		'Picture does not meet standards',
		'Incorrect payments',
		'Visits',
		'Unique visitors',
		'Pageviews',
		'Average time on page',
		'User satisfaction',
		'Success rate']]

df = pd.melt(df, id_vars=['date'], var_name='variable')

df['module'] = df.apply(lambda row: get_modules(row['variable']),axis=1)

dfvisits = df[df['module']=='Visits']
dfuvisits = df[df['module']=='Unique visits']
dfpvs =df[df['module']=='Pageviews']
favgtime = df[df['module']=='Average time on page']



servicesdf = df[df['module']=='Completed applications per channel']
servicesdf = servicesdf[['date','variable','value']]
abandondf = df[df['module'] == 'New applications started with GOV.UK verify, legacy route and \'other ways to apply\'']
abandondf = abandondf[['date','variable','value']]
channeldf = df[df['module'] == 'Enquiries about the onine application form']
channeldf = channeldf[['date','variable','value']]
rejecteddf = df[df['module'] == 'Reasons for rejected online applications']
rejecteddf = rejecteddf[['date','variable','value']]
successratedf = df[df['module'] == 'Success rate']
successratedf = successratedf[['date','variable','value']]
customersatdf = df[df['module'] == 'User satisfaction']
customersatdf = customersatdf[['date','variable','value']]

dfvisits.to_csv('static/data/local_visits.csv',index=False,encoding='utf8')

servicesdf.to_csv('static/data/bucks/services.csv', index=False,encoding='utf8')
abandondf.to_csv('static/data/bucks/abandon.csv',index=False,encoding='utf8')
channeldf.to_csv('static/data/bucks/channel.csv', index=False,encoding='utf8')
rejecteddf.to_csv('static/data/bucks/rejected.csv', index=False,encoding='utf8')
successratedf.to_csv('static/data/bucks/successrate.csv', index=False,encoding='utf8')
customersatdf.to_csv('static/data/bucks/customersat.csv', index=False,encoding='utf8')

df1  = df.pivot_table(values='variable',index=['date','value'],columns='module',aggfunc='first')
df1.reset_index(inplace=True)
df1.fillna(0,inplace=True )
df1.to_json('static/data/bucks/local_data.json')
df1.to_csv('static/data/bucks/local_data.csv',index=False,encoding='utf8')

metrics = df[(df['module']=='Visits')|(df['module']=='Unique Visitors')|(df['module']=='Pageviews')|(df['module']=='Average time on page')]
metrics = metrics.pivot(index='date', columns = 'variable',values='value')
metrics.reset_index(inplace=True)
metrics['visitsN'] = metrics['Visits']
metrics['unique_visitorsN'] = metrics['Unique visitors']
metrics['pageviewsN'] = metrics['Pageviews']
metrics['average_time_on_pageN'] = metrics['Average time on page']
metrics['Visits'] = 'Visits'
metrics['Unique visitors'] = 'Unique visitors'
metrics['Pageviews'] = 'Pageviews'
metrics['Average time on page'] = 'Average time on page'
metrics = metrics[-1:]
metrics.to_csv('static/data/bucks/web_metrics.csv',index=False,encoding='utf8')

avtop = metrics['average_time_on_pageN']
avtop = avtop.reset_index()
avtop = avtop['average_time_on_pageN'][0]

if __name__ == "__main__":
    app.run(host="0.0.0.0",port=5000,debug=True)


