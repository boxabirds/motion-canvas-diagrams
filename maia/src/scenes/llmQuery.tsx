import {makeScene2D, Rect, Txt, Node, Circle, Gradient, Img} from '@motion-canvas/2d';
import {
  createRef,
  waitFor,
  all,
  easeInOutCubic,
  easeInOutQuad,
  Vector2,
  easeOutBack,
  easeInBack,
  loop,
  easeInOutSine,
  chain,
  createSignal,
  Reference,
  ThreadGenerator,
  SimpleSignal,
  easeOutQuint,
  easeInQuint,
  map,
  sequence,
  delay,
} from '@motion-canvas/core';

export default makeScene2D(function* (view) {
  // Set the background colour for this scene - dark gradient
  view.fill('#0a0a1a');

  // Create a root container to center everything
  const rootContainer = createRef<Rect>();

  // Create references for our elements
  const queryBox = createRef<Rect>();
  const queryText = createRef<Txt>();
  const jsonBox = createRef<Rect>();
  const jsonText = createRef<Txt>();
  const userMessageBox = createRef<Rect>();
  const userMessageText = createRef<Txt>();
  const userMessageLabel = createRef<Txt>();
  
  // Chat History elements
  const chatHistoryBox = createRef<Rect>();
  const chatHistoryLabel = createRef<Txt>();
  const chatHistoryText = createRef<Txt>();
  const chatHistoryJsonBox = createRef<Rect>();
  const chatHistoryJsonText = createRef<Txt>();
  
  // System Prompt elements
  const systemPromptBox = createRef<Rect>();
  const systemPromptLabel = createRef<Txt>();
  const systemPromptText = createRef<Txt>();
  const systemPromptJsonBox = createRef<Rect>();
  const systemPromptJsonText = createRef<Txt>();
  const systemPromptGlow = createRef<Circle>();
  
  // Input Package elements
  const inputPackageBox = createRef<Rect>();
  const inputPackageLabel = createRef<Txt>();

  // Tokenization elements
  const combinedStringBox = createRef<Rect>();
  const combinedStringText = createRef<Txt>();
  const tokenContainer = createRef<Node>();
  const zoomedTokenBox = createRef<Rect>();
  const zoomedTokenText = createRef<Txt>();
  const zoomedTokenId = createRef<Txt>();
  const tokenIdSequence = createRef<Rect>();
  const tokenIdSequenceText = createRef<Txt>();

  // JSON representation of the query
  const jsonContent = `{
  "user_input": "Capital of France?"
}`;

  // JSON representation of chat history
  const chatHistoryJson = `{
  "prev_message": "Hello!"
}`;

  // JSON representation of system prompt
  const systemPromptJson = `{
  "instructions": "Answer concisely"
}`;

  // Tokenization data
  const combinedString = "Answer concisely: Capital of France?";
  const tokens = [
    { text: "Answer", id: 512, color: "#50c878" }, // Emerald green
    { text: " concisely", id: 789, color: "#ff7f50" }, // Coral
    { text: ":", id: 25, color: "#9370db" }, // Medium purple
    { text: " Capital", id: 2451, color: "#ff69b4" }, // Hot pink
    { text: " of", id: 32, color: "#1e90ff" }, // Dodger blue
    { text: " France", id: 3782, color: "#ffd700" }, // Gold
    { text: "?", id: 28, color: "#ff4500" }, // Orange red
  ];

  // Token references array to store dynamically created token elements
  const tokenRefs: Reference<Rect>[] = [];
  const tokenTextRefs: Reference<Txt>[] = [];
  const tokenIdRefs: Reference<Txt>[] = [];
  
  // Create token references
  tokens.forEach((_, index) => {
    tokenRefs.push(createRef<Rect>());
    tokenTextRefs.push(createRef<Txt>());
    tokenIdRefs.push(createRef<Txt>());
  });

  // Set up the scene with initial visibility
  view.add(
    <>
      {/* Root container to center everything */}
      <Rect
        ref={rootContainer}
        width={1000}
        height={600}
        radius={0}
        fill={"#0a0a1a"}
        stroke={"#0a0a1a"}
        lineWidth={0}
        x={0}
        y={0}
        opacity={1}
        shadowColor={"#0a0a1a"}
        shadowBlur={0}
        shadowOffset={new Vector2(0, 0)}
        zIndex={0} // Ensure it stays behind other elements
      >
        {/* Input Package box (initially hidden) - MOVED TO FIRST POSITION so it renders behind other elements */}
        <Rect
          ref={inputPackageBox}
          width={1000}
          height={200}
          radius={15}
          fill="#1a1a2a"
          stroke="#4a4a6a"
          lineWidth={3}
          y={0}
          opacity={0}
          shadowColor="#3333aa"
          shadowBlur={25}
          shadowOffset={new Vector2(0, 8)}
          zIndex={-1} // Ensure it stays behind other elements
        >
          <Txt
            ref={inputPackageLabel}
            text="Input Package"
            fill="#ffffff"
            fontFamily="Arial"
            fontSize={24}
            fontWeight={600}
            y={-70}
          />
        </Rect>
        
        {/* User query text box */}
        <Rect
          ref={queryBox}
          width={500}
          height={100}
          radius={8}
          fill="#1e1e3a"
          stroke="#3a3a7a"
          lineWidth={3}
          y={0}
          shadowColor="#0000aa"
          shadowBlur={20}
          shadowOffset={new Vector2(0, 5)}
        >
          <Txt
            ref={queryText}
            text=""
            fill="#e0e0ff"
            fontFamily="monospace"
            fontSize={32}
            fontWeight={600}
            width={450}
            textWrap={true}
            textAlign="center"
          />
        </Rect>

        {/* JSON representation (initially hidden) */}
        <Rect
          ref={jsonBox}
          width={600}
          height={200}
          radius={12}
          fill="#1a1a2a"
          stroke="#4a4a8a"
          lineWidth={3}
          y={0}
          opacity={0}
        >
          <Txt
            ref={jsonText}
            text={jsonContent}
            fill="#a0e0ff"
            fontFamily="monospace"
            fontSize={24}
            width={550}
            textWrap={true}
            textAlign="left"
          />
        </Rect>

        {/* User Message box (initially hidden) */}
        <Rect
          ref={userMessageBox}
          width={300}
          height={80}
          radius={8}
          fill="#2a2a4a"
          stroke="#5a5a9a"
          lineWidth={2}
          y={0}
          opacity={0}
          zIndex={1} // Ensure it stays above the input package
        >
          <Txt
            ref={userMessageLabel}
            text="User Message"
            fill="#ffffff"
            fontFamily="Arial"
            fontSize={18}
            fontWeight={600}
            y={-25}
          />
          <Txt
            ref={userMessageText}
            text="Capital of France?"
            fill="#e0e0ff"
            fontFamily="monospace"
            fontSize={16}
            y={10}
          />
        </Rect>
        
        {/* Chat History box (initially hidden) */}
        <Rect
          ref={chatHistoryBox}
          width={300}
          height={80}
          radius={8}
          fill="#1a3a3a"  // Teal color to distinguish from User Message
          stroke="#2a7a7a"
          lineWidth={2}
          x={-800}  // Start off-screen to the left
          y={0}
          opacity={0}
          shadowColor="#00aaaa"
          shadowBlur={10}
          shadowOffset={new Vector2(-2, 3)}
          zIndex={1} // Ensure it stays above the input package
        >
          <Txt
            ref={chatHistoryLabel}
            text="Chat History"
            fill="#ffffff"
            fontFamily="Arial"
            fontSize={18}
            fontWeight={600}
            y={-25}
          />
          <Txt
            ref={chatHistoryText}
            text="Previous messages"
            fill="#e0ffff"
            fontFamily="monospace"
            fontSize={16}
            y={10}
          />
        </Rect>
        
        {/* Chat History JSON representation (initially hidden) */}
        <Rect
          ref={chatHistoryJsonBox}
          width={500}
          height={180}
          radius={12}
          fill="#1a2a2a"
          stroke="#3a7a7a"
          lineWidth={3}
          x={-400}
          y={0}
          opacity={0}
        >
          <Txt
            ref={chatHistoryJsonText}
            text={chatHistoryJson}
            fill="#a0ffff"
            fontFamily="monospace"
            fontSize={24}
            width={450}
            textWrap={true}
            textAlign="left"
          />
        </Rect>
        
        {/* System Prompt box (initially hidden) */}
        <Rect
          ref={systemPromptBox}
          width={300}
          height={80}
          radius={8}
          fill="#3a1a3a"  // Purple color for system prompt
          stroke="#7a2a7a"
          lineWidth={2}
          x={0}
          y={-500}  // Start off-screen at the top
          opacity={0}
          shadowColor="#aa00aa"
          shadowBlur={15}
          shadowOffset={new Vector2(0, 4)}
          zIndex={1} // Ensure it stays above the input package
        >
          <Circle
            ref={systemPromptGlow}
            width={320}
            height={100}
            fill="rgba(170, 0, 170, 0.1)"
            opacity={0.5}
          />
          <Txt
            ref={systemPromptLabel}
            text="System Prompt"
            fill="#ffffff"
            fontFamily="Arial"
            fontSize={18}
            fontWeight={600}
            y={-25}
          />
          <Txt
            ref={systemPromptText}
            text="Instructions for model"
            fill="#ffe0ff"
            fontFamily="monospace"
            fontSize={16}
            y={10}
          />
        </Rect>
        
        {/* System Prompt JSON representation (initially hidden) */}
        <Rect
          ref={systemPromptJsonBox}
          width={500}
          height={180}
          radius={12}
          fill="#2a1a2a"
          stroke="#7a3a7a"
          lineWidth={3}
          x={0}
          y={-300}
          opacity={0}
        >
          <Txt
            ref={systemPromptJsonText}
            text={systemPromptJson}
            fill="#ffa0ff"
            fontFamily="monospace"
            fontSize={24}
            width={450}
            textWrap={true}
            textAlign="left"
          />
        </Rect>
        
        {/* Combined string box (initially hidden) - for Scene 4 */}
        <Rect
          ref={combinedStringBox}
          width={800}
          height={100}
          radius={10}
          fill="#1a1a2a"
          stroke="#5a5a8a"
          lineWidth={3}
          y={0}
          opacity={0}
          shadowColor="#4444bb"
          shadowBlur={20}
          shadowOffset={new Vector2(0, 5)}
        >
          <Txt
            ref={combinedStringText}
            text={combinedString}
            fill="#ffffff"
            fontFamily="monospace"
            fontSize={28}
            fontWeight={600}
            width={750}
            textWrap={true}
            textAlign="center"
          />
        </Rect>
        
        {/* Container for token bubbles */}
        <Node ref={tokenContainer} opacity={0}>
          {tokens.map((token, index) => (
            <Rect
              ref={tokenRefs[index]}
              width={token.text.length * 20 + 40}
              height={80}
              radius={40}
              fill={token.color}
              stroke={"rgba(255, 255, 255, 0.6)"}
              lineWidth={2}
              x={-400 + index * 150} // Initial positions, will be animated
              y={0}
              shadowColor={token.color}
              shadowBlur={15}
              shadowOffset={new Vector2(0, 3)}
            >
              <Txt
                ref={tokenTextRefs[index]}
                text={token.text}
                fill={"#ffffff"}
                fontFamily="monospace"
                fontSize={22}
                fontWeight={600}
                y={-15}
              />
              <Txt
                ref={tokenIdRefs[index]}
                text={`ID: ${token.id}`}
                fill={"rgba(255, 255, 255, 0.8)"}
                fontFamily="monospace"
                fontSize={16}
                y={15}
                opacity={0} // IDs will fade in during animation
              />
            </Rect>
          ))}
        </Node>
        
        {/* Zoomed token for detailed view (initially hidden) */}
        <Rect
          ref={zoomedTokenBox}
          width={300}
          height={150}
          radius={20}
          fill={"#ffd700"} // Will be updated during animation
          stroke={"rgba(255, 255, 255, 0.8)"}
          lineWidth={3}
          y={0}
          opacity={0}
          shadowColor={"#ffd700"}
          shadowBlur={25}
          shadowOffset={new Vector2(0, 5)}
        >
          <Txt
            ref={zoomedTokenText}
            text={"France"}
            fill={"#ffffff"}
            fontFamily="monospace"
            fontSize={36}
            fontWeight={600}
            y={-30}
          />
          <Txt
            ref={zoomedTokenId}
            text={"Token ID: 3782"}
            fill={"#ffffff"}
            fontFamily="monospace"
            fontSize={24}
            y={30}
          />
        </Rect>
        
        {/* Token ID sequence box (initially hidden) */}
        <Rect
          ref={tokenIdSequence}
          width={700}
          height={100}
          radius={15}
          fill={"#1a1a2a"}
          stroke={"#5a5a8a"}
          lineWidth={2}
          y={200}
          opacity={0}
        >
          <Txt
            ref={tokenIdSequenceText}
            text={"[512, 789, 25, 2451, 32, 3782, 28]"}
            fill={"#ffffff"}
            fontFamily="monospace"
            fontSize={32}
            fontWeight={600}
          />
        </Rect>
      </Rect>
    </>,
  );

  // Animation sequence
  yield* waitFor(0.5);
  
  // Type out the text letter by letter
  const finalText = "Capital of France?";
  for (let i = 1; i <= finalText.length; i++) {
    yield* queryText().text(finalText.substring(0, i), 0.05);
  }
  
  yield* waitFor(0.8);
  
  // Pulse the query box to suggest it's active
  yield* all(
    queryBox().stroke("#6a6aea", 0.4, easeInOutQuad),
    queryBox().shadowBlur(30, 0.4, easeInOutQuad),
  );
  
  yield* all(
    queryBox().stroke("#3a3a7a", 0.4, easeInOutQuad),
    queryBox().shadowBlur(20, 0.4, easeInOutQuad),
  );
  
  yield* waitFor(0.5);
  
  // Zoom in to reveal JSON structure
  yield* all(
    queryBox().scale(2, 0.6, easeInOutCubic),
    queryBox().opacity(0, 0.6),
    queryText().opacity(0, 0.4),
  );
  
  // Show JSON representation
  yield* jsonBox().opacity(1, 0.4);
  
  yield* waitFor(1.2);
  
  // Shrink back down to compact form
  yield* all(
    jsonBox().scale(0.5, 0.8, easeInOutCubic),
    jsonBox().opacity(0, 0.8),
  );
  
  // Show the compact "User Message" box
  yield* userMessageBox().opacity(1, 0.5);
  
  // Move User Message box to the right to make room for Chat History
  yield* userMessageBox().position.x(200, 0.8, easeInOutCubic);
  
  yield* waitFor(0.5);
  
  // SCENE 2: Chat History Joins
  
  // Slide in the Chat History box from the left
  yield* all(
    chatHistoryBox().opacity(1, 0.3),
    chatHistoryBox().position.x(-200, 1.2, easeOutBack),
  );
  
  yield* waitFor(0.5);
  
  // Zoom in to reveal Chat History JSON structure
  yield* all(
    chatHistoryBox().scale(1.5, 0.6, easeInOutCubic),
    chatHistoryBox().opacity(0, 0.6),
  );
  
  // Show Chat History JSON representation
  yield* chatHistoryJsonBox().opacity(1, 0.4);
  yield* chatHistoryJsonBox().position.x(-200, 0.8, easeInOutCubic);
  
  yield* waitFor(1);
  
  // Shrink back down to compact form
  yield* all(
    chatHistoryJsonBox().scale(0.6, 0.7, easeInOutCubic),
    chatHistoryJsonBox().opacity(0, 0.7),
  );
  
  // Show the compact Chat History box in final position
  yield* all(
    chatHistoryBox().opacity(1, 0.5),
    chatHistoryBox().position.x(-200, 0.5),
    chatHistoryBox().scale(1, 0.5),
  );
  
  // Add subtle stacking effect to imply timeline
  yield* all(
    userMessageBox().position.y(-5, 0.5),
    chatHistoryBox().position.y(5, 0.5),
    userMessageBox().shadowBlur(15, 0.5),
    chatHistoryBox().shadowBlur(8, 0.5),
  );
  
  yield* waitFor(1);
  
  // SCENE 3: System Prompt Completes the Trio
  
  // Drop in the System Prompt box from above
  yield* all(
    systemPromptBox().opacity(1, 0.3),
    systemPromptBox().position.y(-150, 0.5, easeOutBack),
  );
  
  yield* waitFor(0.3);
  
  // Continue dropping to final position
  yield* systemPromptBox().position.y(0, 0.8, easeOutBack);
  
  yield* waitFor(0.5);
  
  // Zoom in to reveal System Prompt JSON structure
  yield* all(
    systemPromptBox().scale(1.5, 0.6, easeInOutCubic),
    systemPromptBox().opacity(0, 0.6),
  );
  
  // Show System Prompt JSON representation
  yield* systemPromptJsonBox().opacity(1, 0.4);
  yield* systemPromptJsonBox().position.y(0, 0.8, easeInOutCubic);
  
  yield* waitFor(1);
  
  // Shrink back down to compact form
  yield* all(
    systemPromptJsonBox().scale(0.6, 0.7, easeInOutCubic),
    systemPromptJsonBox().opacity(0, 0.7),
  );
  
  // Show the compact System Prompt box in final position
  yield* all(
    systemPromptBox().opacity(1, 0.5),
    systemPromptBox().position.x(0, 0.5),
    systemPromptBox().scale(1, 0.5),
  );
  
  // Arrange all three boxes horizontally with spacing
  yield* all(
    userMessageBox().position.x(300, 0.8, easeInOutCubic),
    chatHistoryBox().position.x(-300, 0.8, easeInOutCubic),
    systemPromptBox().position.x(0, 0.8, easeInOutCubic),
    
    // Reset vertical positions
    userMessageBox().position.y(0, 0.8),
    chatHistoryBox().position.y(0, 0.8),
    systemPromptBox().position.y(0, 0.8),
  );
  
  yield* waitFor(0.5);
  
  // Create pulsing glow effect for authority
  const pulseGlow = loop(2, function* () {
    yield* all(
      systemPromptGlow().opacity(0.8, 0.8, easeInOutSine),
      systemPromptGlow().scale(1.1, 0.8, easeInOutSine),
    );
    yield* all(
      systemPromptGlow().opacity(0.5, 0.8, easeInOutSine),
      systemPromptGlow().scale(1, 0.8, easeInOutSine),
    );
  });
  
  // Pulse all three boxes in sync
  yield* all(
    pulseGlow,
    chain(
      userMessageBox().stroke("#7a7aca", 0.8, easeInOutSine),
      userMessageBox().stroke("#5a5a9a", 0.8, easeInOutSine),
    ),
    chain(
      chatHistoryBox().stroke("#4a9a9a", 0.8, easeInOutSine),
      chatHistoryBox().stroke("#2a7a7a", 0.8, easeInOutSine),
    ),
    chain(
      systemPromptBox().stroke("#9a4a9a", 0.8, easeInOutSine),
      systemPromptBox().stroke("#7a2a7a", 0.8, easeInOutSine),
    ),
  );
  
  // Fade in the Input Package container BEFORE fading out secondary text
  yield* inputPackageBox().opacity(1, 0.8, easeInOutCubic);
  
  // Fade out secondary text and center title text as boxes shrink
  yield* all(
    // Fade out secondary text
    userMessageText().opacity(0, 0.6, easeInOutCubic),
    chatHistoryText().opacity(0, 0.6, easeInOutCubic),
    systemPromptText().opacity(0, 0.6, easeInOutCubic),
    
    // Center the title text
    userMessageLabel().position.y(0, 0.6, easeInOutCubic),
    chatHistoryLabel().position.y(0, 0.6, easeInOutCubic),
    systemPromptLabel().position.y(0, 0.6, easeInOutCubic),
    
    // Adjust font size for better visibility
    userMessageLabel().fontSize(20, 0.6, easeInOutCubic),
    chatHistoryLabel().fontSize(20, 0.6, easeInOutCubic),
    systemPromptLabel().fontSize(20, 0.6, easeInOutCubic),
  );
  
  // Zoom out to reveal the unified "Input Package"
  yield* all(
    userMessageBox().scale(0.8, 0.8, easeInOutCubic),
    chatHistoryBox().scale(0.8, 0.8, easeInOutCubic),
    systemPromptBox().scale(0.8, 0.8, easeInOutCubic),
  );
  
  yield* waitFor(1.5);
  
  // SCENE 4: Tokenization Begins
  
  // Fade out the three component boxes and input package label
  yield* all(
    userMessageBox().opacity(0, 0.8, easeInOutCubic),
    chatHistoryBox().opacity(0, 0.8, easeInOutCubic),
    systemPromptBox().opacity(0, 0.8, easeInOutCubic),
    inputPackageLabel().opacity(0, 0.8, easeInOutCubic),
  );
  
  // Morph the Input Package into a single string container
  yield* all(
    inputPackageBox().height(100, 0.8, easeInOutCubic),
    inputPackageBox().fill("#1a1a2a", 0.8, easeInOutCubic),
    inputPackageBox().stroke("#5a5a8a", 0.8, easeInOutCubic),
  );
  
  // Show the combined string
  yield* combinedStringBox().opacity(1, 0.8, easeInOutCubic);
  
  yield* waitFor(1);
  
  // Pulse the combined string box to suggest transformation is coming
  yield* all(
    combinedStringBox().stroke("#7a7aea", 0.5, easeInOutQuad),
    combinedStringBox().shadowBlur(30, 0.5, easeInOutQuad),
  );
  
  yield* all(
    combinedStringBox().stroke("#5a5a8a", 0.5, easeInOutQuad),
    combinedStringBox().shadowBlur(20, 0.5, easeInOutQuad),
  );
  
  // Fade out Input Package box as we transition to tokens
  yield* inputPackageBox().opacity(0, 0.8, easeInOutCubic);
  
  // Prepare for the "explosion" effect
  yield* combinedStringBox().scale(1.1, 0.5, easeOutQuint);
  
  // Explode into tokens
  yield* all(
    combinedStringBox().scale(1.5, 0.8, easeOutQuint),
    combinedStringBox().opacity(0, 0.8, easeOutQuint),
    tokenContainer().opacity(1, 0.8, easeInOutCubic),
  );
  
  // Spread out the tokens in slow motion
  const tokenPositions = tokens.map((_, i) => {
    // Calculate positions in a curved arc
    const angle = map(-0.3, 0.3, i / (tokens.length - 1));
    const distance = 150 + Math.random() * 50;
    return new Vector2(
      (i - (tokens.length - 1) / 2) * distance,
      Math.sin(angle * Math.PI) * 100
    );
  });
  
  // Animate tokens spreading out
  yield* all(
    ...tokenRefs.map((tokenRef, i) => 
      tokenRef().position(tokenPositions[i], 1.2, easeOutBack)
    )
  );
  
  // Fade in token IDs one by one with slight delay
  yield* sequence(
    0.1,
    ...tokenIdRefs.map((idRef) => 
      idRef().opacity(1, 0.5, easeInOutCubic)
    )
  );
  
  yield* waitFor(0.8);
  
  // Zoom in on the "France" token (index 5)
  const franceTokenIndex = 5;
  const franceToken = tokenRefs[franceTokenIndex];
  
  // Fade out other tokens
  yield* all(
    ...tokenRefs.map((tokenRef, i) => 
      i !== franceTokenIndex ? 
      tokenRef().opacity(0.3, 0.8, easeInOutCubic) : 
      null
    )
  );
  
  // Scale up the France token (instead of moving the camera)
  yield* all(
    franceToken().scale(2, 1, easeInOutCubic),
    franceToken().position.y(-50, 1, easeInOutCubic)
  );
  
  yield* waitFor(0.5);
  
  // Highlight the token ID
  yield* tokenIdRefs[franceTokenIndex]().scale(1.5, 0.5, easeOutBack);
  yield* tokenIdRefs[franceTokenIndex]().scale(1, 0.5, easeInOutCubic);
  
  yield* waitFor(1);
  
  // Scale back down and restore all tokens
  yield* all(
    franceToken().scale(1, 1, easeInOutCubic),
    franceToken().position.y(0, 1, easeInOutCubic),
    ...tokenRefs.map((tokenRef, i) => 
      i !== franceTokenIndex ? 
      tokenRef().opacity(1, 0.8, easeInOutCubic) : 
      null
    )
  );
  
  yield* waitFor(0.8);
  
  // Transition to show the sequence of token IDs
  yield* all(
    tokenContainer().position.y(-150, 1, easeInOutCubic),
    tokenContainer().scale(0.8, 1, easeInOutCubic),
    tokenIdSequence().opacity(1, 1, easeInOutCubic),
  );
  
  yield* waitFor(2);
});
