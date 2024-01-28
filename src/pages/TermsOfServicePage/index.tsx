import { TERMS_OF_SERVICE } from './constants/TermsOfService';
import Header from 'components/Header';
import CustomScrollView from 'components/CustomScrollView/CustomScrollView';
import PlemText from 'components/Atoms/PlemText';

const TermsOfServicePage = () => {
  return (
    <>
      <Header title="서비스 이용약관" close />
      <CustomScrollView style={{ paddingHorizontal: 16 }}>
        <PlemText style={{ lineHeight: 1.2 }}>{TERMS_OF_SERVICE}</PlemText>
      </CustomScrollView>
    </>
  );
};

export default TermsOfServicePage;
