import { useAuth0 } from "@auth0/auth0-react";

export const LoginButton=()=>{
    const { loginWithRedirect } = useAuth0();
    const boton_login = ()=>{
        loginWithRedirect() //login de auth0
    };
    return (
        <button 
        onClick={()=>boton_login()}
        className="button login"
        >
        Log In
        </button>
    );
}

export const LogoutButton=()=>{
    const { logout } = useAuth0();
    const boton_logout = ()=>{
        logout({ logoutParams:{returnTo:window.location.origin}})
    };
    return (
        <button 
        onClick={()=>boton_logout()} 
        className="button logout"
        >
        Log out
        </button>
    );
}