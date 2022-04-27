# -*- coding: utf-8 -*-
"""
Created on Wed Apr 27 11:03:47 2022

@author: Archana
"""
import sys
import os
import json
from adaboost_regression_outer import adaboost_regression_outer
from gradientBoosting_regression_outer import gradientBoosting_regression_outer
from linear_regression_outer import linear_regression_outer
from svm_regression_outer import svm_regression_outer
from svm_classifier_outer import svm_classifier_outer
from random_classifier_outer import random_classifier_outer
from logistic_classifier_outer import logistic_classifier_outer


def wrapper(json_input_file = {}):
    rc = {}
    algorithm = json_input_file['algorithm']
    
    if algorithm=='ada_boost':
        rc = adaboost_regression_outer(json_input_file)
    if algorithm=='gradient_boost':
        rc = gradientBoosting_regression_outer(json_input_file)
    if algorithm=='linear_reg':
        rc = linear_regression_outer(json_input_file)
    if algorithm=='svm_reg':
        rc = svm_regression_outer(json_input_file)
    if algorithm=='svm_class':
        rc = svm_classifier_outer(json_input_file)
    if algorithm=='random_class':
        rc = random_classifier_outer(json_input_file)
    if algorithm=='logistic_class':
        rc = logistic_classifier_outer(json_input_file)        
    
    return rc

if __name__=="__main__":
    temp = json.dumps(sys.argv)
    json_input_file = json.loads(json.loads(temp)[-1])
    print(str(wrapper(json_input_file)))   