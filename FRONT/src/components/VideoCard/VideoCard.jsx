import React, { useContext, useEffect, useState } from "react";
import styles from "./VideoCard.module.scss";
import ReactPlayer from "react-player";
import { searchById, updateUser } from "../../apis/users";
import { UserContext } from "../../context/UserContext";
import { dislike, like, unDislike, unLike } from "../../apis/videos";

export default function VideoCard({ Video }) {
  const { user, getLocalUser, updateLocalUser } = useContext(UserContext);
  const [creator, setCreator] = useState(null);
  const [time, setTime] = useState();
  const [likedClass, setLikedClass] = useState("fa-regular");
  const [dislikedClass, setDisikedClass] = useState("fa-regular");

  useEffect(() => {
    console.log("UseEffect");
    async function getCreator() {
      try {
        const response = await searchById(Video.creator);
        if (response) {
          setCreator(response.user);
          console.log(user);
          const localUser = await getLocalUser();
          user ? setLikes(user) : localUser ? setLikes(localUser) : null;
        }
      } catch (e) {
        console.error(e);
      }
    }
    getCreator();
    getTime();
    setInterval(() => {
      getTime();
    }, 60000);
  }, []);

  const setLikes = (user) => {
    user.liked_videos.map((vid) => {
      console.log("Vérification des vidéos likées :");
      console.log(vid);
      console.log(Video);
      if (vid._id === Video._id) {
        vid.likeOrDislike
          ? setLikedClass("liked fa-solid")
          : setDisikedClass("disliked fa-solid");
      }
    });
  };

  const getTime = () => {
    const lastUpdate = new Date(Video.createdAt);
    let seperateTime = Date.now() - lastUpdate;
    let message = "";
    const timeTab = [
      {
        valueInMilli: 31556926000,
        unit: "year",
        isPlural: true,
      },
      {
        valueInMilli: 2629743000,
        unit: "month",
        isPlural: false,
      },
      {
        valueInMilli: 604800000,
        unit: "week",
        isPlural: true,
      },
      {
        valueInMilli: 86400000,
        unit: "day",
        isPlural: true,
      },
      {
        valueInMilli: 3600000,
        unit: "hour",
        isPlural: true,
      },
      {
        valueInMilli: 60000,
        unit: "minute",
        isPlural: true,
      },
    ];

    if (seperateTime < timeTab[timeTab.length - 1].valueInMilli) {
      console.log("moins d'une minute");
      message = ", just right now";
    } else {
      timeTab.map((time) => {
        const response = calculateTime(
          seperateTime,
          time.valueInMilli,
          time.unit,
          time.isPlural
        );
        message += response.text;
        seperateTime = response.newTime;
      });
      message += " ago";
    }
    message += ".";
    setTime(message);
  };

  const calculateTime = (timeToConvert, dividend, unit, isPlural) => {
    const calc = Math.floor(timeToConvert / dividend);
    let text = "";
    if (!calc || calc === 0) {
      return { text, newTime: timeToConvert };
    }
    let newTime = timeToConvert % dividend;

    text = ` ${calc} ${unit}`;
    if (isPlural) calc > 1 ? (text += "s") : null;
    return { text, newTime };
  };

  const handleLike = async (isLike) => {
    let indexOfVid = null;

    user.liked_videos.map((vid, index) => {
      if (vid._id === Video._id) indexOfVid = index;
    });

    if (indexOfVid != null) {
      //Video find in list
      console.log("Video find");
      if (user.liked_videos[indexOfVid].likeOrDislike === isLike) {
        user.liked_videos.splice(indexOfVid, 1);
        if (isLike) {
          setLikedClass("fa-regular");
          unLike(Video);
          Video.likes--;
        } else {
          setDisikedClass("fa-regular");
          unDislike(Video);
          Video.dislikes--;
        }
        console.log("Video delete from array");
      } else {
        user.liked_videos[indexOfVid].likeOrDislike = isLike;
        if (isLike) {
          setLikedClass("liked fa-solid");
          like(Video);
          Video.likes++;

          setDisikedClass("fa-regular");
          unDislike(Video);
          Video.dislikes--;
        } else {
          setLikedClass("fa-regular");
          unLike(Video);
          Video.likes--;
          setDisikedClass("disliked fa-solid");
          dislike(Video);
          Video.dislikes++;
        }
        console.log("Video updated");
      }
    } else {
      //Video not find
      console.log("Video not find");
      user.liked_videos.push({
        _id: Video._id,
        likeOrDislike: isLike,
      });
      if (isLike) {
        setLikedClass("liked fa-solid");
        like(Video);
        Video.likes++;
      } else {
        setDisikedClass("disliked fa-solid");
        dislike(Video);
        Video.dislikes++;
      }
    }
    const response = await updateUser(user);
    updateLocalUser(user);
    console.log(response);
  };

  return (
    <div className={`d-flex flex-column center card p-20 ${styles.element}`}>
      <div className={`${styles.player_wrapper}`}>
        <ReactPlayer
          width="100%"
          height="100%"
          url={Video.url}
          controls={true}
          className={`${styles.react_player}`}
        />
      </div>
      <div className={`${styles.title_section}`}>
        <h2>{Video.title}</h2>
        {user && (
          <div className={`${styles.like_section}`}>
            <i
              className={` fa-thumbs-up ${likedClass}`}
              onClick={() => handleLike(true)}
            ></i>
            <p>{Video.likes}</p>
            <i
              className={` fa-thumbs-down ${dislikedClass}`}
              onClick={() => handleLike(false)}
            ></i>
            <p>{Video.dislikes}</p>
          </div>
        )}
      </div>
      {creator && (
        <div className={`${styles.creator_section}`}>
          {/* <div
            className={`${styles.avatar}`}
            style={{ backgroundImage: creator.avatar }}
            id="avatar"
          ></div> */}
          <img
            src={creator.avatar}
            alt="Avatar"
            className={`${styles.avatar}`}
          />
          <p>
            <strong>{creator.username}</strong>
            {time}
          </p>
        </div>
      )}
    </div>
  );
}
