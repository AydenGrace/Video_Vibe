import React, { useEffect, useState } from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import { changePwd, signup } from "../../apis/users";
import Modal from "../../components/Modal/Modal";
import style from "./Change_Pwd.module.scss";

export default function Change_Pwd() {
  const [feedback, setFeedback] = useState("");
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const { token } = useParams();
  const [decodeToken, setDecodeToken] = useState(null);
  useEffect(() => {
    setDecodeToken(token.replaceAll(",", "."));
  }, []);

  const schema = yup.object({
    password: yup
      .string()
      .required("Le mot de passe est obligatoire")
      .min(5, "trop court"),
    confirmPassword: yup
      .string()
      .required("Vous devez confirmer votre mot de passe")
      .oneOf([yup.ref("password"), ""], "Les mots ne correspondent pas"),
  });

  const defaultValues = {
    password: "",
    confirmPassword: "",
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

  function handleCloseModal() {
    setShowModal(false);
    navigate("/login");
  }

  async function submit(values) {
    try {
      const response = await changePwd(values, decodeToken);
      console.log(response);
      setFeedback(response.message);
      reset(defaultValues);
      setShowModal(true);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="d-flex center flex-column flex-fill">
      <form onSubmit={handleSubmit(submit)}>
        <div className="d-flex flex-column mb-10">
          <label htmlFor="email" className="mb-10">
            New Password <span className="text-error">*</span>
          </label>
          <input
            {...register("password")}
            type="password"
            id="password"
            className="mb-10"
          />
          {errors.password && (
            <p className="text-error">{errors.password.message}</p>
          )}
        </div>
        <div className="d-flex flex-column mb-10">
          <label htmlFor="email" className="mb-10">
            Confirm New Password <span className="text-error">*</span>
          </label>
          <input
            {...register("confirmPassword")}
            type="password"
            id="confirmPassword"
            className="mb-10"
          />
          {errors.confirmPassword && (
            <p className="text-error">{errors.confirmPassword.message}</p>
          )}
        </div>
        <button className="btn btn-primary">Submit</button>
      </form>
      {showModal && (
        <Modal onClose={handleCloseModal} feedback={feedback}>
          <button
            className="btn btn-reverse-primary"
            onClick={handleCloseModal}
          >
            X
          </button>
        </Modal>
      )}
    </div>
  );
}
