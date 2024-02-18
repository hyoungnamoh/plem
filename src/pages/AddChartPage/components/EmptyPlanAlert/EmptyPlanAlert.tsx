import PlemText from 'components/Atoms/PlemText';
import PlemAlert, { PlemAlertProps } from 'components/PlemAlert/PlemAlert';

export const EmptyPlanAlert = (props: Omit<PlemAlertProps, 'children'>) => {
  return (
    <PlemAlert {...props}>
      <PlemText style={{ textAlign: 'center' }}>{'계획표에 비어있는 시간이 있어요.\n이대로 등록할까요?'}</PlemText>
    </PlemAlert>
  );
};
