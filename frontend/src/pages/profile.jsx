import "./profile.css";
import { useState,useEffect } from "react";

export default function Profile(){

    const[user,setUser]=useState(null);

    useEffect(()=>{
    const fetchProfile=async()=>{

        const token=localStorage.getItem("token");
        const response=await fetch("http://localhost:8000/me",{
            headers:{
                Authorization:`Bearer ${token}`,

            },
        });

        const data=await response.json();

        if(response.ok)
        {
            setUser(data);
        }
        else
        {
            console.log(data.detail);
        }
    };

    fetchProfile();

    },[]);


    if (!user) {
        return (
            <div className="loading-page">
                <div className="loading-card">
                    <div className="loading-text">
                        Loading...
                    </div>
                </div>
            </div>
        );
    }
    
    return (
        <div className="profile-page">
            <div className="profile-card">
                <h1>My Profile</h1>
    
                <div className="profile-info">
    
                    <div className="profile-field">
                        <span className="profile-label">Email</span>
                        <span className="profile-value">{user.email}</span>
                    </div>
    
                    { <div className="profile-field">
                        <span className="profile-label">Role</span>
                        <span className="profile-value">{user.role}</span>
                    </div> }
    
                </div>
            </div>
        </div>
    );
}

