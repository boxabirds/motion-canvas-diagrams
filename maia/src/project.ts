import {makeProject} from '@motion-canvas/core';

import example from './scenes/example?scene';
import shrinkingBox from './scenes/shrinkingBox?scene';

export default makeProject({
  name: 'System Prompt Animation',
  scenes: [shrinkingBox, example],
});
