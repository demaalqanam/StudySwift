import React, { useEffect, useState } from "react";
import AudioPlayer from "react-h5-audio-player";
import { useAudioPlayer } from "react-use-audio-player";
import "react-h5-audio-player/lib/styles.css";
import { RiPlayListFill } from "react-icons/ri";
import songsData from "../assets/audio/songs.json";
import aud from "../assets/audio/town-10169.mp3";
import { BiHide } from "react-icons/bi";
function MusicPlayer({ showMusicPlayer, setShowMusicPlayer }) {
  const [showLibrary, setShowLibrary] = useState(false);
  const [currentSong, setCurrentSong] = useState();

  useEffect(() => {
    setCurrentSong(songsData[0]);
  }, []);

  //// Choose song action ////
  const chooseSong = (index) => {
    setShowLibrary(false);
    setCurrentSong(songsData[index]);
  };

  return (
    <div
      className="m-player"
      style={{ display: `${showMusicPlayer ? "flex" : "none"}` }}
    >
      <BiHide
        onClick={() => setShowMusicPlayer(false)}
        className="icon hide-i"
      />
      <RiPlayListFill
        onClick={() => setShowLibrary(true)}
        className="icon playlist-icon"
      />
      {showLibrary ? (
        <div className="library">
          <div className="list">
            {songsData?.map((song) => {
              return (
                <div className="song" onClick={() => chooseSong(song.index)}>
                  <img width={35} height={35} alt="" src={song.img} />
                  <p>{song.title}</p>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        ""
      )}
      <div className="p-img">
        <img alt="" src={currentSong?.img} />
        <h4>{currentSong?.title}</h4>
      </div>
      <AudioPlayer
        src={currentSong?.audio}

        // other props here
      />
    </div>
  );
}

export default MusicPlayer;
