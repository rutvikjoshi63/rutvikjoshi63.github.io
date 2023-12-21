---
layout: post
title: Advance Learning Algorithms
date: 2023-01-31 06:56:00-0400
description: Study topics
tags: Machine Learning Masters
categories: sample-posts
giscus_comments: true
related_posts: false
featured: true
# related_publications: einstein1950meaning, einstein1905movement
---

## Topics covered in Advance Learning Algorithms

# Week 1

# Week 2
  * a layer is a grouping of neurons in a neural network
  * an activation is the number calculated by a neuron (and “activations” is a vector that is output by a layer that contains multiple neurons)
    ![_config.yml]({{ site.baseurl }}/assets/img/Andrew_Algorithm_w1.png)

    ![_config.yml]({{ site.baseurl }}/assets/img/Andrew_w1_Notation.png)

  * Computation Graph based on Graph Theory
    ![_config.yml]({{ site.baseurl }}/assets/img/AndrewNg/AdvAlgorithm_w2_GraphTheory.png)
# Week 3
Evaluation of a model:
If fitting a function to predict housing prices or some other regression problem, one model you might consider is to fit a linear/polynomial model.

One procedure you could try, this turns out not to be the best procedure, but one thing you could try is, look at all of these J tests, and see which one gives you the lowest value. Say, you find that, J test for the fifth order polynomial for w^5, b^5 turns out to be the lowest. If that's the case, then you might decide that the fifth order polynomial d equals 5 does best, and choose that model for your application.

The reason this procedure is flawed is J test of w^5, b^5 is likely to be an optimistic estimate of the generalization error. In other words, it is likely to be lower than the actual generalization error.

we're going to introduce a new subset of the data called the cross-validation/validation/dev/test set. The name cross-validation refers to that this is an extra dataset that we're going to use to check or cross check the validity or really the accuracy of different models.
    ![_config.yml]({{ site.baseurl }}/assets/img/AndrewNg/AdvAlgorithm_w3_Cross-ValidationLossfun.png)
    ![_config.yml]({{ site.baseurl }}/assets/img/AndrewNg/AdvAlgorithm_w3_Cross-ValidationNeuralNetwork.png)


# Week 4
