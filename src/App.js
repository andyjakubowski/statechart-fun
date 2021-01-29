import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Example } from './Example';
import { WatchCase as Watch } from './00/Watch';
import { Toggle } from './01/Toggle';
import { ClearHistory } from './02/ClearHistory';
import { WatchCase } from './03/WatchCase';
import { Ticker } from './04/Ticker';
import { ScratchApp } from './scratch';
import { TableOfContents } from './TableOfContents';
import { inspect } from '@xstate/inspect';

inspect({
  url: 'https://statecharts.io/inspect',
  // iframe: () => document.querySelector('iframe[data-xstate]'),
  iframe: false,
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
          <Example markdown={getMarkdownLink('00')} backLink={null}>
            <Watch />
          </Example>
        </Route>
        <Route path="/01">
          <Example markdown={getMarkdownLink('01')}>
            <Toggle />
          </Example>
        </Route>
        <Route path="/02">
          <Example markdown={getMarkdownLink('02')}>
            <ClearHistory />
          </Example>
        </Route>
        <Route path="/03">
          <Example markdown={getMarkdownLink('03')}>
            <WatchCase />
          </Example>
        </Route>
        <Route path="/04">
          <Example markdown={getMarkdownLink('04')}>
            <Ticker />
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
