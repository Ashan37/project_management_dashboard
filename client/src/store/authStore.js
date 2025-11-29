import {create} from 'zustand';
import {persist} from 'zustand/middleware';

export const useAuthStore=create(
    persist(
        (set)=>({
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
        }),
        {
            name: 'auth-storage', 
        }
    )
);

        