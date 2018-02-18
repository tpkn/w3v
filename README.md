# W3V
Nodejs wrapper for W3 Validator


## Usage
```javascript
const w3validator = require('w3v');
const w3v = new w3validator();

w3v.check(fs.readFileSync('is_valid.html', 'utf8'))
.then(result => {
   console.log('Result: ', result.message);
   // '84 errors'

   console.log('Errors list:', result.errors);
   // ['line 44 -> Quote “"” in attribute name. Probable cause: Matching quote missing somewhere earlier.']
})
.catch(err => {
   console.log(err);
})
```

### Set custom request params
If, for example, you want to change the server response format from `json` to [something else](https://github.com/validator/validator/wiki/Service-%C2%BB-Common-params#out), you could overwrite the default request object:
```javascript
w3v.check(<string>, {
   request: {
      url: 'https://validator.w3.org/nu/',
      qs: {
         out: 'json'
      },
      headers: {
         'Content-Type': 'text/html; charset=utf-8',
         'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2272.101 Safari/537.36'
      }
   }
})
```

### Filter the results
If you don't want to get the whole list of `errors`, `infos` and etc., you could specify the list of results you'd like to filter:
```javascript
w3v.check(<string>, {
   filters: [
      'Element “title” must not be empty',
      'A document must not include both a “meta” element'
   ]
})
```
Each filter is automatically converted to a `RegExp` so there is no need to copy/paste the exact error text.


### Get raw results
By default this module cuts off `info` and `warning` from the results. So the `raw` parameter allows you to get the full server response without any changes:
```javascript
w3v.check(<string>, {
   raw: true
})
```


## FAQ
- https://validator.w3.org/docs/api.html
- https://github.com/validator/validator/wiki

