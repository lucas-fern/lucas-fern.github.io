---
layout: post
title: Site Under Construction
---
# Test H1
## Test H2
### Test H3
Body content

{% highlight python %}
import os
from bs4 import BeautifulSoup
from string import punctuation
from gensim.models import Word2Vec

def tokenize(raw_text):
    '''
    'Hey, dogs are awesome!' -> ['hey', 'dogs', 'are', 'awesome']

    using `re` would probably make it run faster but I got lazy
    '''

    # lowercase everything
    text = raw_text.lower()

    # remove punctuation
    for p in punctuation:
        text = text.replace(p, ' ')

    # remove extra whitespaces
    while '  ' in text:
        text = text.replace('  ', ' ')

    # tokenize
    tokens = text.strip().split()

    # remove digits
    tokens = [e for e in tokens if not e.isdigit()]

    return tokens

def yield_docs():
    '''
    crawl XML files, split each one in paragraphs
    and yield one tokenized paragraph at a time
    '''
    n = 0
    path = '/path/to/diario_xml/'
    for root, dirpath, fnames in os.walk(path):
        if not dirpath:
            for fname in fnames:
                if '.xml' in fname:
                    filepath = root + '/' + fname
                    with open(filepath, mode = 'r') as f:
                        content = f.read()
                    soup = BeautifulSoup(content, features = 'lxml')
                    paragraphs = soup.find_all('p')
                    for p in paragraphs:
                        print(n)
                        n += 1
                        tokens = tokenize(p.text)
                        if len(tokens) > 1:
                            yield tokens

class SentencesIterator():
    '''
    this tricks gensim into using a generator,
    so that I can stream the documents from disk
    and not run out of memory; I stole this code
    from here: 

    https://jacopofarina.eu/posts/gensim-generator-is-not-iterator/
    '''
    def __init__(self, generator_function):
        self.generator_function = generator_function
        self.generator = self.generator_function()

    def __iter__(self):
        # reset the generator
        self.generator = self.generator_function()
        return self

    def __next__(self):
        result = next(self.generator)
        if result is None:
            raise StopIteration
        else:
            return result

# train word2vec
model = Word2Vec(
    SentencesIterator(yield_docs), 
    size = 300, 
    window = 10, 
    min_count = 1000, 
    workers = 6
    )

# save to disk
model.save('word2vec.model')
{% endhighlight %}