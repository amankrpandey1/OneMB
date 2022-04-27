# -*- coding: utf-8 -*-
"""
Created on Sun Feb 13 12:01:56 2022

@author: Archana
"""

from sklearn.model_selection import train_test_split 
from sklearn.impute import SimpleImputer 
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import AdaBoostRegressor
from sklearn import metrics
from sklearn.metrics import r2_score
import pandas as pd
import numpy as np


def remove_outliers(df, num_cols):
    ''' Detection '''
    Q1 = np.percentile(df[num_cols], 25,interpolation = 'midpoint') 
    Q3 = np.percentile(df[num_cols], 75,interpolation = 'midpoint')
    IQR = Q3 - Q1
    
    # Upper bound
    upper = np.where(df[num_cols] >= (Q3+1.5*IQR))
    # Lower bound
    lower = np.where(df[num_cols] <= (Q1-1.5*IQR))
     
    ''' Removing the Outliers '''
    df[num_cols].drop(upper[0], inplace = True)
    df[num_cols].drop(lower[0], inplace = True)
    
    return df

def adaboost_regression(data,
                      num_cols = [],
                      cat_cols = [],
                      target = ''):

    try:
        
        output_dict = {}          
        
        # Splitting the attributes into independent and dependent attributes
        X = data[num_cols + cat_cols]
        y = data[target]
        
        ####################  DATA PRE-PROCESSING #############################
        
        # handling the missing data and replace missing values with nan and replace with mean of all the other values
        imputer = SimpleImputer(missing_values=np.nan, strategy='most_frequent') 
        imputer = imputer.fit(X[num_cols])
        X[num_cols] = imputer.transform(X[num_cols])  
        
        #detecting and handling outliers
        X_new = remove_outliers(X, num_cols)
        
        # encode categorical data
        #---------------- dummy variable approach --------------------
        X_new = pd.get_dummies(X_new) 
        
        
        ####################  MODEL BUILDING #############################
        
        # splitting data set
        X_train, X_test, y_train, y_test = train_test_split(X_new, y, test_size=0.2, random_state=0)

        # feature scaling
        sc_X = StandardScaler()
        X_train = sc_X.fit_transform(X_train)
        X_test = sc_X.transform(X_test)
        
        # Instantiating AdaBoostRegression() Model
        model = AdaBoostRegressor(random_state=0, n_estimators=100)         
        # training the algorithm
        model.fit(X_train, y_train)         
        # make predictions on the test data
        y_pred = model.predict(X_test)        
        #Training score
        model.score(X_train, y_train)
        #Testing Score
        model.score(X_test, y_test)
        
        # Evaluating Model's Performance
        model_performance = {}
        model_performance['MAE']= metrics.mean_absolute_error(y_test, y_pred) 
        model_performance['MSE']= metrics.mean_squared_error(y_test, y_pred) 
        model_performance['RMSE']= np.sqrt(metrics.mean_squared_error(y_test, y_pred))
        model_performance['R2Score']= r2_score(y_test,y_pred)



        output_dict['model'] = model
        output_dict['model_train_score'] = model.score(X_train, y_train)
        output_dict['model_test_score'] = model.score(X_test, y_test)
        output_dict['y_actual'] = y_test
        output_dict['y_predict'] = y_pred   
        output_dict['model_performance'] = model_performance   
        output_dict['X_train'] = X_train
        output_dict['y_train'] = y_train
        

        return output_dict       
    
    except Exception as e:
        output_dict['return_code'] = 'ERROR_01'
        output_dict['msg'] = e         
        return output_dict
        
