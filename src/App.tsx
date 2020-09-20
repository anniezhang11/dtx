import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import './App.css';

type QRColor = "Blue" | "Green";

type CallToAction = "Scan Here" | "Point. Aim. Shoot";

type PermutationData = {
  id: string,
  last_modified: Date,
  time_stamp: Date,
  name: string,
  brand: [
    string,
  ],
  campaign: string,
  variables: [
    QRColor,
    CallToAction,
  ]
}

function gen_permutations(permutations: PermutationData[], handleSelect: Function, selected: string[]) {
  return permutations.map((permutation) => {
    const isSelected = selected.includes(permutation.id) ? true : false;
    return (
      <Permutation key={permutation.id} data={permutation} handleSelect={handleSelect} isSelected={isSelected}/>
    );
  });
}

function renderSelected(selected: PermutationData[]) {
  if (selected.length > 0) {
    return selected.map((permutation) => {
      return (
        <SelectedPermutation key={permutation.id} data={permutation}/>
      );
    });
  } else {
    return (
      <div>None selected.</div>
    );
  }
  
}

const Permutation: React.FC<{ data: PermutationData, handleSelect: Function, isSelected: boolean }> = (props) => {
  const [selected, setSelected] = React.useState(false);

  useEffect(() => {
    setSelected(props.isSelected);
  }, [props.isSelected]);

  return (
    <div 
      className="permutation" 
      onClick={() => props.handleSelect(props.data)} 
      style={{color: selected ? 'green' : 'red'}}>
      <div>{props.data.brand}</div>
      <div>{props.data.variables[0]}</div>
      <div>{props.data.variables[1]}</div>
    </div>
  );
}

const SelectedPermutation: React.FC<{ data: PermutationData}> = (props) => {
  return (
    <div 
      className="permutation" 
    >
      <div>{props.data.brand}</div>
      <div>{props.data.variables[0]}</div>
      <div>{props.data.variables[1]}</div>
    </div>
  );
}

const App: React.FC = () => {
  const [data, setData] = React.useState([]);
  const [selected, setSelected] = React.useState([] as string[]);
  const [selectedData, setSelectedData] = React.useState([] as PermutationData[]);

  useEffect(() => {
    fetch("https://flowcode.com/mock-api-data", {mode: 'cors'})
    .then(res => res.json())
    .then(
      (result) => setData(result),
    )
  }, []);

  const handleSelect = (perm: PermutationData) => {
    let newSelected = [...selected];
    let newSelectedData = [...selectedData];
    if (newSelected.includes(perm.id)) {
      const idx = newSelected.indexOf(perm.id);
      newSelected.splice(idx, 1);
      newSelectedData.splice(idx,1);
    } else {
      newSelected.push(perm.id);
      newSelectedData.push(perm);
    }
    setSelected(newSelected);
    setSelectedData(newSelectedData);
  };

  const reset = () => {
    setSelected([]);
    setSelectedData([]);
  };

  const Home = () => {
    return (
      <div className="App">
        <header className="App-header">
          <h3> Permutation Wizard</h3>
        </header>
        <div className="permutations-container">
          {gen_permutations(data, handleSelect, selected)}
        </div>
        <button><Link to="/displayselected">Confirm</Link></button>
        <button onClick={reset}>Reset</button>
      </div>
    );
  };

  const DisplaySelected = (props: {selected: string[]}) => {
    return (
      <div className="App">
        <header className="App-header">
          <h3> Permutation Wizard</h3>
        </header>
        <div className="permutations-container">
          {renderSelected(selectedData)}
        </div>
        <button><Link to="/">Back</Link></button>
      </div>
    );
  };

  return (
    <Router>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/displayselected" render={() => <DisplaySelected selected={selected} />}/>
      </Switch>
    </Router>
  );
}

export default App;
