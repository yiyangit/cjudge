checkers.IgnoreSpace=function(A,B){
	function trim(str) {
    	return str.replace(/^(\s|\u00A0)+/, '').replace(/(\s|\u00A0)+$/, '');
 	}
 	return (trim(A)===trim(B)?100:0);
}
checkers.Strict=function(A,B){
 	return (A==B?100:0);
}