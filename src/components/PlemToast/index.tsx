import Toast, { ToastComponentProps } from '@hyoungnamoh/react-native-easy-toast';
import { forwardRef } from 'react';
import { StyleSheet } from 'react-native';

const PlemToast = forwardRef<Toast, ToastComponentProps>((props, ref) => {
  return (
    <Toast
      ref={ref}
      style={styles.toast}
      position="bottom"
      positionValue={200}
      fadeInDuration={300}
      fadeOutDuration={300}
      textStyle={styles.toastText}
      {...props}
    />
  );
});

const styles = StyleSheet.create({
  toast: {
    backgroundColor: '#444444',
    paddingHorizontal: 16,
    paddingVertical: 12,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '90%',
    borderRadius: 4,
  },
  toastText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default PlemToast;
