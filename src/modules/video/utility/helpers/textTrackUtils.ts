import { TextTrack } from '../../../../types';

export const formatTextTracks = (textTracks: TextTrack[]) => {
  return textTracks.map((track) => ({
    title: track.label,
    language: track.language.substring(0, 2).toLowerCase() as any,
    type: 'text/vtt' as any,
    uri: track.src,
  }));
};

export const formatSelectedTextTrack = (
  selectedTextTrack: {
    type: 'system' | 'disabled' | 'index' | 'language' | 'title';
    value?: string | number;
  } | undefined,
  formattedTextTracks: ReturnType<typeof formatTextTracks>,
  originalTextTracks: TextTrack[]
) => {
  if (!selectedTextTrack) {
    return formattedTextTracks.length > 0
      ? { type: 'index' as any, value: 0 }
      : { type: 'disabled' as any };
  }

  switch (selectedTextTrack.type) {
    case 'disabled':
      return { type: 'disabled' as any };
    case 'index':
      const index = selectedTextTrack.value as number;
      if (index >= 0 && index < formattedTextTracks.length) {
        return { type: 'index' as any, value: index };
      }
      return { type: 'disabled' as any };
    case 'language':
      return { type: 'language' as any, value: selectedTextTrack.value };
    case 'title':
      return { type: 'title' as any, value: selectedTextTrack.value };
    case 'system':
    default:
      const defaultTrack = formattedTextTracks.findIndex((track) =>
        originalTextTracks.find((original) => original.src === track.uri)?.default
      );
      if (defaultTrack >= 0) {
        return { type: 'index' as any, value: defaultTrack };
      }
      return formattedTextTracks.length > 0
        ? { type: 'index' as any, value: 0 }
        : { type: 'disabled' as any };
  }
}; 