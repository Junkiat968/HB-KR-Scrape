import os
from langdetect import detect
import docx2txt
import pandas as pd

os.chdir('C:/Users/Alson/Downloads')

original_word = docx2txt.process("wm20230830-rev 1.5.docx")
original_word = original_word.split('\n')
original_word = list(filter(None, original_word))

original_word_with_lang = []

for text in original_word:
    original_word_with_lang.append((text, detect(text)))

word_with_eng_lang = [(val, key) for (val, key) in original_word_with_lang if key != 'ko']

eng_lang_final = [a for a, b in word_with_eng_lang]
print(eng_lang_final)

with open ('C:/Users/Alson/Downloads/wm20230830-rev 1.5-eng.txt' ,'w') as f:
    for lang in eng_lang_final:
        f.write(f"{lang}\n\n")