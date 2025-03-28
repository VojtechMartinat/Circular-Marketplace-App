import React from 'react';
import './background.css';  

const ProjectOverview = () => {
    return (
        <div className="project-overview-container">
            <header className="project-header">
                <h1>Overview</h1>
            </header>

            <section className="overview-section">
                <h2>About the Project</h2>
                <p>
                    This project aims to transform second-hand marketplaces by harnessing the power of AI to deliver an unparalleled user experience. 
                    As part of this initiative, you will develop a dedicated, robust app for Android and iOS, enabling users to effortlessly add items 
                    they no longer use to the platform. Unlike existing platforms, our vision includes an integrated minimal chatbot that simplifies 
                    uploading photos and describing items. Whether a user prefers typing or voice control, the app shall ensure a streamlined, 
                    quick, and user-friendly experience. Additionally, AI shall be used to classify and tag uploaded photos for precise and efficient 
                    searches later by other users, perfectly matching users with the items they seek. Join us in creating a circular marketplace platform 
                    that sets new standards for simplicity and efficiency, contributing to reducing waste and fostering greater sharing.
                </p>
            </section>

            <section className="project-goals-section">
                <h2>Project Goals</h2>
                <ul>
                    <li>Protect the environment since items can be reused and renewed.</li>
                    <li>Provide the seller a quick and convenient way to get rid of items they no longer want, for money.</li>
                    <li>Provide the buyer a straightforward way to find the articles they desire.</li>
                </ul>
            </section>

            <section className="user-stories-section">
                <h2>User Stories</h2>
                
                <h3>As a buyer:</h3>
                <ul>
                    <li>I want to easily and simply upload items I no longer need, so I can declutter my home and contribute to a sustainable lifestyle.</li>
                    <li>I want to search for specific items quickly via a simple yet powerful search tool, so I can find what I need without searching through irrelevant listings.</li>
                </ul>

                <h3>As a seller:</h3>
                <ul>
                    <li>I want to interact with a chatbot for assistance, so I can get help with uploading items or navigating the app.</li>
                    <li>I want photos of my wares to be easy to find by other users, so I have a better chance of selling them.</li>
                </ul>
            </section>

            <footer className="team-footer">
                <h3>Brought to you by: (UoBristol students)</h3>
                <ul>
                    <li>Lukasz Krepa</li>
                    <li>Karena Ho</li>
                    <li>Vojtech Martinat</li>
                    <li>Herman Tsoi</li>
                    <li>Jagannath Sankar</li>
                </ul>

                <h3>Owned by:</h3>
                <ul>
                    <li>Marius Jurt & Flurin Jurt</li>
                </ul>
            </footer>
        </div>
    );
};

export default ProjectOverview;

