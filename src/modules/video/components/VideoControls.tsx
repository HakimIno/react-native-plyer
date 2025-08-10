import React from 'react';
import { View, StyleSheet } from 'react-native';
import { PlayPauseButton } from './ui/PlayPauseButton';
import { SeekButtons } from './ui/SeekButtons';

interface VideoControlsProps {
    isPlaying: boolean;
    isSeekingInProgress: boolean;
    isBuffering: boolean;
    onPlayPause: () => void;
    onSeekBackward: (seconds: number) => void;
    onSeekForward: (seconds: number) => void;
    playButtonSize?: number;
    seekButtonSize?: number;
    seekSeconds?: number;
    gap?: number;
    isLive: boolean;
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
    isLive,
}) => {

    return (
        <View style={styles.centerControls}>
            <View style={[styles.playbackControls, { top: 35 }]}>

                <View style={[styles.playPauseContainer, { gap }]}>
                    {!isLive && (
                        <SeekButtons
                            onSeekBackward={onSeekBackward}
                            size={seekButtonSize}
                            seekSeconds={seekSeconds}
                            type="backward"
                        />
                    )}
                    <PlayPauseButton
                        isPlaying={isPlaying}
                        onPress={onPlayPause}
                        size={playButtonSize}
                        isLoading={isBuffering || isSeekingInProgress}
                    />
                    {!isLive && (
                        <SeekButtons
                            onSeekForward={onSeekForward}
                            size={seekButtonSize}
                            seekSeconds={seekSeconds}
                            type="forward"
                            
                        />
                    )}
                </View>

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

}); 