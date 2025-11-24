import {create} from 'zustand';

export const useAuthStore=create((set)=>({
    user:null,
    token:null,
    role:null,

    login:(user,token)=>set({
        user,
        token,
        role:user.role,
    }),

    logout:()=>set({
        user:null,
        token:null,
        role:null, 
    }),
}));

        