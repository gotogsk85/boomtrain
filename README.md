# custom angular infinite scroll

  - custom angular infinite scroll
  
  - using prototype to get the modified values from the json response instead of custom filters, since filters are performance hit .
  http://stackoverflow.com/questions/18309755/why-does-filter-trigger-some-many-times
  
  The solution to the above is to use $filter in controllers, BUT a good clean alternative to that is 
   - to create a new object from every response object (that we recieve from API) and 
   - attach the array of new objects to the scope variable
   - add functions in the new object's constructor function's prototype to get the updated values from the response variables.

