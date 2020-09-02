import { gql } from "@apollo/react-hooks";

export const ADD_OR_REMOVE_FROM_QUEUE = gql`
  mutation addOrRemoveFromQueue($input: SongInput!) {
    addOrRemoveFromQueue(input: $input) @client
  }
`;

export const ADD_SONG = gql`
  mutation addSong(
    $title: String!
    $artist: String!
    $thumbnail: String!
    $duration: Float!
    $url: String!
  ) {
    insert_songs(
      objects: {
        artist: $artist
        title: $title
        thumbnail: $thumbnail
        duration: $duration
        url: $url
      }
    ) {
      affected_rows
    }
  }
`;
