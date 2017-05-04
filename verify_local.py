import requests
import json
from flask import Flask
from flask import request, url_for, redirect, render_template, jsonify
import pandas as pd


app = Flask(__name__)

@app.route('/')

def index():
        # return render_template('series_local.html')
        # return render_template('area_local.html')
        return render_template('local.html')
        # return render_template('local_all_dims.html')
    
sheets = requests.get('https://spreadsheets.google.com/feeds/list/1CHmcBuINK-zcd8JAnIvrzswzIGxLEyW3yFSKx_pcV30/2/public/basic?alt=json')

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

	datastr = dstr.replace(':','":"')
	datastr = datastr.replace(',','","')
	datastr = datastr.replace(' ','')
	datastr = '{"'+datastr+'"}'

	datajson = json.loads(datastr)

	return datajson

dictlist = []
i = 0
for data in jsondata['feed']['entry']:
	datastr = data['content']['$t']
	datestr = data['title']['$t']
	

	datajson = format_str(datastr)
	datajson['date'] = jsondata['feed']['entry'][i]['title']['$t']
	i = i+1

	dictlist.append(datajson)

df = pd.DataFrame.from_dict(dictlist)

replace_columns = {"abandonapplication":"Abandon application",
       "concessionarytravelonlynumberofpicturedoesnotmeetstandards":"Number of picture does not meet standards",
       "date":"date",
       "forfacetoface":"For face to face", 
       "foronlinegov.ukverify":"For online GOV.UK Verify", 
       "foronlinelegacyroute":"For online legacy route",
       "forpost":"For post", 
       "fortelephone":"For telephone", 
       "numberoferrorsofform":"Number of error of form", 
       "numberofillegible":"Number of illegible",
       "numberofincomplete":"Number of incomplete", 
       "numberofnoteligible":"Number of not elegible",
       "numberoftransactionsfacetoface":"Number of transactions face to face",
       "numberoftransactionsonlinegov.ukverify":"Number of transactions online GOV.UK Verify",
       "numberoftransactionsonlinelegacy":"Number of transactions online legacy",
       "numberoftransactionsphone":"Number of transactions phone",
       "numberoftransactionspost":"Number of transactions post",
       "parkingpermitsonlynumberofincorrectpayments":"Number of incorrect payments", 
       "totalcontact":"Total contact",
       "usegov.ukverify":"Use GOV.UK Verify", 
       "uselegacyroute":"Use legacy route",
       "weeklyvisits":"Visits",
       "weeklyuniquevisits":"Unique visitors",
       "weeklypageviews": "Pageviews",
       "averagetimeonpage":"Average time on page"}



df = df.rename(columns=replace_columns)
df = df[['date',
		'For post',
		'For face to face',
		'For online GOV.UK Verify',
		'For online legacy route',
		'For telephone',
		'Total contact',
		'Use legacy route',
		'Use GOV.UK Verify',
		'Abandon application',
		'Number of transactions face to face',
		'Number of transactions online GOV.UK Verify',
		'Number of transactions post',
		'Number of transactions online legacy',
		'Number of transactions phone',
		'Number of incomplete',
		'Number of illegible',
		'Number of error of form',
		'Number of not elegible',
		'Number of picture does not meet standards',
		'Number of incorrect payments',
		'Visits',
		'Unique visitors',
		'Pageviews',
		'Average time on page']]

df = pd.melt(df, id_vars=['date'], var_name='variable')
df['module'] = df.apply(lambda row: get_modules(row['variable']),axis=1)

dfvisits = df[df['module']=='Visits']
dfuvisits = df[df['module']=='Unique visits']
dfpvs =df[df['module']=='Pageviews']
favgtime = df[df['module']=='Average time on page']

servicesdf = df[df['module']=='#VerifyLocal [Service] performance dashboard']
servicesdf = servicesdf[['date','variable','value']]
abandondf = df[df['module'] == 'Users who use Verify, abandon or use legacy route when starting an online application']
abandondf = abandondf[['date','variable','value']]
channeldf = df[df['module'] == 'Channel breakdown for transactions']
channeldf = channeldf[['date','variable','value']]
rejecteddf = df[df['module'] == 'Reasons for rejected applications']
rejecteddf = rejecteddf[['date','variable','value']]

dfvisits.to_csv('static/data/local_visits.csv',index=False,encoding='utf8')

servicesdf.to_csv('static/data/services.csv', index=False,encoding='utf8')
abandondf.to_csv('static/data/abandon.csv',index=False,encoding='utf8')
channeldf.to_csv('static/data/channel.csv', index=False,encoding='utf8')
rejecteddf.to_csv('static/data/rejected.csv', index=False,encoding='utf8')

df1  = df.pivot_table(values='variable',index=['date','value'],columns='module',aggfunc='first')
df1.reset_index(inplace=True)
df1.fillna(0,inplace=True )
df1.to_json('static/data/local_data.json')
df1.to_csv('static/data/local_data.csv',index=False,encoding='utf8')

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
metrics.to_csv('static/data/web_metrics.csv',index=False,encoding='utf8')

if __name__ == "__main__":
    app.run(host="0.0.0.0",port=5000,debug=True)


