function TIME(a,b=false){
	var Y,M,D,h,m,s
	var date = new Date(a);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    Y = date.getFullYear() + '-';
    M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
    D = ((date.getDate()<10) ? '0' + date.getDate() : date.getDate() );
    h = ((date.getHours()<10) ? '0' + date.getHours() : date.getHours() ) + ':';
    m = ((date.getMinutes()<10) ? '0' + date.getMinutes() : date.getMinutes() ) + ':';
    s = ((date.getSeconds()<10) ? '0' + date.getSeconds() : date.getSeconds() );
    if(b)
    	return Y+M+D
    else
    	return Y+M+D+' '+h+m+s;
}
export default TIME;