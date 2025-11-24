import {Navigate} from "react-router-dom";
import {useAuthStore} from "../store/authStore";

export default function ProtectedRoute({children, allowedRoles}){
    const {token,role}=useAuthStore();

    if(!token) return <Navigate to ='/Login'/>;

    if(allowedRoles && !allowedRoles.includes(role)){
        return <Navigate to='/login'/>;
    }
    return children;
}