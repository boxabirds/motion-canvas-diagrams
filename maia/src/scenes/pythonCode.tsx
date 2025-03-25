import {makeScene2D, Rect, Code, Txt} from '@motion-canvas/2d';
import {createRef, waitFor, all, easeInOutCubic} from '@motion-canvas/core';

export default makeScene2D(function* (view) {
  // Set the background color for this scene
  view.fill('#141414');
  
  // Create references for our elements
  const box = createRef<Rect>();
  const codeBlock = createRef<Code>();
  const label = createRef<Txt>();
  
  // Calculate sizes based on screen dimensions
  const screenWidth = 1920; // Standard HD width
  const screenHeight = 1080; // Standard HD height
  
  const largeBoxWidth = screenWidth * 0.75;
  const largeBoxHeight = screenHeight * 0.75;
  const smallBoxWidth = largeBoxWidth * 0.25;
  const smallBoxHeight = largeBoxHeight * 0.25;

  // Calculate proportional sizes for the code block
  const paddingRatio = 40 / largeBoxWidth; // Calculate padding as a ratio of box width
  const largePadding = largeBoxWidth * paddingRatio;
  const smallPadding = smallBoxWidth * paddingRatio;
  
  const fontSizeRatio = 32 / largeBoxHeight; // Calculate font size as a ratio of box height
  const largeFontSize = largeBoxHeight * fontSizeRatio;
  const smallFontSize = smallBoxHeight * fontSizeRatio;

  // Python code sample
  const pythonCode = `def fibonacci(n):
    """
    Calculate the Fibonacci sequence up to n
    """
    a, b = 0, 1
    result = []
    while a < n:
        result.append(a)
        a, b = b, a + b
    return result

# Example usage
fib_sequence = fibonacci(100)
print(f"Fibonacci sequence: {fib_sequence}")

class DataProcessor:
    def __init__(self, data):
        self.data = data
        
    def process(self):
        return [x * 2 for x in data if x > 0]`;

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
        <Code
          ref={codeBlock}
          code={pythonCode}
          fontSize={largeFontSize}
          fontFamily="JetBrains Mono, monospace"
          padding={largePadding}
          width={largeBoxWidth - (2 * largePadding)}
          height={largeBoxHeight - (2 * largePadding)}
        />
        <Txt
          ref={label}
          text={'Fibonacci'}
          fontSize={smallBoxHeight * 0.2}
          fontFamily="Arial, sans-serif"
          fontWeight={700}
          fill="#FFFFFF"
          opacity={0}
        />
      </Rect>
    </>,
  );

  // Animation sequence
  yield* waitFor(1);
  
  // Animate the box shrinking and code transition
  yield* all(
    // Shrink the box
    box().size([smallBoxWidth, smallBoxHeight], 2, easeInOutCubic),
    
    // Scale down the code and fade it out
    codeBlock().fontSize(smallFontSize, 2, easeInOutCubic),
    codeBlock().padding(smallPadding, 2, easeInOutCubic),
    codeBlock().width(smallBoxWidth - (2 * smallPadding), 2, easeInOutCubic),
    codeBlock().height(smallBoxHeight - (2 * smallPadding), 2, easeInOutCubic),
    codeBlock().opacity(0, 1.5, easeInOutCubic),
    
    // Fade in the label
    label().opacity(1, 1.5, easeInOutCubic)
  );
  
  yield* waitFor(1);
});
