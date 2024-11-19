from json import *
import pandas as pd
import numpy as np

with open('parking_data_football.csv') as f:
    data = pd.read_csv(f, sep=',')
    headers = pd.Series(["Name","LATITUDE","LONGITUDE","Permit" ,"Permit holders allowed","Start","End", 'something', 'a', 'b'])
    data.columns = headers
    data.drop(columns=['something', 'a', 'b'], inplace=True)
    data.to_json('parking_data_football.json', orient='records')