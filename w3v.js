/*!
 * W3V (v1.1.0.20180117), http://tpkn.me/
 */

const request = require('request');

/**
 * Check if the error should be filtered off from results
 * 
 * @param  {String} error_text
 * @return {Boolean}
 */
function filterError(error_text, filters){
   for(let i = 0, len = filters.length; i < len; i++){
      if(error_text.indexOf(filters[i]) != -1){
         return true;
      }
   }

   return false;
}

/**
 * Checking process
 * 
 * @param  {String} html_data
 * @param  {Object} options
 * @return {Promise}
 */
function W3Validator(html_data, options = {}){
   return new Promise((resolve, reject) => {
   
      let params = {
         url: 'https://validator.w3.org/nu/',
         qs: {
            out: 'json'
         },
         headers: {
            'Content-Type': 'text/html; charset=utf-8',
            'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2272.101 Safari/537.36'
         }
      }

      let filters = [
         'Element “title” must not be empty',
         'A document must not include both a “meta” element'
      ];

      let time = Date.now();


      if(options.request && options.request instanceof Object && options.request.constructor === Object){
         params = Object.assign(params, options.request);
      }

      // Add 'body' to the request object
      params.body = '' + html_data;

      // Add users filters
      if(options.filters && Array.isArray(options.filters)){
         filters = options.filters;
      }

      request.post(params, (err, response, data) => {
         if(err) return reject({status: 'fail', message: 'request error: ' + err.message});

         time = (Date.now() - time) / 1000;

         if(params.qs.out.toLowerCase() === 'json'){

            try {
               let errors = [];
               let results = JSON.parse(data).messages;

               // Return the whole server answer or only errors
               if(typeof options.raw === 'undefined' || options.raw == false){
                  results.forEach((item, i) => {
                     if(item.type == 'error' && !filterError(item.message, filters)){
                        errors.push('line ' + item.lastLine + ' -> ' + item.message);
                     }
                  });
               }else{
                  errors = results;
               }

               if(errors.length){
                  resolve({status: 'ok', message: errors.length + ' error' + (errors.length > 1 ? 's' : ''), errors: errors, time: time});
               }else{
                  resolve({status: 'ok', message: 'no errors', errors: errors, time: time});
               }

            }catch(e){
               reject({status: 'fail', message: e.message, time: time})
            }

         }else{
            resolve({status: 'ok', message: 'not json? meh...', errors: data, time: time});
         }
      });
   });
}

module.exports = W3Validator;
