/*!
 * W3V (v1.0.0.20180117), http://tpkn.me/
 */

const request = require('request');

class W3Validator {
   constructor(){
      this.default_options = {
         url: 'https://validator.w3.org/nu/',
         qs: {
            out: 'json'
         },
         headers: {
            'Content-Type': 'text/html; charset=utf-8',
            'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2272.101 Safari/537.36'
         }
      }

      this.default_filters = [
         'Element “title” must not be empty',
         'A document must not include both a “meta” element'
      ];
   }

   escapeRegExp(filter){
      if(typeof filter === 'string'){
         return filter.replace(/[\+\=\/]/g, '\\$&');
      }else{
         return filter;
      }
   }

   /**
    * Check if the error should be filtered off from results
    * 
    * @param  {String} error_text
    * @return {Boolean}
    */
   filterError(error_text, filters){
      // Convert filter string into RegExp
      filters = filters.map(item => new RegExp(this.escapeRegExp(item), 'i'));

      for(let i = 0, len = filters.length; i < len; i++){
         if(filters[i].test(error_text)){
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
   check(html_data, options = {}){
      return new Promise((resolve, reject) => {
         if(options.request && options.request instanceof Object && options.request.constructor === Object){
            this.default_options = Object.assign(this.default_options, options.request);
         }

         // Add 'body' to the request object
         this.default_options.body = '' + html_data;

         // Apply users filters
         let filters = [];
         if(options.filters && options.filters.constructor === Array){
            filters = options.filters;
         }else{
            filters = this.default_filters;
         }

         request.post(this.default_options, (err, response, data) => {
            if(err) return reject({status: 'fail', message: 'request error: ' + err.message});
            
            try {
               let errors = [];
               let results = JSON.parse(data).messages;

               // Return the whole server answer or only errors
               if(typeof options.raw === 'undefined' || options.raw == false){
                  results.forEach((item, i) => {
                     if(item.type == 'error' && !this.filterError(item.message, filters)){
                        errors.push('line ' + item.lastLine + ' -> ' + item.message);
                     }
                  });
               }else{
                  errors = results;
               }

               if(errors.length){
                  resolve({status: 'ok', message: errors.length + ' error' + (errors.length > 1 ? 's' : ''), errors: errors});
               }else{
                  resolve({status: 'ok', message: 'no errors', errors: errors});
               }

            }catch(e){
               reject({status: 'fail', message: e.message})
            }
         });
      });
   }
}

module.exports = new W3Validator;
