import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const withHOCCheckAuth = (WrappedComponent) => {
	
	return (props) => {

		const router = useRouter();
		const [loginAdmin, setLoginAdmin] = useState(null);

		//next js를 사용하므로 SSR시에는 브라우저 내장객체인 sessionStorage를 인식 못하고 
		//"sessionStorage is not defined" 에러 발생
		//componentDidMount(useEffect사용)시 sessionStorage를 사용할 수 있음
		useEffect(() => {
			const tmpLoginAdmin = sessionStorage?.getItem("loginAdmin");
			setLoginAdmin(tmpLoginAdmin);
						
			if (!tmpLoginAdmin) {
				router.push('/');
			}

		}, []);

		console.log("withHOCCheckAuth : ", loginAdmin);

		if (!loginAdmin) {
			return null;
		}

		return (
			<WrappedComponent {...props} />
			
		);
	
	}
}

export default withHOCCheckAuth;