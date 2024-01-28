import { ADJECTIVES } from 'constants/adjectives';
import { NOUNS } from 'constants/nouns';

export const makeNickname = () => {
  const adjectiveIndex = Math.floor(Math.random() * ADJECTIVES.length);
  const nounIndex = Math.floor(Math.random() * NOUNS.length);
  return `${ADJECTIVES[adjectiveIndex]} ${NOUNS[nounIndex]}`;
};
