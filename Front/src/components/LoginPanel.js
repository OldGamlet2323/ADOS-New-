import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginPanel = () => {
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {

            const checkpointAppUrl = `http://localhost:3001/`;

            if (login == `test4`) {
                window.location.href = checkpointAppUrl;
            }
            // Отправка запроса на сервер
            const response = await fetch("http://localhost:8080/auth/login", {
                method: "POST",
                headers: {

                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ login, password }),
            });


            if (!response.ok) {
                throw new Error("Ошибка авторизации");
            }

            // Получение ответа
            const data = await response.json(); // Предполагаем, что сервер возвращает объект { role: "USER"/"ADMIN" }
            // Сохранение токена, если есть (опционально)
            if (data.token) {
                localStorage.setItem("authToken", data.token);
            }

            localStorage.setItem("role", data.role)
            switch (data.role) {
                case "DUTY_OFFICER_OF_MILITARY_UNIT":
                    navigate("/dutyOfficer");
                    break;
                case "CHIEF_OF_TROOPS_SERVICE":
                    navigate("/сommandantOfficer");
                    break;
                case "CHIEF_OF_STAFF":
                    navigate("/staffOfficer");
                    break;
                default:
                    alert("Unknown role");
            }
        } catch (err) {
            alert(err.message || "Произошла ошибка");
        }
    };

    return (
        <div className="login-wrapper">
            <div className="login-container">
                <h2>Login</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="login"
                        placeholder="Login"
                        value={login}
                        onChange={(e) => setLogin(e.target.value)}

                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autocomplete="current-password"
                    />
                    <button type="submit">Login</button>
                </form>
            </div>
        </div>
    );
};

export default LoginPanel;
