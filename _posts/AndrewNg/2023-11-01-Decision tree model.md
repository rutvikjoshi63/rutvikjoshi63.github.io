---
layout: distill
title: Decision tree model
date: 2023-11-01 06:56:00-0400
description: Intro to Decision tree
tags: Machine Learning 
# categories: sample-posts
giscus_comments: false
related_posts: false
# related_publications: einstein1950meaning, einstein1905movement

authors:
  - name: Rutvik Joshi
    # url: "https://en.wikipedia.org/wiki/Albert_Einstein"
    affiliations:
      name: IIT-Bombay, VJTI

toc:
  - name: Intro
    # subsections:
    #   - name: building an email spam classifier
  - name: Learning Process
  - name: Measuring purity
  - name: Information Gain
 #  if a section has subsections, you can add them as follows:
#     subsections:
#       - name: Data augmentation
#       - name: Photo OCR 
#   - name: Transfer learning
# #  if a section has subsections, you can add them as follows:
#     subsections:
#       - name: Pre-training
#       - name: Fine-tuning
#       - name: Benefits
#       - name: Limitations
#       - name: Examples
#   - name: Deployment

_styles: >
  .fake-img {
    background: #bbb;
    border: 1px solid rgba(0, 0, 0, 0.1);
    box-shadow: 0 0px 4px rgba(0, 0, 0, 0.1);
    margin-bottom: 12px;
  }
  .fake-img p {
    font-family: monospace;
    color: white;
    text-align: left;
    margin: 12px 0;
    text-align: center;
    font-size: 16px;
  }
---
<!-- Fee Structure: 1. Full Payment - 21,999 INR 2. Two Installments - 13,000 INR (First) + 10,999 INR (Second) [Total - 23999] 3. Three Installment - 8,999 INR (First) + 8,999 INR (Second) + 8000 INR (Third) [Total - 25999] You need to pay installments within 21 days. -->

## Intro
![_config.yml]({{ site.baseurl }}/assets/img/AndrewNg/AdvAlgorithm_w4_DecisionTree.png) 


## Learning Process
1. How to choose what feature to split on at each node?
Maximize purity (or minimize impurity)
2. When do you stop splitting?
When a node is 100% one class
When splitting a node will result in the tree exceeding a maximum depth
When improvements in purity score are below a
threshold
When number of examples in a node is below a threshold

## Measuring purity:
Entropy as a measure of impurity
Po = 1-P1
H(P1) = -P_1log_2(P1) - P_olog_2(po)
= -P1 log2(P1) - (1 − P1)log2 (1 − P1)
Note: "0 log(0)" = 0
if you look in open source packages you may also hear about something called the Gini criteria, which is another function that looks a lot like the entropy function, and that will work well as well for building decision trees.

### Information Gain
![_config.yml]({{ site.baseurl }}/assets/img/AndrewNg/AdvAlgorithm_w4_Information Gain.png) 
![_config.yml]({{ site.baseurl }}/assets/img/AndrewNg/AdvAlgorithm_w4_Information Gain2.png) 

<!-- ## Decision Tree Learning -->
