import React, { useContext, useState } from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import Modal from "../../components/Modal/Modal";
import { signin } from "../../apis/users";
import { UserContext } from "../../context/UserContext";
import styles from "./Login.module.scss";

export default function Login() {
  const [feedback, setFeedback] = useState("");
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const { setConnectedUser } = useContext(UserContext);
  const [seePwd, setSeePwd] = useState(false);

  const schema = yup.object({
    username: yup.string().required("Le nom d'utilisateur est requis."),
    password: yup.string().required("Le mot de passe est obligatoire."),
  });

  const defaultValues = {
    username: "",
    password: "",
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues,
    mode: "onChange",
    resolver: yupResolver(schema),
  });

  async function submit(values) {
    // console.log(values);
    try {
      const response = await signin(values);
      // console.log(response);
      if (!response.message) {
        localStorage.setItem("user", JSON.stringify(response));
        setConnectedUser(response.user);
        setFeedback("Connexion réussie");
        reset(defaultValues);
        setShowModal(true);
      } else {
        setFeedback(response.message);
        setShowModal(true);
      }
      setShowModal(true);
    } catch (error) {
      console.error(error);
    }
  }

  function handleSeePassword() {
    setSeePwd(!seePwd);
    if (seePwd) {
      document.getElementById("login_password").type = "password";
    } else {
      document.getElementById("login_password").type = "text";
    }
  }

  function handleCloseModal() {
    setShowModal(false);
    if (feedback === "Connexion réussie") {
      navigate("/");
    }
  }

  return (
    <div className="d-flex center flex-column flex-fill">
      <form onSubmit={handleSubmit(submit)}>
        <div className="d-flex flex-column mb-10">
          <label htmlFor="username" className="mb-10">
            Username
          </label>
          <input
            {...register("username")}
            type="text"
            id="username"
            className="input-style"
          />
          {errors.email && <p className="text-error">{errors.email.message}</p>}
        </div>
        <div className="d-flex flex-column mb-10">
          <label htmlFor="login_password" className="mb-10">
            Password
          </label>
          <div className={`d-flex center ${styles.relative}`}>
            <input
              {...register("password")}
              type="password"
              id="login_password"
              className="input-style"
            />
            {seePwd ? (
              <i
                className={`fa-solid fa-eye-slash c-p ${styles.pointer} p-5`}
                id="mdp_not_toggle"
                onClick={handleSeePassword}
              ></i>
            ) : (
              <i
                className={`fa-solid fa-eye c-p ${styles.pointer} p-5`}
                id="mdp_toggle"
                onClick={handleSeePassword}
              ></i>
            )}
          </div>

          <div className={`d-flex ${styles.Forgot}`}>
            <Link to={"/"}>Forgot password ?</Link>
          </div>
          {errors.password && (
            <p className="text-error">{errors.password.message}</p>
          )}
        </div>
        <button className="btn btn-primary">Connect</button>
      </form>
      {showModal && (
        <Modal onClose={handleCloseModal} feedback={feedback}>
          <button
            className="btn btn-reverse-primary"
            onClick={handleCloseModal}
          >
            Close
          </button>
        </Modal>
      )}
    </div>
  );
}
