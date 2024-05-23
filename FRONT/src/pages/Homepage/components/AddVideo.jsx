import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../context/UserContext";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import styles from "./AddVideo.module.scss";
import app from "../../../firebase";

import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { VideoContext } from "../../../context/VideoContext";

export default function AddVideo() {
  const { user } = useContext(UserContext);
  const [feedback, setFeedback] = useState("");
  const [video, setVideo] = useState(null);
  const [videoURL, setVideoURL] = useState("");
  const [videoProgress, setVideoProgress] = useState(0);
  const { addNewVideo } = useContext(VideoContext);

  const schema = yup.object({
    video: yup.mixed().required(),
    name: yup.string().required(),
  });

  const defaultValues = {
    video: null,
    name: "",
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

  useEffect(() => {
    videoProgress === 100 && resetForm();
  }, [videoProgress]);

  const uploadFile = async (video) => {
    const { file, title } = video;
    const storage = getStorage(app);
    const filename = title;
    const storageRef = ref(storage, "videos/" + filename);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // console.log(snapshot);
        setVideoProgress(
          Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
        );
      },
      (err) => {
        switch (err.code) {
          case "storage/unauthorized":
            console.error("Accès non autorisé");
            break;
          default:
            console.error(err);
        }
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setVideoURL(downloadURL.toString());
          sendToBackEnd(video, downloadURL.toString());
          // addNewVideo(video);
        });
      }
    );
  };

  async function sendToBackEnd(videoToUpload, url) {
    const message = {
      title: videoToUpload.title,
      url: url,
      creator: user._id,
    };
    try {
      const response = await fetch("http://localhost:5000/api/videos/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(message),
      });

      const newVid = await response.json();
      addNewVideo(newVid.video);
      // console.log("UPLOAD RETURN : ");
      // console.log(newVid);
      resetForm();
    } catch (e) {
      console.error(e);
    }
  }

  async function submit(values) {
    const videoToUpload = {
      title: values.name,
      file: values.video[0],
    };
    try {
      // console.log(videoToUpload);
      await uploadFile(videoToUpload);
    } catch (e) {
      console.error(e);
    }
  }

  function resetForm() {
    reset(defaultValues);
    setVideoURL("");
    setVideo(null);
    setVideoProgress(0);
    setFeedback("Vidéo mise en ligne.");
  }

  return (
    <section className={`${styles.section}`}>
      <h2>Add a Video</h2>
      <form
        className="d-flex center flex-column"
        onSubmit={handleSubmit(submit)}
      >
        <input
          {...register("video")}
          type="file"
          name="video"
          id="video"
          accept="video/mp4,video/x-m4v,video/*"
          onChange={(e) => setVideo(() => e.target.files[0])}
          className="mb-10"
        />
        <div className="d-flex flex-column">
          <label htmlFor="name">Title</label>
          <input
            {...register("name")}
            type="text"
            name="name"
            id="name"
            className="input-style mb-10"
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Send
        </button>
      </form>
      <p>{videoProgress > 0 ? `Uploading ${videoProgress}%` : ""}</p>
      {feedback && <p>{feedback}</p>}
    </section>
  );
}
