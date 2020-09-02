import React from "react";
import Header from "./components/Header";
import AddSong from "./components/AddSong";
import SongList from "./components/SongList";
import SongPlayer from "./components/SongPlayer";
import { Grid, useMediaQuery, Hidden } from "@material-ui/core";
import songReducer from "./reducer";

export const SongContext = React.createContext({
  song: {
    id: "07060c83-f690-4fcf-8372-e404ac4080f9",
    title: "No Welly",
    artist: "Waly SECK",
    thumbnail:
      "https://www.lequotidien.sn/wp-content/uploads/2019/06/Wally-B-Seck.jpg",
    url: "https://www.youtube.com/watch?v=yN2j2WqvkHo",
    duration: "250",
  },
  isPlaying: false,
});

function App() {
  const initialSongState = React.useContext(SongContext);
  const [state, dispatch] = React.useReducer(songReducer, initialSongState);
  const graterThanMd = useMediaQuery((theme) => theme.breakpoints.up("md"));
  const graterThanSm = useMediaQuery((theme) => theme.breakpoints.up("sm"));

  return (
    <SongContext.Provider value={{ state, dispatch }}>
      <Hidden only="xs">
        <Header />
      </Hidden>
      <Grid container spacing={3}>
        <Grid
          style={{ paddingTop: graterThanSm ? 80 : 10 }}
          item
          xs={12}
          md={7}
        >
          <AddSong />
          <SongList />
        </Grid>
        <Grid
          style={
            graterThanMd
              ? {
                  position: "fixed",
                  width: "100%",
                  right: 0,
                  top: 70,
                }
              : {
                  position: "fixed",
                  left: 0,
                  bottom: 0,
                  width: "100%",
                }
          }
          item
          xs={12}
          md={5}
        >
          <SongPlayer />
        </Grid>
      </Grid>
    </SongContext.Provider>
  );
}

export default App;
