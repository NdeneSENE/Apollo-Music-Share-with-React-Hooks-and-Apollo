import React from "react";
import {
  Typography,
  Avatar,
  IconButton,
  makeStyles,
  useMediaQuery,
} from "@material-ui/core";
import { Delete } from "@material-ui/icons";
import { useMutation } from "@apollo/react-hooks";
import { ADD_OR_REMOVE_FROM_QUEUE } from "../graphql/mutations";

const useStyles = makeStyles({
  avatar: {
    width: 44,
    height: 44,
  },
  text: {
    textOverflow: "ellipsis",
    overflow: "hidden",
  },
  container: {
    display: "grid",
    gridAutoFlow: "column",
    gridTemplateColumns: "50px auto 50px",
    gridGap: 12,
    alignItems: "center",
    marginTop: 10,
  },
  songInfoContainer: {
    overflow: "hidden",
    whiteSpace: "nowrap",
  },
});
function QueueSongList({ queue }) {
  console.log(queue);
  const graterThanMd = useMediaQuery((theme) => theme.breakpoints.up("md"));

  // const song = {
  //   title: "GOOR",
  //   artist: "Senegal",
  //   thumbnail:
  //     "https://lomultimedia.com/wp-content/uploads/2020/08/img_header_1.jpg",
  // };
  return (
    graterThanMd && (
      <div style={{ margin: "10px 0" }}>
        <Typography color="secondary" variant="button">
          QUEUE ({queue.length})
        </Typography>
        {queue.map((song, i) => (
          <QueudSong key={i} song={song} />
        ))}
      </div>
    )
  );
}

function QueudSong({ song }) {
  const classes = useStyles();
  const { title, thumbnail, artist } = song;
  const [addOrRemoveFromQueue] = useMutation(ADD_OR_REMOVE_FROM_QUEUE, {
    onCompleted: (data) => {
      localStorage.setItem("queue", JSON.stringify(data.addOrRemoveFromQueue));
    },
  });

  function handleAddOrRemoveFromQueue() {
    addOrRemoveFromQueue({
      variables: {
        input: { ...song, __typename: "Song" },
      },
    });
  }

  return (
    <div className={classes.container}>
      <Avatar className={classes.avatar} src={thumbnail} alt={artist} />
      <div className={classes.songInfoContainer}>
        <Typography className={classes.text} variant="subtitle2">
          {title}
        </Typography>
        <Typography
          color="textSecondary"
          className={classes.text}
          variant="subtitle2"
        >
          {artist}
        </Typography>
      </div>
      <IconButton onClick={handleAddOrRemoveFromQueue}>
        <Delete color="error" />
      </IconButton>
    </div>
  );
}

export default QueueSongList;
