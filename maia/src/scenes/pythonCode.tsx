import {makeScene2D, Rect, Code} from '@motion-canvas/2d';
import {createRef, waitFor, all, easeInOutCubic} from '@motion-canvas/core';

export default makeScene2D(function* (view) {
  // Set the background color for this scene
  view.fill('#141414');
  
  // Create references for our elements
  const box = createRef<Rect>();
  const codeBlock = createRef<Code>();
  
  // Calculate sizes based on screen dimensions
  const screenWidth = 1920; // Standard HD width
  const screenHeight = 1080; // Standard HD height
  
  const largeBoxWidth = screenWidth * 0.75;
  const largeBoxHeight = screenHeight * 0.75;
  const smallBoxWidth = largeBoxWidth * 0.25;
  const smallBoxHeight = largeBoxHeight * 0.25;

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
          fontSize={32}
          fontFamily="JetBrains Mono, monospace"
          padding={40}
          width={largeBoxWidth - 80}
          height={largeBoxHeight - 80}
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
    
    // Scale down the code font size
    codeBlock().fontSize(14, 2, easeInOutCubic),
    codeBlock().padding(10, 2, easeInOutCubic),
    codeBlock().width(smallBoxWidth - 20, 2, easeInOutCubic),
    codeBlock().height(smallBoxHeight - 20, 2, easeInOutCubic)
  );
  
  yield* waitFor(1);
});
