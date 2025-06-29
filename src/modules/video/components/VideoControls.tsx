import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { PlayPauseButton } from './ui/PlayPauseButton';
import { SeekButtons } from './ui/SeekButtons';

interface VideoControlsProps {
    isPlaying: boolean;
    isSeekingInProgress: boolean;
    isBuffering: boolean;
    onPlayPause: () => void;
    onSeekBackward: () => void;
    onSeekForward: () => void;
    playButtonSize?: number;
    seekButtonSize?: number;
    seekSeconds?: number;
    gap?: number;
}

export const VideoControls: React.FC<VideoControlsProps> = ({
    isPlaying,
    isSeekingInProgress,
    isBuffering,
    onPlayPause,
    onSeekBackward,
    onSeekForward,
    playButtonSize = 70,
    seekButtonSize = 50,
    seekSeconds = 10,
    gap = 40,
}) => {


    return (
        <View style={styles.centerControls}>
            <View style={[styles.playbackControls, { top: 25 }]}>
                {isSeekingInProgress || isBuffering ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#fff" />
                    </View>
                ) : (
                    <View style={[styles.playPauseContainer, { gap }]}>
                        <SeekButtons
                            onSeekBackward={onSeekBackward}
                            onSeekForward={onSeekForward}
                            size={seekButtonSize}
                            seekSeconds={seekSeconds}
                            type="backward"
                        />
                        <PlayPauseButton
                            isPlaying={isPlaying}
                            onPress={onPlayPause}
                            size={playButtonSize}
                        />
                        <SeekButtons
                            onSeekBackward={onSeekBackward}
                            onSeekForward={onSeekForward}
                            size={seekButtonSize}
                            seekSeconds={seekSeconds}
                            type="forward"
                        />
                    </View>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    centerControls: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    playbackControls: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    playPauseContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
}); 