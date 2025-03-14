import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "../../components/header/header";
import Home from "../../components/home";
import ModelDataInput from "../../components/modelInput";

import "../../styles/component/dashboard.scss";

const Dashboard = () => {
    return (
        <div className="dashboard-layout">
            <Header />
            <div className="dashboard-content">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/model" element={<ModelDataInput />} />
                    {/* <Route path="/suggestions" element={<div>Suggestions Page</div>} />
                    <Route path="/chatbot" element={<div>Chatbot Page</div>} />
                    <Route path="/profile" element={<div>Profile Page</div>} /> */}
                </Routes>
            </div>
        </div>
    );
};

export default Dashboard;
