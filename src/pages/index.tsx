import { useState } from 'react';
import { NextPage } from 'next';
import Image from 'next/image';

import {
  useGetCharacterByIdLazyQuery,
  useGetCharactersQuery
} from '../../generated/graphql';

const Home: NextPage = () => {
  const { loading, data } = useGetCharactersQuery();

  const [id, setId] = useState<string>('');

  const [getCharacter, { loading: loadingCharacter, data: characterData }] =
    useGetCharacterByIdLazyQuery();

  if (loading) {
    return <p>Loading...</p>;
  }

  const characters = data?.characters?.results;
  const character = characterData?.character;

  return (
    <div>
      <main>
        {characters?.map(character => (
          <p key={character?.id ?? crypto.randomUUID()}>
            {character?.id + ' / ' + character?.name ??
              'No name: something is wrong'}
          </p>
        ))}

        <form
          style={{ marginTop: '2rem' }}
          onSubmit={e => {
            e.preventDefault();
            getCharacter({
              variables: {
                id
              }
            });
          }}
        >
          <input
            type="text"
            name="id"
            id="id"
            value={id}
            placeholder="Character ID"
            onChange={e => setId(e.target.value)}
          />
          <button>Get Character</button>
        </form>

        <p style={{ marginTop: '0.5rem' }}>
          Character:{' '}
          {loadingCharacter ? (
            'Getting character...'
          ) : character ? (
            <Character
              name={character?.name as string}
              gender={character?.gender as string}
              species={character?.species as string}
              image={character?.image as string}
            />
          ) : null}
        </p>
      </main>
    </div>
  );
};

export default Home;

const Character = ({
  name,
  gender,
  species,
  image
}: {
  name: string;
  gender: string;
  species: string;
  image: string;
}) => (
  <>
    <p>{name}</p>
    <p>{gender}</p>
    <p>{species}</p>
    <Image src={image} width={64} height={64} alt="" />
  </>
);
