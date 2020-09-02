import React from "react";
import {
  TextField,
  InputAdornment,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  makeStyles,
} from "@material-ui/core";
import { Link, AddBoxOutlined } from "@material-ui/icons";
import ReactPlayer from "react-player";
import SoundcloudPlayer from "react-player/lib/players/SoundCloud";
import YoutubePlayer from "react-player/lib/players/YouTube";
import { useMutation } from "@apollo/react-hooks";
import { ADD_SONG } from "../graphql/mutations";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    alignItems: "center",
  },
  urlIput: {
    margin: theme.spacing(1),
  },
  addSongButton: {
    margin: theme.spacing(1),
  },
  dialog: {
    textAlign: "center",
  },
  thumbnail: {
    width: "90%",
  },
}));

const DEFAULT_SONG = {
  duration: 0,
  title: "",
  artist: "",
  thumbnail: "",
};

function AddSong() {
  const [url, setUrl] = React.useState("");
  const [playable, setPlayable] = React.useState(false);
  const classes = useStyles();
  const [addSong, { error }] = useMutation(ADD_SONG);
  const [dialog, setDialog] = React.useState(false);
  const [song, setSong] = React.useState(DEFAULT_SONG);

  React.useEffect(() => {
    const isPlayable =
      SoundcloudPlayer.canPlay(url) || YoutubePlayer.canPlay(url);
    setPlayable(isPlayable);
  }, [url]);

  function handleChangeSong(event) {
    const { name, value } = event.target;
    setSong((prevSong) => ({
      ...prevSong,
      [name]: value,
    }));
  }

  function handleCloseDialog() {
    setDialog(false);
  }

  async function handleEditSong({ player }) {
    const nestedPlayer = player.player.player;
    let songData;
    if (nestedPlayer.getVideoData) {
      songData = getYoutubeInfo(nestedPlayer);
    } else if (nestedPlayer.getCurrentSound) {
      songData = await getSoundcloudInfo(nestedPlayer);
    }
    setSong({ ...songData, url });
  }

  async function handleAddSong() {
    try {
      const { title, url, thumbnail, artist, duration } = song;
      await addSong({
        variables: {
          url: url.length > 0 ? url : null,
          thumbnail: thumbnail.length > 0 ? thumbnail : null,
          artist: artist.length > 0 ? artist : null,
          title: title.length > 0 ? title : null,
          duration: duration > 0 ? duration : null,
        },
      });
      handleCloseDialog();
      setSong(DEFAULT_SONG);
      setUrl("");
    } catch (error) {
      console.log("Erreur adding song", error);
    }
  }

  function getYoutubeInfo(player) {
    const duration = player.getDuration();
    const { title, video_id, author } = player.getVideoData();
    const thumbnail = `http://img.youtube.com/vi/${video_id}/0.jpg`;
    return {
      duration,
      title,
      artist: author,
      thumbnail,
    };
  }

  function getSoundcloudInfo(player) {
    return new Promise((resolve) => {
      player.getCurrentSound((songData) => {
        if (songData) {
          resolve({
            duration: Number(songData.duration / 1000),
            title: songData.title,
            artist: songData.user.username,
            thumbnail: songData.artwork_url.replace("-large", "-t500x500"),
          });
        }
      });
    });
  }

  function handleError(field) {
    return error?.graphQLErrors[0]?.extensions?.path.includes(field);
  }

  const { title, thumbnail, artist } = song;
  return (
    <div className={classes.container}>
      <Dialog
        className={classes.dialog}
        open={dialog}
        onClose={handleCloseDialog}
      >
        <DialogTitle>Edit Song</DialogTitle>
        <DialogContent>
          <img
            src={thumbnail}
            alt="Song Thumbnail"
            className={classes.thumbnail}
          />
          <TextField
            value={title}
            onChange={handleChangeSong}
            margin="dense"
            label="Title"
            name="title"
            fullWidth
            error={handleError("title")}
            helperText={handleError("title") && "Champ obligatoire"}
          />
          <TextField
            value={artist}
            onChange={handleChangeSong}
            margin="dense"
            label="Artiste"
            name="artist"
            fullWidth
            error={handleError("artist")}
            helperText={handleError("artist") && "Champ obligatoire"}
          />
          <TextField
            value={thumbnail}
            onChange={handleChangeSong}
            margin="dense"
            label="Thumbnail"
            name="thumbnail"
            fullWidth
            error={handleError("thumbnail")}
            helperText={handleError("thumbnail") && "Champ obligatoire"}
          />
        </DialogContent>
        <DialogActions>
          <Button color="secondary" onClick={handleCloseDialog}>
            Annuler
          </Button>
          <Button color="primary" variant="outlined" onClick={handleAddSong}>
            Valider
          </Button>
        </DialogActions>
      </Dialog>
      <TextField
        className={classes.urlIput}
        onChange={(event) => setUrl(event.target.value)}
        value={url}
        placeholder="Ajouter Youtube ou Soundcloud URL"
        fullWidth
        margin="normal"
        type="url"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Link />
            </InputAdornment>
          ),
        }}
      />
      <Button
        disabled={!playable}
        className={classes.addSongButton}
        onClick={() => setDialog(true)}
        variant="contained"
        color="primary"
        endIcon={<AddBoxOutlined />}
      >
        Ajouter
      </Button>
      <ReactPlayer url={url} hidden onReady={handleEditSong} />
    </div>
  );
}

export default AddSong;
