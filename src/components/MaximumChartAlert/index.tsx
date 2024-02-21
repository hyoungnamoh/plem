import PlemText from 'components/Atoms/PlemText';
import PlemAlert, { PlemAlertProps } from 'components/PlemAlert/PlemAlert';
import { NUM_OF_MAXIMUM_CHART } from 'constants/numOfMaximumChart';

const MaximumChartAlert = (props: Omit<PlemAlertProps, 'children' | 'size'>) => {
  return (
    <PlemAlert {...props} size="medium">
      <PlemText style={{ textAlign: 'center' }}>
        {`와우! 이미 ${NUM_OF_MAXIMUM_CHART}개의 계획표가 있어요.\n새로운 계획표가 필요하다면\n 사용하지 않는 계획표를 정리해 보세요.`}
      </PlemText>
    </PlemAlert>
  );
};

export default MaximumChartAlert;
