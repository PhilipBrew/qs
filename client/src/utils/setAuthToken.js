import axios from 'axios';

 const setAuthToken = token => {
	if(token){
		//APPLY TO EVERY REQUEST
		axios.defaults.headers.common['Authorization'] = token;
	}else{
		delete axios.defaults.headers.common['Authorization']
	}
}
export default setAuthToken;
