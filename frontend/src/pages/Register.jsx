import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {

    const navigate = useNavigate();
    const [avatar, setavatar] = useState(null);    // To store the avatar file
    const [coverImg, setcoverImg] = useState(null); // To store the cover image file
    const [previewavatar, setpreviewavatar] = useState(null); // To preview avatar image
    const [previewcoverImg, setpreviewcoverImg] = useState(null); // To preview cover image
    const [formdata, setformdata] = useState({
        username: '',
        email: '',
        password: '',
        fullname: '',
    });

    const handleChange = (e) => {
        setformdata({ ...formdata, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        // Create a new FormData instance to send as a form payload
        const form = new FormData();

        // Append the regular fields
        form.append("username", formdata.username);
        form.append("email", formdata.email);
        form.append("password", formdata.password);
        form.append("fullname", formdata.fullname);

        // Append the avatar file if it exists
        if (avatar) {
            form.append("avatar", avatar);
        }

        // Append the cover image file if it exists
        if (coverImg) {
            form.append("coverImg", coverImg);
        }
        console.log(formdata);
        axios.post('http://localhost:8000/api/v1/users/register', form, {
            withCredentials: true, // if you're using cookies for session management
        }).then((res) => {console.log(res.data);
           navigate('/login');
        }).catch((err) => {console.log(err);});
    };

    return (
        <div>
            <input
                type="text"
                name="username"
                value={formdata.username}
                onChange={handleChange}
                placeholder="Username"
            />
            <input
                type="email"
                name="email"
                value={formdata.email}
                onChange={handleChange}
                placeholder="Email"
            />
            <input
                type="password"
                name="password"
                value={formdata.password}
                onChange={handleChange}
                placeholder="Password"
            />
            <input
                type="text"
                name="fullname"
                value={formdata.fullname}
                onChange={handleChange}
                placeholder="Fullname"
            />
            
            {/* Avatar input */}
            <input
                type="file"
                name="avatar"
                onChange={(e) => {
                    setavatar(e.target.files[0]); // Capture selected file
                    setpreviewavatar(URL.createObjectURL(e.target.files[0])); // Preview the avatar
                }}
            />
            {previewavatar && <img src={previewavatar} alt="avatar" style={{ width: '100px', height: '100px' }} />} {/* Display preview */}

            {/* Cover image input */}
            <input
                type="file"
                name="coverImg"
                onChange={(e) => {
                    setcoverImg(e.target.files[0]); // Capture selected file
                    setpreviewcoverImg(URL.createObjectURL(e.target.files[0])); // Preview the cover image
                }}
            />
            {previewcoverImg && <img src={previewcoverImg} alt="coverImg" style={{ width: '200px', height: '100px' }} />} {/* Display preview */}

            {/* Submit button */}
            <button onClick={handleSubmit}>Register</button>
        </div>
    );
}
export default Register;
