import {makeProject} from '@motion-canvas/core';
import {Code, LezerHighlighter} from '@motion-canvas/2d';
import {parser} from '@lezer/python';

import example from './scenes/example?scene';
import shrinkingBox from './scenes/shrinkingBox?scene';
import pythonCode from './scenes/pythonCode?scene';

// Configure Python syntax highlighting
Code.defaultHighlighter = new LezerHighlighter(parser);

export default makeProject({
  name: 'System Prompt Animation',
  scenes: [pythonCode, shrinkingBox, example],
});
