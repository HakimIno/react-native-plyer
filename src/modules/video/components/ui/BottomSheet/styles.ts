import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  // BottomSheet main component styles
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  bottomSheetContainer: {
    backgroundColor: 'rgba(10, 10, 10, 1)',
    position: 'absolute',
    borderRadius: 15,
    pointerEvents: 'auto',
  },
  line: {
    width: 75,
    height: 4,
    backgroundColor: '#666',
    alignSelf: 'center',
    marginTop: 15,
    marginBottom: 5,
    borderRadius: 2,
  },
  content: {
    flex: 1,
  },
  contentLandscape: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 25,
  },
  headerDragArea: {
    padding: 10,
  },

  // VideoOptionsContent styles
  optionsContainer: {
    paddingHorizontal: 0,
  },
  optionsContainerLandscape: {
    paddingHorizontal: 0,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  optionItemLandscape: {
    paddingVertical: 14,
  },
  optionText: {
    fontSize: 16,
    color: '#fff',
    marginLeft: 16,
    flex: 1,
  },
  currentValueText: {
    fontSize: 14,
    color: '#888',
    marginRight: 8,
  },
  slideContainer: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
    minHeight: 200,
  },
  slideView: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
  },
}); 