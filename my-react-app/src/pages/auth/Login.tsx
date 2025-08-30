
import {useGoogleLogin} from "@react-oauth/google";
import * as React from "react";

const Login : React.FC = () => {

    const loginByGoogle = useGoogleLogin({
        onSuccess: tokenResponse => {
            console.log("Get Google token",tokenResponse.access_token)
        },
    });

    return (
        <>
            <h1 className="text-3xl font-bold text-center mb-5 mt-4">
                Вхід
            </h1>
            <button onClick={() => loginByGoogle()}>Sign in with Google 🚀</button>
        </>
    )
}

export default Login