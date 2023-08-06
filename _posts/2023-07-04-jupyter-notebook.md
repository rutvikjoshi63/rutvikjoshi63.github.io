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
