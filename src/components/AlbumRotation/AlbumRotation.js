import { useEffect, useState } from 'react';
import './AlbumRotation.css';

/**
 * Component name.
 */
const CN = 'AlbumRotation';

/**
 * Displays a search field and a box with 5 items.
 * When some input is entered in the search field we search Itunes for music
 * albums matching the search term and displays them in the list.
 * The list rotates it's items every second.
 */
function AlbumRotation() {
  const [albums, setAlbums] = useState(['A', 'B', 'C', 'D', 'E']);
  const [newAlbums, setNewAlbums] = useState([]);
  const [fetchTimer, setFetchTimer] = useState(null);

  /**
   * Rotates the list every second; adds new album item if it exists.
   */
  useEffect(() => {
    const timer = setInterval(() => {
      setAlbums(oldList => {
        const newList = [...oldList];

        newList.push(newList.shift());

        if (newAlbums.length) {
          const newAlbum = newAlbums[0];

          newList.pop();
          newList.push(newAlbum);
        }
  
        return newList;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [newAlbums]);

  /**
   * Removes an item from the new albums list.
   */
  useEffect(() => {
    if (newAlbums.length && albums.includes(newAlbums[0])) {
      setNewAlbums(oldAlbums => {
        const newAlbums = [...oldAlbums];
        newAlbums.shift();

        return newAlbums;
      });
    }
  }, [albums, newAlbums]);

  /**
   * Handles changes to the search field.
   * On change, queries the Itunes API to gather music albums.
   */
  const onSearchFieldChangeHandler = e => {
    clearTimeout(fetchTimer);

    const searchTerm = e.target.value;

    if (!searchTerm) return;
  
    const newTimer = setTimeout(async () => {
      const response = await fetch(
        `https://itunes.apple.com/search?term=${searchTerm}`,
        {mode: 'cors'}
      ).catch(e => console.log(e));

      if (!response.ok) return;

      const songs = (await response.json()).results;
      const albums = songs.map(song => song.collectionName);
      const top5Albums = [...new Set(albums)].sort().filter((_, key) => key < 5);

      setNewAlbums(top5Albums);
    }, 500)

    setFetchTimer(newTimer);
  };

  return (
    <div className={CN}>
      <input
        className={`${CN}__search-field`}
        type="search"
        placeholder="Search Band"
        onChange={onSearchFieldChangeHandler}
      />
      <div className={`${CN}__list-container`}>
        <ul className={`${CN}__album-list`}>
          {
            albums.map((album, i) => (
              <li
                key={`${i}-${album}`}
                className={`${CN}__album-list-item`}>
                  {album}
              </li>)
            )
          }
        </ul>
      </div> 
    </div>
  );
}

export default AlbumRotation;
