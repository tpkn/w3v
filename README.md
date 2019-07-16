# W3V [![npm Package](https://img.shields.io/npm/v/w3v.svg)](https://www.npmjs.org/package/w3v)
Node.js wrapper for W3 Validator


## Installation
```bash
npm install w3v
```


## Usage
```javascript
const w3v = require('w3v');

w3v(fs.readFileSync('is_valid.html', 'utf8'))
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
:warning: Beautified results are only supported for `json` format!


### Set custom request params
If, for example, you want to change the server response format from `json` to [something else](https://github.com/validator/validator/wiki/Service-%C2%BB-Common-params#out), you could overwrite the default request object:
```javascript
w3v('<html>', {
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
If you don't want to get the whole list of `errors`, you could specify the list of results you'd like to filter. There is no need to define the exact error text, just a part of it (searching method is `Array.indexOf`).
```javascript
w3v('<html>', {
   filters: [
      'Element “title” must not be empty',
      'A document must not include both a “meta” element'
   ]
})
```
Please keep in mind that I've already set a number of my own filters, and their number will increase over time. To reset all my filters you could set `filters: []`.



### Get raw results
By default this module cuts off `info` and `warning` from the results. So the `raw` parameter allows you to get the full server response without any changes:
```javascript
w3v('<html>', {
   raw: true
})
```


## Resources
- https://validator.w3.org/docs/api.html
- https://github.com/validator/validator/wiki


## Changelog 
#### 2018-02-18:
- a bit simplified api
- speed improvements

