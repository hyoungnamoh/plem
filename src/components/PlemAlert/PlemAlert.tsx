import { ReactNode } from 'react';
import PlemAlertMediumSvg from 'assets/images/plem-alert-md.svg';
import PlemAlertSmallSvg from 'assets/images/plem-alert-sm.svg';
import PlemAlertLargeSvg from 'assets/images/plem-alert-lg.svg';
import Modal from 'react-native-modal';
import { StyleSheet, View } from 'react-native';
import PlemButton from 'components/Atoms/PlemButton';
import PlemText from 'components/Atoms/PlemText';
import {
  ALERT_CONTENT_HEIGHT_LARGE,
  ALERT_CONTENT_HEIGHT_MEDIUM,
  ALERT_CONTENT_HEIGHT_SMALL,
  ALERT_WIDTH,
} from './components/constants';

export type PlemAlertProps = {
  size: 'small' | 'medium' | 'large';
  children: ReactNode;
  cancelText?: string;
  confirmText?: string;
  onCancel: () => void;
  onConfirm: () => void;
  open: boolean;
};

const PlemAlert = ({ size, children, cancelText, confirmText, onCancel, onConfirm, open }: PlemAlertProps) => {
  const getModalBySize = () => {
    if (size === 'small') {
      return <PlemAlertSmallSvg preserveAspectRatio="none" width={ALERT_WIDTH} />;
    }
    if (size === 'medium') {
      return <PlemAlertMediumSvg preserveAspectRatio="none" width={ALERT_WIDTH} />;
    }
    if (size === 'large') {
      return <PlemAlertLargeSvg preserveAspectRatio="none" width={ALERT_WIDTH} />;
    }
  };

  const getHeightBySize = () => {
    if (size === 'small') {
      return ALERT_CONTENT_HEIGHT_SMALL;
    }
    if (size === 'medium') {
      return ALERT_CONTENT_HEIGHT_MEDIUM;
    }
    if (size === 'large') {
      return ALERT_CONTENT_HEIGHT_LARGE;
    }
  };

  return (
    <Modal backdropOpacity={0.5} isVisible={open} animationInTiming={0.1} animationOutTiming={0.1}>
      <View style={styles.innerWrapper}>
        {getModalBySize()}
        <View style={styles.contentWrap}>
          <View style={[styles.content, { height: getHeightBySize() }]}>{children}</View>
          <View style={styles.buttonContainer}>
            <PlemButton style={styles.button} onPress={onCancel}>
              <PlemText>{cancelText || '아니요'}</PlemText>
            </PlemButton>
            <PlemButton style={styles.button} onPress={onConfirm}>
              <PlemText>{confirmText || '네'}</PlemText>
            </PlemButton>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  innerWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentWrap: {
    position: 'absolute',
  },
  content: {
    width: ALERT_WIDTH,
    padding: 24,
    justifyContent: 'center',
  },
  buttonContainer: { height: 60, flexDirection: 'row' },
  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default PlemAlert;
