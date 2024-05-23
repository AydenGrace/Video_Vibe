import React, { useState } from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { signup } from "../../apis/users";
import Modal from "../../components/Modal/Modal";
import styles from "./Register.module.scss";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { createAvatar } from "@dicebear/core";
import { lorelei } from "@dicebear/collection";

export default function Register() {
  const [feedback, setFeedback] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [seePwd, setSeePwd] = useState(false);
  const [seeConfPwd, setSeeConfPwd] = useState(false);
  const navigate = useNavigate();

  const schema = yup.object({
    username: yup.string().required("This is required."),
    // email: yup
    //   .string()
    //   .email()
    //   .required("Required")
    //   .matches(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g, "Mail non valide"),
    password: yup
      .string()
      .required("This is required.")
      .min(12, "This is too short.")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$#!%*?&])[A-Za-z\d@$#!%*?&]{12,}$/,
        "Your password need :\n1 lettre capitale\n1 lettre minuscule\n1 chiffre\n1 caractère spécial (&@$#!%*?&)"
      ),
    confirmPassword: yup
      .string()
      .required("This is required.")
      .oneOf([yup.ref("password"), ""], "This is not the same."),
    gender: yup.string().required("This is required."),
    rgpd: yup.boolean().oneOf([true], "You need to accept all conditions."),
  });

  const defaultValues = {
    username: "",
    // email: "",
    password: "",
    confirmPassword: "",
    gender: "other",
    rgpd: false,
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
    try {
      const response = await signup(values);
      console.log(response);
      setFeedback(response.message);
      if (response.message !== "Username already taken.") {
        reset(defaultValues);
      }
      setShowModal(true);
    } catch (error) {
      console.error(error);
    }
  }

  function handleSeePassword() {
    setSeePwd(!seePwd);
    if (seePwd) {
      document.getElementById("password").type = "password";
    } else {
      document.getElementById("password").type = "text";
    }
  }

  function handleSeeConfPassword() {
    setSeeConfPwd(!seeConfPwd);
    if (seeConfPwd) {
      document.getElementById("confirmPassword").type = "password";
    } else {
      document.getElementById("confirmPassword").type = "text";
    }
  }

  function handleCloseModal() {
    setShowModal(false);
    if (feedback === "Account created.") {
      navigate("/login");
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
          {errors.username && (
            <p className="text-error">{errors.username.message}</p>
          )}
        </div>
        {/* <div className="d-flex flex-column mb-10">
          <label htmlFor="email" className="mb-10">
            Email
          </label>
          <input
            {...register("email")}
            type="email"
            id="email"
            className="input-style"
          />
          {errors.email && <p className="text-error">{errors.email.message}</p>}
        </div> */}
        <div className="d-flex flex-column mb-10">
          <label htmlFor="password" className={`mb-10`}>
            Password <span> </span>
            <div className={`${styles.tooltip}`}>
              <i className={`fa-solid fa-circle-info ${styles.icon}`}></i>
              <div className={`${styles.tooltiptext}`}>
                <p>Your password need at least : </p>
                <ul>
                  <li>1 uppercase letter</li>
                  <li>1 lowercase letter</li>
                  <li>1 number</li>
                  <li>1 special character</li>
                </ul>
              </div>
            </div>
          </label>
          <div className={`d-flex center ${styles.relative}`}>
            <input
              {...register("password")}
              type="password"
              id="password"
              className="input-style flex-fill"
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

          {errors.password && (
            <p className="text-error">{errors.password.message}</p>
          )}
        </div>
        <div className="d-flex flex-column mb-10">
          <label htmlFor="confirmPassword" className="mb-10">
            Confirm Password
          </label>
          <div className={`d-flex center ${styles.relative}`}>
            <input
              {...register("confirmPassword")}
              type="password"
              id="confirmPassword"
              className="input-style flex-fill"
            />
            {seeConfPwd ? (
              <i
                className={`fa-solid fa-eye-slash c-p ${styles.pointer} p-5`}
                id="conf_mdp_not_toggle"
                onClick={handleSeeConfPassword}
              ></i>
            ) : (
              <i
                className={`fa-solid fa-eye c-p ${styles.pointer} p-5`}
                id="conf_mdp_toggle"
                onClick={handleSeeConfPassword}
              ></i>
            )}
          </div>
          {errors.confirmPassword && (
            <p className="text-error">{errors.confirmPassword.message}</p>
          )}
        </div>
        <div className="d-flex flex-column mb-20">
          <label htmlFor="gender">Gender</label>

          <div>
            <input
              {...register("gender")}
              type="radio"
              id="woman"
              className="mb-10"
              value="woman"
            />
            <label htmlFor="woman">Woman</label>
          </div>

          <div>
            <input
              {...register("gender")}
              type="radio"
              id="man"
              className="mb-10"
              value="man"
            />
            <label htmlFor="man">Man</label>
          </div>

          <div>
            <input
              {...register("gender")}
              type="radio"
              id="other"
              className="mb-10"
              value="other"
            />
            <label htmlFor="other">Other</label>
          </div>
          {errors.gender && (
            <p className="text-error">{errors.gender.message}</p>
          )}
        </div>
        <div className="d-flex flex-column mb-10">
          <label htmlFor="rgpd" className="mb-10">
            <input
              {...register("rgpd")}
              type="checkbox"
              className="mr-15"
              id="rgpd"
            />
            I have read and understood the
            <Link className={`${styles.underline}`}>privacy statement</Link>.
          </label>
          {errors.rgpd && <p className="text-error">{errors.rgpd.message}</p>}
        </div>
        <button className="btn btn-primary">Signin</button>
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
