# -*- coding: utf-8 -*-
"""
Created on Fri Feb 11 12:20:29 2022

@author: Archana
"""
from adaboost_regression_model import adaboost_regression
import datetime
import time
import pandas as pd
import json
import os
import pickle
from matplotlib import pyplot as plt
import seaborn as sns
import sys
import warnings 
warnings.filterwarnings("ignore")
def adaboost_regression_outer(json_input_file = {} #json input path
                            ):

    try:
        d = {}   
        #Load json
        json_input = json_input_file
        # print(json_input)
        #read csv
        input_file_path = json_input['input_file_path']
        data = pd.read_csv(input_file_path)
        
        #loading parameters
        num_cols = json_input['numeric_cols']
        cat_cols = json_input['cat_cols']
        target = json_input['target']
        
        #call linear_regression_model
        output = adaboost_regression(data,
                                   num_cols,
                                   cat_cols,
                                   target)
        
       
        #generate output folder 
        # ms = datetime.datetime.now()
        # ms = str(int(time.mktime(ms.timetuple()) * 1000))
        output_file_path = json_input['experiment_id']#+"_"+ms
        path = os.getcwd() +"/algoOutputs/" +output_file_path
        if not (os.path.isdir(path)):
            os.makedirs(path)        
        
        ####################  CSV and MODEL file #############################
       
        #generate csv with y_actual and y_pred
        temp = {'Y_actual': output['y_actual'], 'Y_predicted': output['y_predict']}
        df = pd.DataFrame(data=temp).reset_index(drop=True)
        df = df.assign(Index=range(len(df))).set_index('Index')
        df.to_csv(path+'/actualVspredicted.csv')
        
        #generate performance metrics of model
        df1 = pd.DataFrame([output['model_performance']]).T.reset_index()
        df1 = df1.set_index('index').rename_axis('Metrices')
        df1.columns=['Scores']
        df1.to_csv(path+'/model_performance.csv')
        
        #generate model in pkl format
        with open(path+'/model.pkl', 'wb') as files:
            pickle.dump(output['model'], files)
        

        ####################  VISUALIZATION PLOTS #############################

        #Dist Plot
        plt.figure(figsize = (10,10))
        sns.distplot(output['y_actual']- output['y_predict'],
                     kde=True, color="g", )
        plt.title("Dist Plot", fontsize=30)
        plt.rc('axes', labelsize=20)
        plt.savefig(path+'/dist_plot.png')
        # plt.show()
        
        output['visualize'] = []
        output['visualize'].append("Dist Plot") 
        
        #Parity plot - Scatter plot
        plt.figure(figsize = (10,10))
        lineStart = output['y_actual'].min() 
        lineEnd = output['y_predict'].max()  
        plt.scatter(output['y_actual'], output['y_predict'], alpha = 0.8, color = "b")
        plt.plot([lineStart, lineEnd], [lineStart, lineEnd], 'k-', color = 'r', lw=2)
        plt.title("Actual vs Pred (Testing set)", fontsize=30)
        plt.xlabel("Y_Actual", fontsize=25)
        plt.ylabel("Y_Predicted", fontsize=25)
        #plt.rc('axes', labelsize=20)
        plt.savefig(path+'/parity_plot.png')
        # plt.show()

        output['visualize'].append("Parity Plot") 


        #Trend Plot
        randomlist = []
        for i in range(0,len(output['y_actual'])):
            randomlist.append(i)
        plt.figure(figsize = (10,10))
        plt.plot(randomlist, output['y_actual'], color="blue", marker="p", label="Y_Actual")
        plt.plot(randomlist, output['y_predict'], color="green", marker="d", label="Y_Predicted")
        plt.title("Actual vs Pred Trend", fontsize=25)
        plt.ylabel(target, fontsize=25)
        plt.legend(prop={'size': 15})
        plt.savefig(path+'/trend_plot.png')
        # plt.show()

        output['visualize'].append("Trend Plot") 

        #Correlation heatmap
        plt.figure(figsize = (10,10))
        sns.heatmap(data.corr(), annot = True, cmap = "RdYlGn",linewidths=0.1, annot_kws={"fontsize":12})
        #sns.set(font_scale=3)
        plt.savefig(path+'/corr_heatmap.png')
        # plt.show()
        
        output['visualize'].append("Correlation Heatmap") 

        # plot for residual error 
        plt.style.use('fivethirtyeight') 
        plt.scatter(output['model'].predict(output['X_train']), output['model'].predict(output['X_train']) - output['y_train'],
                    color = "green", s = 10, label = 'Train data')
        plt.scatter(output['y_predict'], output['y_predict'] - output['y_actual'],
                    color = "blue", s = 10, label = 'Test data')
        plt.hlines(y = 0, xmin = 0, xmax = 50, linewidth = 2) 
        plt.legend(loc = 'upper right') 
        plt.title("Residual errors")
        plt.savefig(path+'/residual_plot.png')
        # plt.show()

        output['visualize'].append("Residual Plot") 

        ####################  MODEL INFO JSON #############################

        #model info jsom
        model_info = {}
        model_info['Algorithm_Name'] = 'AdaBoost Regression'
        model_info['Numerical_columns'] = num_cols
        model_info['Cateogrical_columns'] = cat_cols
        model_info['Target Variable'] = target
        model_info['Model Train Score'] = output['model_train_score']
        model_info['Model Test Score'] = output['model_test_score']
        model_info['Model Performance'] = output['model_performance']
        model_info['Plots Generated'] = output['visualize']
        
        with open(path+'/model_info.json', 'w') as file:
            json.dump(model_info, file)

        ####################  MODEL INFO JSON #############################
        
        output_json = {}
        output_json['input_json_path'] = json_input_file
        output_json['input_file_path'] = input_file_path
        output_json['output_file_path'] = path
        output_json['Algorithm_Name'] = 'AdaBoost Regression'
        output_json['Numerical_columns'] = num_cols
        output_json['Cateogrical_columns'] = cat_cols
        output_json['Target Variable'] = target
        output_json['Model'] = path+'/model.pkl'
        output_json['actualVspredicted_file_path'] = path+'/actual Vs predicted.csv'
        output_json['model_performance_file_path'] = path+'/model_performance.csv'
        output_json['model_info_file_path'] = path+'/model_info.json'
        output_json['dist_plot_file_path'] = path+'/dist_plot.png'
        output_json['parity_plot_file_path'] = path+'/parity_plot.png'
        output_json['trend_plot_file_path'] = path+'/trend_plot.png'
        output_json['corr_heatmap_file_path'] = path+'/corr_heatmap.png'      
        output_json['residual_plot_file_path'] = path+'/residual_plot.png'      

        with open(path+'/output_json_file.json', 'w') as file:
            json.dump(output_json, file)
        
        d['return_code'] = '1'
        d['msg'] = 'Executed Sucessfully !'   
        d['folderPath'] = output_json['output_file_path'];
        return d
        
        
    except Exception as e:
        d['return_code'] = 'ERROR_01'
        d['msg'] = e         
        return d