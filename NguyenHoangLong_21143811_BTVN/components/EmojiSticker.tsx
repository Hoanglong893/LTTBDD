import { ImageSourcePropType, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

type Props = {
    imageSize: number;
    stickerSource: ImageSourcePropType;
};

export default function EmojiSticker({ imageSize, stickerSource }: Props) {
    // shared values
    const scale = useSharedValue(1);
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);

    // pan (kéo/thả)
    const pan = Gesture.Pan()
        .onChange((e) => {
        translateX.value += e.changeX;
        translateY.value += e.changeY;
        });

    // pinch (phóng to/thu nhỏ)
    const pinch = Gesture.Pinch()
        .onChange((e) => {
        scale.value = e.scale;
        });

    // (tuỳ chọn) double tap để tăng size nhanh
    const doubleTap = Gesture.Tap()
        .numberOfTaps(2)
        .onEnd(() => {
        scale.value = scale.value * 1.2;
        });

    // gộp gestures: pinch + pan + doubleTap
    const composed = Gesture.Simultaneous(pinch, pan, doubleTap);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: scale.value },
        ],
    }));

    return (
        <GestureDetector gesture={composed}>
        <Animated.View style={[styles.stickerContainer, animatedStyle]}>
            <Image source={stickerSource} style={{ width: imageSize, height: imageSize }} />
        </Animated.View>
        </GestureDetector>
    );
}

const styles = StyleSheet.create({
    stickerContainer: {
        position: 'absolute',
    },
});
