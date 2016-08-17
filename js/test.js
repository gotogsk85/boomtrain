angular.module("test",[])

.constant("baseUrl","https://api.github.com/repositories?since=")

  .service("elemInViewportSvc",function(){
     this.isScrolledIntoView = function (el) {
	    var elemTop = el.getBoundingClientRect().top;
	    var elemBottom = el.getBoundingClientRect().bottom;

	    var isVisible = (elemTop >= 0) && (elemBottom <= window.innerHeight);
	    return isVisible;
    };
  })
  .factory('ajaxCallFact', function($http,baseUrl) {

    return {

      getData: function(id) {
		
         return $http.get(baseUrl + id);

      }

    }

  })

.controller("mainCtrl",function($scope,ajaxCallFact,elemInViewportSvc,$document){
 
 $scope.data = {id:862};
 $scope.data.results = [],nextId = "";
/*
 function Owner(ownerObj){
   this.loginName = ownerObj.loginName;
   this.type = ownerObj.type;
 }

 function Repository(obj){
   this.id = obj.id;
   this.full_name = obj.full_name;
   this.owner = new Owner(obj.owner);
 }
 */

 function _setNextId(id){
	 nextId = id;
 }
 
 function _getNextId(){
	 return nextId;
 }
 
 $scope.setObject = function(obj,index){	 
	 console.log(index);
 }
 
 var _successCb = function(resp){
       $scope.data.results = $scope.data.results.concat(resp.data);	   
	   var link = resp.headers()["link"],
	       pat = /(since=)\d+/gi,
		   id = link.match(pat)[0].replace("since=","");
		_setNextId(id);   
     },
     _errorCb = function(err){
      console.log("error in api response");
     },
     _scrollCb = function(e){
        var lastItem = angular.element(document.getElementsByClassName('lastItem_'+$scope.data.id));
	    if(elemInViewportSvc.isScrolledIntoView(lastItem[0])){
          console.log("lastItem found !");          
		  ajaxCallFact.getData(_getNextId()).then(_successCb,_errorCb);
        }
     };
 ajaxCallFact.getData($scope.data.id).then(_successCb,_errorCb);
 angular.element($document).on('scroll', _scrollCb);
   
})
