import json
import os 
import requests

from django.http import HttpResponse, HttpResponseRedirect
from django.template import RequestContext
from django.shortcuts import render_to_response
import boto.sdb

# AWS connection to SimpleDB
def aws_connect():
	conn = boto.sdb.connect_to_region('us-east-1',\
    		aws_access_key_id=os.environ['aws_access_key_id'], \
            aws_secret_access_key=os.environ['aws_secret_access_key'])
	return conn

# home endpoint
def home(request):
	return render_to_response('home.html')

# get receiver info for given qb
def get_qb_breakdown(request):
	qb_name = request.GET['qb']
	conn = aws_connect()
	query = 'select * from `qb_table` where quarterback="%s"' % qb_name
	rs = qb_domain.select(query)

	output = []
	for attrs in rs: 
		output.append(attrs)
	final_output = json.dumps(output)

