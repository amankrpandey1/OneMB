# -*- coding: utf-8 -*-
"""
Created on Wed Apr 13 09:09:21 2022

@author: Archana
"""
import pandas as pd

##### iris data ##################

input_file_path = ['C:/Users/Dell/Desktop/OneMB/LinearRegression/input/iris.csv']
num_cols = ['SepalLengthCm', 'SepalWidthCm', 'PetalLengthCm', 'PetalWidthCm']
cat_cols = []
target = 'Species'

##### flight data ##################

input_file_path = ['C:/Users/Dell/Desktop/OneMB/AdaBoostRegression/input/car_data.csv']
output_file_path = ['/outputFile']
num_cols = [ 'Year','Present_Price', 'Kms_Driven']
cat_cols = ['Seller_Type','Transmission','Owner','Fuel_Type']
target = 'Selling_Price'


data = pd.read_csv(input_file_path[0])









        ####################  HYPERPARAMETER TUNING #############################

        #Randomized Search CV
        
        #Create the random grid
        random_grid = {'n_estimators': n_estimators,
                       'min_samples_leaf': min_samples_leaf}
        
        #Random search of parameters, using 5 fold cross validation
        lr_random = RandomizedSearchCV(estimator = model, 
                                       param_distributions = random_grid,
                                       scoring='neg_mean_squared_error', 
                                       n_iter = 10, cv = 5, verbose=2, 
                                       random_state=42, n_jobs = 1)
        
        lr_random.fit(X_train,y_train)
        lr_random.best_params_
        prediction = lr_random.predict(X_test)

        model_performance1 = {}
        model_performance1['MAE']= metrics.mean_absolute_error(y_test, prediction) 
        model_performance1['MSE']= metrics.mean_squared_error(y_test, prediction) 
        model_performance1['RMSE']= np.sqrt(metrics.mean_squared_error(y_test, prediction))
        model_performance1['R2Score']= r2_score(y_test, prediction)
