import os
import csv

# print(__file__)
# print(os.path.realpath(__file__))
# print(os.path.abspath(__file__))
# print(os.getcwd())

lst = None
array = [[] for x in range(6)]
done = []

with open('D:\\tmp\\zzz\\class.csv', 'r', encoding='utf-8') as csvfile:
    reader = csv.reader(csvfile)
    next(reader)
    
    lst = list(reader)

def getSet(lst):
    filtered = []
    for row in lst:
        for x in row:
            if (type(x) == list):
                filtered.append(x[0])
    return set(filtered)

def getValue(lst, val):
    for row in lst:
        if (row[0] == val):
            return row

def funW(arr, lst, done):
    for row in lst:
        if (len(arr) == 2):
            break
        if (row[0] in done):
            continue
        if (row[2] != '여'):
            continue
        arr.append(row)
        done.append(row[0])

def funM(lst, done, type):
    result = None
    if (type == 0):
        for row in [x for x in lst if x[2] == '남']:
            if (int(row[0]) % 2 == 0):
                if (row[0] in done):
                    continue
                else:
                    done.append(row[0])
                    result = row
                    break
    elif(type == 1):
        for row in [x for x in lst if x[2] == '남']:
            if (int(row[0]) % 2 == 1):
                if (row[0] in done):
                    continue
                else:
                    done.append(row[0])
                    result = row
                    break
    
    return result



for idx in range(len(array)):
    if (idx % 2 == 0):
        funW(array[idx], lst, done)

for idx in range(len(array)):
    # print(idx)
    if (len(array[idx]) > 1):
        array[idx].append([]); array[idx][2] = funM(lst, done, 1)
        array[idx].append([]); array[idx][3] = funM(lst, done, 0)
    else:
        array[idx].append([]); array[idx][0] = funM(lst, done, 1)
        array[idx].append([]); array[idx][1] = funM(lst, done, 0)
        array[idx].append([]); array[idx][2] = funM(lst, done, 1)
        array[idx].append([]); array[idx][3] = funM(lst, done, 0)

array[5][3] = getValue(lst, list(set([x[0] for x in lst]).difference(getSet(array)))[0]) 

for row in array:
    print(row)

# print(done)

# print(getValue(lst,list(set([x[0] for x in lst]).difference(getSet(array)))[0]))



    