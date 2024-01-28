import Header from 'components/Header';
import CustomScrollView from 'components/CustomScrollView/CustomScrollView';
import PlemText from 'components/Atoms/PlemText';
import { PRIVACY_POLICY } from './constants/PrivacyPolicy';

const PrivacyPolicyPage = () => {
  return (
    <>
      <Header title="개인정보처리방침" close />
      <CustomScrollView style={{ paddingHorizontal: 16 }}>
        <PlemText style={{ lineHeight: 1.2 }}>{PRIVACY_POLICY}</PlemText>
      </CustomScrollView>
    </>
  );
};

export default PrivacyPolicyPage;
