import PlemText from 'components/Atoms/PlemText';
import PlemAlert, { PlemAlertProps } from 'components/PlemAlert/PlemAlert';

const WithdrawalConfirmAlert = (props: Omit<PlemAlertProps, 'children' | 'size'>) => {
  return (
    <PlemAlert size="small" {...props}>
      <PlemText style={{ alignItems: 'center' }}>
        {'계정을 삭제할까요?\n삭제 시 모든 데이터는 복구할 수 없어요.'}
      </PlemText>
    </PlemAlert>
  );
};

export default WithdrawalConfirmAlert;
