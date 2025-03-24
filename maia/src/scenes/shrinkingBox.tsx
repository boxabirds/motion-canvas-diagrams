import {makeScene2D, Rect, Txt} from '@motion-canvas/2d';
import {createRef, waitFor, all, easeInOutCubic} from '@motion-canvas/core';

export default makeScene2D(function* (view) {
  // Set the background color for this scene
  view.fill('#141414');
  
  // Create references for our elements
  const box = createRef<Rect>();
  const loremText = createRef<Txt>();
  const labelText = createRef<Txt>();

  // Calculate sizes based on screen dimensions
  const screenWidth = 1920; // Standard HD width
  const screenHeight = 1080; // Standard HD height
  
  const largeBoxWidth = screenWidth * 0.75;
  const largeBoxHeight = screenHeight * 0.75;
  const smallBoxWidth = largeBoxWidth * 0.25;
  const smallBoxHeight = largeBoxHeight * 0.25;

  // Font sizes
  const largeFontSize = 32;
  const smallFontSize = largeFontSize * 0.25;

  // Text widths
  const largeTextWidth = largeBoxWidth * 0.9;
  const smallTextWidth = smallBoxWidth * 0.9;

  // Lorem ipsum placeholder text
  const loremIpsum = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`;

  // Set up the scene with initial visibility
  view.add(
    <>
      <Rect
        ref={box}
        width={largeBoxWidth}
        height={largeBoxHeight}
        radius={12}
        fill="#2c3e50"
        stroke="#34495e"
        lineWidth={4}
      >
        <Txt
          ref={loremText}
          text={loremIpsum}
          fill="#ecf0f1"
          fontFamily="Arial"
          fontSize={largeFontSize}
          width={largeTextWidth}
          textWrap={true}
          padding={20}
          opacity={1}
        />
        <Txt
          ref={labelText}
          text="Text"
          fill="#ecf0f1"
          fontFamily="Arial"
          fontSize={40}
          textAlign="center"
          opacity={0}
        />
      </Rect>
    </>,
  );

  // Animation sequence
  yield* waitFor(1);
  
  // Animate the box shrinking and text transition
  yield* all(
    // Shrink the box
    box().size([smallBoxWidth, smallBoxHeight], 2, easeInOutCubic),
    
    // Shrink and fade out the lorem ipsum text
    loremText().fontSize(smallFontSize, 2, easeInOutCubic),
    loremText().width(smallTextWidth, 2, easeInOutCubic),
    loremText().opacity(0, 1.5, easeInOutCubic),
    
    // Fade in the label text
    labelText().opacity(1, 1.5, easeInOutCubic),
  );
  
  yield* waitFor(1);
});
