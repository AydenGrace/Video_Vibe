import React, { useContext, useEffect, useState } from "react";
import styles from "./VideoCard.module.scss";
import ReactPlayer from "react-player";
import { searchById, updateUser } from "../../apis/users";
import { UserContext } from "../../context/UserContext";
import { dislike, like, unDislike, unLike } from "../../apis/videos";

export default function VideoCard({ Video }) {
  const { user } = useContext(UserContext);
  const [creator, setCreator] = useState(null);
  const [time, setTime] = useState();
  const [likedClass, setLikedClass] = useState('');
  const [dislikedClass, setDisikedClass] = useState('');

  useEffect(() => {
    async function getCreator() {
      try {
        const response = await searchById(Video.creator);
        if (response) {
          setCreator(response.user);
          if(user)
          {
            user.liked_videos.map((vid)=>{
              if(vid._id==Video._id){
                vid.likeOrDislike ? setLikedClass('liked') : setDisikedClass('disliked');
              }
            });
          }
        }
      } catch (e) {
        console.error(e);
      }
    }
    getCreator();
    getTime();
    setInterval(()=>{
      getTime();
    },60000);
  }, []);

  const getTime = () => {
    const lastUpdate = new Date(Video.createdAt);
    let seperateTime = Date.now() - lastUpdate;
    let message = ", il y a";
    const timeTab = [
      {
        valueInMilli : 31556926000,
        unit: 'année',
        isPlural: true,
      },
      {
        valueInMilli : 2629743000,
        unit: 'mois',
        isPlural: false,
      },
      {
        valueInMilli : 604800000,
        unit: 'semaine',
        isPlural: true,
      },
      {
        valueInMilli : 86400000,
        unit: 'jour',
        isPlural: true,
      },
      {
        valueInMilli : 3600000,
        unit: 'heure',
        isPlural: true,
      },
      {
        valueInMilli : 60000,
        unit: 'minute',
        isPlural: true,
      }
    ]

    if(seperateTime<timeTab[timeTab.length-1].valueInMilli)
    {
      console.log("moins d'une minute");
      message = ", à l'instant";
    }
    else{
      timeTab.map((time)=>{
        const response = calculateTime(seperateTime,time.valueInMilli,time.unit,time.isPlural);
        message += response.text;
        seperateTime = response.newTime;
      });
    }
    message +='.';
    setTime(message);
  }

  const calculateTime = (timeToConvert, dividend, unit, isPlural) => {
    const calc = Math.floor(timeToConvert/dividend);
    let text = '';
    if(!calc || calc===0)
    {
      return {text,newTime:timeToConvert};
    }
    let newTime = timeToConvert % dividend ;
    
    text = ` ${calc} ${unit}`;
    if(isPlural)
      calc > 1 ? text += 's' : null;
    return {text,newTime}
  }

  const handleLike = async (isLike) => {
    let indexOfVid = null;

    user.liked_videos.map((vid,index)=>{
      if(vid._id === Video._id) indexOfVid = index;
    });

    if(indexOfVid != null) //Video find in list
    {
      console.log('Video find');
      if(user.liked_videos[indexOfVid].likeOrDislike === isLike) {
        user.liked_videos.splice(indexOfVid,1);
        if(isLike)
        {
          setLikedClass('');
          unLike(Video);
          Video.likes --;
        }else{
          setDisikedClass('');
          unDislike(Video);
          Video.dislikes --;
        }
        console.log('Video delete from array');
      }
      else {
        user.liked_videos[indexOfVid].likeOrDislike = isLike
        if(isLike)
        {
          setLikedClass('liked');
          like(Video);
          Video.likes ++;

          setDisikedClass('');
          unDislike(Video);
          Video.dislikes --;

        } else {
          setLikedClass('');
          unLike(Video);
          Video.likes --;
          setDisikedClass('disliked');
          dislike(Video);
          Video.dislikes ++;
        }
        console.log('Video updated');
      }
    } else { //Video not find
      console.log('Video not find');
      user.liked_videos.push({
        _id: Video._id,
        likeOrDislike: isLike
      });
      if(isLike)
        {
          setLikedClass('liked');
          like(Video);
          Video.likes ++;
        } else {
          setDisikedClass('disliked');
          dislike(Video);
          Video.dislikes ++;
        }
    }
    const response = await updateUser(user);
    console.log(response);
  }

  return (
    <div className={`d-flex flex-column center card p-20 ${styles.element}`}>
      <ReactPlayer url={Video.url} controls={true} />
      <div className={`${styles.title_section}`}>
        <h2>{Video.title}</h2>
        {user&& <div className={`${styles.like_section}`}>
          <i className={`fa-regular fa-thumbs-up ${likedClass}`} onClick={()=>handleLike(true)}></i>
          <p>{Video.likes}</p>
          <i className={`fa-regular fa-thumbs-down ${dislikedClass}`} onClick={()=>handleLike(false)}></i>
          <p>{Video.dislikes}</p>
        </div>}
        
      </div>
      {creator && (
        <div className={`${styles.creator_section}`}>
          <img src={creator.avatar} alt="Avatar" style={{ width: "30px" }} />
          <p><strong>{creator.username}</strong>{time}</p>
        </div>
      )}
    </div>
  );
}
