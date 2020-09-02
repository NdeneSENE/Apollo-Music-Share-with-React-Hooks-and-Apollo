import { gql } from "apollo-boost";

export const GET_QUEUED_SONGS = gql`
  query getQueuedSongs {
    queue @client {
      artist
      duration
      id
      thumbnail
      title
      url
    }
  }
`;
