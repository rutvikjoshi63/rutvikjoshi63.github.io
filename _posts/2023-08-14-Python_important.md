---
layout: post
title: Programming Tips
date: 2023-08-01 08:57:00-0400
description: All tricks andd tips
tags: formatting jupyter programming tips Machine Learning
categories: sample-posts
giscus_comments: true
related_posts: false
---

# Object oriented programming 
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

# Complex Nummbers
```python
##complex numbers
j=1.0-2.3j
j
```

Answer: \\
>(1-2.3j)    \\
>print(j.real,j.imag)    \\
>1.0 -2.3    \\

# string Formatting
```python
first_name="Krish"
last_name="Naik"
print("The first name is {a} and last name is {b}".format(b=last_name,a=first_name))

```
# Pointers in Python
```python
a="Krish"
b="Krish"
print(id(a))
print(id(b))
```
2575134525872\\
2575134525872

```python
lst=[1,2,3]
lst1=[1,2,3]
print(id(lst))
print(id(lst1))

```
2575100854848\\
2575100861184

### Equality Operators 
\\
Following operations are present in python for equlity check operation-\\
\\


| Operators    | Meaning                                                                                         |
| :----------- | -----------------------------------------------------------------------------------------------:|
| **is**       | ***a is b*** returns true if variable/identifiers a and b *points* to the *same object*         |
| **is not**   | ***a is not b*** returns true if variable/identifiers a and b *points* to the *different object*|
| **==**       | ***a == b*** returns true if variable/identifiers a and b has same value                        |
| **!=**       | ***a != b*** returns true if variable/identifiers a and b has different value                   |
| **/**        | true division                                                                                   |
| **//**       | integer division                                                                                |
| **%**        | the modulo operator                                                                             |



# Inbuilt Function Tricks
```python
print(my_str.isalnum()) #check if all char are numbers \\
print(my_str.isalpha()) #check if all char in the string are alphabetic    \\
print(my_str.isdigit()) #test if string contains digits    \\
print(my_str.istitle()) #test if string contains title words   \\
print(my_str.isupper()) #test if string contains upper case    \\
print(my_str.islower()) #test if string contains lower case    \\
print(my_str.isspace()) #test if string contains spaces    \\
print(my_str.endswith('k')) #test if string endswith a d   \\
print(my_str.startswith('K')) #test if string startswith H \\

numbers=[1,2,3,4,5]
squard_numbers=[i**2 for i in numbers]
print(squard_numbers)

## Generating a list of all the divisors of a number:

number =36
[i for i in range(1,number+1) if number%i==0]
[1, 2, 3, 4, 6, 9, 12, 18, 36]

## Generating a list of all the prime number:
number = 10
result = [2]
prime_num = [result.append(i) for i in range(3, number+1) if not [x for x in result if i%x == 0]]
print(result)

## Map function
l = [1,2,3,4,5,6,,7,8,9]

cube_lst = [map(lambda x: x*x*x, l)]

## Filter function
new_list = [filter(lambda x: x>4, l)] # lambda x: x>4 return bool value

## Higher order function are those that take function as argument
## Reduce function
from functools import reduce
l = [1,2,3,4,5]
# it will apply function to all elements and give sibngular output
sum = reduce(lambda x,y: x+y, l)
sum = 15

### try else finally
try:
    ##code block where exception can occur
    a=int(input("Enter the number 1 "))
    b=int(input("Enter the number 2 "))
    c=a/b
    
except NameError:
    print("The user have not defined the variable")
except ZeroDivisionError:
    print("Please provide number greater than 0")
except TypeError:
    print("Try to make the datatype similar")
except Exception as ex:
    print(ex)
else:
    print(c)
finally:
    print("The execution is done")

```
```markdown

abs(x) will return the absolute value of a number x which we pass in argument. The number x can be integer, float, complex,..
ceil(x) will return the ceiling value of a number x which we pass in argument. The ceiling value of a number x will be the smallest integer not less than x
floor
exp(x) will return the exponential value of a number x which we pass in argument.
fabs()
log(x)
pow()
Triggnometric functions
modf()
Program to check prime numbers
Program to check max of 3 numbers
Pop() Method
count()

```
```python
math.ceil(43.67)
44
math.ceil(-44.5)
-44
math.floor(43.9)
43
math.floor(-56.9)
-57
math.log(65.5)
4.182050142641207
math.log10(40)
1.6020599913279623
import math
math.pow(20,5)
3200000.0

math.modf()

lst
[1, 2, 3, 4]
lst.pop(2)
3
```
========================================================================================      
## Function Tricks
```python
>def hello(*args, **kwargs):                                    
>   print(args) 
>   print(kwargs)   
>   
>hello("Rutvik", "Joshi", age = 23, dob = 696969)   

```
Answer: 
>*("Rutvik", "Joshi")* \\
>*{'age' : 23, 'dob' : 696969}*    \\

========================================================================================  

```python
lst = ["Rutvik", "Joshi"]   
dict = {'age' : 23, 'dob' : 696969}     
hello(lst, dict)    
```

\\
Answer: \\
*(["Rutvik", "Joshi"],{'age' : 23, 'dob' : 696969}  )*    \\
*{}*  \\

========================================================================================

```python
>hello(*lst, **dict) 

```

\\
Answer: \\
>*("Rutvik", "Joshi")* \\
>*{'age' : 23, 'dob' : 696969}*    \\

# Map Function 

========================================================================================
```python
def even_odd(num):
    if i%2==0:
        return "{}num is even".format(num)
    else:
        return "{}num is odd".format(num)
    
list_num=[1,2,3,4,5,6]
list(map(even_odd, list_num))

```
>Answer:    \\
>[*"1 num is odd",*     \\
>*"2 num is even",*     \\
>*"3 num is odd",*      \\
>*"4 num is even",*     \\
>*"5 num is odd",*      \\
>*"6 num is even"*]     


For learning sets, Dictionary, tuples:  
2-Python List,Dictionary,Sets etc   


To include a jupyter notebook in a post, you can use the following code:

{% raw %}

```html
{::nomarkdown}
{% assign jupyter_path = "assets/jupyter/blog.ipynb" | relative_url %}
{% capture notebook_exists %}{% file_exists assets/jupyter/blog.ipynb %}{% endcapture %}
{% if notebook_exists == "true" %}
    {% jupyter_notebook jupyter_path %}
{% else %}
    <p>Sorry, the notebook you are looking for does not exist.</p>
{% endif %}
{:/nomarkdown}
```

{% endraw %}

Let's break it down: this is possible thanks to [Jekyll Jupyter Notebook plugin](https://github.com/red-data-tools/jekyll-jupyter-notebook) that allows you to embed jupyter notebooks in your posts. It basically calls [`jupyter nbconvert --to html`](https://nbconvert.readthedocs.io/en/latest/usage.html#convert-html) to convert the notebook to an html page and then includes it in the post. Since [Kramdown](https://jekyllrb.com/docs/configuration/markdown/) is the default Markdown renderer for Jekyll, we need to surround the call to the plugin with the [::nomarkdown](https://kramdown.gettalong.org/syntax.html#extensions) tag so that it stops processing this part with Kramdown and outputs the content as-is.

The plugin takes as input the path to the notebook, but it assumes the file exists. If you want to check if the file exists before calling the plugin, you can use the `file_exists` filter. This avoids getting a 404 error from the plugin and ending up displaying the main page inside of it instead. If the file does not exist, you can output a message to the user. The code displayed above outputs the following:

{::nomarkdown}
{% assign jupyter_path = "assets/jupyter/blog.ipynb" | relative_url %}
{% capture notebook_exists %}{% file_exists assets/jupyter/blog.ipynb %}{% endcapture %}
{% if notebook_exists == "true" %}
    {% jupyter_notebook jupyter_path %}
{% else %}
    <p>Sorry, the notebook you are looking for does not exist.</p>
{% endif %}
{:/nomarkdown}

Note that the jupyter notebook supports both light and dark themes.
