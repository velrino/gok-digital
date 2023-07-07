import React from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate, Outlet, Route, useNavigate } from "react-router-dom";

export const isAuthenticated = (): boolean => {
    const access_token = false;

    return (access_token) ? true : false;
}


export const ProtectedRoutes = (props: any) => {
    const authenticated: boolean = isAuthenticated();

    if (props.roleRequired) {
        return authenticated ? <Outlet /> : (<Navigate to="/denied" />)
    } else {
        return authenticated ? <Outlet /> : <Navigate to="/auth/login" />
    }
}

export const PublicRoutes: React.FC = () => {
    const translate = useTranslation();

    return isAuthenticated() ? <Navigate to="/home" /> : <Outlet context={[translate]} />
}