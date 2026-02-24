import React, {
  createContext,
  useContext,
  useCallback,
  useRef,
  useState,
  ReactNode,
} from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  StyleProp,
  ViewStyle,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import { ArrowLeft, ArrowRight } from 'lucide-react-native';

const { width: screenWidth } = Dimensions.get('window');

interface CarouselProps {
  orientation?: 'horizontal' | 'vertical';
  style?: StyleProp<ViewStyle>;
  children: ReactNode;
}

interface CarouselContextProps {
  scrollRef: React.RefObject<ScrollView | null>;
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
  orientation: 'horizontal' | 'vertical';
}

const CarouselContext = createContext<CarouselContextProps | null>(null);

function useCarousel() {
  const context = useContext(CarouselContext);
  if (!context) {
    throw new Error('useCarousel must be used within <Carousel />');
  }
  return context;
}

const Carousel = React.forwardRef<
  React.ElementRef<typeof View>,
  CarouselProps
>(({ orientation = 'horizontal', style, children }, ref) => {
  const scrollRef = useRef<ScrollView | null>(null);
  const [scrollPos, setScrollPos] = useState(0);

  const totalItems = React.Children.count(children);
  const maxScroll = (totalItems - 1) * screenWidth;

  const canScrollPrev = scrollPos > 0;
  const canScrollNext = scrollPos < maxScroll;

  const scrollPrev = useCallback(() => {
    scrollRef.current?.scrollTo({
      x: orientation === 'horizontal' ? scrollPos - screenWidth : 0,
      y: orientation === 'vertical' ? scrollPos - screenWidth : 0,
      animated: true,
    });
  }, [scrollPos, orientation]);

  const scrollNext = useCallback(() => {
    scrollRef.current?.scrollTo({
      x: orientation === 'horizontal' ? scrollPos + screenWidth : 0,
      y: orientation === 'vertical' ? scrollPos + screenWidth : 0,
      animated: true,
    });
  }, [scrollPos, orientation]);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offset =
      orientation === 'horizontal'
        ? event.nativeEvent.contentOffset.x
        : event.nativeEvent.contentOffset.y;

    setScrollPos(offset);
  };

  return (
    <CarouselContext.Provider
      value={{
        scrollRef,
        scrollPrev,
        scrollNext,
        canScrollPrev,
        canScrollNext,
        orientation,
      }}
    >
      <View ref={ref} style={[styles.carousel, style]}>
        <ScrollView
          ref={scrollRef}
          horizontal={orientation === 'horizontal'}
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={handleScroll}
        >
          {children}
        </ScrollView>
      </View>
    </CarouselContext.Provider>
  );
});

Carousel.displayName = 'Carousel';

const CarouselItem = React.forwardRef<
  React.ElementRef<typeof View>,
  { children: ReactNode; style?: StyleProp<ViewStyle> }
>(({ children, style }, ref) => {
  const { orientation } = useCarousel();

  return (
    <View
      ref={ref}
      style={[
        styles.item,
        orientation === 'horizontal' && { width: screenWidth },
        orientation === 'vertical' && { height: screenWidth },
        style,
      ]}
    >
      {children}
    </View>
  );
});

CarouselItem.displayName = 'CarouselItem';

const CarouselPrevious = React.forwardRef<
  React.ElementRef<typeof TouchableOpacity>,
  { style?: StyleProp<ViewStyle> }
>(({ style }, ref) => {
  const { scrollPrev, canScrollPrev } = useCarousel();

  return (
    <TouchableOpacity
      ref={ref}
      style={[
        styles.navButton,
        styles.navButtonPrev,
        !canScrollPrev && styles.disabled,
        style,
      ]}
      onPress={scrollPrev}
      disabled={!canScrollPrev}
      activeOpacity={0.8}
    >
      <ArrowLeft size={20} color="#6b7280" />
    </TouchableOpacity>
  );
});

CarouselPrevious.displayName = 'CarouselPrevious';

const CarouselNext = React.forwardRef<
  React.ElementRef<typeof TouchableOpacity>,
  { style?: StyleProp<ViewStyle> }
>(({ style }, ref) => {
  const { scrollNext, canScrollNext } = useCarousel();

  return (
    <TouchableOpacity
      ref={ref}
      style={[
        styles.navButton,
        styles.navButtonNext,
        !canScrollNext && styles.disabled,
        style,
      ]}
      onPress={scrollNext}
      disabled={!canScrollNext}
      activeOpacity={0.8}
    >
      <ArrowRight size={20} color="#6b7280" />
    </TouchableOpacity>
  );
});

CarouselNext.displayName = 'CarouselNext';

const styles = StyleSheet.create({
  carousel: {
    position: 'relative',
  },
  item: {
    flex: 0,
  },
  navButton: {
    position: 'absolute',
    top: '50%',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    elevation: 3,
  },
  navButtonPrev: {
    left: 8,
    transform: [{ translateY: -16 }],
  },
  navButtonNext: {
    right: 8,
    transform: [{ translateY: -16 }],
  },
  disabled: {
    opacity: 0.4,
  },
});

export { Carousel, CarouselItem, CarouselPrevious, CarouselNext };
export default function _Component() { return null; }
