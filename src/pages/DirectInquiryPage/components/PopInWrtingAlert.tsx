import PlemText from 'components/Atoms/PlemText';
import PlemAlert, { PlemAlertProps } from 'components/PlemAlert/PlemAlert';

export const PopInWritingAlert = (props: Omit<PlemAlertProps, 'children'>) => {
  return (
    <PlemAlert {...props}>
      <PlemText style={{ textAlign: 'center' }}>{'잠깐! 작성 중인 문의가 있어요.\n그냥 나가시겠어요?'}</PlemText>
    </PlemAlert>
  );
};
