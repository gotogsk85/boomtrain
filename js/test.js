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
  .service("dataStructureSVCs",function(){
	  var svcObj = this;
	  svcObj.OwnerClass = function(ownerObj){
		  this.login = ownerObj.login;
		  this.type = ownerObj.type;
	  }
	  
	  svcObj.RepositoryClass = function(respObj){
		this.owner = new svcObj.OwnerClass(respObj.owner) ;
		this.name = respObj.name;
		this.full_name = respObj.full_name;
		this.url = respObj.url;
	  }
	  // just using getters to extract the variable names 
	  svcObj.RepositoryClass.prototype.getRepoUrl = function(){
		  return this.url;
	  }	  	  
	  svcObj.RepositoryClass.prototype.getRepoName = function(){
		  return this.name;
	  }	  
	  svcObj.RepositoryClass.prototype.getFullName = function(){
		  return this.full_name;
	  }
	  svcObj.RepositoryClass.prototype.getOwnerLogin = function(){
		  return this.owner.login;
	  }	  
	  svcObj.RepositoryClass.prototype.getOwnerType = function(){
		  return this.owner.type;
	  }	  	  
  })
.controller("mainCtrl",function($scope,ajaxCallFact,elemInViewportSvc,$document,dataStructureSVCs){
 var vm = this ;
 $scope.data = {id:862};
 $scope.data.results = [],nextId = "";

 function _setNextId(id){
	 nextId = id;
 }
 
 function _getNextId(){
	 return nextId;
 }
 
 function _setResponseData(resp){
	 for(var c=0;c<resp.length;c++){
		 // setting repository class in dataStructureSVCs service and appending it to results array .
		 var rep = new dataStructureSVCs.RepositoryClass(resp[c]);
		 $scope.data.results.push(rep);
	 }
 }
  
 var _successCb = function(resp){
	   _setResponseData(resp.data);
	   var link = resp.headers()["link"],
	       pat = /(since=)\d+/gi,
		   id = link.match(pat)[0].replace("since=","");
		_setNextId(id);   
     },
     _errorCb = function(err){
      console.log("error in api response");
     },
     _scrollCb = function(e){
        var lastItem = angular.element(document.getElementsByClassName('lastItem'));
	    if(elemInViewportSvc.isScrolledIntoView(lastItem[0])){
          console.log("lastItem found !");          
		  $scope.data.id = _getNextId() ;
		  ajaxCallFact.getData(_getNextId()).then(_successCb,_errorCb);
        }
     };
 ajaxCallFact.getData($scope.data.id).then(_successCb,_errorCb);
 angular.element($document).on('scroll', _scrollCb);
   
})
