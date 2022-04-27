# -*- coding: utf-8 -*-
"""
Created on Fri Feb 11 12:20:29 2022

@author: Archana
"""

from random_classifier_model import random_classifier

import pandas as pd
import numpy as np
import json
import os
import pickle
from matplotlib import pyplot as plt
import seaborn as sns
import sys
import warnings 
warnings.filterwarnings("ignore")


def random_classifier_outer(json_input_file = {} #json input path
                            ):
    
    try:
        d = {}
               
        #Load json
        json_input = json_input_file      
        
        
        #read csv
        input_file_path = json_input['input_file_path']
        data = pd.read_csv(input_file_path)
        
        #loading parameters
        num_cols = json_input['numeric_cols']
        cat_cols = json_input['cat_cols']
        target = json_input['target']
        
        #call linear_regression_model
        output = random_classifier(data,
                                num_cols,
                                cat_cols,
                                target)
        
       
        #generate output folder 
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
    
        #generate model in pkl format
        with open(path+'/model.pkl', 'wb') as files:
            pickle.dump(output['model'], files)
            
        #Classifier report
        output['classifier_report'] = output['classifier_report'].reset_index()
        output['classifier_report'].to_csv(path+'/classification_report.csv', index = False)
        

        ####################  VISUALIZATION PLOTS #############################

        #Confusion matrix
        plt.figure(figsize = (10,10))
        ax = sns.heatmap(output['conf_matrix'], annot=True, fmt='', cmap='Blues',annot_kws={"fontsize":15})
        ax.set_title('Confusion Matrix\n', fontsize=30);
        ax.set_xlabel('\nPredicted Values', fontsize=22)
        ax.set_ylabel('Actual Values ', fontsize=22);      
        ax.set_xticklabels(ax.get_xmajorticklabels(), fontsize = 18)
        ax.set_yticklabels(ax.get_ymajorticklabels(), fontsize = 18)
        ## Display the visualization of the Confusion Matrix.
        plt.savefig(path+'/conf_matrix.png')
        plt.show()

        output['visualize'] = []
        output['visualize'].append("Confusion Matrix Plot") 


        #Dist Plot
        plt.figure(figsize = (10,10))
        sns.distplot(output['y_actual']- output['y_predict'],
                     kde=True, color="g", )
        plt.title("Dist Plot", fontsize=30)
        plt.rc('axes', labelsize=20)
        plt.savefig(path+'/dist_plot.png')
        plt.show()
        
        output['visualize'].append("Dist Plot") 
        

        #Correlation heatmap
        plt.figure(figsize = (10,10))
        sns.heatmap(data.corr(), annot = True, cmap = "Blues",linewidths=0.1, annot_kws={"fontsize":12})
        #sns.set(font_scale=3)
        plt.savefig(path+'/corr_heatmap.png')
        plt.show()
        
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
        plt.show()

        output['visualize'].append("Residual Plot") 

        ####################  MODEL INFO JSON #############################

        #model info jsom
        model_info = {}
        model_info['Algorithm_Name'] = 'Random Forest Classifier'
        model_info['Numerical_columns'] = num_cols
        model_info['Cateogrical_columns'] = cat_cols
        model_info['Target Variable'] = target
        model_info['Model Train Score'] = output['model_train_score']
        model_info['Model Test Score'] = output['model_test_score']
        model_info['Plots Generated'] = output['visualize']
        model_info['Accuracy Score'] = output['accuracy_score']
        model_info['Confusion Matrix'] = pd.DataFrame(output['conf_matrix']).to_dict()
        
        with open(path+'/model_info.json', 'w') as file:
            json.dump(model_info, file)

        ####################  MODEL INFO JSON #############################
        
        output_json = {}
        output_json['input_json_path'] = json_input_file
        output_json['input_file_path'] = input_file_path
        output_json['output_file_path'] = path
        output_json['Algorithm_Name'] = 'Random Forest Classifier'
        output_json['Numerical_columns'] = num_cols
        output_json['Cateogrical_columns'] = cat_cols
        output_json['Target Variable'] = target
        output_json['Model'] = path+'/model.pkl'
        output_json['actualVspredicted_file_path'] = path+'/actual Vs predicted.csv'
        output_json['classifier_report_file_path'] = path+'/classification_report.csv'      
        output_json['model_info_file_path'] = path+'/model_info.json'
        output_json['dist_plot_file_path'] = path+'/dist_plot.png'
        output_json['corr_heatmap_file_path'] = path+'/corr_heatmap.png'      
        output_json['conf_matrix_file_path'] = path+'/conf_matrix.png'      
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
        
        
        
    
    
