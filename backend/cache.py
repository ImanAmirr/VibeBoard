cache_store={}

#return smth from cache(if present)
def get_cache(key):
    return cache_store.get(key)

#insert a value in cache
def set_cache(key,value):
    cache_store[key]=value

#delete a value from cache
def delete_cache(key):
    if key in cache_store:
        del cache_store[key]