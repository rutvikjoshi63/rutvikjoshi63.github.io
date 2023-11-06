---
layout: distill
title: Hashing
date: 2023-10-1 06:56:00-0400
description: Study resources for Data Structures & Algorithms
tags: Data Structures & Algorithms
# categories: sample-posts
giscus_comments: true
# related_posts: false
# related_publications: einstein1950meaning, einstein1905movement

authors:
  - name: Rutvik Joshi
    # url: "https://en.wikipedia.org/wiki/Albert_Einstein"
    affiliations:
      name: IIT-Bombay, VJTI

toc:
  - name: Hashing
   #  if a section has subsections, you can add them as follows:
    subsections:
      - name: Applications
      - name: Popular functions
      - name: Working
      - name: Advantages
      - name: DisAdvantages
  - name: Set
   #  if a section has subsections, you can add them as follows:
    subsections:
      - name: Working
      - name: Advantages
      - name: DisAdvantages
      
#   - name: Parallel Conquring Technique
#   - name: Mathematics
#   - name: Computer vision
#   - name: NLP
#   - name: Exercise
#   - name: Libraries

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
## Geeks for Geeks

# Hashing 
Dictionary and Set implement.
# Applications:
- Dictionary
- Database indexing
- Cryptography
- Caches
- Data from Databases

# Not used for :
- Finding closes value
- Sorted order
- Prefix searching -(Trie is better)

- # Popular functions
  1. Append()
  2. Insert(loc, var)
  3. var in list
  4. count(var)
  5. index(var)--error if abscent
    index(var, start, end)
  6. remove(var)
  7. pop() --returns, index optional
  8. del list[index start : end]
  9. max, min, sum,list.reverse(), sort() --for strings only sum will not work
  10. map:
    ```python
    # input size of the list
    n = int(input("Enter the size of list : "))
    # store integrs in a list using map,
    # split and strip functions
    lst = list(map(int, input("Enter the integer\
    elements:").strip().split()))[:n]

    # printing the list
    print('The list is:', lst)

  ```
  11. Clear()	Removes all items from the list
  12. copy()	Returns a copy of the list

- # Working:
    * Direct Address Table - problem Not handle large keys, floating point strings
    * Hash function- need to be fast, uniformly distribute large keys
  Examples
  
- # Advantages:
  - Best for Search, Insert, Delete in BigO(1)
  - insertion ovverides if exist already, no duplicates
- # DisAdvantages:
  - Strict search, yes or No. 
  - No sorted order
  - Not handle large keys, floating point strings

- # Other functions
1. reduce()	apply a particular function passed in its argument to all of the list elements stores the intermediate result and only returns the final summation value
2. sum()	Sums up the numbers in the list
3. ord()	Returns an integer representing the Unicode code point of the given Unicode character
4. cmp()	This function returns 1 if the first list is “greater” than the second list
5. max()	return maximum element of a given list
6. min()	return minimum element of a given list
7. all()	Returns true if all element is true or if the list is empty
8. any()	return true if any element of the list is true. if the list is empty, return false
9. len()	Returns length of the list or size of the list
10. enumerate()	Returns enumerate object of the list
11. accumulate()	apply a particular function passed in its argument to all of the list elements returns a list containing the intermediate results
12. filter()	tests if each element of a list is true or not
13. map()	returns a list of the results after applying the given function to each item of a given iterable
14. lambda()	This function can have any number of arguments but only one expression, which is evaluated and returned.

- # Slicing
  1. Negative steps to reverse list
  2. gives different for list only. tuple gives same back...since immutable

- # Comprehensions


# Sets 
 do not contain duplicates. {}
- # Sets

# Dictionary 
 do not contain duplicates. {}
- # Comprehensions
  * list(li) to set, dictionay
  d1 = {x:x**3 for x in l1}
  d1 = {x:f"ID{x}" for x in l1}
  d1 = {l2[i]:l3[i] for i in range(len(l2))} or **## d3 = dict(zip(l2,l3)) **
  * reverse dictionary
  d2 = {v:k for (k,v) in d1.items()}

*## A New Post for resources to learn Data Structures & Algorithms*
1. website 
    * [CodeWithHarry](https://www.codewithharry.com/videos/data-structures-and-algorithms-in-hindi-1/).
2. videos
    * [CodeWithHarry](https://www.youtube.com/watch?v=5_5oE5lgrhw&list=PLu0W_9lII9ahIappRPN0MCAgtOu3lQjQi&ab_channel=CodeWithHarry) playlist
      [alternative if didn't understand](https://www.youtube.com/watch?v=f9Aje_cN_CY&ab_channel=CampusX)
    * [nptelhrd](https://www.youtube.com/watch?v=zWg7U0OEAoE)playlist
    * [freeCodeCamp in jupyter notebook](https://www.youtube.com/watch?v=pkYVOmU3MgA&ab_channel=freeCodeCamp.org)
      [jovian](https://jovian.com/learn/data-structures-and-algorithms-in-python)

3. Practise and competitive matches
   * [leetcode](https://leetcode.com/)
   * [neetcode](https://neetcode.io/courses/dsa-for-beginners/2)
4. Pdfs
   * [Coursera-Algorithms, Princeton University](E:\study\Software\DSA\Algorithms_4th_Robert_Sedgewick,_Kevin_Wayne)-[coursera](https://www.coursera.org/lecture/algorithms-part1/quick-union-improvements-RZW72)
   * [Coursera-UC SanDiago](E:\study\Software\DSA\UC SanDiago)
   * [Ritika notes from LinkedIn](E:\study\Software\DSA\DSA notes by Ritika)


----
****
