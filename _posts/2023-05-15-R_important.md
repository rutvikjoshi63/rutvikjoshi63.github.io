---
layout: post
title: Data Analysis with R Programming
date: 2023-05-15 08:57:00-0400
description: Google Data Analytics Professional Certificate
tags: programming Data Analytics 
categories: sample-posts
giscus_comments: true
related_posts: true
---

## RStudio Cloud (now called Posit Cloud) is the primary tool we use  
1. **Install packages to RStudio Cloud**: The **lubridate** package is part of the tidyverse. The tidyverse is a collection of packages in R with a common design philosophy for data manipulation, exploration, and visualization. For a lot of data analysts, the tidyverse is an essential tool.
To install the core tidyverse packages and load them, follow these steps:
1. In the bottom of the console, type install.packages("tidyverse") and press Enter (Windows)
2. Load the tidyverse library with the library() function. To load the core tidyverse, type library(tidyverse) and press Enter (Windows)
3. Load the lubridate package. Since this is already part of the tidyverse package, there is no need to re-install. However, the library will need to be loaded. Type library(lubridate) into the console pane and press Enter (Windows)

**Data structure**
The most common data structures in the R programming language include: 

1. Vectors: There are two types of vectors: atomic vectors and lists
**Atomic vectors** can only contain elements of the same type. If you want to store elements of different types in the same data structure, you can use a list. 

| Type       	| Description                        	| Example   	|
|------------	|------------------------------------	|-----------	|
| Logical    	| True/False                         	| TRUE      	|
| Integer    	| Positive and negative whole values 	| 3         	|
| Double     	| Decimal values                     	| 101.175   	|
| Character  	| String/character values            	| “Coding”  	|
* The c() function in R combines multiple values into a vector
* You can determine what type of vector you are working with by using the typeof() function
* You can determine the length of an existing vector–meaning the number of elements it contains–by using the length() function
* You can also check if a vector is a specific type by using an is function: is.logical(), is.double(), is.integer(), is.character(). R  returns bool value
* You can use the names() function to assign a different name to each element of the vector. 
    ![_config.yml]({{ site.baseurl }}/assets/img/R_programming1.png)

**Creating lists**
* You can create a list with the list() function. eg list("a", 1L, 1.5, TRUE)
* you can even store a list inside a list inside a list—and so on
* If you want to find out what types of elements a list contains, you can use the str() function
    ![_config.yml]({{ site.baseurl }}/assets/img/R_programming2.png)
* You can name the elements of a list when you first create it with the list() function: eg: list('Chicago' = 1, 'New York' = 2, 'Los Angeles' = 3)     $`Chicago`

**Dates and times in R**
We work with dates and times in R using the lubridate package.



Data frames
Matrices
Arrays




```python
To find number of functions and methods defined for a class 
print(dir(object of class))
eg: print(dir(car1))

def welcome(msg)->str:
    """
    Description: This function will show a welcome message
    

    Return : This function will return the welcome message 
    """

    return msg

msg=welcome("Welcome all")
print(msg + "Please subscribe")

# Custom Exception
class Error(Exception):
    pass

class dobException(Error):
    pass

class customgeneric(Error):
    pass
year=int(input("Enter the year of Birth "))
age=2021-year
try:
    if age<=30 & age>20:
        print("The age is valid. You can apply for the exams")
    else:
        raise dobException
except dobException:
    print("The age is not within the range. You cannot apply for the exams")
    
Enter the year of Birth 1986
The year age is not within the range. You cannot apply for the exams

```
