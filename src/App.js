import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Example } from './Example';
import { Fun as Fun00 } from './00/Fun';
import { ScratchApp } from './scratch';
import { TableOfContents } from './TableOfContents';
import { inspect } from '@xstate/inspect';

inspect({
  url: 'https://statecharts.io/inspect',
  iframe: () => document.querySelector('iframe[data-xstate]'),
});

function getMarkdownLink(exercise) {
  return require(`./${exercise}/README.md`).default;
}

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/scratch">
          <Example markdown={getMarkdownLink('scratch')}>
            <ScratchApp />
          </Example>
        </Route>
        <Route path="/00">
          <Example markdown={getMarkdownLink('00')}>
            <Fun00 />
          </Example>
        </Route>
        <Route path="/">
          <Example
            markdown={getMarkdownLink('TableOfContents')}
            backLink={null}
          >
            <TableOfContents />
          </Example>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
