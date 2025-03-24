import {makeScene2D, Rect, Txt} from '@motion-canvas/2d';
import {createRef, waitFor, all, easeInOutCubic} from '@motion-canvas/core';

export default makeScene2D(function* (view) {
  // Set the background color for this scene
  view.fill('#141414');
  
  // Create references for our elements
  const languageModelBox = createRef<Rect>();
  const promptBox = createRef<Rect>();
  const languageModelText = createRef<Txt>();
  const promptText = createRef<Txt>();

  // Set up the scene with initial visibility
  view.add(
    <>
      {/* Language Model box - larger box that will receive the prompt */}
      <Rect
        ref={languageModelBox}
        width={600}
        height={400}
        radius={8}
        fill="#2c3e50"
        stroke="#34495e"
        lineWidth={4}
        y={0}
      >
        <Txt
          ref={languageModelText}
          text="Language Model"
          fill="#ecf0f1"
          fontFamily="Arial"
          fontSize={40}
          y={-150}
        />
      </Rect>

      {/* System prompt box - smaller box that will move into the language model */}
      <Rect
        ref={promptBox}
        width={400}
        height={200}
        radius={8}
        fill="#3498db"
        stroke="#2980b9"
        lineWidth={4}
        y={-300}
      >
        <Txt
          ref={promptText}
          text="System prompt:\nplanning and iteration\n(ReAct)"
          fill="#ecf0f1"
          fontFamily="Arial"
          fontSize={28}
          textAlign="center"
        />
      </Rect>
    </>,
  );

  // Animation sequence
  yield* waitFor(0.5);
  
  // Move the prompt box into the language model box
  yield* promptBox().position.y(0, 1.5, easeInOutCubic);
  
  yield* waitFor(0.5);
  
  // Scale down the prompt box slightly to show it's being processed
  yield* promptBox().scale(0.8, 0.8, easeInOutCubic);
  
  yield* waitFor(0.5);
  
  // Pulse the language model box to show it's processing the prompt
  yield* languageModelBox().fill("#34495e", 0.5);
  yield* languageModelBox().fill("#2c3e50", 0.5);
  
  yield* waitFor(1);
});
