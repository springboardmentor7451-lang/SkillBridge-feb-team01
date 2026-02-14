import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const EditProfile = () => {
    const { user, setUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: user?.name || "",
        location: user?.location || "",
        bio: user?.bio || "",
        skills: user?.skills?.join(", ") || ""
    });

    const onChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = (e) => {
        e.preventDefault();

        const updatedUser = {
            ...user,
            ...formData,
            skills: formData.skills.split(",").map(s => s.trim())
        };

        setUser(updatedUser);
        navigate("/dashboard");
    };

    return (
        <div className="auth-container">
            <div className="register-form">
                <h2>Edit Profile</h2>

                <form onSubmit={onSubmit}>
                    <div className="form-group">
                        <label>Name</label>
                        <input name="name" value={formData.name} onChange={onChange} />
                    </div>

                    <div className="form-group">
                        <label>Location</label>
                        <input name="location" value={formData.location} onChange={onChange} />
                    </div>

                    <div className="form-group">
                        <label>Bio</label>
                        <textarea name="bio" value={formData.bio} onChange={onChange} />
                    </div>

                    <div className="form-group">
                        <label>Skills (comma separated)</label>
                        <input name="skills" value={formData.skills} onChange={onChange} />
                    </div>

                    <button className="btn" style={{ width: "100%" }}>
                        Save Changes
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditProfile;