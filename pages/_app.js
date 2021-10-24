import '../styles/globals.css'
import 'antd/dist/antd.css';
import '../styles/shinyoung.css';
import wrapper from "../store/configureStore";
import Head from 'next/head';

function Shinyoung({ Component, pageProps }) {

    return (
        <>
            <Head>
                <meta charSet="utf-8" />
                <title>신영냉장</title>
            </Head>
            <Component {...pageProps}/>
        </>
    )

}

export default wrapper.withRedux(Shinyoung);
