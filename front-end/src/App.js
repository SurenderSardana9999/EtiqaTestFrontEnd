import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = "http://localhost:5169/api/freelancers";
const API_HOBBIES_URL = "http://localhost:5169/api/Freelancers/hobbies";
const API_SKILLS_URL = "http://localhost:5169/api/Freelancers/skills";

export default function FreelancerApp() {
    const [freelancers, setFreelancers] = useState([]);
    const [hobbies, setHobbies] = useState([]);
    const [skills, setSkills] = useState([]);
    const [form, setForm] = useState({
        id: 0,
        username: "",
        email: "",
        phoneNumber: "",
        isArchived: false,
        skillMappings: [],
    });

    useEffect(() => {
        fetchFreelancers();
        fetchHobbies();
        fetchSkills();
    }, []);

    const fetchFreelancers = async () => {
        const response = await axios.get(API_BASE_URL);
        setFreelancers(response.data);
    };

    const fetchHobbies = async () => {
        const response = await axios.get(API_HOBBIES_URL);
        setHobbies(response.data);
    };

    const fetchSkills = async () => {
        const response = await axios.get(API_SKILLS_URL);
        setSkills(response.data);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        debugger;
        if (form.id) {
            await axios.put(`${API_BASE_URL}/${form.id}`, form);
        } else {
            await axios.post(API_BASE_URL, form);
        }
        fetchFreelancers();
        setForm({ id: 0, username: "", email: "", phoneNumber: "", isArchived: false, skillMappings: [] });
    };

    const handleDelete = async (id) => {
        await axios.delete(`${API_BASE_URL}/${id}`);
        fetchFreelancers();
    };

    //const handleSelectChange = (e, type) => {
    //    const selectedIds = Array.from(e.target.selectedOptions, (option) => parseInt(option.value));
    //    setForm({
    //        ...form,
    //        skillMappings: selectedIds.map((id) => ({ [type]: id })),
    //    });
    //};

    const handleSelectChange = (e, type) => {
        const selectedIds = Array.from(e.target.selectedOptions, (option) => parseInt(option.value));

        setForm((prevForm) => {
            // Ensure skillMappings is always an array
            const existingMappings = Array.isArray(prevForm.skillMappings) ? prevForm.skillMappings : [];

            let updatedMappings;

            if (type === "hobbiesId") {
                updatedMappings = selectedIds.map((id) => ({
                    freelancerId: prevForm.id || 0,
                    hobbiesId: id,
                    skllsId: null, // Do not overwrite skills
                }));
            } else if (type === "skllsId") {
                updatedMappings = selectedIds.map((id) => ({
                    freelancerId: prevForm.id || 0,
                    hobbiesId: null, // Do not overwrite hobbies
                    skllsId: id,
                }));
            }

            return {
                ...prevForm,
                skillMappings: [...existingMappings, ...updatedMappings],
            };
        });
    };


    return (
        <div className="container">
            <h1>Freelancer Management</h1>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
                <input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                <input type="text" placeholder="Phone Number" value={form.phoneNumber} onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })} />
                <label>Hobbies:</label>
                <select multiple onChange={(e) => handleSelectChange(e, "hobbiesId")}>
                    {hobbies.map((hobby) => (
                        <option key={hobby.id} value={hobby.id}>
                            {hobby.name}
                        </option>
                    ))}
                </select>
                <label>Skills:</label>
                <select multiple onChange={(e) => handleSelectChange(e, "skllsId")}>
                    {skills.map((skill) => (
                        <option key={skill.id} value={skill.id}>
                            {skill.name}
                        </option>
                    ))}
                </select>
                <button type="submit">{form.id ? "Update" : "Save"}</button>
            </form>

            <div className="list">
                {freelancers.map((f) => (
                    <div key={f.id} className="card">
                        <p><strong>{f.username}</strong> - {f.email}</p>
                        <p>Phone: {f.phoneNumber}</p>
                        <button onClick={() => setForm(f)}>Edit</button>
                        <button onClick={() => handleDelete(f.id)}>Delete</button>
                    </div>
                ))}
            </div>
        </div>
    );
}
