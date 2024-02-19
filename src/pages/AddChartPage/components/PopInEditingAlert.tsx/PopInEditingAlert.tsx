import PlemText from 'components/Atoms/PlemText';
import PlemAlert, { PlemAlertProps } from 'components/PlemAlert/PlemAlert';

export const PopInEditingAlert = (props: Omit<PlemAlertProps, 'children'>) => {
  return (
    <PlemAlert {...props}>
      <PlemText style={{ textAlign: 'center' }}>{'잠깐! 저장되지 않은 계획이 있어요.\n그냥 나가시겠어요?'}</PlemText>
    </PlemAlert>
  );
};
